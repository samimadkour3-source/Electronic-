import React, { useCallback, useMemo, useRef, useState } from 'react';
import {
  AlertTriangle,
  ArrowLeftRight,
  CheckCircle2,
  Cpu,
  GripVertical,
  MousePointer,
  Power,
  RotateCcw,
  RotateCw,
  Trash2,
  Volume2,
  Zap,
} from 'lucide-react';
import {
  CircuitSimOutput,
  getEffectiveResistance,
  SimComponent,
  simulateCircuit,
  SimWire,
} from '../utils/circuitSolver';
import { useLanguage } from '../i18n/LanguageContext';

export type BreadboardPartType =
  | 'resistor'
  | 'led'
  | 'switch'
  | 'potentiometer'
  | 'diode'
  | 'zener'
  | 'ldr'
  | 'buzzer'
  | 'fuse';

export type LedColor = 'red' | 'green' | 'yellow' | 'blue';
export type WireColor = 'red' | 'black' | 'blue' | 'green' | 'amber';

export interface BoardComponent {
  id: string;
  type: BreadboardPartType;
  pin1Hole: string;
  pin2Hole: string;
  value: number;
  ledColor?: LedColor;
  closed?: boolean;
  lightLevel?: number;
}

export interface BoardWire {
  id: string;
  holeA: string;
  holeB: string;
  color: WireColor;
}

type ToolMode = 'select' | 'wire' | BreadboardPartType;

interface HoleDef {
  id: string;
  x: number;
  y: number;
  net: string;
  kind: 'rail' | 'top' | 'bot';
  col?: number;
  rowChar?: string;
  railIndex?: number;
  label: string;
}

const COL_X0 = 172;
const COL_DX = 26;
const TOP_ROWS = ['A', 'B', 'C', 'D', 'E'] as const;
const BOT_ROWS = ['F', 'G', 'H', 'I', 'J'] as const;
const ROW_Y: Record<string, number> = {
  'tp-': 44,
  'tp+': 66,
  A: 118,
  B: 138,
  C: 158,
  D: 178,
  E: 198,
  F: 248,
  G: 268,
  H: 288,
  I: 308,
  J: 328,
  'bp+': 368,
  'bp-': 390,
};

function railIndexToCol(idx: number): number {
  const g = Math.floor(idx / 5);
  const k = idx % 5;
  return 2 + g * 6 + k;
}

const ALL_HOLES: HoleDef[] = (() => {
  const holes: HoleDef[] = [];

  const railSpecs: { prefix: 'tp-' | 'tp+' | 'bp+' | 'bp-'; net: string; labelPrefix: string }[] = [
    { prefix: 'tp-', net: 'rail_top_neg', labelPrefix: 'TOP −' },
    { prefix: 'tp+', net: 'rail_top_pos', labelPrefix: 'TOP +' },
    { prefix: 'bp+', net: 'rail_bot_pos', labelPrefix: 'BOT +' },
    { prefix: 'bp-', net: 'rail_bot_neg', labelPrefix: 'BOT −' },
  ];

  for (const r of railSpecs) {
    for (let i = 0; i < 25; i++) {
      const col = railIndexToCol(i);
      holes.push({
        id: `${r.prefix}:${i}`,
        x: COL_X0 + (col - 1) * COL_DX,
        y: ROW_Y[r.prefix],
        net: r.net,
        kind: 'rail',
        col,
        railIndex: i,
        label: `${r.labelPrefix} #${i + 1}`,
      });
    }
  }

  for (let col = 1; col <= 30; col++) {
    const x = COL_X0 + (col - 1) * COL_DX;
    for (const rowChar of TOP_ROWS) {
      holes.push({
        id: `${rowChar}:${col}`,
        x,
        y: ROW_Y[rowChar],
        net: `top_col_${col}`,
        kind: 'top',
        col,
        rowChar,
        label: `${rowChar}${col}`,
      });
    }
    for (const rowChar of BOT_ROWS) {
      holes.push({
        id: `${rowChar}:${col}`,
        x,
        y: ROW_Y[rowChar],
        net: `bot_col_${col}`,
        kind: 'bot',
        col,
        rowChar,
        label: `${rowChar}${col}`,
      });
    }
  }

  return holes;
})();

const HOLE_MAP: Record<string, HoleDef> = Object.fromEntries(ALL_HOLES.map((h) => [h.id, h]));

const NET_TO_HOLES: Record<string, HoleDef[]> = ALL_HOLES.reduce<Record<string, HoleDef[]>>(
  (acc, h) => {
    if (!acc[h.net]) acc[h.net] = [];
    acc[h.net].push(h);
    return acc;
  },
  {}
);

interface PaletteMeta {
  type: BreadboardPartType;
  labelAr: string;
  labelFr: string;
  labelEn: string;
  defaultValue: number;
  defaultSpanCols: number;
  bridgeRavine?: boolean;
}

const PART_PALETTE: PaletteMeta[] = [
  { type: 'resistor', labelAr: 'مقاومة', labelFr: 'Résistance', labelEn: 'Resistor', defaultValue: 330, defaultSpanCols: 5 },
  { type: 'led', labelAr: 'ليد LED', labelFr: 'LED', labelEn: 'LED', defaultValue: 2, defaultSpanCols: 4 },
  { type: 'switch', labelAr: 'مفتاح ضاغط', labelFr: 'Bouton-poussoir', labelEn: 'Push Switch', defaultValue: 0, defaultSpanCols: 3, bridgeRavine: true },
  { type: 'potentiometer', labelAr: 'مقاومة متغيرة', labelFr: 'Potentiomètre', labelEn: 'Potentiometer', defaultValue: 500, defaultSpanCols: 4 },
  { type: 'diode', labelAr: 'دايود 1N4007', labelFr: 'Diode 1N4007', labelEn: 'Diode 1N4007', defaultValue: 0.7, defaultSpanCols: 5 },
  { type: 'zener', labelAr: 'دايود زينر', labelFr: 'Diode Zener', labelEn: 'Zener Diode', defaultValue: 5.1, defaultSpanCols: 5 },
  { type: 'ldr', labelAr: 'حساس ضوء LDR', labelFr: 'Photorésistance', labelEn: 'LDR Sensor', defaultValue: 50, defaultSpanCols: 4 },
  { type: 'buzzer', labelAr: 'جرس بازر', labelFr: 'Buzzer', labelEn: 'Buzzer', defaultValue: 5, defaultSpanCols: 4 },
  { type: 'fuse', labelAr: 'فيوز حماية', labelFr: 'Fusible', labelEn: 'Fuse', defaultValue: 250, defaultSpanCols: 5 },
];

const WIRE_COLORS: { id: WireColor; hex: string; labelAr: string; labelFr: string; labelEn: string }[] = [
  { id: 'red', hex: '#dc2626', labelAr: 'أحمر (+)', labelFr: 'Rouge (+)', labelEn: 'Red (+)' },
  { id: 'black', hex: '#1e293b', labelAr: 'أسود (−)', labelFr: 'Noir (−)', labelEn: 'Black (−)' },
  { id: 'blue', hex: '#0284c7', labelAr: 'أزرق', labelFr: 'Bleu', labelEn: 'Blue' },
  { id: 'green', hex: '#059669', labelAr: 'أخضر', labelFr: 'Vert', labelEn: 'Green' },
  { id: 'amber', hex: '#d97706', labelAr: 'أصفر', labelFr: 'Jaune', labelEn: 'Yellow' },
];

const LED_PALETTE: { id: LedColor; base: string; glow: string; labelAr: string; labelFr: string; labelEn: string }[] = [
  { id: 'red', base: '#ef4444', glow: '#fca5a5', labelAr: 'أحمر', labelFr: 'Rouge', labelEn: 'Red' },
  { id: 'green', base: '#22c55e', glow: '#86efac', labelAr: 'أخضر', labelFr: 'Vert', labelEn: 'Green' },
  { id: 'yellow', base: '#eab308', glow: '#fde047', labelAr: 'أصفر', labelFr: 'Jaune', labelEn: 'Yellow' },
  { id: 'blue', base: '#3b82f6', glow: '#93c5fd', labelAr: 'أزرق', labelFr: 'Bleu', labelEn: 'Blue' },
];

const EIA_COLORS = [
  '#111827', // 0 black
  '#78350f', // 1 brown
  '#dc2626', // 2 red
  '#ea580c', // 3 orange
  '#eab308', // 4 yellow
  '#16a34a', // 5 green
  '#2563eb', // 6 blue
  '#7c3aed', // 7 violet
  '#6b7280', // 8 gray
  '#f8fafc', // 9 white
];

function getResistorBands(ohms: number): [string, string, string, string] {
  const safe = Math.max(10, Math.round(ohms));
  const str = String(safe);
  const d1 = Number(str[0]) || 1;
  const d2 = Number(str[1] ?? 0);
  const mult = Math.min(6, Math.max(0, str.length - 2));
  return [
    EIA_COLORS[d1] || '#78350f',
    EIA_COLORS[d2] || '#111827',
    EIA_COLORS[mult] || '#111827',
    '#ca8a04', // gold 5%
  ];
}

function formatResistance(ohms: number): string {
  if (ohms >= 1000) return `${(ohms / 1000).toFixed(ohms % 1000 === 0 ? 0 : 1)}kΩ`;
  return `${Math.round(ohms)}Ω`;
}

interface PresetBoard {
  id: string;
  labelAr: string;
  labelFr: string;
  labelEn: string;
  supplyVoltage: 3.3 | 5 | 9 | 12;
  components: BoardComponent[];
  wires: BoardWire[];
}

const PRESETS: PresetBoard[] = [
  {
    id: 'led_basic',
    labelAr: 'ليد + مقاومة حماية (5V)',
    labelFr: 'LED + Résistance (5V)',
    labelEn: 'LED + Resistor (5V)',
    supplyVoltage: 5,
    components: [
      { id: 'bc1', type: 'resistor', pin1Hole: 'C:5', pin2Hole: 'C:10', value: 330 },
      { id: 'bc2', type: 'led', pin1Hole: 'D:10', pin2Hole: 'D:14', value: 2, ledColor: 'red' },
    ],
    wires: [
      { id: 'bw1', holeA: 'tp+:2', holeB: 'B:5', color: 'red' },
      { id: 'bw2', holeA: 'E:14', holeB: 'tp-:10', color: 'black' },
    ],
  },
  {
    id: 'switch_led',
    labelAr: 'تشغيل ليد بمفتاح ضاغط',
    labelFr: 'LED avec bouton-poussoir',
    labelEn: 'Push Switch + LED',
    supplyVoltage: 5,
    components: [
      { id: 'bc1', type: 'switch', pin1Hole: 'E:5', pin2Hole: 'F:5', value: 0, closed: true },
      { id: 'bc2', type: 'resistor', pin1Hole: 'H:5', pin2Hole: 'H:10', value: 220 },
      { id: 'bc3', type: 'led', pin1Hole: 'I:10', pin2Hole: 'I:14', value: 2, ledColor: 'green' },
    ],
    wires: [
      { id: 'bw1', holeA: 'tp+:2', holeB: 'B:5', color: 'red' },
      { id: 'bw2', holeA: 'J:14', holeB: 'bp-:10', color: 'black' },
    ],
  },
  {
    id: 'ldr_night',
    labelAr: 'دائرة حساس الضوء LDR (9V)',
    labelFr: 'Détecteur lumière LDR (9V)',
    labelEn: 'LDR Light Sensor (9V)',
    supplyVoltage: 9,
    components: [
      { id: 'bc1', type: 'ldr', pin1Hole: 'C:5', pin2Hole: 'C:10', value: 50, lightLevel: 65 },
      { id: 'bc2', type: 'resistor', pin1Hole: 'D:10', pin2Hole: 'D:15', value: 470 },
      { id: 'bc3', type: 'led', pin1Hole: 'E:15', pin2Hole: 'E:20', value: 2, ledColor: 'yellow' },
    ],
    wires: [
      { id: 'bw1', holeA: 'tp+:2', holeB: 'B:5', color: 'red' },
      { id: 'bw2', holeA: 'B:20', holeB: 'tp-:15', color: 'black' },
    ],
  },
  {
    id: 'pot_dimmer',
    labelAr: 'تعتيم الليد بمقاومة متغيرة',
    labelFr: 'Variateur LED (Potentiomètre)',
    labelEn: 'Potentiometer LED Dimmer',
    supplyVoltage: 5,
    components: [
      { id: 'bc1', type: 'potentiometer', pin1Hole: 'C:5', pin2Hole: 'C:10', value: 400 },
      { id: 'bc2', type: 'led', pin1Hole: 'D:10', pin2Hole: 'D:14', value: 2, ledColor: 'blue' },
    ],
    wires: [
      { id: 'bw1', holeA: 'tp+:2', holeB: 'B:5', color: 'red' },
      { id: 'bw2', holeA: 'E:14', holeB: 'tp-:10', color: 'black' },
    ],
  },
  {
    id: 'empty_board',
    labelAr: 'لوحة فارغة (ابدأ من الصفر)',
    labelFr: 'Platine vierge',
    labelEn: 'Blank Breadboard',
    supplyVoltage: 5,
    components: [],
    wires: [],
  },
];

function computeSecondHole(anchorHoleId: string, type: BreadboardPartType): string {
  const anchor = HOLE_MAP[anchorHoleId];
  if (!anchor) return anchorHoleId;
  const meta = PART_PALETTE.find((p) => p.type === type);
  const span = meta?.defaultSpanCols ?? 4;

  // Push switch defaults to straddling the central ravine E <-> F
  if (meta?.bridgeRavine && anchor.kind !== 'rail' && anchor.col) {
    if (anchor.kind === 'top') {
      return `F:${anchor.col}`;
    }
    return `E:${anchor.col}`;
  }

  // If placed on a main strip (A..J), offset horizontally by span columns
  if (anchor.kind !== 'rail' && anchor.col && anchor.rowChar) {
    const targetCol = anchor.col + span <= 30 ? anchor.col + span : Math.max(1, anchor.col - span);
    return `${anchor.rowChar}:${targetCol}`;
  }

  // If placed on a rail, jump into nearest component row in same column
  if (anchor.kind === 'rail' && anchor.col) {
    const targetRow = anchor.id.startsWith('tp') ? 'B' : 'I';
    return `${targetRow}:${anchor.col}`;
  }

  return anchorHoleId;
}

function shiftHoleByDelta(holeId: string, dCol: number, dRowSteps: number): string | null {
  const h = HOLE_MAP[holeId];
  if (!h) return null;
  const allRows = [...TOP_ROWS, ...BOT_ROWS] as string[];
  if (h.kind === 'rail') {
    if (dRowSteps === 0 && h.railIndex !== undefined) {
      const nextIdx = Math.max(0, Math.min(24, h.railIndex + Math.round(dCol)));
      const prefix = h.id.split(':')[0];
      return `${prefix}:${nextIdx}`;
    }
    const baseRowIdx = h.id.startsWith('tp') ? 0 : 9;
    const targetRowIdx = Math.max(0, Math.min(9, baseRowIdx + dRowSteps));
    const targetCol = Math.max(1, Math.min(30, (h.col ?? 1) + dCol));
    return `${allRows[targetRowIdx]}:${targetCol}`;
  }
  const curRowIdx = allRows.indexOf(h.rowChar || 'C');
  const nextRowIdx = Math.max(0, Math.min(9, curRowIdx + dRowSteps));
  const nextCol = Math.max(1, Math.min(30, (h.col ?? 1) + dCol));
  return `${allRows[nextRowIdx]}:${nextCol}`;
}

export const BreadboardSimulator: React.FC = () => {
  const { pick } = useLanguage();

  const [components, setComponents] = useState<BoardComponent[]>(PRESETS[0].components);
  const [wires, setWires] = useState<BoardWire[]>(PRESETS[0].wires);
  const [supplyVoltage, setSupplyVoltage] = useState<3.3 | 5 | 9 | 12>(PRESETS[0].supplyVoltage);
  const [powerOn, setPowerOn] = useState<boolean>(true);
  const [mirrorRails, setMirrorRails] = useState<boolean>(true);

  const [activeTool, setActiveTool] = useState<ToolMode>('select');
  const [wireColor, setWireColor] = useState<WireColor>('red');
  const [selectedItem, setSelectedItem] = useState<{ kind: 'comp' | 'wire'; id: string } | null>({
    kind: 'comp',
    id: PRESETS[0].components[0].id,
  });

  const [pendingWireHole, setPendingWireHole] = useState<string | null>(null);
  const [hoveredHoleId, setHoveredHoleId] = useState<string | null>(null);
  const [pointerSvg, setPointerSvg] = useState<{ x: number; y: number } | null>(null);

  // Dragging from palette (HTML5 Drag & Drop)
  const [draggingPaletteType, setDraggingPaletteType] = useState<BreadboardPartType | null>(null);
  const [dragHoverHoleId, setDragHoverHoleId] = useState<string | null>(null);

  // Dragging placed component directly on board
  const [draggingCompState, setDraggingCompState] = useState<{
    id: string;
    origPin1: string;
    origPin2: string;
    startCol: number;
    startRowIdx: number;
  } | null>(null);

  const svgRef = useRef<SVGSVGElement | null>(null);

  const clientToSvg = useCallback((clientX: number, clientY: number): { x: number; y: number } | null => {
    const svg = svgRef.current;
    if (!svg) return null;
    const rect = svg.getBoundingClientRect();
    if (!rect.width || !rect.height) return null;
    return {
      x: ((clientX - rect.left) / rect.width) * 980,
      y: ((clientY - rect.top) / rect.height) * 430,
    };
  }, []);

  const findNearestHole = useCallback((svgX: number, svgY: number, maxDist = 26): HoleDef | null => {
    let best: HoleDef | null = null;
    let bestD2 = maxDist * maxDist;
    for (const h of ALL_HOLES) {
      const dx = h.x - svgX;
      const dy = h.y - svgY;
      const d2 = dx * dx + dy * dy;
      if (d2 < bestD2) {
        bestD2 = d2;
        best = h;
      }
    }
    return best;
  }, []);

  // Build electrical simulation from Breadboard nets + components + jumper wires
  const { simResult, holeVoltages, energizedWireIds } = useMemo(() => {
    if (!powerOn) {
      return {
        simResult: {
          nodeVoltages: {},
          components: {},
          status: 'empty',
          messageAr: 'مزوّد الطاقة متوقف (OFF). اضغط زر التشغيل لتمرير الجهد إلى مسارات اللوحة.',
          messageFr: 'Alimentation coupée (OFF). Allumez le module pour alimenter les rails.',
          messageEn: 'Power supply is OFF. Switch ON the MB102 module to energize the breadboard rails.',
        } as CircuitSimOutput,
        holeVoltages: {} as Record<string, number>,
        energizedWireIds: new Set<string>(),
      };
    }

    // Union-Find over breadboard nets
    const parent: Record<string, string> = {};
    const findNet = (n: string): string => {
      if (!parent[n]) parent[n] = n;
      if (parent[n] !== n) parent[n] = findNet(parent[n]);
      return parent[n];
    };
    const unionNet = (a: string, b: string) => {
      const ra = findNet(a);
      const rb = findNet(b);
      if (ra !== rb) parent[ra] = rb;
    };

    if (mirrorRails) {
      unionNet('rail_top_pos', 'rail_bot_pos');
      unionNet('rail_top_neg', 'rail_bot_neg');
    }

    for (const w of wires) {
      const ha = HOLE_MAP[w.holeA];
      const hb = HOLE_MAP[w.holeB];
      if (ha && hb) {
        unionNet(ha.net, hb.net);
      }
    }

    // Map each electrical net root -> list of solver pins
    const simComps: SimComponent[] = [
      { id: '__supply', type: 'battery', label: `${supplyVoltage}V`, x: 0, y: 0, rotation: 0, value: supplyVoltage },
      { id: '__gnd', type: 'ground', label: 'GND', x: 0, y: 0, rotation: 0, value: 0 },
    ];

    const netPins: Record<string, { compId: string; port: 0 | 1 }[]> = {};
    const addPinToNet = (netName: string, compId: string, port: 0 | 1) => {
      const root = findNet(netName);
      if (!netPins[root]) netPins[root] = [];
      netPins[root].push({ compId, port });
    };

    addPinToNet('rail_top_pos', '__supply', 1);
    addPinToNet('rail_top_neg', '__supply', 0);
    addPinToNet('rail_top_neg', '__gnd', 0);

    for (const bc of components) {
      const h1 = HOLE_MAP[bc.pin1Hole];
      const h2 = HOLE_MAP[bc.pin2Hole];
      if (!h1 || !h2) continue;
      simComps.push({
        id: bc.id,
        type: bc.type,
        label: bc.type,
        x: 0,
        y: 0,
        rotation: 0,
        value: bc.value,
        closed: bc.closed,
        lightLevel: bc.lightLevel,
      });
      addPinToNet(h1.net, bc.id, 0);
      addPinToNet(h2.net, bc.id, 1);
    }

    const simWires: SimWire[] = [];
    let wireCounter = 0;
    for (const pins of Object.values(netPins)) {
      for (let i = 1; i < pins.length; i++) {
        simWires.push({
          id: `sw_${wireCounter++}`,
          fromCompId: pins[0].compId,
          fromPort: pins[0].port,
          toCompId: pins[i].compId,
          toPort: pins[i].port,
        });
      }
    }

    const result = simulateCircuit(simComps, simWires);

    // Map solved voltages back to each merged net root so hovering any connected hole shows live voltage
    const netVoltMap: Record<string, number> = {};
    for (const [root, pins] of Object.entries(netPins)) {
      const first = pins[0];
      const v = result.nodeVoltages[`${first.compId}:${first.port}`];
      if (v !== undefined) {
        netVoltMap[root] = v;
      }
    }

    // Identify jumper wires carrying active DC current (2-vertex-connected block containing active __supply)
    const activeWires = new Set<string>();
    const supplyActive = Boolean(result.components['__supply']?.conducting);
    if (supplyActive) {
      interface StripEdge {
        u: string;
        v: string;
        wireId?: string;
        isSource?: boolean;
      }
      const edges: StripEdge[] = [];
      const adj: Record<string, { to: string; edgeId: number }[]> = {};
      const addStripEdge = (u: string, v: string, meta?: { wireId?: string; isSource?: boolean }) => {
        if (u === v) return;
        const edgeId = edges.length;
        edges.push({ u, v, ...meta });
        if (!adj[u]) adj[u] = [];
        if (!adj[v]) adj[v] = [];
        adj[u].push({ to: v, edgeId });
        adj[v].push({ to: u, edgeId });
      };

      addStripEdge('rail_top_pos', 'rail_top_neg', { isSource: true });
      if (mirrorRails) {
        addStripEdge('rail_top_pos', 'rail_bot_pos');
        addStripEdge('rail_top_neg', 'rail_bot_neg');
      }
      for (const w of wires) {
        const ha = HOLE_MAP[w.holeA];
        const hb = HOLE_MAP[w.holeB];
        if (ha && hb) {
          addStripEdge(ha.net, hb.net, { wireId: w.id });
        }
      }
      for (const bc of components) {
        if (!result.components[bc.id]?.conducting) continue;
        const h1 = HOLE_MAP[bc.pin1Hole];
        const h2 = HOLE_MAP[bc.pin2Hole];
        if (h1 && h2) {
          addStripEdge(h1.net, h2.net);
        }
      }

      const disc: Record<string, number> = {};
      const low: Record<string, number> = {};
      const edgeStack: number[] = [];
      let timer = 0;

      const dfsBlock = (u: string, parentEdgeId: number) => {
        disc[u] = low[u] = ++timer;
        for (const { to: v, edgeId } of adj[u] || []) {
          if (edgeId === parentEdgeId) continue;
          if (!disc[v]) {
            edgeStack.push(edgeId);
            dfsBlock(v, edgeId);
            low[u] = Math.min(low[u], low[v]);
            if (low[v] >= disc[u]) {
              const block: number[] = [];
              while (edgeStack.length > 0) {
                const eid = edgeStack.pop()!;
                block.push(eid);
                if (eid === edgeId) break;
              }
              if (block.length > 1 && block.some((eid) => edges[eid].isSource)) {
                for (const eid of block) {
                  const wid = edges[eid].wireId;
                  if (wid) activeWires.add(wid);
                }
              }
            }
          } else if (disc[v] < disc[u]) {
            edgeStack.push(edgeId);
            low[u] = Math.min(low[u], disc[v]);
          }
        }
      };

      dfsBlock('rail_top_pos', -1);
    }

    return { simResult: result, holeVoltages: netVoltMap, energizedWireIds: activeWires };
  }, [components, wires, supplyVoltage, powerOn, mirrorRails]);

  const getHoleVoltage = useCallback(
    (holeId: string): number | undefined => {
      if (!powerOn) return undefined;
      const h = HOLE_MAP[holeId];
      if (!h) return undefined;
      // Direct rail lookup via netPins union
      // Re-resolve using wires cleanly:
      const parent: Record<string, string> = {};
      const findNet = (n: string): string => {
        if (!parent[n]) parent[n] = n;
        if (parent[n] !== n) parent[n] = findNet(parent[n]);
        return parent[n];
      };
      const unionNet = (a: string, b: string) => {
        const ra = findNet(a);
        const rb = findNet(b);
        if (ra !== rb) parent[ra] = rb;
      };
      if (mirrorRails) {
        unionNet('rail_top_pos', 'rail_bot_pos');
        unionNet('rail_top_neg', 'rail_bot_neg');
      }
      for (const w of wires) {
        const ha = HOLE_MAP[w.holeA];
        const hb = HOLE_MAP[w.holeB];
        if (ha && hb) unionNet(ha.net, hb.net);
      }
      const root = findNet(h.net);
      return holeVoltages[root];
    },
    [holeVoltages, mirrorRails, powerOn, wires]
  );

  const placePartAtHole = useCallback((type: BreadboardPartType, holeId: string) => {
    const meta = PART_PALETTE.find((p) => p.type === type);
    if (!meta) return;
    const pin2Hole = computeSecondHole(holeId, type);
    const id = `bc_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
    const newComp: BoardComponent = {
      id,
      type,
      pin1Hole: holeId,
      pin2Hole,
      value: meta.defaultValue,
      ledColor: type === 'led' ? 'red' : undefined,
      closed: type === 'switch' || type === 'fuse' ? true : undefined,
      lightLevel: type === 'ldr' ? 60 : undefined,
    };
    setComponents((prev) => [...prev, newComp]);
    setSelectedItem({ kind: 'comp', id });
    setActiveTool('select');
  }, []);

  const handleHoleInteraction = (holeId: string) => {
    if (activeTool === 'wire') {
      if (!pendingWireHole) {
        setPendingWireHole(holeId);
      } else if (pendingWireHole === holeId) {
        setPendingWireHole(null);
      } else {
        const id = `bw_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
        // Auto-select sensible color if placing on power rails and user hasn't forced something else
        setWires((prev) => [...prev, { id, holeA: pendingWireHole, holeB: holeId, color: wireColor }]);
        setSelectedItem({ kind: 'wire', id });
        setPendingWireHole(null);
      }
      return;
    }

    if (activeTool !== 'select') {
      placePartAtHole(activeTool, holeId);
    }
  };

  const handleLoadPreset = (preset: PresetBoard) => {
    setComponents(preset.components.map((c) => ({ ...c })));
    setWires(preset.wires.map((w) => ({ ...w })));
    setSupplyVoltage(preset.supplyVoltage);
    setPowerOn(true);
    setPendingWireHole(null);
    setActiveTool('select');
    setSelectedItem(preset.components[0] ? { kind: 'comp', id: preset.components[0].id } : null);
  };

  const handleRotateSelected = () => {
    if (!selectedItem || selectedItem.kind !== 'comp') return;
    setComponents((prev) =>
      prev.map((c) => {
        if (c.id !== selectedItem.id) return c;
        const h1 = HOLE_MAP[c.pin1Hole];
        const h2 = HOLE_MAP[c.pin2Hole];
        if (!h1 || !h2 || !h1.col || !h2.col) return c;
        const isMostlyHorizontal = Math.abs(h1.y - h2.y) < Math.abs(h1.x - h2.x);
        if (isMostlyHorizontal) {
          // Make vertical across the center ravine or 4 rows down
          if (h1.kind === 'top') {
            return { ...c, pin2Hole: `F:${h1.col}` };
          }
          if (h1.kind === 'bot') {
            return { ...c, pin2Hole: `E:${h1.col}` };
          }
          return c;
        } else {
          // Make horizontal
          const row = h1.rowChar || 'C';
          const nextCol = h1.col + 4 <= 30 ? h1.col + 4 : Math.max(1, h1.col - 4);
          return { ...c, pin2Hole: `${row}:${nextCol}` };
        }
      })
    );
  };

  const handleFlipPolarity = () => {
    if (!selectedItem || selectedItem.kind !== 'comp') return;
    setComponents((prev) =>
      prev.map((c) =>
        c.id === selectedItem.id ? { ...c, pin1Hole: c.pin2Hole, pin2Hole: c.pin1Hole } : c
      )
    );
  };

  const handleAdjustSpan = (deltaCols: number) => {
    if (!selectedItem || selectedItem.kind !== 'comp') return;
    setComponents((prev) =>
      prev.map((c) => {
        if (c.id !== selectedItem.id) return c;
        const h1 = HOLE_MAP[c.pin1Hole];
        const h2 = HOLE_MAP[c.pin2Hole];
        if (!h1 || !h2 || h2.kind === 'rail' || !h1.col || !h2.col || !h2.rowChar) return c;
        const nextCol = Math.max(1, Math.min(30, h2.col + deltaCols));
        if (nextCol === h1.col && h2.rowChar === h1.rowChar) return c;
        return { ...c, pin2Hole: `${h2.rowChar}:${nextCol}` };
      })
    );
  };

  const handleDeleteSelected = () => {
    if (!selectedItem) return;
    if (selectedItem.kind === 'comp') {
      setComponents((prev) => prev.filter((c) => c.id !== selectedItem.id));
    } else {
      setWires((prev) => prev.filter((w) => w.id !== selectedItem.id));
    }
    setSelectedItem(null);
  };

  const selectedComp = useMemo(
    () =>
      selectedItem?.kind === 'comp'
        ? components.find((c) => c.id === selectedItem.id) || null
        : null,
    [components, selectedItem]
  );

  const selectedWire = useMemo(
    () =>
      selectedItem?.kind === 'wire'
        ? wires.find((w) => w.id === selectedItem.id) || null
        : null,
    [wires, selectedItem]
  );

  // Highlighted electrical strip holes when hovering or placing wire
  const highlightedNet = useMemo(() => {
    const targetHole = dragHoverHoleId || hoveredHoleId || pendingWireHole;
    return targetHole ? HOLE_MAP[targetHole]?.net ?? null : null;
  }, [dragHoverHoleId, hoveredHoleId, pendingWireHole]);

  const hoveredHoleInfo = hoveredHoleId ? HOLE_MAP[hoveredHoleId] : null;
  const hoveredVoltage = hoveredHoleId ? getHoleVoltage(hoveredHoleId) : undefined;

  const getPartLabel = (type: BreadboardPartType) => {
    const p = PART_PALETTE.find((x) => x.type === type);
    return p ? pick(p.labelAr, p.labelFr, p.labelEn) : type;
  };

  // Ghost preview coordinates when dragging from palette or hovering in place mode
  const ghostPreview = useMemo(() => {
    const typeToPlace: BreadboardPartType | null =
      draggingPaletteType || (activeTool !== 'select' && activeTool !== 'wire' ? activeTool : null);
    const anchorId = dragHoverHoleId || hoveredHoleId;
    if (!typeToPlace || !anchorId) return null;
    const h1 = HOLE_MAP[anchorId];
    const h2Id = computeSecondHole(anchorId, typeToPlace);
    const h2 = HOLE_MAP[h2Id];
    if (!h1 || !h2) return null;
    return { type: typeToPlace, h1, h2 };
  }, [activeTool, dragHoverHoleId, draggingPaletteType, hoveredHoleId]);

  const statusTone =
    !powerOn
      ? 'border-[#E2E8F0] dark:border-[#334155] bg-[#F8FAFC] dark:bg-[#0F172A] text-slate-600 dark:text-slate-300'
      : simResult.status === 'short_circuit'
      ? 'border-rose-300 dark:border-rose-900 bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-200'
      : 'border-emerald-200 dark:border-emerald-800/70 bg-emerald-50/70 dark:bg-emerald-950/30 text-emerald-900 dark:text-emerald-200';

  const statusText = pick(simResult.messageAr, simResult.messageFr, simResult.messageEn);

  const allRowOrder = [...TOP_ROWS, ...BOT_ROWS] as string[];

  const handleSvgPointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    const pt = clientToSvg(e.clientX, e.clientY);
    if (!pt) return;
    setPointerSvg(pt);
    const nearest = findNearestHole(pt.x, pt.y);
    setHoveredHoleId(nearest ? nearest.id : null);

    if (draggingCompState && nearest && nearest.kind !== 'rail' && nearest.col && nearest.rowChar) {
      const curRowIdx = allRowOrder.indexOf(nearest.rowChar);
      const dCol = nearest.col - draggingCompState.startCol;
      const dRow = curRowIdx - draggingCompState.startRowIdx;
      const next1 = shiftHoleByDelta(draggingCompState.origPin1, dCol, dRow);
      const next2 = shiftHoleByDelta(draggingCompState.origPin2, dCol, dRow);
      if (next1 && next2 && next1 !== next2) {
        setComponents((prev) =>
          prev.map((c) =>
            c.id === draggingCompState.id ? { ...c, pin1Hole: next1, pin2Hole: next2 } : c
          )
        );
      }
    }
  };

  const handleSvgPointerUp = () => {
    if (draggingCompState) {
      setDraggingCompState(null);
    }
  };

  const handleBoardDragOver = (e: React.DragEvent<SVGSVGElement>) => {
    if (!draggingPaletteType) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
    const pt = clientToSvg(e.clientX, e.clientY);
    if (!pt) return;
    const nearest = findNearestHole(pt.x, pt.y);
    setDragHoverHoleId(nearest ? nearest.id : null);
  };

  const handleBoardDrop = (e: React.DragEvent<SVGSVGElement>) => {
    e.preventDefault();
    const partType =
      (e.dataTransfer.getData('text/plain') as BreadboardPartType) || draggingPaletteType;
    const pt = clientToSvg(e.clientX, e.clientY);
    if (partType && pt) {
      const nearest = findNearestHole(pt.x, pt.y);
      if (nearest) {
        placePartAtHole(partType, nearest.id);
      }
    }
    setDraggingPaletteType(null);
    setDragHoverHoleId(null);
  };

  const renderPlacedComponent = (comp: BoardComponent) => {
    const h1 = HOLE_MAP[comp.pin1Hole];
    const h2 = HOLE_MAP[comp.pin2Hole];
    if (!h1 || !h2) return null;

    const cx = (h1.x + h2.x) / 2;
    const cy = (h1.y + h2.y) / 2;
    const dx = h2.x - h1.x;
    const dy = h2.y - h1.y;
    const dist = Math.hypot(dx, dy);
    const angleDeg = (Math.atan2(dy, dx) * 180) / Math.PI;
    const isSelected = selectedItem?.kind === 'comp' && selectedItem.id === comp.id;
    const compSim = powerOn ? simResult.components[comp.id] : undefined;

    const handleStartDrag = (e: React.PointerEvent<SVGGElement>) => {
      e.stopPropagation();
      setSelectedItem({ kind: 'comp', id: comp.id });
      const pt = clientToSvg(e.clientX, e.clientY);
      const nearest = pt ? findNearestHole(pt.x, pt.y, 40) : h1;
      const anchor = nearest && nearest.kind !== 'rail' ? nearest : h1;
      if (anchor.col && anchor.rowChar) {
        setDraggingCompState({
          id: comp.id,
          origPin1: comp.pin1Hole,
          origPin2: comp.pin2Hole,
          startCol: anchor.col,
          startRowIdx: allRowOrder.indexOf(anchor.rowChar),
        });
      }
    };

    const ledSpec = LED_PALETTE.find((l) => l.id === (comp.ledColor || 'red')) || LED_PALETTE[0];
    const brightness = compSim?.brightness ?? 0;
    const isOvercurrent = Boolean(compSim?.overcurrent);

    return (
      <g
        key={comp.id}
        onPointerDown={handleStartDrag}
        style={{ cursor: 'grab', touchAction: 'none' }}
      >
        {/* Metallic leads anchored into exact holes */}
        <line
          x1={h1.x}
          y1={h1.y}
          x2={h2.x}
          y2={h2.y}
          stroke="#94a3b8"
          strokeWidth={3.2}
          strokeLinecap="round"
        />
        <circle cx={h1.x} cy={h1.y} r={4.2} fill="#cbd5e1" stroke="#334155" strokeWidth={1.2} />
        <circle cx={h2.x} cy={h2.y} r={4.2} fill="#cbd5e1" stroke="#334155" strokeWidth={1.2} />

        {/* Selection halo */}
        {isSelected && (
          <g transform={`translate(${cx}, ${cy}) rotate(${angleDeg})`}>
            <rect
              x={-Math.max(24, dist * 0.42)}
              y={-18}
              width={Math.max(48, dist * 0.84)}
              height={36}
              rx={9}
              fill="none"
              stroke="#059669"
              strokeWidth={2}
              strokeDasharray="4 3"
            />
          </g>
        )}

        {/* Component Body */}
        <g transform={`translate(${cx}, ${cy}) rotate(${angleDeg})`}>
          {comp.type === 'resistor' && (() => {
            const [b1, b2, b3, b4] = getResistorBands(comp.value);
            return (
              <g>
                <rect
                  x={-22}
                  y={-8.5}
                  width={44}
                  height={17}
                  rx={5.5}
                  fill="#e7cf9e"
                  stroke="#926c38"
                  strokeWidth={1.2}
                />
                <rect x={-14} y={-8.5} width={4} height={17} fill={b1} />
                <rect x={-6} y={-8.5} width={4} height={17} fill={b2} />
                <rect x={2} y={-8.5} width={4} height={17} fill={b3} />
                <rect x={12} y={-8.5} width={3.5} height={17} fill={b4} />
                <g transform={`rotate(${-angleDeg})`}>
                  <text
                    y={-13}
                    textAnchor="middle"
                    className="fill-slate-800 text-[9.5px] font-bold font-mono-num"
                    style={{ paintOrder: 'stroke', stroke: '#f3efe6', strokeWidth: 3 }}
                  >
                    {formatResistance(comp.value)}
                  </text>
                </g>
              </g>
            );
          })()}

          {comp.type === 'led' && (
            <g>
              {brightness > 0.02 && (
                <circle
                  cx={0}
                  cy={0}
                  r={18 + brightness * 14}
                  fill={ledSpec.glow}
                  opacity={0.28 + brightness * 0.55}
                />
              )}
              <circle
                cx={0}
                cy={0}
                r={12}
                fill={brightness > 0.05 ? ledSpec.glow : ledSpec.base}
                stroke={isOvercurrent ? '#dc2626' : '#1e293b'}
                strokeWidth={isOvercurrent ? 2.5 : 1.5}
                opacity={brightness > 0.05 ? 1 : 0.82}
              />
              {/* Flat cathode edge indicator */}
              <line x1={9} y1={-7} x2={9} y2={7} stroke="#0f172a" strokeWidth={2.5} />
              <text x={-6} y={3.5} textAnchor="middle" className="fill-white text-[9px] font-extrabold">
                +
              </text>
              {isOvercurrent && (
                <g transform={`rotate(${-angleDeg})`}>
                  <text
                    y={-16}
                    textAnchor="middle"
                    className="fill-rose-600 text-[9px] font-extrabold"
                    style={{ paintOrder: 'stroke', stroke: '#ffffff', strokeWidth: 3 }}
                  >
                    ! {Math.round(compSim?.currentMa ?? 0)}mA
                  </text>
                </g>
              )}
            </g>
          )}

          {comp.type === 'switch' && (
            <g
              onClick={(e) => {
                e.stopPropagation();
                setComponents((prev) =>
                  prev.map((c) => (c.id === comp.id ? { ...c, closed: !c.closed } : c))
                );
                setSelectedItem({ kind: 'comp', id: comp.id });
              }}
              style={{ cursor: 'pointer' }}
            >
              <rect
                x={-16}
                y={-15}
                width={32}
                height={30}
                rx={4}
                fill="#cbd5e1"
                stroke="#334155"
                strokeWidth={1.5}
              />
              <circle
                cx={0}
                cy={0}
                r={9}
                fill={comp.closed ? '#0284c7' : '#334155'}
                stroke="#0f172a"
                strokeWidth={1.4}
              />
              <g transform={`rotate(${-angleDeg})`}>
                <text
                  y={-19}
                  textAnchor="middle"
                  className="fill-slate-900 text-[9px] font-extrabold"
                  style={{ paintOrder: 'stroke', stroke: '#f3efe6', strokeWidth: 3 }}
                >
                  {comp.closed ? 'ON' : 'OFF'}
                </text>
              </g>
            </g>
          )}

          {comp.type === 'potentiometer' && (
            <g>
              <rect
                x={-15}
                y={-14}
                width={30}
                height={28}
                rx={4}
                fill="#0284c7"
                stroke="#075985"
                strokeWidth={1.4}
              />
              <circle cx={0} cy={0} r={9} fill="#e2e8f0" stroke="#475569" strokeWidth={1.2} />
              <line x1={0} y1={-6} x2={0} y2={6} stroke="#334155" strokeWidth={2.2} strokeLinecap="round" />
              <g transform={`rotate(${-angleDeg})`}>
                <text
                  y={-18}
                  textAnchor="middle"
                  className="fill-slate-800 text-[9px] font-bold font-mono-num"
                  style={{ paintOrder: 'stroke', stroke: '#f3efe6', strokeWidth: 3 }}
                >
                  {formatResistance(comp.value)}
                </text>
              </g>
            </g>
          )}

          {(comp.type === 'diode' || comp.type === 'zener') && (
            <g>
              <rect
                x={-19}
                y={-8}
                width={38}
                height={16}
                rx={3}
                fill={comp.type === 'zener' ? '#ea580c' : '#1e293b'}
                stroke="#0f172a"
                strokeWidth={1.2}
              />
              <rect
                x={9}
                y={-8}
                width={5}
                height={16}
                fill={comp.type === 'zener' ? '#0f172a' : '#e2e8f0'}
              />
              <text x={-6} y={3} textAnchor="middle" className="fill-white text-[8px] font-bold">
                {comp.type === 'zener' ? `${comp.value}V` : '1N'}
              </text>
            </g>
          )}

          {comp.type === 'ldr' && (
            <g>
              <ellipse cx={0} cy={0} rx={15} ry={12} fill="#fed7aa" stroke="#9a3412" strokeWidth={1.4} />
              <path
                d="M-9 -4 Q-4 -8 0 -4 T9 -4 M-9 2 Q-4 -2 0 2 T9 2"
                fill="none"
                stroke="#b91c1c"
                strokeWidth={1.8}
              />
              <g transform={`rotate(${-angleDeg})`}>
                <text
                  y={-15}
                  textAnchor="middle"
                  className="fill-amber-900 text-[9px] font-bold font-mono-num"
                  style={{ paintOrder: 'stroke', stroke: '#f3efe6', strokeWidth: 3 }}
                >
                  {comp.lightLevel ?? 50}%
                </text>
              </g>
            </g>
          )}

          {comp.type === 'buzzer' && (
            <g>
              <circle cx={0} cy={0} r={16} fill="#1e293b" stroke="#0f172a" strokeWidth={1.5} />
              <circle cx={0} cy={0} r={5} fill="#475569" />
              <text x={-9} y={3} textAnchor="middle" className="fill-white text-[8px] font-bold">
                +
              </text>
              {brightness > 0.1 && (
                <circle
                  cx={0}
                  cy={0}
                  r={22}
                  fill="none"
                  stroke="#D97706"
                  strokeWidth={2}
                  strokeDasharray="4 3"
                />
              )}
            </g>
          )}

          {comp.type === 'fuse' && (
            <g>
              <rect
                x={-20}
                y={-7.5}
                width={40}
                height={15}
                rx={4}
                fill={comp.closed === false || isOvercurrent ? '#fecaca' : '#e0f2fe'}
                stroke="#475569"
                strokeWidth={1.2}
              />
              <rect x={-20} y={-7.5} width={7} height={15} rx={2} fill="#94a3b8" />
              <rect x={13} y={-7.5} width={7} height={15} rx={2} fill="#94a3b8" />
              {!(comp.closed === false || isOvercurrent) && (
                <line x1={-12} y1={0} x2={12} y2={0} stroke="#334155" strokeWidth={1.5} />
              )}
            </g>
          )}
        </g>
      </g>
    );
  };

  return (
    <div className="space-y-5">
      {/* Top Toolbar: Presets, Power Control, Clear */}
      <section className="rounded-2xl border border-[#E2E8F0] dark:border-[#334155] bg-white dark:bg-[#1E293B] p-4 space-y-3.5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {pick(
                'محاكي لوحة التجارب التفاعلي (Breadboard)',
                'Simulateur de platine d’essai (Breadboard)',
                'Interactive Breadboard Workbench'
              )}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {pick(
                'اسحب العناصر إلى ثقوب اللوحة أو اضغط على العنصر ثم اضغط على الثقب لتركيبه واختبر توصيلاتك حياً.',
                'Glissez les composants sur les trous ou sélectionnez puis touchez un trou pour câbler et simuler en direct.',
                'Drag parts onto breadboard tie-points or tap a part then a hole to build and test live DC circuits.'
              )}
            </p>
          </div>

          {/* Power Supply Controls (MB102) */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setPowerOn((p) => !p)}
              className={`inline-flex min-h-[44px] items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-colors whitespace-nowrap shadow-sm ${
                powerOn
                  ? 'bg-[#059669] text-white hover:bg-[#047857]'
                  : 'bg-[#F8FAFC] dark:bg-[#0F172A] border border-[#E2E8F0] dark:border-[#334155] text-slate-800 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-[#334155]'
              }`}
            >
              <Power className="h-4 w-4" />
              <span>
                {powerOn
                  ? pick('الطاقة: تشغيل', 'Alim : ON', 'Power: ON')
                  : pick('الطاقة: إيقاف', 'Alim : OFF', 'Power: OFF')}
              </span>
            </button>

            <div className="flex items-center gap-1 rounded-xl bg-[#F8FAFC] dark:bg-[#0F172A] p-1 border border-[#E2E8F0] dark:border-[#334155]">
              {([3.3, 5, 9, 12] as const).map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => setSupplyVoltage(v)}
                  className={`min-h-[36px] rounded-lg px-2.5 py-1 text-xs font-bold font-mono-num transition-colors whitespace-nowrap ${
                    supplyVoltage === v
                      ? 'bg-[#059669] text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {v}V
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Preset Circuits & Reset */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2.5 border-t border-[#E2E8F0] dark:border-[#334155]">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 whitespace-nowrap me-1">
              {pick('تجارب جاهزة:', 'Montages prêts :', 'Presets:')}
            </span>
            {PRESETS.map((pr) => (
              <button
                key={pr.id}
                type="button"
                onClick={() => handleLoadPreset(pr)}
                className="min-h-[36px] rounded-lg border border-[#E2E8F0] dark:border-[#334155] bg-[#F8FAFC] dark:bg-[#0F172A] px-3 py-1 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:border-[#059669] hover:text-[#059669] dark:hover:text-emerald-400 transition-colors whitespace-nowrap shrink-0"
              >
                {pick(pr.labelAr, pr.labelFr, pr.labelEn)}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => handleLoadPreset(PRESETS[0])}
            className="inline-flex min-h-[36px] items-center gap-1.5 rounded-lg border border-[#E2E8F0] dark:border-[#334155] bg-[#F8FAFC] dark:bg-[#0F172A] px-3 py-1 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#334155]/60 whitespace-nowrap"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>{pick('إعادة ضبط', 'Réinitialiser', 'Reset')}</span>
          </button>
        </div>

        {/* Status Banner */}
        <div className={`flex items-center gap-2.5 rounded-xl border px-3.5 py-2.5 text-xs font-semibold ${statusTone}`}>
          {!powerOn ? (
            <Power className="h-4 w-4 shrink-0" />
          ) : simResult.status === 'short_circuit' ? (
            <AlertTriangle className="h-4 w-4 shrink-0" />
          ) : (
            <CheckCircle2 className="h-4 w-4 shrink-0" />
          )}
          <span className="flex-1">{statusText}</span>
          {hoveredHoleInfo && (
            <span className="font-mono-num text-[11px] font-bold whitespace-nowrap border-s border-current/25 ps-2.5" dir="ltr">
              {hoveredHoleInfo.label}
              {hoveredVoltage !== undefined ? ` · ${hoveredVoltage.toFixed(2)}V` : ''}
            </span>
          )}
        </div>
      </section>

      {/* Main Two-Zone Workspace */}
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_320px] items-start">
        {/* Left/Main Zone: Palette + Interactive Breadboard Canvas */}
        <div className="space-y-4 min-w-0">
          {/* Draggable / Tappable Component Tray & Wire Tool */}
          <section className="rounded-2xl border border-[#E2E8F0] dark:border-[#334155] bg-white dark:bg-[#1E293B] p-3.5 space-y-3 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTool('select');
                    setPendingWireHole(null);
                  }}
                  className={`inline-flex min-h-[40px] items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition-colors whitespace-nowrap ${
                    activeTool === 'select'
                      ? 'bg-[#059669] text-white shadow-sm'
                      : 'bg-[#F8FAFC] dark:bg-[#0F172A] border border-[#E2E8F0] dark:border-[#334155] text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#334155]/60'
                  }`}
                >
                  <MousePointer className="h-3.5 w-3.5" />
                  <span>{pick('تحديد وسحب', 'Sélection / Déplacer', 'Select & Move')}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActiveTool('wire');
                    setPendingWireHole(null);
                  }}
                  className={`inline-flex min-h-[40px] items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition-colors whitespace-nowrap ${
                    activeTool === 'wire'
                      ? 'bg-[#059669] text-white shadow-sm'
                      : 'bg-[#F8FAFC] dark:bg-[#0F172A] border border-[#E2E8F0] dark:border-[#334155] text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#334155]/60'
                  }`}
                >
                  <Zap className="h-3.5 w-3.5" />
                  <span>{pick('سلك توصيل', 'Fil de pontage', 'Jumper Wire')}</span>
                </button>
              </div>

              {/* Wire Color Picker */}
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                  {pick('لون السلك:', 'Couleur :', 'Wire:')}
                </span>
                {WIRE_COLORS.map((wc) => (
                  <button
                    key={wc.id}
                    type="button"
                    onClick={() => {
                      setWireColor(wc.id);
                      setActiveTool('wire');
                    }}
                    title={pick(wc.labelAr, wc.labelFr, wc.labelEn)}
                    aria-label={pick(wc.labelAr, wc.labelFr, wc.labelEn)}
                    className={`h-7 w-7 rounded-full border-2 transition-transform ${
                      wireColor === wc.id
                        ? 'scale-110 border-[#059669] ring-2 ring-[#059669]/40'
                        : 'border-white dark:border-[#334155] opacity-85 hover:opacity-100'
                    }`}
                    style={{ backgroundColor: wc.hex }}
                  />
                ))}
              </div>
            </div>

            {/* Draggable Component Chips */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {PART_PALETTE.map((part) => {
                const isActive = activeTool === part.type;
                return (
                  <button
                    key={part.type}
                    type="button"
                    draggable
                    onDragStart={(e) => {
                      setDraggingPaletteType(part.type);
                      e.dataTransfer.setData('text/plain', part.type);
                      e.dataTransfer.effectAllowed = 'copy';
                    }}
                    onDragEnd={() => {
                      setDraggingPaletteType(null);
                      setDragHoverHoleId(null);
                    }}
                    onClick={() => {
                      setActiveTool(isActive ? 'select' : part.type);
                      setPendingWireHole(null);
                    }}
                    className={`inline-flex min-h-[44px] items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-bold transition-all whitespace-nowrap shrink-0 cursor-grab active:cursor-grabbing ${
                      isActive
                        ? 'border-[#059669] bg-emerald-50 dark:bg-emerald-950/50 text-[#059669] dark:text-emerald-300 ring-2 ring-[#059669]/20'
                        : 'border-[#E2E8F0] dark:border-[#334155] bg-[#F8FAFC] dark:bg-[#0F172A] text-slate-800 dark:text-slate-100 hover:border-[#059669]'
                    }`}
                  >
                    <GripVertical className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                    <span>{pick(part.labelAr, part.labelFr, part.labelEn)}</span>
                  </button>
                );
              })}
            </div>

            {(activeTool !== 'select' || pendingWireHole || energizedWireIds.size > 0) && (
              <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] font-semibold">
                <div className="text-[#059669] dark:text-emerald-400">
                  {activeTool === 'wire'
                    ? pendingWireHole
                      ? pick(
                          `اضغط على الثقب الثاني لإكمال السلك من ${HOLE_MAP[pendingWireHole]?.label}`,
                          `Touchez le 2e trou pour relier depuis ${HOLE_MAP[pendingWireHole]?.label}`,
                          `Tap destination hole to complete wire from ${HOLE_MAP[pendingWireHole]?.label}`
                        )
                      : pick(
                          'اضغط على أول ثقب ثم ثاني ثقب على اللوحة لتوصيل السلك.',
                          'Touchez le trou de départ puis le trou d’arrivée pour placer un fil.',
                          'Tap any start hole then an end hole on the board to route a jumper wire.'
                        )
                    : activeTool !== 'select'
                    ? pick(
                        `الأداة النشطة: ${getPartLabel(activeTool)} — اسحبه أو اضغط على أي ثقب في اللوحة لتركيبه.`,
                        `Outil actif : ${getPartLabel(activeTool)} — Glissez ou touchez un trou sur la platine.`,
                        `Active part: ${getPartLabel(activeTool)} — Drag or tap any hole on the breadboard to plug it in.`
                      )
                    : null}
                </div>

                {energizedWireIds.size > 0 && (
                  <div className="inline-flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                    <span
                      className={`h-2.5 w-2.5 rounded-full ${
                        simResult.status === 'short_circuit'
                          ? 'bg-[#D97706] shadow-[0_0_8px_#D97706]'
                          : 'bg-[#10b981] shadow-[0_0_8px_#10b981]'
                      }`}
                    />
                    <span>
                      {pick(
                        'توهج الأسلاك يشير إلى سريان تيار كهربائي حي',
                        'La lueur des fils indique un courant électrique actif',
                        'Wire glow indicates live electric current flow'
                      )}
                    </span>
                  </div>
                )}
              </div>
            )}
          </section>

          {/* Interactive SVG 400-Hole Breadboard Stage */}
          <section className="rounded-2xl border border-[#E2E8F0] dark:border-[#334155] bg-[#1E293B] p-3 sm:p-4 overflow-x-auto shadow-sm">
            <div className="min-w-[760px]">
              <svg
                ref={svgRef}
                viewBox="0 0 980 430"
                className="w-full h-auto select-none"
                onPointerMove={handleSvgPointerMove}
                onPointerUp={handleSvgPointerUp}
                onPointerLeave={() => {
                  setHoveredHoleId(null);
                  setPointerSvg(null);
                }}
                onDragOver={handleBoardDragOver}
                onDrop={handleBoardDrop}
              >
                {/* Workbench subtle grid */}
                <defs>
                  <pattern id="bbGrid" width="26" height="26" patternUnits="userSpaceOnUse">
                    <path d="M 26 0 L 0 0 0 26" fill="none" stroke="#1e293b" strokeWidth="1" />
                  </pattern>
                </defs>
                <rect x="0" y="0" width="980" height="430" rx="14" fill="#0f172a" />
                <rect x="0" y="0" width="980" height="430" rx="14" fill="url(#bbGrid)" opacity="0.6" />

                {/* MB102 Power Supply Module on Left */}
                <g>
                  <rect
                    x="18"
                    y="28"
                    width="124"
                    height="376"
                    rx="12"
                    fill="#064e3b"
                    stroke="#047857"
                    strokeWidth="2"
                  />
                  {/* Copper Gold 4 Header Pins bridging into Breadboard Rails */}
                  <rect x="132" y="40" width="16" height="7" rx="2" fill="#D97706" />
                  <rect x="132" y="62" width="16" height="7" rx="2" fill="#D97706" />
                  <rect x="132" y="364" width="16" height="7" rx="2" fill="#D97706" />
                  <rect x="132" y="386" width="16" height="7" rx="2" fill="#D97706" />

                  <text x="80" y="66" textAnchor="middle" className="fill-emerald-200 text-[11px] font-bold">
                    MB102 POWER
                  </text>
                  <text x="80" y="84" textAnchor="middle" className="fill-emerald-300/85 text-[10px] font-mono-num">
                    DC {supplyVoltage}V
                  </text>

                  {/* Power Status LED */}
                  <circle
                    cx="80"
                    cy="115"
                    r="8"
                    fill={powerOn ? '#22c55e' : '#334155'}
                    stroke="#0f172a"
                    strokeWidth="2"
                  />
                  {powerOn && <circle cx="80" cy="115" r="15" fill="#4ade80" opacity="0.28" />}

                  {/* Interactive Power Button on PCB */}
                  <g onClick={() => setPowerOn((p) => !p)} style={{ cursor: 'pointer' }}>
                    <rect
                      x="38"
                      y="150"
                      width="84"
                      height="42"
                      rx="8"
                      fill={powerOn ? '#059669' : '#334155'}
                      stroke="#a7f3d0"
                      strokeWidth="1.2"
                    />
                    <text x="80" y="175" textAnchor="middle" className="fill-white text-[12px] font-extrabold">
                      {powerOn ? 'ON' : 'OFF'}
                    </text>
                  </g>

                  {/* Rail Mirror Toggle */}
                  <g onClick={() => setMirrorRails((m) => !m)} style={{ cursor: 'pointer' }}>
                    <rect
                      x="30"
                      y="220"
                      width="100"
                      height="46"
                      rx="8"
                      fill="#065f46"
                      stroke="#34d399"
                      strokeOpacity="0.45"
                    />
                    <text x="80" y="240" textAnchor="middle" className="fill-emerald-100 text-[9.5px] font-bold">
                      {mirrorRails ? 'TOP + BOT RAILS' : 'TOP RAIL ONLY'}
                    </text>
                    <text x="80" y="254" textAnchor="middle" className="fill-emerald-300 text-[9px] font-mono-num">
                      {mirrorRails ? 'LINKED' : 'ISOLATED'}
                    </text>
                  </g>

                  {/* Output Labels */}
                  <text x="122" y="47" textAnchor="end" className="fill-sky-300 text-[10px] font-bold font-mono-num">
                    GND
                  </text>
                  <text x="122" y="69" textAnchor="end" className="fill-rose-300 text-[10px] font-bold font-mono-num">
                    +{supplyVoltage}V
                  </text>
                  <text x="122" y="371" textAnchor="end" className="fill-rose-300 text-[10px] font-bold font-mono-num">
                    +{supplyVoltage}V
                  </text>
                  <text x="122" y="393" textAnchor="end" className="fill-sky-300 text-[10px] font-bold font-mono-num">
                    GND
                  </text>
                </g>

                {/* Main Breadboard ABS Plastic Housing */}
                <rect
                  x="142"
                  y="20"
                  width="816"
                  height="392"
                  rx="14"
                  fill="#f3efe6"
                  stroke="#cbd5e1"
                  strokeWidth="2"
                />

                {/* Top Power Rail Stripes */}
                <line x1="164" y1="33" x2="940" y2="33" stroke="#2563eb" strokeWidth="2.4" />
                <line x1="164" y1="78" x2="940" y2="78" stroke="#dc2626" strokeWidth="2.4" />
                <text x="155" y="48" textAnchor="middle" className="fill-blue-700 text-[13px] font-extrabold">
                  −
                </text>
                <text x="155" y="70" textAnchor="middle" className="fill-red-600 text-[13px] font-extrabold">
                  +
                </text>

                {/* Bottom Power Rail Stripes */}
                <line x1="164" y1="355" x2="940" y2="355" stroke="#dc2626" strokeWidth="2.4" />
                <line x1="164" y1="402" x2="940" y2="402" stroke="#2563eb" strokeWidth="2.4" />
                <text x="155" y="372" textAnchor="middle" className="fill-red-600 text-[13px] font-extrabold">
                  +
                </text>
                <text x="155" y="394" textAnchor="middle" className="fill-blue-700 text-[13px] font-extrabold">
                  −
                </text>

                {/* Subtle groove dividers */}
                <line x1="146" y1="88" x2="954" y2="88" stroke="#d6d0c4" strokeWidth="1.5" />
                <line x1="146" y1="346" x2="954" y2="346" stroke="#d6d0c4" strokeWidth="1.5" />

                {/* Central DIP Ravine */}
                <rect x="144" y="211" width="812" height="24" fill="#e2ddd2" />
                <line x1="144" y1="211" x2="956" y2="211" stroke="#cbd5e1" strokeWidth="1" />
                <line x1="144" y1="235" x2="956" y2="235" stroke="#cbd5e1" strokeWidth="1" />

                {/* Column Numbers */}
                {[1, 5, 10, 15, 20, 25, 30].map((col) => {
                  const x = COL_X0 + (col - 1) * COL_DX;
                  return (
                    <g key={col}>
                      <text x={x} y="103" textAnchor="middle" className="fill-slate-500 text-[9.5px] font-bold font-mono-num">
                        {col}
                      </text>
                      <text x={x} y="343" textAnchor="middle" className="fill-slate-500 text-[9.5px] font-bold font-mono-num">
                        {col}
                      </text>
                    </g>
                  );
                })}

                {/* Row Letters A..J */}
                {[...TOP_ROWS, ...BOT_ROWS].map((r) => (
                  <g key={r}>
                    <text x="155" y={ROW_Y[r] + 3.5} textAnchor="middle" className="fill-slate-500 text-[9.5px] font-bold font-mono">
                      {r}
                    </text>
                    <text x="944" y={ROW_Y[r] + 3.5} textAnchor="middle" className="fill-slate-500 text-[9.5px] font-bold font-mono">
                      {r}
                    </text>
                  </g>
                ))}

                {/* Connected Electrical Strip Highlight */}
                {highlightedNet && NET_TO_HOLES[highlightedNet] && (
                  <g>
                    {NET_TO_HOLES[highlightedNet].map((h) => (
                      <circle
                        key={`hl_${h.id}`}
                        cx={h.x}
                        cy={h.y}
                        r={8}
                        fill="#10b981"
                        opacity={0.28}
                      />
                    ))}
                  </g>
                )}

                {/* Breadboard Tie-Point Holes (400 holes) */}
                {ALL_HOLES.map((h) => {
                  const isHovered = hoveredHoleId === h.id || dragHoverHoleId === h.id;
                  const isPending = pendingWireHole === h.id;
                  return (
                    <g
                      key={h.id}
                      onClick={() => handleHoleInteraction(h.id)}
                      style={{ cursor: activeTool === 'select' ? 'default' : 'crosshair' }}
                    >
                      <rect
                        x={h.x - 4.4}
                        y={h.y - 4.4}
                        width={8.8}
                        height={8.8}
                        rx={1.8}
                        fill={isPending ? '#059669' : isHovered ? '#10b981' : '#1e293b'}
                        stroke={isHovered || isPending ? '#34d399' : '#94a3b8'}
                        strokeWidth={isHovered || isPending ? 1.6 : 0.8}
                      />
                      <rect
                        x={h.x - 2}
                        y={h.y - 2}
                        width={4}
                        height={4}
                        rx={0.8}
                        fill="#0f172a"
                      />
                    </g>
                  );
                })}

                {/* Ghost Placement Preview */}
                {ghostPreview && (
                  <g opacity="0.65" pointerEvents="none">
                    <line
                      x1={ghostPreview.h1.x}
                      y1={ghostPreview.h1.y}
                      x2={ghostPreview.h2.x}
                      y2={ghostPreview.h2.y}
                      stroke="#059669"
                      strokeWidth={6}
                      strokeDasharray="5 4"
                      strokeLinecap="round"
                    />
                    <circle cx={ghostPreview.h1.x} cy={ghostPreview.h1.y} r={7} fill="#059669" />
                    <circle cx={ghostPreview.h2.x} cy={ghostPreview.h2.y} r={7} fill="#059669" />
                  </g>
                )}

                {/* Placed Electronic Components */}
                {components.map(renderPlacedComponent)}

                {/* Jumper Wires */}
                {wires.map((w) => {
                  const ha = HOLE_MAP[w.holeA];
                  const hb = HOLE_MAP[w.holeB];
                  if (!ha || !hb) return null;
                  const wc = WIRE_COLORS.find((c) => c.id === w.color) || WIRE_COLORS[0];
                  const isSel = selectedItem?.kind === 'wire' && selectedItem.id === w.id;
                  const isEnergized = energizedWireIds.has(w.id);
                  const isShort = simResult.status === 'short_circuit';
                  const glowHex = isShort ? '#f59e0b' : '#10b981';
                  const coreHex = isShort ? '#fef08a' : '#a7f3d0';
                  const mx = (ha.x + hb.x) / 2;
                  const my = (ha.y + hb.y) / 2;
                  const dist = Math.hypot(hb.x - ha.x, hb.y - ha.y);
                  const arcLift = Math.min(48, Math.max(16, dist * 0.22));
                  const ctrlY = my - arcLift;
                  const pathD = `M ${ha.x} ${ha.y} Q ${mx} ${ctrlY} ${hb.x} ${hb.y}`;

                  return (
                    <g
                      key={w.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedItem({ kind: 'wire', id: w.id });
                      }}
                      style={{ cursor: 'pointer' }}
                    >
                      {/* Soft luminous outer glow when electric current flows through this wire */}
                      {isEnergized && (
                        <>
                          <path
                            d={pathD}
                            fill="none"
                            stroke={glowHex}
                            strokeWidth={13}
                            strokeLinecap="round"
                            opacity={0.22}
                          />
                          <path
                            d={pathD}
                            fill="none"
                            stroke={glowHex}
                            strokeWidth={8.5}
                            strokeLinecap="round"
                            opacity={0.42}
                          >
                            <animate
                              attributeName="opacity"
                              values="0.28;0.52;0.28"
                              dur="1.8s"
                              repeatCount="indefinite"
                            />
                          </path>
                        </>
                      )}

                      {isSel && (
                        <path
                          d={pathD}
                          fill="none"
                          stroke="#34d399"
                          strokeWidth={9}
                          strokeLinecap="round"
                          opacity={0.7}
                        />
                      )}
                      <path
                        d={pathD}
                        fill="none"
                        stroke={wc.hex}
                        strokeWidth={4.8}
                        strokeLinecap="round"
                      />

                      {/* Subtle flowing current highlight inside energized wire */}
                      {isEnergized && (
                        <path
                          d={pathD}
                          fill="none"
                          stroke={coreHex}
                          strokeWidth={1.6}
                          strokeLinecap="round"
                          strokeDasharray="6 10"
                          opacity={0.8}
                        >
                          <animate
                            attributeName="stroke-dashoffset"
                            from="16"
                            to="0"
                            dur="1.2s"
                            repeatCount="indefinite"
                          />
                        </path>
                      )}

                      {/* Plug connector boots */}
                      {isEnergized && (
                        <>
                          <circle cx={ha.x} cy={ha.y} r={7.5} fill={glowHex} opacity={0.32} />
                          <circle cx={hb.x} cy={hb.y} r={7.5} fill={glowHex} opacity={0.32} />
                        </>
                      )}
                      <circle cx={ha.x} cy={ha.y} r={5} fill="#0f172a" stroke={wc.hex} strokeWidth={1.8} />
                      <circle cx={hb.x} cy={hb.y} r={5} fill="#0f172a" stroke={wc.hex} strokeWidth={1.8} />
                    </g>
                  );
                })}

                {/* Pending Wire Rubberband Line */}
                {pendingWireHole && pointerSvg && HOLE_MAP[pendingWireHole] && (
                  <line
                    x1={HOLE_MAP[pendingWireHole].x}
                    y1={HOLE_MAP[pendingWireHole].y}
                    x2={pointerSvg.x}
                    y2={pointerSvg.y}
                    stroke={WIRE_COLORS.find((c) => c.id === wireColor)?.hex || '#dc2626'}
                    strokeWidth={3.5}
                    strokeDasharray="6 4"
                    pointerEvents="none"
                  />
                )}
              </svg>
            </div>
          </section>
        </div>

        {/* Right Zone: Component Inspector & Breadboard Wiring Guide */}
        <aside className="space-y-4">
          <section className="rounded-2xl border border-[#E2E8F0] dark:border-[#334155] bg-white dark:bg-[#1E293B] p-4 space-y-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-[#E2E8F0] dark:border-[#334155] pb-3">
              <div className="flex items-center gap-2">
                <Cpu className="h-4 w-4 text-[#059669] dark:text-emerald-400" />
                <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
                  {pick('خصائص العنصر والقراءات', 'Inspecteur & Mesures', 'Inspector & Live Metrics')}
                </h3>
              </div>
              {selectedItem && (
                <button
                  type="button"
                  onClick={handleDeleteSelected}
                  aria-label={pick('حذف', 'Supprimer', 'Delete')}
                  className="inline-flex min-h-[36px] items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  <span>{pick('حذف', 'Supprimer', 'Remove')}</span>
                </button>
              )}
            </div>

            {selectedComp ? (
              (() => {
                const res = powerOn ? simResult.components[selectedComp.id] : undefined;
                const h1 = HOLE_MAP[selectedComp.pin1Hole];
                const h2 = HOLE_MAP[selectedComp.pin2Hole];
                const isPolarized =
                  selectedComp.type === 'led' ||
                  selectedComp.type === 'diode' ||
                  selectedComp.type === 'zener' ||
                  selectedComp.type === 'buzzer';

                return (
                  <div className="space-y-4">
                    <div>
                      <div className="text-base font-extrabold text-slate-900 dark:text-white">
                        {getPartLabel(selectedComp.type)}
                      </div>
                      <div className="mt-1 text-xs font-mono-num text-slate-500 dark:text-slate-400" dir="ltr">
                        Pin 1 ({isPolarized ? '+' : 'A'}): {h1?.label} · Pin 2 ({isPolarized ? '−' : 'B'}): {h2?.label}
                      </div>
                    </div>

                    {/* Position & Orientation Controls */}
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={handleRotateSelected}
                        className="inline-flex min-h-[40px] items-center justify-center gap-1.5 rounded-xl border border-[#E2E8F0] dark:border-[#334155] bg-[#F8FAFC] dark:bg-[#0F172A] px-3 py-1.5 text-xs font-bold text-slate-800 dark:text-slate-100 hover:border-[#059669]"
                      >
                        <RotateCw className="h-3.5 w-3.5 text-[#059669] dark:text-emerald-400" />
                        <span>{pick('تدوير 90°', 'Pivoter 90°', 'Rotate 90°')}</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleFlipPolarity}
                        className="inline-flex min-h-[40px] items-center justify-center gap-1.5 rounded-xl border border-[#E2E8F0] dark:border-[#334155] bg-[#F8FAFC] dark:bg-[#0F172A] px-3 py-1.5 text-xs font-bold text-slate-800 dark:text-slate-100 hover:border-[#059669]"
                      >
                        <ArrowLeftRight className="h-3.5 w-3.5 text-[#059669] dark:text-emerald-400" />
                        <span>{pick('عكس الأطراف', 'Inverser', 'Flip Pins')}</span>
                      </button>
                    </div>

                    <div className="flex items-center justify-between gap-2 rounded-xl border border-[#E2E8F0] dark:border-[#334155] bg-[#F8FAFC] dark:bg-[#0F172A] px-3 py-2">
                      <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                        {pick('مسافة الأرجل', 'Écartement', 'Pin Span')}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleAdjustSpan(-1)}
                          className="h-8 w-8 rounded-lg border border-[#E2E8F0] dark:border-[#334155] bg-white dark:bg-[#1E293B] font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#334155]"
                        >
                          −
                        </button>
                        <button
                          type="button"
                          onClick={() => handleAdjustSpan(1)}
                          className="h-8 w-8 rounded-lg border border-[#E2E8F0] dark:border-[#334155] bg-white dark:bg-[#1E293B] font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#334155]"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* Component-Specific Tuners */}
                    {(selectedComp.type === 'resistor' || selectedComp.type === 'potentiometer') && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs font-bold">
                          <span className="text-slate-700 dark:text-slate-200">
                            {pick('قيمة المقاومة', 'Valeur résistance', 'Resistance')}
                          </span>
                          <span className="font-mono-num text-[#059669] dark:text-emerald-400" dir="ltr">
                            {formatResistance(selectedComp.value)}
                          </span>
                        </div>
                        <input
                          type="range"
                          min={10}
                          max={10000}
                          step={10}
                          value={selectedComp.value}
                          onChange={(e) => {
                            const val = Number(e.target.value);
                            setComponents((prev) =>
                              prev.map((c) => (c.id === selectedComp.id ? { ...c, value: val } : c))
                            );
                          }}
                          className="w-full accent-[#059669]"
                        />
                        <div className="flex flex-wrap gap-1">
                          {[100, 220, 330, 470, 1000, 4700, 10000].map((ohm) => (
                            <button
                              key={ohm}
                              type="button"
                              onClick={() =>
                                setComponents((prev) =>
                                  prev.map((c) => (c.id === selectedComp.id ? { ...c, value: ohm } : c))
                                )
                              }
                              className={`rounded-md px-2 py-1 text-[11px] font-bold font-mono-num border ${
                                selectedComp.value === ohm
                                  ? 'border-[#059669] bg-emerald-50 dark:bg-emerald-950/60 text-[#059669] dark:text-emerald-300'
                                  : 'border-[#E2E8F0] dark:border-[#334155] text-slate-600 dark:text-slate-300'
                              }`}
                            >
                              {formatResistance(ohm)}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {selectedComp.type === 'led' && (
                      <div className="space-y-2">
                        <div className="text-xs font-bold text-slate-700 dark:text-slate-200">
                          {pick('لون الليد', 'Couleur LED', 'LED Color')}
                        </div>
                        <div className="grid grid-cols-4 gap-1.5">
                          {LED_PALETTE.map((lc) => (
                            <button
                              key={lc.id}
                              type="button"
                              onClick={() =>
                                setComponents((prev) =>
                                  prev.map((c) =>
                                    c.id === selectedComp.id ? { ...c, ledColor: lc.id } : c
                                  )
                                )
                              }
                              className={`min-h-[36px] rounded-lg border text-[11px] font-bold transition-colors ${
                                (selectedComp.ledColor || 'red') === lc.id
                                  ? 'border-[#059669] bg-emerald-50 dark:bg-emerald-950/60 text-[#059669] dark:text-emerald-300'
                                  : 'border-[#E2E8F0] dark:border-[#334155] text-slate-600 dark:text-slate-300'
                              }`}
                            >
                              {pick(lc.labelAr, lc.labelFr, lc.labelEn)}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {selectedComp.type === 'switch' && (
                      <button
                        type="button"
                        onClick={() =>
                          setComponents((prev) =>
                            prev.map((c) =>
                              c.id === selectedComp.id ? { ...c, closed: !c.closed } : c
                            )
                          )
                        }
                        className={`w-full min-h-[44px] rounded-xl px-4 py-2 text-xs font-bold text-white transition-colors ${
                          selectedComp.closed
                            ? 'bg-[#059669] hover:bg-[#047857]'
                            : 'bg-slate-600 hover:bg-slate-700'
                        }`}
                      >
                        {selectedComp.closed
                          ? pick('الحالة: مغلق (يمرر التيار) — اضغط للفتح', 'État : Fermé (ON) — Ouvrir', 'State: Closed (ON) — Click to Open')
                          : pick('الحالة: مفتوح (مقطوع) — اضغط للإغلاق', 'État : Ouvert (OFF) — Fermer', 'State: Open (OFF) — Click to Close')}
                      </button>
                    )}

                    {selectedComp.type === 'ldr' && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs font-bold">
                          <span>{pick('شدة الإضاءة على LDR', 'Luminosité LDR', 'LDR Light Level')}</span>
                          <span className="font-mono-num text-[#D97706] dark:text-amber-400">
                            {selectedComp.lightLevel ?? 50}% (
                            {formatResistance(
                              getEffectiveResistance({
                                id: selectedComp.id,
                                type: 'ldr',
                                label: 'LDR',
                                x: 0,
                                y: 0,
                                rotation: 0,
                                value: 50,
                                lightLevel: selectedComp.lightLevel ?? 50,
                              })
                            )}
                            )
                          </span>
                        </div>
                        <input
                          type="range"
                          min={0}
                          max={100}
                          step={5}
                          value={selectedComp.lightLevel ?? 50}
                          onChange={(e) => {
                            const val = Number(e.target.value);
                            setComponents((prev) =>
                              prev.map((c) =>
                                c.id === selectedComp.id ? { ...c, lightLevel: val } : c
                              )
                            );
                          }}
                          className="w-full accent-[#D97706]"
                        />
                      </div>
                    )}

                    {selectedComp.type === 'zener' && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs font-bold">
                          <span>{pick('جهد الزينر', 'Tension Zener', 'Zener Voltage')}</span>
                          <span className="font-mono-num text-[#059669] dark:text-emerald-400">{selectedComp.value}V</span>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {[3.3, 4.7, 5.1, 6.2, 9.1].map((vz) => (
                            <button
                              key={vz}
                              type="button"
                              onClick={() =>
                                setComponents((prev) =>
                                  prev.map((c) => (c.id === selectedComp.id ? { ...c, value: vz } : c))
                                )
                              }
                              className={`rounded-md px-2.5 py-1 text-xs font-bold font-mono-num border ${
                                selectedComp.value === vz
                                  ? 'border-[#059669] bg-emerald-50 dark:bg-emerald-950/60 text-[#059669] dark:text-emerald-300'
                                  : 'border-[#E2E8F0] dark:border-[#334155] text-slate-600 dark:text-slate-300'
                              }`}
                            >
                              {vz}V
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Live Electrical Telemetry */}
                    <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[#E2E8F0] dark:border-[#334155] text-center">
                      <div className="rounded-xl bg-[#F8FAFC] dark:bg-[#0F172A] border border-[#E2E8F0] dark:border-[#334155] p-2.5">
                        <div className="text-[10px] font-semibold text-slate-500 dark:text-slate-400">
                          {pick('فرق الجهد', 'Tension', 'Drop')}
                        </div>
                        <div className="mt-0.5 text-sm font-extrabold font-mono-num text-slate-900 dark:text-white" dir="ltr">
                          {res ? `${res.voltageDrop.toFixed(2)}V` : '0.00V'}
                        </div>
                      </div>
                      <div className="rounded-xl bg-[#F8FAFC] dark:bg-[#0F172A] border border-[#E2E8F0] dark:border-[#334155] p-2.5">
                        <div className="text-[10px] font-semibold text-slate-500 dark:text-slate-400">
                          {pick('التيار', 'Courant', 'Current')}
                        </div>
                        <div
                          className={`mt-0.5 text-sm font-extrabold font-mono-num ${
                            res?.overcurrent
                              ? 'text-rose-600 dark:text-rose-400'
                              : 'text-[#059669] dark:text-emerald-400'
                          }`}
                          dir="ltr"
                        >
                          {res ? `${res.currentMa.toFixed(1)}mA` : '0.0mA'}
                        </div>
                      </div>
                      <div className="rounded-xl bg-[#F8FAFC] dark:bg-[#0F172A] border border-[#E2E8F0] dark:border-[#334155] p-2.5">
                        <div className="text-[10px] font-semibold text-slate-500 dark:text-slate-400">
                          {pick('القدرة', 'Puissance', 'Power')}
                        </div>
                        <div className="mt-0.5 text-sm font-extrabold font-mono-num text-slate-900 dark:text-white" dir="ltr">
                          {res ? `${res.powerMw.toFixed(1)}mW` : '0.0mW'}
                        </div>
                      </div>
                    </div>

                    {selectedComp.type === 'buzzer' && res && res.brightness > 0.1 && (
                      <div className="flex items-center gap-2 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 px-3 py-2 text-xs font-bold text-[#D97706] dark:text-amber-300">
                        <Volume2 className="h-4 w-4 shrink-0" />
                        <span>{pick('الجرس يُصدر صوت تنبيه الآن!', 'Le buzzer émet un son !', 'Buzzer is ringing!')}</span>
                      </div>
                    )}

                    {res?.overcurrent && (
                      <div className="flex items-center gap-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 px-3 py-2 text-xs font-bold text-rose-700 dark:text-rose-300">
                        <AlertTriangle className="h-4 w-4 shrink-0" />
                        <span>
                          {pick(
                            'تحذير: التيار أعلى من الحد الآمن للعنصر! أضف أو كبّر المقاومة.',
                            'Alerte : courant excessif ! Ajoutez ou augmentez la résistance.',
                            'Warning: Current exceeds safe component limit! Add or raise series resistance.'
                          )}
                        </span>
                      </div>
                    )}
                  </div>
                );
              })()
            ) : selectedWire ? (
              <div className="space-y-3">
                <div className="text-sm font-bold text-slate-900 dark:text-white">
                  {pick('سلك توصيل محدد', 'Fil sélectionné', 'Selected Jumper Wire')}
                </div>
                <div className="text-xs font-mono-num text-slate-500 dark:text-slate-400" dir="ltr">
                  {HOLE_MAP[selectedWire.holeA]?.label} ⇄ {HOLE_MAP[selectedWire.holeB]?.label}
                </div>
                <div
                  className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-bold ${
                    energizedWireIds.has(selectedWire.id)
                      ? simResult.status === 'short_circuit'
                        ? 'border-amber-200 dark:border-amber-800/60 bg-amber-50 dark:bg-amber-950/35 text-[#D97706] dark:text-amber-300'
                        : 'border-emerald-200 dark:border-emerald-800/60 bg-emerald-50/70 dark:bg-emerald-950/35 text-[#059669] dark:text-emerald-300'
                      : 'border-[#E2E8F0] dark:border-[#334155] bg-[#F8FAFC] dark:bg-[#0F172A] text-slate-500 dark:text-slate-400'
                  }`}
                >
                  <Zap className="h-3.5 w-3.5 shrink-0" />
                  <span>
                    {energizedWireIds.has(selectedWire.id)
                      ? pick(
                          'يسري في هذا السلك تيار كهربائي حالياً',
                          'Un courant électrique traverse ce fil',
                          'Live electric current is flowing through this wire'
                        )
                      : pick(
                          'لا يمر تيار في هذا السلك (مسار مفتوح أو متوقف)',
                          'Aucun courant dans ce fil (circuit ouvert)',
                          'No current flowing (open path or power OFF)'
                        )}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {WIRE_COLORS.map((wc) => (
                    <button
                      key={wc.id}
                      type="button"
                      onClick={() =>
                        setWires((prev) =>
                          prev.map((w) => (w.id === selectedWire.id ? { ...w, color: wc.id } : w))
                        )
                      }
                      className={`h-8 w-8 rounded-full border-2 ${
                        selectedWire.color === wc.id ? 'border-[#059669] scale-110' : 'border-transparent'
                      }`}
                      style={{ backgroundColor: wc.hex }}
                      aria-label={pick(wc.labelAr, wc.labelFr, wc.labelEn)}
                    />
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                {pick(
                  'اضغط على أي عنصر أو سلك فوق لوحة التجارب لتعديل قيمته أو تدويره أو فحص جهده وتياره.',
                  'Touchez un composant ou un fil sur la platine pour modifier sa valeur, l’orienter ou mesurer son courant.',
                  'Tap any component or wire on the breadboard to edit its value, rotate pins, or read live voltage and current.'
                )}
              </p>
            )}
          </section>

          {/* Beginner Breadboard Structure Cheat Sheet */}
          <section className="rounded-2xl border border-[#E2E8F0] dark:border-[#334155] bg-white dark:bg-[#1E293B] p-4 space-y-2.5 text-xs leading-relaxed text-slate-600 dark:text-slate-300 shadow-sm">
            <h4 className="font-extrabold text-slate-900 dark:text-white">
              {pick(
                'كيف تتصل ثقوب لوحة التجارب داخلياً؟',
                'Comment sont reliés les trous internes ?',
                'How Breadboard Holes Connect Internally'
              )}
            </h4>
            <p>
              {pick(
                '1. مسارا الطاقة (+ الأحمر و − الأزرق) في الأعلى والأسفل متصلان أفقياً لتوزيع الجهد والأرضي.',
                '1. Les rails d’alimentation (+ rouge et − bleu) en haut et en bas sont reliés horizontalement.',
                '1. Top and bottom (+ red / − blue) power rails run horizontally across the board.'
              )}
            </p>
            <p>
              {pick(
                '2. ثقوب الأعمدة (A–E) و(F–J) متصلة عمودياً داخل كل عمود (5 ثقوب معاً)، ويفصل بين النصفين القناة الوسطى لعزل أطراف المفاتيح والدارات.',
                '2. Les colonnes (A–E) et (F–J) sont reliées verticalement par groupes de 5 trous, séparées par la rainure centrale.',
                '2. Terminal columns (A–E) and (F–J) connect 5 holes vertically per column, isolated across the center ravine.'
              )}
            </p>
          </section>
        </aside>
      </div>
    </div>
  );
};
