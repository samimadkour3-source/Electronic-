import React, { useMemo, useRef, useState } from 'react';
import {
  AlertTriangle,
  Calculator,
  CheckCircle2,
  Minus,
  Play,
  Plus,
  RotateCw,
  Square,
  Trash2,
  Zap,
} from 'lucide-react';
import {
  CircuitSimOutput,
  getEffectiveResistance,
  SimComponent,
  SimComponentType,
  simulateCircuit,
  SimWire,
} from '../utils/circuitSolver';
import { useLanguage } from '../i18n/LanguageContext';

interface PaletteItem {
  type: SimComponentType;
  labelAr: string;
  labelFr: string;
  labelEn: string;
  defaultValue: number;
}

const PALETTE: PaletteItem[] = [
  { type: 'battery', labelAr: 'بطارية DC', labelFr: 'Pile DC', labelEn: 'DC Battery', defaultValue: 9 },
  { type: 'resistor', labelAr: 'مقاومة', labelFr: 'Résistance', labelEn: 'Resistor', defaultValue: 330 },
  { type: 'potentiometer', labelAr: 'مقاومة متغيرة', labelFr: 'Potentiomètre', labelEn: 'Potentiometer', defaultValue: 1000 },
  { type: 'led', labelAr: 'ليد LED', labelFr: 'LED', labelEn: 'LED', defaultValue: 2 },
  { type: 'diode', labelAr: 'دايود', labelFr: 'Diode', labelEn: 'Diode', defaultValue: 0.7 },
  { type: 'zener', labelAr: 'دايود زينر', labelFr: 'Diode Zener', labelEn: 'Zener Diode', defaultValue: 5.1 },
  { type: 'switch', labelAr: 'مفتاح', labelFr: 'Interrupteur', labelEn: 'Switch', defaultValue: 0 },
  { type: 'ldr', labelAr: 'مقاومة ضوئية', labelFr: 'Photorésistance', labelEn: 'LDR Sensor', defaultValue: 50 },
  { type: 'fuse', labelAr: 'فيوز حماية', labelFr: 'Fusible', labelEn: 'Fuse', defaultValue: 250 },
  { type: 'buzzer', labelAr: 'جرس بازر', labelFr: 'Buzzer', labelEn: 'Buzzer', defaultValue: 5 },
  { type: 'ground', labelAr: 'أرضي GND', labelFr: 'Masse GND', labelEn: 'Ground GND', defaultValue: 0 },
];

const PRESETS: { id: string; labelAr: string; labelFr: string; labelEn: string; components: SimComponent[]; wires: SimWire[] }[] = [
  {
    id: 'led_circuit',
    labelAr: 'دائرة ليد + مقاومة (9V)',
    labelFr: 'LED + Résistance (9V)',
    labelEn: 'LED + Resistor (9V)',
    components: [
      { id: 'bat1', type: 'battery', label: '9V', x: 110, y: 185, rotation: 90, value: 9 },
      { id: 'sw1', type: 'switch', label: 'SW', x: 255, y: 90, rotation: 0, value: 0, closed: true },
      { id: 'res1', type: 'resistor', label: '330Ω', x: 430, y: 90, rotation: 0, value: 330 },
      { id: 'led1', type: 'led', label: 'LED', x: 540, y: 185, rotation: 90, value: 2 },
      { id: 'gnd1', type: 'ground', label: 'GND', x: 110, y: 295, rotation: 0, value: 0 },
    ],
    wires: [
      { id: 'w1', fromCompId: 'bat1', fromPort: 1, toCompId: 'sw1', toPort: 0 },
      { id: 'w2', fromCompId: 'sw1', fromPort: 1, toCompId: 'res1', toPort: 0 },
      { id: 'w3', fromCompId: 'res1', fromPort: 1, toCompId: 'led1', toPort: 0 },
      { id: 'w4', fromCompId: 'led1', fromPort: 1, toCompId: 'bat1', toPort: 0 },
      { id: 'w5', fromCompId: 'bat1', fromPort: 0, toCompId: 'gnd1', toPort: 0 },
    ],
  },
  {
    id: 'divider',
    labelAr: 'مجزئ جهد (12V)',
    labelFr: 'Diviseur de tension (12V)',
    labelEn: 'Voltage Divider (12V)',
    components: [
      { id: 'bat1', type: 'battery', label: '12V', x: 120, y: 180, rotation: 90, value: 12 },
      { id: 'r1', type: 'resistor', label: 'R1 1kΩ', x: 320, y: 110, rotation: 90, value: 1000 },
      { id: 'r2', type: 'resistor', label: 'R2 2kΩ', x: 320, y: 250, rotation: 90, value: 2000 },
      { id: 'gnd1', type: 'ground', label: 'GND', x: 120, y: 295, rotation: 0, value: 0 },
    ],
    wires: [
      { id: 'w1', fromCompId: 'bat1', fromPort: 1, toCompId: 'r1', toPort: 0 },
      { id: 'w2', fromCompId: 'r1', fromPort: 1, toCompId: 'r2', toPort: 0 },
      { id: 'w3', fromCompId: 'r2', fromPort: 1, toCompId: 'bat1', toPort: 0 },
      { id: 'w4', fromCompId: 'bat1', fromPort: 0, toCompId: 'gnd1', toPort: 0 },
    ],
  },
  {
    id: 'ldr_circuit',
    labelAr: 'حساس إضاءة LDR',
    labelFr: 'Capteur lumière LDR',
    labelEn: 'LDR Light Sensor',
    components: [
      { id: 'bat1', type: 'battery', label: '9V', x: 110, y: 185, rotation: 90, value: 9 },
      { id: 'ldr1', type: 'ldr', label: 'LDR', x: 290, y: 95, rotation: 0, value: 50, lightLevel: 75 },
      { id: 'led1', type: 'led', label: 'LED', x: 490, y: 185, rotation: 90, value: 2 },
      { id: 'gnd1', type: 'ground', label: 'GND', x: 110, y: 295, rotation: 0, value: 0 },
    ],
    wires: [
      { id: 'w1', fromCompId: 'bat1', fromPort: 1, toCompId: 'ldr1', toPort: 0 },
      { id: 'w2', fromCompId: 'ldr1', fromPort: 1, toCompId: 'led1', toPort: 0 },
      { id: 'w3', fromCompId: 'led1', fromPort: 1, toCompId: 'bat1', toPort: 0 },
      { id: 'w4', fromCompId: 'bat1', fromPort: 0, toCompId: 'gnd1', toPort: 0 },
    ],
  },
];

function getPortCoords(comp: SimComponent, port: 0 | 1): { x: number; y: number } {
  if (comp.type === 'ground') {
    return { x: comp.x, y: comp.y - 24 };
  }
  const offset = 44;
  const rad = (comp.rotation * Math.PI) / 180;
  // port 0 is left (-offset), port 1 is right (+offset) before rotation
  // Note for battery: port 0 (-), port 1 (+)
  const dx = port === 0 ? -offset : offset;
  const rx = dx * Math.cos(rad);
  const ry = dx * Math.sin(rad);
  // For 90deg battery: make port 1 (+) at top (y - offset) and port 0 (-) at bottom (y + offset)
  if (comp.type === 'battery' && comp.rotation === 90) {
    return { x: comp.x, y: port === 1 ? comp.y - offset : comp.y + offset };
  }
  if (comp.type === 'led' && comp.rotation === 90) {
    return { x: comp.x, y: port === 0 ? comp.y - offset : comp.y + offset };
  }
  return { x: comp.x + rx, y: comp.y + ry };
}

function formatResistance(ohms: number): string {
  if (ohms >= 1000) return `${(ohms / 1000).toFixed(ohms % 1000 === 0 ? 0 : 1)}kΩ`;
  return `${ohms}Ω`;
}

function formatExactResistance(ohms: number): string {
  if (!Number.isFinite(ohms) || ohms <= 0) return '0Ω';
  if (ohms >= 1000000) return `${Number((ohms / 1000000).toFixed(2))}MΩ`;
  if (ohms >= 1000) return `${Number((ohms / 1000).toFixed(2))}kΩ`;
  return `${Number(ohms.toFixed(2))}Ω`;
}

type NetworkTopology = 'series' | 'parallel' | 'unwired' | 'custom';

interface ResistorNetworkAnalysis {
  topology: NetworkTopology;
  resistors: SimComponent[];
  hasBattery: boolean;
  batteryVoltage: number;
  reqSeries: number;
  reqParallel: number;
  activeReq: number | null;
  totalCurrentMa: number | null;
  totalPowerMw: number | null;
}

const STANDARD_RESISTOR_VALUES = [100, 220, 330, 470, 680, 1000, 2000, 2200, 4700, 10000];

function analyzeResistorNetwork(
  components: SimComponent[],
  wires: SimWire[]
): ResistorNetworkAnalysis | null {
  const resistors = components.filter((c) => c.type === 'resistor');
  if (resistors.length < 2) return null;

  const battery = components.find((c) => c.type === 'battery');
  const batteryVoltage = battery ? battery.value : 9;

  const reqSeries = resistors.reduce((sum, r) => sum + Math.max(1, r.value), 0);
  const invSum = resistors.reduce((sum, r) => sum + 1 / Math.max(1, r.value), 0);
  const reqParallel = invSum > 0 ? 1 / invSum : 0;

  // Union-Find on terminals
  const parent: Record<string, string> = {};
  const find = (k: string): string => {
    if (!parent[k]) parent[k] = k;
    if (parent[k] !== k) parent[k] = find(parent[k]);
    return parent[k];
  };
  const union = (a: string, b: string) => {
    const ra = find(a);
    const rb = find(b);
    if (ra !== rb) parent[ra] = rb;
  };

  for (const c of components) {
    find(`${c.id}:0`);
    if (c.type !== 'ground') find(`${c.id}:1`);
  }
  for (const w of wires) {
    union(`${w.fromCompId}:${w.fromPort}`, `${w.toCompId}:${w.toPort}`);
  }

  const resSet = new Set(resistors.map((r) => r.id));
  const resTouchAnyWire = wires.some((w) => resSet.has(w.fromCompId) || resSet.has(w.toCompId));

  let topology: NetworkTopology = 'custom';

  if (!resTouchAnyWire) {
    topology = 'unwired';
  } else {
    // Check Parallel: all resistors share the same unordered pair of distinct node roots
    const first0 = find(`${resistors[0].id}:0`);
    const first1 = find(`${resistors[0].id}:1`);
    const allParallel =
      first0 !== first1 &&
      resistors.every((r) => {
        const a = find(`${r.id}:0`);
        const b = find(`${r.id}:1`);
        return (a === first0 && b === first1) || (a === first1 && b === first0);
      });

    if (allParallel) {
      topology = 'parallel';
    } else {
      // Check Series: simple connected chain of k resistors with k+1 distinct nodes
      // and no non-resistor branches on internal degree-2 nodes
      const nonResNodes = new Set<string>();
      for (const c of components) {
        if (c.type === 'resistor') continue;
        nonResNodes.add(find(`${c.id}:0`));
        if (c.type !== 'ground') nonResNodes.add(find(`${c.id}:1`));
      }

      const deg: Record<string, number> = {};
      const adj: Record<string, string[]> = {};
      let validEdges = true;
      for (const r of resistors) {
        const a = find(`${r.id}:0`);
        const b = find(`${r.id}:1`);
        if (a === b) {
          validEdges = false;
          break;
        }
        deg[a] = (deg[a] || 0) + 1;
        deg[b] = (deg[b] || 0) + 1;
        (adj[a] ||= []).push(b);
        (adj[b] ||= []).push(a);
      }

      if (validEdges) {
        const nodes = Object.keys(deg);
        const deg1 = nodes.filter((n) => deg[n] === 1);
        const deg2 = nodes.filter((n) => deg[n] === 2);
        // BFS connectivity across resistor nodes
        const visited = new Set<string>();
        const queue = [nodes[0]];
        visited.add(nodes[0]);
        while (queue.length > 0) {
          const cur = queue.shift()!;
          for (const nxt of adj[cur] || []) {
            if (!visited.has(nxt)) {
              visited.add(nxt);
              queue.push(nxt);
            }
          }
        }
        const isChain =
          visited.size === nodes.length &&
          nodes.length === resistors.length + 1 &&
          deg1.length === 2 &&
          deg2.length === resistors.length - 1 &&
          deg2.every((n) => !nonResNodes.has(n));

        if (isChain) {
          topology = 'series';
        }
      }
    }
  }

  const activeReq =
    topology === 'series' ? reqSeries : topology === 'parallel' ? reqParallel : null;
  const totalCurrentMa =
    activeReq && battery ? (batteryVoltage / activeReq) * 1000 : null;
  const totalPowerMw =
    totalCurrentMa !== null ? batteryVoltage * totalCurrentMa : null;

  return {
    topology,
    resistors,
    hasBattery: Boolean(battery),
    batteryVoltage,
    reqSeries,
    reqParallel,
    activeReq,
    totalCurrentMa,
    totalPowerMw,
  };
}

export const CircuitSimulator: React.FC = () => {
  const { pick } = useLanguage();
  const [components, setComponents] = useState<SimComponent[]>(PRESETS[0].components);
  const [wires, setWires] = useState<SimWire[]>(PRESETS[0].wires);
  const [isRunning, setIsRunning] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>('res1');
  const [pendingWire, setPendingWire] = useState<{ compId: string; port: 0 | 1 } | null>(null);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const dragOffset = useRef<{ dx: number; dy: number }>({ dx: 0, dy: 0 });
  const svgRef = useRef<SVGSVGElement | null>(null);

  const getTypeLabel = (type: SimComponentType) => {
    const item = PALETTE.find((p) => p.type === type);
    return item ? pick(item.labelAr, item.labelFr, item.labelEn) : type;
  };

  const simResult: CircuitSimOutput = useMemo(() => {
    if (!isRunning) {
      return {
        nodeVoltages: {},
        components: {},
        status: 'empty',
        messageAr: 'المحاكاة متوقفة مؤقتاً. اضغط على "تشغيل المحاكاة" لرؤية القراءات.',
        messageFr: 'Simulation en pause. Cliquez sur « Lancer » pour afficher les mesures.',
        messageEn: 'Simulation paused. Press "Run Simulation" to see live circuit readings.',
      };
    }
    return simulateCircuit(components, wires);
  }, [components, wires, isRunning]);

  const selectedComp = useMemo(
    () => components.find((c) => c.id === selectedId) || null,
    [components, selectedId]
  );

  const networkAnalysis = useMemo(
    () => analyzeResistorNetwork(components, wires),
    [components, wires]
  );

  const clientToSvgCoords = (clientX: number, clientY: number) => {
    const svg = svgRef.current;
    if (!svg) return { x: 320, y: 180 };
    const rect = svg.getBoundingClientRect();
    const x = ((clientX - rect.left) / rect.width) * 680;
    const y = ((clientY - rect.top) / rect.height) * 380;
    return {
      x: Math.max(50, Math.min(630, Math.round(x / 10) * 10)),
      y: Math.max(45, Math.min(335, Math.round(y / 10) * 10)),
    };
  };

  const addComponent = (type: SimComponentType, x = 340, y = 190) => {
    const item = PALETTE.find((p) => p.type === type)!;
    const id = `${type}_${Date.now().toString().slice(-4)}`;
    const newComp: SimComponent = {
      id,
      type,
      label: pick(item.labelAr, item.labelFr, item.labelEn),
      x,
      y,
      rotation: type === 'battery' ? 90 : 0,
      value: item.defaultValue,
      closed: type === 'switch' || type === 'fuse' ? true : undefined,
      lightLevel: type === 'ldr' ? 60 : undefined,
    };
    setComponents((prev) => [...prev, newComp]);
    setSelectedId(id);
  };

  const handleDropOnCanvas = (e: React.DragEvent<SVGSVGElement>) => {
    e.preventDefault();
    const type = e.dataTransfer.getData('application/sim-type') as SimComponentType;
    if (!type) return;
    const coords = clientToSvgCoords(e.clientX, e.clientY);
    addComponent(type, coords.x, coords.y);
  };

  const handlePointerDownComp = (e: React.PointerEvent, comp: SimComponent) => {
    e.stopPropagation();
    setSelectedId(comp.id);
    const coords = clientToSvgCoords(e.clientX, e.clientY);
    dragOffset.current = { dx: comp.x - coords.x, dy: comp.y - coords.y };
    setDraggingId(comp.id);
    (e.target as Element).setPointerCapture?.(e.pointerId);
  };

  const handlePointerMoveCanvas = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!draggingId) return;
    const coords = clientToSvgCoords(e.clientX, e.clientY);
    const nx = Math.max(50, Math.min(630, Math.round((coords.x + dragOffset.current.dx) / 10) * 10));
    const ny = Math.max(45, Math.min(335, Math.round((coords.y + dragOffset.current.dy) / 10) * 10));
    setComponents((prev) =>
      prev.map((c) => (c.id === draggingId ? { ...c, x: nx, y: ny } : c))
    );
  };

  const handlePointerUpCanvas = () => {
    setDraggingId(null);
  };

  const handlePortClick = (e: React.MouseEvent, compId: string, port: 0 | 1) => {
    e.stopPropagation();
    if (!pendingWire) {
      setPendingWire({ compId, port });
      return;
    }
    if (pendingWire.compId === compId && pendingWire.port === port) {
      setPendingWire(null);
      return;
    }
    // Avoid duplicate wires
    const exists = wires.some(
      (w) =>
        (w.fromCompId === pendingWire.compId && w.fromPort === pendingWire.port && w.toCompId === compId && w.toPort === port) ||
        (w.toCompId === pendingWire.compId && w.toPort === pendingWire.port && w.fromCompId === compId && w.fromPort === port)
    );
    if (!exists) {
      setWires((prev) => [
        ...prev,
        {
          id: `w_${Date.now()}`,
          fromCompId: pendingWire.compId,
          fromPort: pendingWire.port,
          toCompId: compId,
          toPort: port,
        },
      ]);
    }
    setPendingWire(null);
  };

  const removeSelected = () => {
    if (!selectedId) return;
    setComponents((prev) => prev.filter((c) => c.id !== selectedId));
    setWires((prev) =>
      prev.filter((w) => w.fromCompId !== selectedId && w.toCompId !== selectedId)
    );
    setSelectedId(null);
  };

  const rotateSelected = () => {
    if (!selectedId) return;
    setComponents((prev) =>
      prev.map((c) =>
        c.id === selectedId
          ? { ...c, rotation: ((c.rotation + 90) % 360) as 0 | 90 | 180 | 270 }
          : c
      )
    );
  };

  const loadPreset = (presetId: string) => {
    const p = PRESETS.find((item) => item.id === presetId);
    if (!p) return;
    setComponents(p.components.map((c) => ({ ...c })));
    setWires(p.wires.map((w) => ({ ...w })));
    setPendingWire(null);
    setSelectedId(p.components[1]?.id || p.components[0]?.id || null);
    setIsRunning(true);
  };

  const clearCanvas = () => {
    setComponents([]);
    setWires([]);
    setPendingWire(null);
    setSelectedId(null);
  };

  const autoConnectResistors = (
    mode: 'series' | 'parallel',
    countOverride?: number,
    valuesOverride?: number[],
    voltageOverride?: number
  ) => {
    const existingRes = components.filter((c) => c.type === 'resistor');
    const existingBat = components.find((c) => c.type === 'battery');
    const batV = voltageOverride ?? existingBat?.value ?? 9;
    const defaultPad = [1000, 1000, 470, 2200, 330, 4700];

    let targetValues: number[];
    if (valuesOverride && valuesOverride.length >= 2) {
      targetValues = valuesOverride;
    } else if (countOverride !== undefined) {
      const n = Math.max(2, Math.min(6, countOverride));
      targetValues = Array.from({ length: n }, (_, i) =>
        existingRes[i] ? existingRes[i].value : defaultPad[i % defaultPad.length]
      );
    } else if (existingRes.length >= 2) {
      targetValues = existingRes.slice(0, 6).map((r) => r.value);
    } else {
      targetValues = [1000, 1000];
    }

    const n = targetValues.length;
    const nextComponents: SimComponent[] = [
      { id: 'bat1', type: 'battery', label: `${batV}V`, x: 95, y: 185, rotation: 90, value: batV },
      { id: 'gnd1', type: 'ground', label: 'GND', x: 95, y: 310, rotation: 0, value: 0 },
    ];
    const nextWires: SimWire[] = [
      { id: 'w_gnd', fromCompId: 'bat1', fromPort: 0, toCompId: 'gnd1', toPort: 0 },
    ];

    if (mode === 'series') {
      const seriesSlots: Record<number, { x: number; y: number; rot: 0 | 90 | 180 | 270 }[]> = {
        2: [
          { x: 280, y: 95, rot: 0 },
          { x: 470, y: 95, rot: 0 },
        ],
        3: [
          { x: 225, y: 95, rot: 0 },
          { x: 380, y: 95, rot: 0 },
          { x: 535, y: 95, rot: 0 },
        ],
        4: [
          { x: 235, y: 95, rot: 0 },
          { x: 405, y: 95, rot: 0 },
          { x: 545, y: 185, rot: 90 },
          { x: 320, y: 265, rot: 180 },
        ],
      };

      const slots =
        seriesSlots[n] ||
        targetValues.map((_, i) => {
          const topCount = Math.ceil(n / 2);
          if (i < topCount) {
            const step = topCount > 1 ? 330 / (topCount - 1) : 0;
            return { x: Math.round(215 + i * step), y: 95, rot: 0 as const };
          }
          const botIdx = i - topCount;
          const botCount = n - topCount;
          const step = botCount > 1 ? 330 / (botCount - 1) : 0;
          return { x: Math.round(545 - botIdx * step), y: 265, rot: 180 as const };
        });

      targetValues.forEach((val, idx) => {
        const slot = slots[idx];
        nextComponents.push({
          id: `r${idx + 1}`,
          type: 'resistor',
          label: `R${idx + 1} ${formatResistance(val)}`,
          x: slot.x,
          y: slot.y,
          rotation: slot.rot,
          value: val,
        });
      });

      nextWires.push({ id: 'w_s0', fromCompId: 'bat1', fromPort: 1, toCompId: 'r1', toPort: 0 });
      for (let i = 1; i < n; i++) {
        nextWires.push({
          id: `w_s${i}`,
          fromCompId: `r${i}`,
          fromPort: 1,
          toCompId: `r${i + 1}`,
          toPort: 0,
        });
      }
      nextWires.push({
        id: `w_s${n}`,
        fromCompId: `r${n}`,
        fromPort: 1,
        toCompId: 'bat1',
        toPort: 0,
      });
    } else {
      const parallelXs: Record<number, number[]> = {
        2: [265, 445],
        3: [230, 385, 540],
        4: [205, 325, 445, 565],
      };
      const xs =
        parallelXs[n] ||
        targetValues.map((_, i) => Math.round(190 + i * (390 / Math.max(1, n - 1))));

      targetValues.forEach((val, idx) => {
        nextComponents.push({
          id: `r${idx + 1}`,
          type: 'resistor',
          label: `R${idx + 1} ${formatResistance(val)}`,
          x: xs[idx],
          y: 185,
          rotation: 90,
          value: val,
        });
      });

      nextWires.push({ id: 'w_pt0', fromCompId: 'bat1', fromPort: 1, toCompId: 'r1', toPort: 0 });
      nextWires.push({ id: 'w_pb0', fromCompId: 'bat1', fromPort: 0, toCompId: 'r1', toPort: 1 });
      for (let i = 1; i < n; i++) {
        nextWires.push({
          id: `w_pt${i}`,
          fromCompId: `r${i}`,
          fromPort: 0,
          toCompId: `r${i + 1}`,
          toPort: 0,
        });
        nextWires.push({
          id: `w_pb${i}`,
          fromCompId: `r${i}`,
          fromPort: 1,
          toCompId: `r${i + 1}`,
          toPort: 1,
        });
      }
    }

    setComponents(nextComponents);
    setWires(nextWires);
    setPendingWire(null);
    setSelectedId('r1');
    setIsRunning(true);
  };

  return (
    <div className="space-y-5">
      {/* Header & Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
            {pick('محاكي الدوائر الإلكترونية التفاعلي', 'Simulateur de Circuits Électroniques', 'Interactive DC Circuit Simulator')}
          </h2>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            {pick(
              'اسحب العناصر إلى اللوحة أو اضغط لإضافتها، ثم انقر على الأطراف (النقاط) لتوصيل الأسلاك وقراءة الفولتية والتيار حياً.',
              'Glissez ou cliquez sur les composants pour les ajouter, reliez les bornes par des fils et observez tensions et courants en direct.',
              'Drag or tap components to add them, click terminal dots to connect wires, and inspect live voltage and current readings.'
            )}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setIsRunning((r) => !r)}
            className={`inline-flex min-h-[44px] items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold text-white transition-colors shadow-sm ${
              isRunning ? 'bg-[#D97706] hover:bg-amber-700' : 'bg-[#059669] hover:bg-[#047857]'
            }`}
          >
            {isRunning ? <Square className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            <span>{isRunning ? pick('إيقاف المحاكاة', 'Pause', 'Pause Sim') : pick('تشغيل المحاكاة', 'Lancer', 'Run Sim')}</span>
          </button>

          <button
            type="button"
            onClick={clearCanvas}
            className="inline-flex min-h-[44px] items-center gap-1.5 rounded-xl border border-[#E2E8F0] dark:border-[#334155] bg-white dark:bg-[#1E293B] px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-[#F8FAFC] dark:hover:bg-[#334155]/60 shadow-sm"
          >
            <Trash2 className="h-4 w-4" />
            <span>{pick('مسح اللوحة', 'Effacer', 'Clear Board')}</span>
          </button>
        </div>
      </div>

      {/* Presets Strip */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-bold text-slate-500 dark:text-slate-400 me-1">
          {pick('دوائر جاهزة:', 'Circuits prêts :', 'Preset Circuits:')}
        </span>
        {PRESETS.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => loadPreset(p.id)}
            className="min-h-[40px] rounded-xl border border-[#E2E8F0] dark:border-[#334155] bg-white dark:bg-[#1E293B] px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:border-[#059669] hover:text-[#059669] dark:hover:text-emerald-400 transition-colors shadow-sm"
          >
            {pick(p.labelAr, p.labelFr, p.labelEn)}
          </button>
        ))}
      </div>

      {/* Auto Series / Parallel Resistor Builder Strip */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#E2E8F0] dark:border-[#334155] bg-white dark:bg-[#1E293B] px-4 py-3 shadow-sm">
        <div className="flex items-center gap-2">
          <Calculator className="h-4 w-4 text-[#059669] dark:text-emerald-400 shrink-0" />
          <span className="text-xs sm:text-sm font-bold text-slate-800 dark:text-white">
            {pick(
              'توصيل المقاومات تلقائياً:',
              'Câblage automatique de résistances :',
              'Auto-Connect Resistors:'
            )}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => autoConnectResistors('series')}
            className={`inline-flex min-h-[40px] items-center gap-2 rounded-xl border px-3.5 py-1.5 text-xs font-bold transition-colors whitespace-nowrap ${
              networkAnalysis?.topology === 'series'
                ? 'border-[#059669] bg-[#059669] text-white shadow-sm'
                : 'border-[#E2E8F0] dark:border-[#334155] bg-[#F8FAFC] dark:bg-[#0F172A] text-slate-700 dark:text-slate-200 hover:border-[#059669] hover:text-[#059669] dark:hover:text-emerald-400'
            }`}
          >
            <svg className="h-4 w-6 shrink-0" viewBox="0 0 28 14" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
              <path d="M1 7h3l1.5-3 2 6 2-6 1.5 3h6l1.5-3 2 6 2-6 1.5 3h3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span>{pick('توالي تلقائي (Series)', 'Série auto (Series)', 'Auto Series')}</span>
          </button>

          <button
            type="button"
            onClick={() => autoConnectResistors('parallel')}
            className={`inline-flex min-h-[40px] items-center gap-2 rounded-xl border px-3.5 py-1.5 text-xs font-bold transition-colors whitespace-nowrap ${
              networkAnalysis?.topology === 'parallel'
                ? 'border-[#059669] bg-[#059669] text-white shadow-sm'
                : 'border-[#E2E8F0] dark:border-[#334155] bg-[#F8FAFC] dark:bg-[#0F172A] text-slate-700 dark:text-slate-200 hover:border-[#059669] hover:text-[#059669] dark:hover:text-emerald-400'
            }`}
          >
            <svg className="h-4 w-6 shrink-0" viewBox="0 0 28 16" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
              <path d="M1 8h4M23 8h4M5 3.5v9M23 3.5v9M5 3.5h5l1-2 1.5 4 1.5-4 1 2h8M5 12.5h5l1-2 1.5 4 1.5-4 1 2h8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span>{pick('توازي تلقائي (Parallel)', 'Parallèle auto (Parallel)', 'Auto Parallel')}</span>
          </button>

          <div className="flex items-center gap-1 rounded-xl bg-[#F8FAFC] dark:bg-[#0F172A] p-1 border border-[#E2E8F0] dark:border-[#334155]">
            <span className="px-1.5 text-[11px] font-semibold text-slate-500 dark:text-slate-400 whitespace-nowrap">
              {pick('العدد:', 'Nb :', 'Qty:')}
            </span>
            {[2, 3, 4].map((cnt) => {
              const isCurrentCount =
                (networkAnalysis?.topology === 'series' || networkAnalysis?.topology === 'parallel') &&
                networkAnalysis.resistors.length === cnt;
              return (
                <button
                  key={cnt}
                  type="button"
                  onClick={() =>
                    autoConnectResistors(
                      networkAnalysis?.topology === 'parallel' ? 'parallel' : 'series',
                      cnt
                    )
                  }
                  className={`min-h-[32px] min-w-[32px] rounded-lg px-2 text-xs font-bold font-mono-num transition-colors ${
                    isCurrentCount
                      ? 'bg-[#059669] text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {cnt}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Component Palette (Draggable + Tap-to-add for Android touch) */}
      <div className="rounded-2xl border border-[#E2E8F0] dark:border-[#334155] bg-white dark:bg-[#1E293B] p-3 shadow-sm">
        <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2">
          {pick('اسحب العنصر للوحة أو اضغط عليه لإضافته مباشرة:', 'Glissez un composant sur le plan ou touchez-le pour l’ajouter :', 'Drag a part onto the board or tap to add:')}
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {PALETTE.map((item) => (
            <button
              key={item.type}
              type="button"
              draggable
              onDragStart={(e) => {
                e.dataTransfer.setData('application/sim-type', item.type);
              }}
              onClick={() => addComponent(item.type, 280 + Math.round(Math.random() * 100), 150 + Math.round(Math.random() * 80))}
              className="inline-flex min-h-[44px] items-center gap-1.5 rounded-xl border border-[#E2E8F0] dark:border-[#334155] bg-[#F8FAFC] dark:bg-[#0F172A] px-3.5 py-2 text-xs font-semibold text-slate-800 dark:text-slate-200 hover:border-[#059669] hover:bg-emerald-50 dark:hover:bg-emerald-950/40 whitespace-nowrap shrink-0 cursor-grab active:cursor-grabbing transition-colors"
            >
              <Plus className="h-3.5 w-3.5 text-[#059669] dark:text-emerald-400" />
              <span>{pick(item.labelAr, item.labelFr, item.labelEn)}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Sandbox: Interactive SVG Breadboard + Property Inspector */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-12 items-stretch">
        {/* Interactive Canvas */}
        <div className="lg:col-span-8 flex flex-col gap-3">
          <div className="relative overflow-hidden rounded-2xl border border-[#E2E8F0] dark:border-[#334155] bg-[#0F172A] shadow-sm">
            {pendingWire && (
              <div className="bg-[#059669] px-3 py-1.5 text-xs font-semibold text-white text-center">
                {pick(
                  'اضغط الآن على الطرف الثاني لأي عنصر لإتمام التوصيل بالسلك (أو اضغط في أي مكان للإلغاء)',
                  'Cliquez maintenant sur une autre borne pour relier le fil (ou cliquez dans le vide pour annuler)',
                  'Tap a second terminal dot to connect the wire (or tap anywhere else to cancel)'
                )}
              </div>
            )}

            <svg
              ref={svgRef}
              viewBox="0 0 680 380"
              className="w-full h-[300px] sm:h-[400px] touch-none select-none"
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDropOnCanvas}
              onPointerMove={handlePointerMoveCanvas}
              onPointerUp={handlePointerUpCanvas}
              onClick={() => setPendingWire(null)}
            >
              <defs>
                <pattern id="sim-grid" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#1E293B" strokeWidth="1" />
                </pattern>
              </defs>
              <rect width="680" height="380" fill="url(#sim-grid)" />

              {/* Wires (click a wire to remove it) */}
              {wires.map((w) => {
                const c1 = components.find((c) => c.id === w.fromCompId);
                const c2 = components.find((c) => c.id === w.toCompId);
                if (!c1 || !c2) return null;
                const p1 = getPortCoords(c1, w.fromPort);
                const p2 = getPortCoords(c2, w.toPort);
                const midX = (p1.x + p2.x) / 2;
                const vAtWire = simResult.nodeVoltages[`${w.fromCompId}:${w.fromPort}`];
                const isEnergized = isRunning && vAtWire !== undefined && vAtWire > 0.2;
                return (
                  <g
                    key={w.id}
                    className="cursor-pointer group"
                    onClick={(e) => {
                      e.stopPropagation();
                      setWires((prev) => prev.filter((item) => item.id !== w.id));
                    }}
                  >
                    <path
                      d={`M ${p1.x} ${p1.y} L ${midX} ${p1.y} L ${midX} ${p2.y} L ${p2.x} ${p2.y}`}
                      fill="none"
                      stroke="transparent"
                      strokeWidth="14"
                    />
                    <path
                      d={`M ${p1.x} ${p1.y} L ${midX} ${p1.y} L ${midX} ${p2.y} L ${p2.x} ${p2.y}`}
                      fill="none"
                      stroke={isEnergized ? '#38BDF8' : '#64748B'}
                      strokeWidth="3"
                      strokeLinejoin="round"
                      className="group-hover:stroke-rose-500 transition-colors"
                    />
                  </g>
                );
              })}

              {/* Components */}
              {components.map((comp) => {
                const isSelected = comp.id === selectedId;
                const res = simResult.components[comp.id];
                const p0 = getPortCoords(comp, 0);
                const p1 = comp.type !== 'ground' ? getPortCoords(comp, 1) : null;

                return (
                  <g
                    key={comp.id}
                    className="cursor-move"
                    onPointerDown={(e) => handlePointerDownComp(e, comp)}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedId(comp.id);
                    }}
                  >
                    {/* Selection Halo */}
                    {isSelected && (
                      <rect
                        x={comp.x - 42}
                        y={comp.y - 32}
                        width="84"
                        height="64"
                        rx="10"
                        fill="none"
                        stroke="#10B981"
                        strokeWidth="1.8"
                        strokeDasharray="4 3"
                      />
                    )}

                    {/* Wire leads from component body to ports */}
                    {p1 && (
                      <line
                        x1={p0.x}
                        y1={p0.y}
                        x2={p1.x}
                        y2={p1.y}
                        stroke="#94A3B8"
                        strokeWidth="2.5"
                      />
                    )}

                    {/* Symbol Body */}
                    {comp.type === 'battery' && (
                      <g transform={`translate(${comp.x}, ${comp.y})`}>
                        <rect x="-24" y="-22" width="48" height="44" rx="6" fill="#0F172A" stroke="#F59E0B" strokeWidth="2.5" />
                        <text x="0" y="-4" textAnchor="middle" fill="#FBBF24" className="text-[11px] font-mono font-bold">
                          {comp.value}V
                        </text>
                        <text x="0" y="12" textAnchor="middle" fill="#CBD5E1" className="text-[9px]">
                          DC + / -
                        </text>
                      </g>
                    )}

                    {comp.type === 'resistor' && (
                      <g transform={`translate(${comp.x}, ${comp.y}) rotate(${comp.rotation})`}>
                        <rect x="-26" y="-12" width="52" height="24" rx="4" fill="#D6B585" stroke="#92400E" strokeWidth="2" />
                        <rect x="-15" y="-12" width="5" height="24" fill="#78350F" />
                        <rect x="-4" y="-12" width="5" height="24" fill="#18181B" />
                        <rect x="7" y="-12" width="5" height="24" fill="#DC2626" />
                      </g>
                    )}

                    {comp.type === 'ldr' && (
                      <g transform={`translate(${comp.x}, ${comp.y}) rotate(${comp.rotation})`}>
                        <circle cx="0" cy="0" r="20" fill="#1E293B" stroke="#F97316" strokeWidth="2.5" />
                        <path d="M-10 -6 L10 -6 L-10 0 L10 0 L-10 6 L10 6" fill="none" stroke="#FB923C" strokeWidth="2.5" strokeLinecap="round" />
                      </g>
                    )}

                    {comp.type === 'led' && (
                      <g transform={`translate(${comp.x}, ${comp.y})`}>
                        {res && res.brightness > 0 && (
                          <circle
                            cx="0"
                            cy="0"
                            r={22 + res.brightness * 12}
                            fill={res.overcurrent ? '#EF4444' : '#10B981'}
                            opacity={0.18 + res.brightness * 0.35}
                          />
                        )}
                        <circle
                          cx="0"
                          cy="0"
                          r="17"
                          fill={
                            res?.overcurrent
                              ? '#EF4444'
                              : res && res.brightness > 0
                              ? '#10B981'
                              : '#1E293B'
                          }
                          stroke={res && res.brightness > 0 ? '#6EE7B7' : '#64748B'}
                          strokeWidth="2.5"
                        />
                        <text x="0" y="4" textAnchor="middle" fill="#FFFFFF" className="text-[10px] font-mono font-bold">
                          LED
                        </text>
                      </g>
                    )}

                    {comp.type === 'diode' && (
                      <g transform={`translate(${comp.x}, ${comp.y}) rotate(${comp.rotation})`}>
                        <rect x="-22" y="-11" width="44" height="22" rx="3" fill="#0F172A" stroke="#94A3B8" strokeWidth="2" />
                        <rect x="11" y="-11" width="6" height="22" fill="#E2E8F0" />
                      </g>
                    )}

                    {comp.type === 'switch' && (
                      <g
                        transform={`translate(${comp.x}, ${comp.y})`}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedId(comp.id);
                          setComponents((prev) =>
                            prev.map((item) =>
                              item.id === comp.id ? { ...item, closed: !item.closed } : item
                            )
                          );
                        }}
                      >
                        <rect x="-26" y="-16" width="52" height="32" rx="6" fill="#1E293B" stroke={comp.closed ? '#38BDF8' : '#64748B'} strokeWidth="2" />
                        <line
                          x1="-16"
                          y1="4"
                          x2={comp.closed ? 16 : 10}
                          y2={comp.closed ? 4 : -10}
                          stroke={comp.closed ? '#38BDF8' : '#F59E0B'}
                          strokeWidth="3.5"
                          strokeLinecap="round"
                        />
                        <circle cx="-16" cy="4" r="3" fill="#E2E8F0" />
                        <circle cx="16" cy="4" r="3" fill="#E2E8F0" />
                      </g>
                    )}

                    {comp.type === 'potentiometer' && (
                      <g transform={`translate(${comp.x}, ${comp.y}) rotate(${comp.rotation})`}>
                        <rect x="-26" y="-12" width="52" height="24" rx="4" fill="#1E293B" stroke="#38BDF8" strokeWidth="2" />
                        <path d="M-14 0 L14 0" stroke="#94A3B8" strokeWidth="2" />
                        <polygon points="0,-16 -5,-23 5,-23" fill="#38BDF8" />
                      </g>
                    )}

                    {comp.type === 'zener' && (
                      <g transform={`translate(${comp.x}, ${comp.y}) rotate(${comp.rotation})`}>
                        <rect x="-22" y="-11" width="44" height="22" rx="3" fill="#7C2D12" stroke="#F97316" strokeWidth="2" />
                        <rect x="11" y="-11" width="6" height="22" fill="#0F172A" />
                      </g>
                    )}

                    {comp.type === 'fuse' && (
                      <g transform={`translate(${comp.x}, ${comp.y}) rotate(${comp.rotation})`}>
                        <rect x="-24" y="-10" width="48" height="20" rx="5" fill="#0F172A" stroke={res?.overcurrent || comp.closed === false ? '#EF4444' : '#E2E8F0'} strokeWidth="2" />
                        {comp.closed !== false && !res?.overcurrent && (
                          <line x1="-16" y1="0" x2="16" y2="0" stroke="#FBBF24" strokeWidth="2.5" />
                        )}
                      </g>
                    )}

                    {comp.type === 'buzzer' && (
                      <g transform={`translate(${comp.x}, ${comp.y})`}>
                        {res && res.brightness > 0 && (
                          <circle cx="0" cy="0" r={22 + res.brightness * 8} fill="#38BDF8" opacity="0.22" />
                        )}
                        <circle
                          cx="0"
                          cy="0"
                          r="17"
                          fill="#0F172A"
                          stroke={res && res.brightness > 0 ? '#38BDF8' : '#64748B'}
                          strokeWidth="2.5"
                        />
                        <circle cx="0" cy="0" r="5" fill={res && res.brightness > 0 ? '#38BDF8' : '#475569'} />
                      </g>
                    )}

                    {comp.type === 'ground' && (
                      <g transform={`translate(${comp.x}, ${comp.y})`}>
                        <line x1="0" y1="-24" x2="0" y2="-2" stroke="#94A3B8" strokeWidth="2.5" />
                        <line x1="-16" y1="-2" x2="16" y2="-2" stroke="#38BDF8" strokeWidth="3" strokeLinecap="round" />
                        <line x1="-10" y1="5" x2="10" y2="5" stroke="#38BDF8" strokeWidth="2.5" strokeLinecap="round" />
                        <line x1="-4" y1="12" x2="4" y2="12" stroke="#38BDF8" strokeWidth="2" strokeLinecap="round" />
                      </g>
                    )}

                    {/* Component Value / Live Telemetry Badge */}
                    <text
                      x={comp.x}
                      y={comp.y + (comp.type === 'ground' ? 28 : 34)}
                      textAnchor="middle"
                      fill="#E2E8F0"
                      className="text-[10px] font-mono font-semibold"
                    >
                      {(comp.type === 'resistor' || comp.type === 'potentiometer') && formatResistance(comp.value)}
                      {comp.type === 'ldr' && `LDR ${formatResistance(getEffectiveResistance(comp))}`}
                      {comp.type === 'switch' && (comp.closed ? 'ON' : 'OFF')}
                      {comp.type === 'fuse' && (res?.overcurrent || comp.closed === false ? 'BLOWN!' : `FUSE ${comp.value}mA`)}
                      {comp.type === 'buzzer' && (isRunning && res && res.brightness > 0 ? `🔊 ${res.voltageDrop}V` : 'BUZZER')}
                      {comp.type === 'zener' && `Vz ${comp.value}V`}
                      {comp.type === 'led' && isRunning && res ? `${res.currentMa}mA` : ''}
                      {comp.type === 'diode' && '1N4007'}
                    </text>

                    {/* Port 0 Terminal */}
                    <g
                      className="cursor-crosshair"
                      onClick={(e) => handlePortClick(e, comp.id, 0)}
                    >
                      <circle
                        cx={p0.x}
                        cy={p0.y}
                        r="11"
                        fill="transparent"
                      />
                      <circle
                        cx={p0.x}
                        cy={p0.y}
                        r="5.5"
                        fill={
                          pendingWire?.compId === comp.id && pendingWire.port === 0
                            ? '#10B981'
                            : comp.type === 'battery'
                            ? '#334155'
                            : '#0F172A'
                        }
                        stroke={
                          pendingWire?.compId === comp.id && pendingWire.port === 0
                            ? '#FFFFFF'
                            : comp.type === 'led' || comp.type === 'diode'
                            ? '#10B981'
                            : '#94A3B8'
                        }
                        strokeWidth="2"
                      />
                    </g>

                    {/* Port 1 Terminal */}
                    {p1 && (
                      <g
                        className="cursor-crosshair"
                        onClick={(e) => handlePortClick(e, comp.id, 1)}
                      >
                        <circle
                          cx={p1.x}
                          cy={p1.y}
                          r="11"
                          fill="transparent"
                        />
                        <circle
                          cx={p1.x}
                          cy={p1.y}
                          r="5.5"
                          fill={
                            pendingWire?.compId === comp.id && pendingWire.port === 1
                              ? '#10B981'
                              : comp.type === 'battery'
                              ? '#DC2626'
                              : '#0F172A'
                          }
                          stroke={
                            pendingWire?.compId === comp.id && pendingWire.port === 1
                              ? '#FFFFFF'
                              : '#94A3B8'
                          }
                          strokeWidth="2"
                        />
                      </g>
                    )}
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Simulation Status Bar */}
          <div
            className={`flex items-center gap-2.5 rounded-xl border px-4 py-3 text-xs sm:text-sm shadow-sm ${
              simResult.status === 'short_circuit'
                ? 'border-rose-300 dark:border-rose-800 bg-rose-50 dark:bg-rose-950/40 text-rose-900 dark:text-rose-100'
                : 'border-[#E2E8F0] dark:border-[#334155] bg-white dark:bg-[#1E293B] text-slate-700 dark:text-slate-200'
            }`}
          >
            {simResult.status === 'short_circuit' ? (
              <AlertTriangle className="h-4 w-4 shrink-0 text-rose-600 dark:text-rose-400" />
            ) : (
              <CheckCircle2 className="h-4 w-4 shrink-0 text-[#059669] dark:text-emerald-400" />
            )}
            <span>{pick(simResult.messageAr, simResult.messageFr, simResult.messageEn)}</span>
          </div>

          {/* Instant Series / Parallel Calculation Panel */}
          {networkAnalysis && (
            <div className="rounded-2xl border border-[#E2E8F0] dark:border-[#334155] bg-white dark:bg-[#1E293B] p-4 space-y-3.5 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-[#E2E8F0] dark:border-[#334155]">
                <div className="flex items-center gap-2">
                  <Calculator className="h-4 w-4 text-[#059669] dark:text-emerald-400 shrink-0" />
                  <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
                    {networkAnalysis.topology === 'series'
                      ? pick('تحليل التوصيل على التوالي (Series)', 'Analyse en Série (Series)', 'Series Resistor Analysis')
                      : networkAnalysis.topology === 'parallel'
                      ? pick('تحليل التوصيل على التوازي (Parallel)', 'Analyse en Parallèle (Parallel)', 'Parallel Resistor Analysis')
                      : pick('حساب التوالي والتوازي الفوري للمقاومات', 'Calcul Série / Parallèle instantané', 'Instant Series / Parallel Calculator')}
                  </h3>
                </div>

                <div className="flex items-center gap-1.5">
                  {networkAnalysis.resistors.length > 2 && (
                    <button
                      type="button"
                      onClick={() =>
                        autoConnectResistors(
                          networkAnalysis.topology === 'parallel' ? 'parallel' : 'series',
                          networkAnalysis.resistors.length - 1
                        )
                      }
                      aria-label={pick('إزالة مقاومة', 'Retirer une résistance', 'Remove resistor')}
                      className="inline-flex min-h-[34px] min-w-[34px] items-center justify-center rounded-lg border border-[#E2E8F0] dark:border-[#334155] bg-[#F8FAFC] dark:bg-[#0F172A] text-slate-700 dark:text-slate-200 hover:border-rose-400 hover:text-rose-600 transition-colors"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                  )}
                  {networkAnalysis.resistors.length < 4 && (
                    <button
                      type="button"
                      onClick={() =>
                        autoConnectResistors(
                          networkAnalysis.topology === 'parallel' ? 'parallel' : 'series',
                          networkAnalysis.resistors.length + 1
                        )
                      }
                      className="inline-flex min-h-[34px] items-center gap-1 rounded-lg border border-[#E2E8F0] dark:border-[#334155] bg-[#F8FAFC] dark:bg-[#0F172A] px-2.5 py-1 text-xs font-bold text-[#059669] dark:text-emerald-400 hover:border-[#059669] transition-colors"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      <span>{pick('مقاومة', 'Résistance', 'Resistor')}</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Calculated Equivalent Values */}
              {networkAnalysis.activeReq !== null ? (
                <div className="space-y-2.5">
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="rounded-xl bg-[#F8FAFC] dark:bg-[#0F172A] border border-[#E2E8F0] dark:border-[#334155] p-2.5">
                      <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                        {pick('المقاومة المكافئة (Req)', 'Résistance éq. (Req)', 'Equivalent R (Req)')}
                      </div>
                      <div className="mt-0.5 font-mono-num text-base font-extrabold text-[#059669] dark:text-emerald-400" dir="ltr">
                        {formatExactResistance(networkAnalysis.activeReq)}
                      </div>
                    </div>

                    <div className="rounded-xl bg-[#F8FAFC] dark:bg-[#0F172A] border border-[#E2E8F0] dark:border-[#334155] p-2.5">
                      <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                        {pick('التيار الكلي (Itot)', 'Courant total', 'Total Current')}
                      </div>
                      <div className="mt-0.5 font-mono-num text-base font-extrabold text-slate-900 dark:text-white" dir="ltr">
                        {networkAnalysis.totalCurrentMa !== null
                          ? `${networkAnalysis.totalCurrentMa.toFixed(1)} mA`
                          : '—'}
                      </div>
                    </div>

                    <div className="rounded-xl bg-[#F8FAFC] dark:bg-[#0F172A] border border-[#E2E8F0] dark:border-[#334155] p-2.5">
                      <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                        {pick('القدرة الكلية (P)', 'Puissance tot.', 'Total Power')}
                      </div>
                      <div className="mt-0.5 font-mono-num text-base font-extrabold text-[#D97706] dark:text-amber-400" dir="ltr">
                        {networkAnalysis.totalPowerMw !== null
                          ? `${networkAnalysis.totalPowerMw.toFixed(1)} mW`
                          : '—'}
                      </div>
                    </div>
                  </div>

                  {/* Formula Summary */}
                  <div
                    className="rounded-xl bg-[#F8FAFC] dark:bg-[#0F172A] border border-[#E2E8F0] dark:border-[#334155] px-3 py-2 text-xs font-mono-num text-slate-700 dark:text-slate-300 overflow-x-auto whitespace-nowrap"
                    dir="ltr"
                  >
                    {networkAnalysis.topology === 'series'
                      ? `Req = ${networkAnalysis.resistors.map((r) => formatResistance(r.value)).join(' + ')} = ${formatExactResistance(networkAnalysis.reqSeries)}`
                      : `Req = 1 / (${networkAnalysis.resistors.map((r) => `1/${formatResistance(r.value)}`).join(' + ')}) = ${formatExactResistance(networkAnalysis.reqParallel)}`}
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => autoConnectResistors('series')}
                    className="rounded-xl border border-[#E2E8F0] dark:border-[#334155] bg-[#F8FAFC] dark:bg-[#0F172A] p-3 text-start hover:border-[#059669] transition-colors"
                  >
                    <div className="text-xs font-bold text-slate-700 dark:text-slate-200">
                      {pick('توصيل على التوالي (اضغط للتطبيق)', 'Connecter en Série', 'Wire in Series')}
                    </div>
                    <div className="mt-1 font-mono-num text-sm font-extrabold text-[#059669] dark:text-emerald-400" dir="ltr">
                      Req = {formatExactResistance(networkAnalysis.reqSeries)} · {((networkAnalysis.batteryVoltage / networkAnalysis.reqSeries) * 1000).toFixed(1)} mA
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => autoConnectResistors('parallel')}
                    className="rounded-xl border border-[#E2E8F0] dark:border-[#334155] bg-[#F8FAFC] dark:bg-[#0F172A] p-3 text-start hover:border-[#059669] transition-colors"
                  >
                    <div className="text-xs font-bold text-slate-700 dark:text-slate-200">
                      {pick('توصيل على التوازي (اضغط للتطبيق)', 'Connecter en Parallèle', 'Wire in Parallel')}
                    </div>
                    <div className="mt-1 font-mono-num text-sm font-extrabold text-[#059669] dark:text-emerald-400" dir="ltr">
                      Req = {formatExactResistance(networkAnalysis.reqParallel)} · {((networkAnalysis.batteryVoltage / networkAnalysis.reqParallel) * 1000).toFixed(1)} mA
                    </div>
                  </button>
                </div>
              )}

              {/* Quick Per-Resistor Tuner + Individual Drops */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {networkAnalysis.resistors.map((r, idx) => {
                  const rSim = isRunning ? simResult.components[r.id] : undefined;
                  const isSel = selectedId === r.id;
                  return (
                    <div
                      key={r.id}
                      onClick={() => setSelectedId(r.id)}
                      className={`flex items-center justify-between gap-2 rounded-xl border px-3 py-2 cursor-pointer transition-colors ${
                        isSel
                          ? 'border-[#059669] bg-emerald-50/50 dark:bg-emerald-950/25'
                          : 'border-[#E2E8F0] dark:border-[#334155] bg-[#F8FAFC] dark:bg-[#0F172A]'
                      }`}
                    >
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-slate-900 dark:text-white">
                          R{idx + 1}
                        </div>
                        <div className="font-mono-num text-[11px] text-slate-500 dark:text-slate-400" dir="ltr">
                          {rSim ? `${rSim.voltageDrop}V · ${rSim.currentMa}mA` : formatResistance(r.value)}
                        </div>
                      </div>

                      <select
                        value={STANDARD_RESISTOR_VALUES.includes(r.value) ? r.value : ''}
                        onClick={(e) => e.stopPropagation()}
                        onChange={(e) => {
                          const nextVal = Number(e.target.value);
                          if (!nextVal) return;
                          setComponents((prev) =>
                            prev.map((c) =>
                              c.id === r.id
                                ? { ...c, value: nextVal, label: `R${idx + 1} ${formatResistance(nextVal)}` }
                                : c
                            )
                          );
                        }}
                        aria-label={`R${idx + 1}`}
                        className="min-h-[34px] rounded-lg border border-[#E2E8F0] dark:border-[#334155] bg-white dark:bg-[#1E293B] px-2 text-xs font-bold font-mono-num text-slate-800 dark:text-slate-100 focus:border-[#059669] focus:outline-none"
                        dir="ltr"
                      >
                        {!STANDARD_RESISTOR_VALUES.includes(r.value) && (
                          <option value="">{formatResistance(r.value)}</option>
                        )}
                        {STANDARD_RESISTOR_VALUES.map((val) => (
                          <option key={val} value={val}>
                            {formatResistance(val)}
                          </option>
                        ))}
                      </select>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Right Panel: Selected Component Inspector & Live Readings */}
        <div className="lg:col-span-4 rounded-2xl border border-[#E2E8F0] dark:border-[#334155] bg-white dark:bg-[#1E293B] p-5 flex flex-col justify-between gap-5 shadow-sm">
          {selectedComp ? (
            <>
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2 pb-3 border-b border-[#E2E8F0] dark:border-[#334155]">
                  <div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      {pick('العنصر المحدد', 'Composant sélectionné', 'Selected Component')}
                    </div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      {getTypeLabel(selectedComp.type)} ({selectedComp.label})
                    </h3>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {selectedComp.type !== 'ground' && (
                      <button
                        type="button"
                        onClick={rotateSelected}
                        aria-label={pick('تدوير العنصر', 'Pivoter', 'Rotate component')}
                        className="flex min-h-[40px] min-w-[40px] items-center justify-center rounded-xl border border-[#E2E8F0] dark:border-[#334155] text-slate-700 dark:text-slate-200 hover:bg-[#F8FAFC] dark:hover:bg-[#334155]/60"
                      >
                        <RotateCw className="h-4 w-4" />
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={removeSelected}
                      aria-label={pick('حذف العنصر', 'Supprimer', 'Delete component')}
                      className="flex min-h-[40px] min-w-[40px] items-center justify-center rounded-xl border border-rose-200 dark:border-rose-900 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Live Telemetry Readout */}
                {isRunning && simResult.components[selectedComp.id] && (
                  <div className="grid grid-cols-3 gap-2 rounded-xl bg-[#F8FAFC] dark:bg-[#0F172A] p-3 border border-[#E2E8F0] dark:border-[#334155] text-center">
                    <div>
                      <div className="text-[11px] text-slate-500">{pick('الجهد', 'Tension', 'Voltage')}</div>
                      <div className="font-mono-num text-sm font-bold text-[#059669] dark:text-emerald-400 mt-0.5" dir="ltr">
                        {simResult.components[selectedComp.id].voltageDrop} V
                      </div>
                    </div>
                    <div>
                      <div className="text-[11px] text-slate-500">{pick('التيار', 'Courant', 'Current')}</div>
                      <div className="font-mono-num text-sm font-bold text-slate-900 dark:text-white mt-0.5" dir="ltr">
                        {simResult.components[selectedComp.id].currentMa} mA
                      </div>
                    </div>
                    <div>
                      <div className="text-[11px] text-slate-500">{pick('القدرة', 'Puissance', 'Power')}</div>
                      <div className="font-mono-num text-sm font-bold text-slate-900 dark:text-white mt-0.5" dir="ltr">
                        {simResult.components[selectedComp.id].powerMw} mW
                      </div>
                    </div>
                  </div>
                )}

                {selectedComp.type === 'led' && simResult.components[selectedComp.id]?.overcurrent && (
                  <div className="flex items-start gap-2 rounded-xl border border-rose-300 dark:border-rose-800 bg-rose-50 dark:bg-rose-950/40 p-3 text-xs text-rose-800 dark:text-rose-200">
                    <Zap className="h-4 w-4 shrink-0 text-rose-600 mt-0.5" />
                    <span>
                      {pick(
                        'تحذير: التيار أعلى من 30mA وقد يحترق الليد! ارفع قيمة المقاومة.',
                        'Attention : courant > 30mA, risque de brûler la LED ! Augmentez la résistance.',
                        'Warning: Current exceeds 30mA and may burn the LED! Increase series resistance.'
                      )}
                    </span>
                  </div>
                )}

                {/* Value Controls */}
                {selectedComp.type === 'battery' && (
                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1.5">
                      <label htmlFor="sim-bat-v" className="text-slate-600 dark:text-slate-400">
                        {pick('جهد البطارية', 'Tension de pile', 'Battery Voltage')}
                      </label>
                      <span className="font-mono-num text-slate-900 dark:text-white" dir="ltr">{selectedComp.value} V</span>
                    </div>
                    <input
                      id="sim-bat-v"
                      type="range"
                      min="1.5"
                      max="24"
                      step="0.5"
                      value={selectedComp.value}
                      onChange={(e) => {
                        const v = Number(e.target.value);
                        setComponents((prev) =>
                          prev.map((c) => (c.id === selectedComp.id ? { ...c, value: v, label: `${v}V` } : c))
                        );
                      }}
                      className="w-full accent-[#059669] h-2"
                    />
                  </div>
                )}

                {selectedComp.type === 'resistor' && (
                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1.5">
                      <label htmlFor="sim-res-ohm" className="text-slate-600 dark:text-slate-400">
                        {pick('قيمة المقاومة', 'Valeur de résistance', 'Resistance Value')}
                      </label>
                      <span className="font-mono-num text-slate-900 dark:text-white" dir="ltr">
                        {formatResistance(selectedComp.value)}
                      </span>
                    </div>
                    <div className="grid grid-cols-4 gap-1.5 mb-2">
                      {[100, 220, 330, 470, 1000, 2200, 4700, 10000].map((val) => (
                        <button
                          key={val}
                          type="button"
                          onClick={() =>
                            setComponents((prev) =>
                              prev.map((c) =>
                                c.id === selectedComp.id ? { ...c, value: val, label: formatResistance(val) } : c
                              )
                            )
                          }
                          className={`min-h-[36px] rounded-lg font-mono-num text-[11px] font-semibold border ${
                            selectedComp.value === val
                              ? 'border-[#059669] bg-[#059669] text-white'
                              : 'border-[#E2E8F0] dark:border-[#334155] bg-[#F8FAFC] dark:bg-[#0F172A] text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          {formatResistance(val)}
                        </button>
                      ))}
                    </div>
                    <input
                      id="sim-res-ohm"
                      type="range"
                      min="10"
                      max="10000"
                      step="10"
                      value={selectedComp.value}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setComponents((prev) =>
                          prev.map((c) =>
                            c.id === selectedComp.id ? { ...c, value: val, label: formatResistance(val) } : c
                          )
                        );
                      }}
                      className="w-full accent-[#059669] h-2"
                    />
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
                    className={`w-full min-h-[44px] rounded-xl font-semibold text-sm text-white transition-colors ${
                      selectedComp.closed ? 'bg-[#059669] hover:bg-[#047857]' : 'bg-slate-600 hover:bg-slate-700'
                    }`}
                  >
                    {selectedComp.closed
                      ? pick('المفتاح مغلق (يمرر التيار) — اضغط للفتح', 'Interrupteur fermé (ON) — Cliquer pour ouvrir', 'Switch Closed (ON) — Tap to Open')
                      : pick('المفتاح مفتوح (مقطوع) — اضغط للإغلاق', 'Interrupteur ouvert (OFF) — Cliquer pour fermer', 'Switch Open (OFF) — Tap to Close')}
                  </button>
                )}

                {selectedComp.type === 'ldr' && (
                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1.5">
                      <label htmlFor="sim-ldr-light" className="text-slate-600 dark:text-slate-400">
                        {pick('شدة الإضاءة', 'Luminosité', 'Light Level')}
                      </label>
                      <span className="font-mono-num text-slate-900 dark:text-white" dir="ltr">
                        {selectedComp.lightLevel ?? 50}% ({formatResistance(getEffectiveResistance(selectedComp))})
                      </span>
                    </div>
                    <input
                      id="sim-ldr-light"
                      type="range"
                      min="0"
                      max="100"
                      step="5"
                      value={selectedComp.lightLevel ?? 50}
                      onChange={(e) => {
                        const lvl = Number(e.target.value);
                        setComponents((prev) =>
                          prev.map((c) => (c.id === selectedComp.id ? { ...c, lightLevel: lvl } : c))
                        );
                      }}
                      className="w-full accent-[#D97706] h-2"
                    />
                  </div>
                )}

                {selectedComp.type === 'potentiometer' && (
                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1.5">
                      <label htmlFor="sim-pot-ohm" className="text-slate-600 dark:text-slate-400">
                        {pick('تدوير المقاومة المتغيرة', 'Curseur potentiomètre', 'Potentiometer Wiper')}
                      </label>
                      <span className="font-mono-num text-slate-900 dark:text-white" dir="ltr">
                        {formatResistance(selectedComp.value)}
                      </span>
                    </div>
                    <input
                      id="sim-pot-ohm"
                      type="range"
                      min="50"
                      max="10000"
                      step="50"
                      value={selectedComp.value}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setComponents((prev) =>
                          prev.map((c) =>
                            c.id === selectedComp.id ? { ...c, value: val, label: formatResistance(val) } : c
                          )
                        );
                      }}
                      className="w-full accent-[#059669] h-2"
                    />
                  </div>
                )}

                {selectedComp.type === 'zener' && (
                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1.5">
                      <label htmlFor="sim-zener-v" className="text-slate-600 dark:text-slate-400">
                        {pick('جهد الزينر (Vz)', 'Tension Zener (Vz)', 'Zener Voltage (Vz)')}
                      </label>
                      <span className="font-mono-num text-slate-900 dark:text-white" dir="ltr">{selectedComp.value} V</span>
                    </div>
                    <div className="grid grid-cols-4 gap-1.5">
                      {[3.3, 5.1, 9.1, 12.0].map((vz) => (
                        <button
                          key={vz}
                          type="button"
                          onClick={() =>
                            setComponents((prev) =>
                              prev.map((c) => (c.id === selectedComp.id ? { ...c, value: vz, label: `${vz}V` } : c))
                            )
                          }
                          className={`min-h-[36px] rounded-lg font-mono-num text-xs font-semibold border ${
                            selectedComp.value === vz
                              ? 'border-[#059669] bg-[#059669] text-white'
                              : 'border-[#E2E8F0] dark:border-[#334155] bg-[#F8FAFC] dark:bg-[#0F172A] text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          {vz}V
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {selectedComp.type === 'fuse' && (
                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1.5">
                      <label htmlFor="sim-fuse-ma" className="text-slate-600 dark:text-slate-400">
                        {pick('تيار الفصل (mA)', 'Calibre fusible (mA)', 'Fuse Rating (mA)')}
                      </label>
                      <span className="font-mono-num text-slate-900 dark:text-white" dir="ltr">{selectedComp.value} mA</span>
                    </div>
                    <div className="grid grid-cols-3 gap-1.5">
                      {[100, 250, 500].map((ma) => (
                        <button
                          key={ma}
                          type="button"
                          onClick={() =>
                            setComponents((prev) =>
                              prev.map((c) => (c.id === selectedComp.id ? { ...c, value: ma, label: `${ma}mA` } : c))
                            )
                          }
                          className={`min-h-[36px] rounded-lg font-mono-num text-xs font-semibold border ${
                            selectedComp.value === ma
                              ? 'border-[#059669] bg-[#059669] text-white'
                              : 'border-[#E2E8F0] dark:border-[#334155] bg-[#F8FAFC] dark:bg-[#0F172A] text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          {ma}mA
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-[#E2E8F0] dark:border-[#334155] text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                {pick(
                  'تلميح: لحذف أي سلك موصل، اضغط مباشرة على السلك الأزرق أو الرمادي فوق اللوحة.',
                  'Astuce : cliquez directement sur un fil bleu ou gris pour le supprimer.',
                  'Tip: Click or tap directly on any blue/gray wire on the board to remove it.'
                )}
              </div>
            </>
          ) : (
            <div className="text-sm text-slate-500 dark:text-slate-400 text-center py-8">
              {pick(
                'اضغط على أي عنصر في اللوحة لتعديل قيمته ومعاينة قراءاته.',
                'Cliquez sur un composant du schéma pour modifier sa valeur et lire ses mesures.',
                'Tap any component on the board to adjust its value and view live readings.'
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
