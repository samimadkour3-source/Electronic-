import React, { useMemo, useRef, useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
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
            className={`inline-flex min-h-[44px] items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold text-white transition-colors ${
              isRunning ? 'bg-amber-600 hover:bg-amber-700' : 'bg-emerald-600 hover:bg-emerald-700'
            }`}
          >
            {isRunning ? <Square className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            <span>{isRunning ? pick('إيقاف المحاكاة', 'Pause', 'Pause Sim') : pick('تشغيل المحاكاة', 'Lancer', 'Run Sim')}</span>
          </button>

          <button
            type="button"
            onClick={clearCanvas}
            className="inline-flex min-h-[44px] items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
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
            className="min-h-[40px] rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:border-sky-500 hover:text-sky-600 dark:hover:text-sky-400 transition-colors"
          >
            {pick(p.labelAr, p.labelFr, p.labelEn)}
          </button>
        ))}
      </div>

      {/* Component Palette (Draggable + Tap-to-add for Android touch) */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3">
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
              className="inline-flex min-h-[44px] items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-3.5 py-2 text-xs font-semibold text-slate-800 dark:text-slate-200 hover:border-sky-500 hover:bg-sky-50 dark:hover:bg-sky-950/50 whitespace-nowrap shrink-0 cursor-grab active:cursor-grabbing transition-colors"
            >
              <Plus className="h-3.5 w-3.5 text-sky-600 dark:text-sky-400" />
              <span>{pick(item.labelAr, item.labelFr, item.labelEn)}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Sandbox: Interactive SVG Breadboard + Property Inspector */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-12 items-stretch">
        {/* Interactive Canvas */}
        <div className="lg:col-span-8 flex flex-col gap-3">
          <div className="relative overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-950 shadow-sm">
            {pendingWire && (
              <div className="bg-sky-600 px-3 py-1.5 text-xs font-semibold text-white text-center">
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
                        stroke="#0EA5E9"
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
                            ? '#38BDF8'
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
                              ? '#38BDF8'
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
            className={`flex items-center gap-2.5 rounded-xl border px-4 py-3 text-xs sm:text-sm ${
              simResult.status === 'short_circuit'
                ? 'border-rose-300 dark:border-rose-800 bg-rose-50 dark:bg-rose-950/40 text-rose-900 dark:text-rose-100'
                : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200'
            }`}
          >
            {simResult.status === 'short_circuit' ? (
              <AlertTriangle className="h-4 w-4 shrink-0 text-rose-600 dark:text-rose-400" />
            ) : (
              <CheckCircle2 className="h-4 w-4 shrink-0 text-sky-600 dark:text-sky-400" />
            )}
            <span>{pick(simResult.messageAr, simResult.messageFr, simResult.messageEn)}</span>
          </div>
        </div>

        {/* Right Panel: Selected Component Inspector & Live Readings */}
        <div className="lg:col-span-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 flex flex-col justify-between gap-5">
          {selectedComp ? (
            <>
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2 pb-3 border-b border-slate-200 dark:border-slate-800">
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
                        className="flex min-h-[40px] min-w-[40px] items-center justify-center rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
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
                  <div className="grid grid-cols-3 gap-2 rounded-xl bg-slate-50 dark:bg-slate-950 p-3 border border-slate-200 dark:border-slate-800 text-center">
                    <div>
                      <div className="text-[11px] text-slate-500">{pick('الجهد', 'Tension', 'Voltage')}</div>
                      <div className="font-mono-num text-sm font-bold text-sky-600 dark:text-sky-400 mt-0.5" dir="ltr">
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
                      className="w-full accent-sky-600 h-2"
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
                              ? 'border-sky-600 bg-sky-600 text-white'
                              : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300'
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
                      className="w-full accent-sky-600 h-2"
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
                      selectedComp.closed ? 'bg-sky-600 hover:bg-sky-700' : 'bg-slate-700 hover:bg-slate-600'
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
                      className="w-full accent-amber-500 h-2"
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
                      className="w-full accent-sky-600 h-2"
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
                              ? 'border-sky-600 bg-sky-600 text-white'
                              : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300'
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
                              ? 'border-sky-600 bg-sky-600 text-white'
                              : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          {ma}mA
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
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
