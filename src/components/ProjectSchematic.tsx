import React from 'react';

interface ProjectSchematicProps {
  projectId: string;
  className?: string;
}

export const ProjectSchematic: React.FC<ProjectSchematicProps> = ({
  projectId,
  className = 'w-full h-56',
}) => {
  switch (projectId) {
    case 'night_light':
      return (
        <svg viewBox="0 0 420 210" className={className} fill="none" aria-label="مخطط دائرة مصباح الليل التلقائي">
          {/* Rails */}
          <line x1="35" y1="26" x2="380" y2="26" stroke="#DC2626" strokeWidth="2.5" />
          <line x1="35" y1="184" x2="380" y2="184" stroke="#64748B" strokeWidth="2.5" />
          <text x="20" y="30" fill="#DC2626" className="text-[11px] font-mono font-bold">+9V</text>
          <text x="16" y="188" fill="currentColor" className="text-[11px] font-mono font-bold">GND</text>

          {/* 10k Resistor */}
          <line x1="130" y1="26" x2="130" y2="48" stroke="currentColor" strokeWidth="2" />
          <rect x="118" y="48" width="24" height="40" rx="3" stroke="currentColor" strokeWidth="2.2" />
          <text x="150" y="72" fill="currentColor" className="text-[10px] font-mono">10kΩ</text>
          <line x1="130" y1="88" x2="130" y2="112" stroke="currentColor" strokeWidth="2" />

          {/* LDR */}
          <circle cx="130" cy="144" r="18" stroke="#D97706" strokeWidth="2" />
          <rect x="120" y="132" width="20" height="24" rx="2" stroke="currentColor" strokeWidth="1.8" />
          <line x1="130" y1="112" x2="130" y2="132" stroke="currentColor" strokeWidth="2" />
          <line x1="130" y1="156" x2="130" y2="184" stroke="currentColor" strokeWidth="2" />
          <text x="92" y="148" textAnchor="end" fill="#D97706" className="text-[10px] font-mono">LDR</text>

          {/* Base connection to Q1 */}
          <circle cx="130" cy="112" r="3" fill="currentColor" />
          <line x1="130" y1="112" x2="235" y2="112" stroke="currentColor" strokeWidth="2" />
          <text x="222" y="106" fill="currentColor" className="text-[10px] font-mono">B</text>

          {/* Transistor Q1 */}
          <circle cx="255" cy="112" r="24" stroke="currentColor" strokeWidth="2" opacity="0.5" />
          <line x1="240" y1="96" x2="240" y2="128" stroke="currentColor" strokeWidth="3" />
          <line x1="240" y1="104" x2="270" y2="88" stroke="currentColor" strokeWidth="2.2" />
          <line x1="240" y1="120" x2="270" y2="136" stroke="currentColor" strokeWidth="2.2" />
          <line x1="270" y1="136" x2="270" y2="184" stroke="currentColor" strokeWidth="2" />
          <text x="280" y="148" fill="currentColor" className="text-[10px] font-mono">E</text>
          <text x="282" y="114" fill="currentColor" className="text-[10px] font-mono">2N3904</text>

          {/* Collector Branch: 330R + LED */}
          <line x1="270" y1="26" x2="270" y2="36" stroke="currentColor" strokeWidth="2" />
          <rect x="260" y="36" width="20" height="24" rx="3" stroke="currentColor" strokeWidth="2" />
          <text x="288" y="52" fill="currentColor" className="text-[10px] font-mono">330Ω</text>
          <line x1="270" y1="60" x2="270" y2="68" stroke="currentColor" strokeWidth="2" />
          <polygon points="258,68 282,68 270,84" fill="#10B981" fillOpacity="0.3" stroke="#10B981" strokeWidth="2" />
          <line x1="258" y1="84" x2="282" y2="84" stroke="#10B981" strokeWidth="2.5" />
          <line x1="270" y1="84" x2="270" y2="88" stroke="currentColor" strokeWidth="2" />
          <text x="290" y="80" fill="#10B981" className="text-[10px] font-mono">LED</text>
        </svg>
      );

    case 'regulated_power':
      return (
        <svg viewBox="0 0 420 200" className={className} fill="none" aria-label="مخطط منظم الجهد 7805">
          {/* Input Rail */}
          <line x1="35" y1="64" x2="165" y2="64" stroke="#DC2626" strokeWidth="2.5" />
          <text x="24" y="56" fill="#DC2626" className="text-[11px] font-mono font-bold">+9V–12V</text>
          {/* Output Rail */}
          <line x1="245" y1="64" x2="385" y2="64" stroke="#0284C7" strokeWidth="2.5" />
          <text x="355" y="52" fill="#0284C7" className="text-[11px] font-mono font-bold">+5V OUT</text>
          {/* Ground Rail */}
          <line x1="35" y1="168" x2="385" y2="168" stroke="#64748B" strokeWidth="2.5" />
          <text x="20" y="172" fill="currentColor" className="text-[11px] font-mono font-bold">GND</text>

          {/* C1 100uF */}
          <line x1="110" y1="64" x2="110" y2="104" stroke="currentColor" strokeWidth="2" />
          <line x1="94" y1="104" x2="126" y2="104" stroke="currentColor" strokeWidth="3" />
          <path d="M94 118 Q110 110 126 118" stroke="currentColor" strokeWidth="3" />
          <line x1="110" y1="114" x2="110" y2="168" stroke="currentColor" strokeWidth="2" />
          <text x="86" y="114" textAnchor="end" fill="currentColor" className="text-[10px] font-mono">100µF</text>

          {/* 7805 IC */}
          <rect x="165" y="42" width="80" height="46" rx="6" fill="currentColor" fillOpacity="0.08" stroke="currentColor" strokeWidth="2.5" />
          <text x="205" y="68" textAnchor="middle" fill="currentColor" className="text-[12px] font-mono font-bold">LM7805</text>
          <text x="174" y="82" fill="currentColor" className="text-[9px] font-mono">1:IN</text>
          <text x="218" y="82" fill="currentColor" className="text-[9px] font-mono">3:OUT</text>
          <line x1="205" y1="88" x2="205" y2="168" stroke="currentColor" strokeWidth="2.5" />
          <text x="212" y="130" fill="currentColor" className="text-[9px] font-mono">2:GND</text>

          {/* C2 100uF */}
          <line x1="285" y1="64" x2="285" y2="104" stroke="currentColor" strokeWidth="2" />
          <line x1="270" y1="104" x2="300" y2="104" stroke="currentColor" strokeWidth="3" />
          <path d="M270 118 Q285 110 300 118" stroke="currentColor" strokeWidth="3" />
          <line x1="285" y1="114" x2="285" y2="168" stroke="currentColor" strokeWidth="2" />
          <text x="278" y="138" textAnchor="end" fill="currentColor" className="text-[10px] font-mono">100µF</text>

          {/* 220R + LED */}
          <line x1="350" y1="64" x2="350" y2="78" stroke="currentColor" strokeWidth="2" />
          <rect x="340" y="78" width="20" height="28" rx="3" stroke="currentColor" strokeWidth="2" />
          <text x="366" y="96" fill="currentColor" className="text-[10px] font-mono">220Ω</text>
          <line x1="350" y1="106" x2="350" y2="120" stroke="currentColor" strokeWidth="2" />
          <polygon points="338,120 362,120 350,138" fill="#10B981" fillOpacity="0.3" stroke="#10B981" strokeWidth="2" />
          <line x1="338" y1="138" x2="362" y2="138" stroke="#10B981" strokeWidth="2.5" />
          <line x1="350" y1="138" x2="350" y2="168" stroke="currentColor" strokeWidth="2" />
        </svg>
      );

    case 'ne555_flasher':
      return (
        <svg viewBox="0 0 420 210" className={className} fill="none" aria-label="مخطط وميض NE555">
          {/* VCC & GND */}
          <line x1="30" y1="22" x2="390" y2="22" stroke="#DC2626" strokeWidth="2.2" />
          <line x1="30" y1="190" x2="390" y2="190" stroke="#64748B" strokeWidth="2.2" />
          <text x="16" y="26" fill="#DC2626" className="text-[10px] font-mono font-bold">+VCC</text>
          <text x="16" y="194" fill="currentColor" className="text-[10px] font-mono font-bold">GND</text>

          {/* NE555 Block */}
          <rect x="160" y="54" width="100" height="100" rx="6" fill="currentColor" fillOpacity="0.07" stroke="currentColor" strokeWidth="2.5" />
          <text x="210" y="108" textAnchor="middle" fill="currentColor" className="text-[13px] font-mono font-bold">NE555</text>

          {/* Pin 8 & 4 to VCC */}
          <line x1="185" y1="22" x2="185" y2="54" stroke="#DC2626" strokeWidth="2" />
          <line x1="235" y1="22" x2="235" y2="54" stroke="#DC2626" strokeWidth="2" />
          <text x="180" y="46" textAnchor="end" fill="currentColor" className="text-[9px] font-mono">8</text>
          <text x="242" y="46" fill="currentColor" className="text-[9px] font-mono">4</text>

          {/* Pin 1 to GND */}
          <line x1="210" y1="154" x2="210" y2="190" stroke="currentColor" strokeWidth="2" />
          <text x="218" y="176" fill="currentColor" className="text-[9px] font-mono">1:GND</text>

          {/* Timing R1, R2, C1 on left */}
          <line x1="85" y1="22" x2="85" y2="34" stroke="currentColor" strokeWidth="2" />
          <rect x="76" y="34" width="18" height="26" rx="2" stroke="currentColor" strokeWidth="2" />
          <text x="68" y="50" textAnchor="end" fill="currentColor" className="text-[9px] font-mono">10k</text>
          <line x1="85" y1="60" x2="85" y2="86" stroke="currentColor" strokeWidth="2" />
          <line x1="85" y1="74" x2="160" y2="74" stroke="currentColor" strokeWidth="2" />
          <text x="152" y="70" textAnchor="end" fill="currentColor" className="text-[9px] font-mono">7</text>

          <rect x="76" y="86" width="18" height="28" rx="2" stroke="currentColor" strokeWidth="2" />
          <text x="68" y="104" textAnchor="end" fill="currentColor" className="text-[9px] font-mono">47k</text>
          <line x1="85" y1="114" x2="85" y2="146" stroke="currentColor" strokeWidth="2" />
          <line x1="85" y1="128" x2="160" y2="128" stroke="currentColor" strokeWidth="2" />
          <text x="152" y="124" textAnchor="end" fill="currentColor" className="text-[9px] font-mono">2,6</text>

          {/* C1 10uF */}
          <line x1="72" y1="146" x2="98" y2="146" stroke="currentColor" strokeWidth="2.8" />
          <path d="M72 158 Q85 150 98 158" stroke="currentColor" strokeWidth="2.8" />
          <line x1="85" y1="154" x2="85" y2="190" stroke="currentColor" strokeWidth="2" />
          <text x="66" y="158" textAnchor="end" fill="currentColor" className="text-[9px] font-mono">10µF</text>

          {/* Pin 3 Out -> 330R -> LED */}
          <line x1="260" y1="104" x2="292" y2="104" stroke="#0284C7" strokeWidth="2.2" />
          <text x="266" y="98" fill="currentColor" className="text-[9px] font-mono">3:OUT</text>
          <rect x="292" y="95" width="32" height="18" rx="2" stroke="currentColor" strokeWidth="2" />
          <text x="308" y="88" textAnchor="middle" fill="currentColor" className="text-[9px] font-mono">330Ω</text>
          <line x1="324" y1="104" x2="352" y2="104" stroke="currentColor" strokeWidth="2" />
          <line x1="352" y1="104" x2="352" y2="126" stroke="currentColor" strokeWidth="2" />
          <polygon points="340,126 364,126 352,144" fill="#EF4444" fillOpacity="0.3" stroke="#EF4444" strokeWidth="2" />
          <line x1="340" y1="144" x2="364" y2="144" stroke="#EF4444" strokeWidth="2.5" />
          <line x1="352" y1="144" x2="352" y2="190" stroke="currentColor" strokeWidth="2" />
          <text x="372" y="140" fill="#EF4444" className="text-[10px] font-mono">LED</text>
        </svg>
      );

    case 'mosfet_dimmer':
    default:
      return (
        <svg viewBox="0 0 420 205" className={className} fill="none" aria-label="مخطط متحكم الموسفت">
          <line x1="30" y1="24" x2="385" y2="24" stroke="#DC2626" strokeWidth="2.5" />
          <line x1="30" y1="184" x2="385" y2="184" stroke="#64748B" strokeWidth="2.5" />
          <text x="16" y="28" fill="#DC2626" className="text-[10px] font-mono font-bold">+12V</text>
          <text x="16" y="188" fill="currentColor" className="text-[10px] font-mono font-bold">GND</text>

          {/* Potentiometer 10k */}
          <line x1="90" y1="24" x2="90" y2="62" stroke="currentColor" strokeWidth="2" />
          <rect x="78" y="62" width="24" height="62" rx="3" stroke="currentColor" strokeWidth="2.2" />
          <line x1="90" y1="124" x2="90" y2="184" stroke="currentColor" strokeWidth="2" />
          <text x="68" y="96" textAnchor="end" fill="currentColor" className="text-[10px] font-mono">10k POT</text>

          {/* Wiper -> 1k -> Gate */}
          <line x1="102" y1="93" x2="140" y2="93" stroke="#0284C7" strokeWidth="2.2" />
          <polygon points="102,93 112,88 112,98" fill="#0284C7" />
          <rect x="140" y="84" width="36" height="18" rx="2" stroke="currentColor" strokeWidth="2" />
          <text x="158" y="78" textAnchor="middle" fill="currentColor" className="text-[9px] font-mono">1kΩ</text>
          <line x1="176" y1="93" x2="225" y2="93" stroke="currentColor" strokeWidth="2" />

          {/* MOSFET */}
          <circle cx="250" cy="112" r="26" stroke="currentColor" strokeWidth="2" opacity="0.45" />
          <line x1="236" y1="92" x2="236" y2="132" stroke="currentColor" strokeWidth="3.5" />
          <line x1="236" y1="98" x2="265" y2="98" stroke="currentColor" strokeWidth="2.2" />
          <line x1="265" y1="98" x2="265" y2="86" stroke="currentColor" strokeWidth="2.2" />
          <line x1="236" y1="126" x2="265" y2="126" stroke="currentColor" strokeWidth="2.2" />
          <line x1="265" y1="126" x2="265" y2="184" stroke="currentColor" strokeWidth="2" />
          <text x="218" y="108" fill="currentColor" className="text-[9px] font-mono">G</text>
          <text x="275" y="146" fill="currentColor" className="text-[9px] font-mono">S</text>
          <text x="284" y="114" fill="currentColor" className="text-[10px] font-mono font-bold">IRFZ44N</text>

          {/* Load + Flyback Diode */}
          <rect x="242" y="42" width="46" height="28" rx="4" fill="#10B981" fillOpacity="0.18" stroke="#10B981" strokeWidth="2" />
          <text x="265" y="60" textAnchor="middle" fill="#10B981" className="text-[10px] font-mono font-bold">LOAD</text>
          <line x1="265" y1="24" x2="265" y2="42" stroke="currentColor" strokeWidth="2" />
          <line x1="265" y1="70" x2="265" y2="86" stroke="currentColor" strokeWidth="2" />

          {/* 1N4007 parallel diode */}
          <line x1="265" y1="32" x2="335" y2="32" stroke="currentColor" strokeWidth="1.8" />
          <line x1="265" y1="78" x2="335" y2="78" stroke="currentColor" strokeWidth="1.8" />
          <polygon points="325,64 345,64 335,46" stroke="currentColor" strokeWidth="2" />
          <line x1="325" y1="46" x2="345" y2="46" stroke="currentColor" strokeWidth="2.5" />
          <line x1="335" y1="32" x2="335" y2="46" stroke="currentColor" strokeWidth="1.8" />
          <line x1="335" y1="64" x2="335" y2="78" stroke="currentColor" strokeWidth="1.8" />
          <text x="352" y="60" fill="currentColor" className="text-[9px] font-mono">1N4007</text>
        </svg>
      );
  }
};
