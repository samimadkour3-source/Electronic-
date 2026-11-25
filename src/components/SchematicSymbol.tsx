import React from 'react';

interface SchematicSymbolProps {
  componentId: string;
  className?: string;
}

export const SchematicSymbol: React.FC<SchematicSymbolProps> = ({ componentId, className = 'w-full h-28' }) => {
  switch (componentId) {
    case 'resistor':
      return (
        <svg viewBox="0 0 220 90" className={className} fill="none" aria-label="رمز المقاومة الكهربائية">
          <line x1="16" y1="45" x2="54" y2="45" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
          <path d="M54 45 L64 25 L80 65 L96 25 L112 65 L128 25 L144 65 L154 45" stroke="currentColor" strokeWidth="3.5" strokeLinejoin="round" strokeLinecap="round" />
          <line x1="154" y1="45" x2="204" y2="45" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
          <text x="110" y="16" textAnchor="middle" fill="currentColor" className="text-[11px] font-mono" opacity="0.75">R (Ω)</text>
        </svg>
      );
    case 'capacitor':
      return (
        <svg viewBox="0 0 220 90" className={className} fill="none" aria-label="رمز المكثف">
          <line x1="20" y1="45" x2="96" y2="45" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
          <line x1="96" y1="20" x2="96" y2="70" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
          <path d="M126 20 Q114 45 126 70" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
          <line x1="120" y1="45" x2="200" y2="45" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
          <text x="76" y="28" textAnchor="middle" fill="currentColor" className="text-[14px] font-bold">+</text>
          <text x="142" y="28" textAnchor="middle" fill="currentColor" className="text-[14px] font-bold">-</text>
        </svg>
      );
    case 'inductor':
      return (
        <svg viewBox="0 0 220 90" className={className} fill="none" aria-label="رمز الملف الكهربائي">
          <line x1="18" y1="52" x2="48" y2="52" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
          <path
            d="M48 52 C48 26, 78 26, 78 52 C78 26, 108 26, 108 52 C108 26, 138 26, 138 52 C138 26, 168 26, 168 52"
            stroke="currentColor"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          <line x1="168" y1="52" x2="202" y2="52" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
          <line x1="50" y1="22" x2="166" y2="22" stroke="currentColor" strokeWidth="2.5" strokeDasharray="6 4" opacity="0.65" />
        </svg>
      );
    case 'diode':
      return (
        <svg viewBox="0 0 220 90" className={className} fill="none" aria-label="رمز الدايود">
          <line x1="22" y1="45" x2="86" y2="45" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
          <polygon points="86,23 86,67 132,45" fill="currentColor" opacity="0.18" stroke="currentColor" strokeWidth="3.5" strokeLinejoin="round" />
          <line x1="134" y1="22" x2="134" y2="68" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
          <line x1="134" y1="45" x2="198" y2="45" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
          <text x="54" y="34" textAnchor="middle" fill="currentColor" className="text-[11px] font-mono">A (+)</text>
          <text x="166" y="34" textAnchor="middle" fill="currentColor" className="text-[11px] font-mono">K (-)</text>
        </svg>
      );
    case 'led':
      return (
        <svg viewBox="0 0 220 95" className={className} fill="none" aria-label="رمز الليد LED">
          <line x1="22" y1="52" x2="84" y2="52" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
          <polygon points="84,30 84,74 130,52" fill="currentColor" opacity="0.2" stroke="currentColor" strokeWidth="3.5" strokeLinejoin="round" />
          <line x1="132" y1="29" x2="132" y2="75" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
          <line x1="132" y1="52" x2="198" y2="52" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
          <path d="M122 24 L138 10 M138 10 L130 10 M138 10 L138 18" stroke="#0284C7" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M142 30 L158 16 M158 16 L150 16 M158 16 L158 24" stroke="#0284C7" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          <text x="52" y="42" textAnchor="middle" fill="currentColor" className="text-[11px] font-mono">A (+)</text>
          <text x="168" y="42" textAnchor="middle" fill="currentColor" className="text-[11px] font-mono">K (-)</text>
        </svg>
      );
    case 'transistor':
      return (
        <svg viewBox="0 0 220 96" className={className} fill="none" aria-label="رمز الترانزستور NPN">
          <circle cx="110" cy="48" r="32" stroke="currentColor" strokeWidth="2.5" opacity="0.45" />
          <line x1="36" y1="48" x2="94" y2="48" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
          <line x1="94" y1="28" x2="94" y2="68" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
          <line x1="94" y1="38" x2="132" y2="18" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
          <line x1="132" y1="18" x2="132" y2="6" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
          <line x1="94" y1="58" x2="132" y2="78" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
          <line x1="132" y1="78" x2="132" y2="90" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
          <polygon points="122,73 114,62 108,71" fill="currentColor" />
          <text x="48" y="38" textAnchor="middle" fill="currentColor" className="text-[11px] font-mono">B</text>
          <text x="148" y="18" textAnchor="middle" fill="currentColor" className="text-[11px] font-mono">C</text>
          <text x="148" y="84" textAnchor="middle" fill="currentColor" className="text-[11px] font-mono">E</text>
        </svg>
      );
    case 'relay':
      return (
        <svg viewBox="0 0 220 95" className={className} fill="none" aria-label="رمز الريليه">
          <rect x="26" y="16" width="168" height="64" rx="8" stroke="currentColor" strokeWidth="2" strokeDasharray="5 4" opacity="0.5" />
          <rect x="44" y="30" width="28" height="36" rx="3" stroke="currentColor" strokeWidth="3" />
          <line x1="58" y1="14" x2="58" y2="30" stroke="currentColor" strokeWidth="3" />
          <line x1="58" y1="66" x2="58" y2="82" stroke="currentColor" strokeWidth="3" />
          <line x1="84" y1="48" x2="110" y2="48" stroke="currentColor" strokeWidth="2" strokeDasharray="3 3" opacity="0.7" />
          <line x1="112" y1="48" x2="148" y2="32" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
          <circle cx="112" cy="48" r="3.5" fill="currentColor" />
          <circle cx="154" cy="30" r="3.5" fill="currentColor" />
          <circle cx="154" cy="66" r="3.5" fill="currentColor" />
          <text x="174" y="34" fill="currentColor" className="text-[10px] font-mono">NC</text>
          <text x="174" y="70" fill="currentColor" className="text-[10px] font-mono">NO</text>
          <text x="108" y="66" textAnchor="middle" fill="currentColor" className="text-[10px] font-mono">COM</text>
        </svg>
      );
    case 'regulator':
      return (
        <svg viewBox="0 0 220 95" className={className} fill="none" aria-label="رمز منظم الجهد">
          <rect x="74" y="20" width="72" height="44" rx="6" fill="currentColor" fillOpacity="0.08" stroke="currentColor" strokeWidth="3" />
          <line x1="24" y1="40" x2="74" y2="40" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
          <line x1="146" y1="40" x2="196" y2="40" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
          <line x1="110" y1="64" x2="110" y2="86" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
          <text x="110" y="46" textAnchor="middle" fill="currentColor" className="text-[12px] font-mono font-bold">7805</text>
          <text x="48" y="30" textAnchor="middle" fill="currentColor" className="text-[10px] font-mono">IN</text>
          <text x="172" y="30" textAnchor="middle" fill="currentColor" className="text-[10px] font-mono">OUT +5V</text>
          <text x="128" y="82" fill="currentColor" className="text-[10px] font-mono">GND</text>
        </svg>
      );
    case 'potentiometer':
      return (
        <svg viewBox="0 0 220 95" className={className} fill="none" aria-label="رمز المقاومة المتغيرة">
          <line x1="22" y1="54" x2="58" y2="54" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
          <path d="M58 54 L68 34 L82 74 L96 34 L110 74 L124 34 L138 74 L148 54" stroke="currentColor" strokeWidth="3.5" strokeLinejoin="round" />
          <line x1="148" y1="54" x2="194" y2="54" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
          <line x1="103" y1="10" x2="103" y2="38" stroke="#0284C7" strokeWidth="3" strokeLinecap="round" />
          <polygon points="103,43 96,31 110,31" fill="#0284C7" />
          <text x="36" y="42" textAnchor="middle" fill="currentColor" className="text-[10px] font-mono">1</text>
          <text x="122" y="20" textAnchor="middle" fill="#0284C7" className="text-[10px] font-mono">2 (Wiper)</text>
          <text x="180" y="42" textAnchor="middle" fill="currentColor" className="text-[10px] font-mono">3</text>
        </svg>
      );
    case 'ic_chip':
      return (
        <svg viewBox="0 0 220 95" className={className} fill="none" aria-label="رمز الدائرة المتكاملة DIP-8">
          <rect x="64" y="18" width="92" height="60" rx="6" fill="currentColor" fillOpacity="0.08" stroke="currentColor" strokeWidth="3" />
          <path d="M100 18 A10 10 0 0 0 120 18" stroke="currentColor" strokeWidth="2.5" />
          {[28, 42, 56, 70].map((y, idx) => (
            <React.Fragment key={y}>
              <line x1="44" y1={y} x2="64" y2={y} stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
              <line x1="156" y1={y} x2="176" y2={y} stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
              <text x="34" y={y + 4} textAnchor="end" fill="currentColor" className="text-[9px] font-mono" opacity="0.7">{idx + 1}</text>
              <text x="186" y={y + 4} textAnchor="start" fill="currentColor" className="text-[9px] font-mono" opacity="0.7">{8 - idx}</text>
            </React.Fragment>
          ))}
          <text x="110" y="53" textAnchor="middle" fill="currentColor" className="text-[12px] font-mono font-bold">NE555</text>
        </svg>
      );
    case 'ldr':
      return (
        <svg viewBox="0 0 220 95" className={className} fill="none" aria-label="رمز المقاومة الضوئية LDR">
          <circle cx="110" cy="52" r="28" stroke="currentColor" strokeWidth="2.5" opacity="0.45" />
          <line x1="20" y1="52" x2="64" y2="52" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
          <path d="M64 52 L72 38 L86 66 L100 38 L114 66 L128 38 L142 66 L150 52" stroke="currentColor" strokeWidth="3" strokeLinejoin="round" />
          <line x1="150" y1="52" x2="200" y2="52" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
          <path d="M60 14 L78 28 M78 28 L70 28 M78 28 L77 20" stroke="#D97706" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M84 10 L102 24 M102 24 L94 24 M102 24 L101 16" stroke="#D97706" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case 'zener':
      return (
        <svg viewBox="0 0 220 90" className={className} fill="none" aria-label="رمز دايود زينر">
          <line x1="22" y1="45" x2="86" y2="45" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
          <polygon points="86,23 86,67 132,45" fill="currentColor" opacity="0.18" stroke="currentColor" strokeWidth="3.5" strokeLinejoin="round" />
          <path d="M124 20 L134 25 L134 65 L144 70" stroke="currentColor" strokeWidth="3.8" strokeLinecap="round" strokeLinejoin="round" />
          <line x1="134" y1="45" x2="198" y2="45" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
          <text x="54" y="34" textAnchor="middle" fill="currentColor" className="text-[11px] font-mono">A</text>
          <text x="166" y="34" textAnchor="middle" fill="currentColor" className="text-[11px] font-mono">K (Vz)</text>
        </svg>
      );
    case 'bridge_rectifier':
      return (
        <svg viewBox="0 0 220 96" className={className} fill="none" aria-label="رمز قنطرة التوحيد">
          <polygon points="110,14 152,48 110,82 68,48" stroke="currentColor" strokeWidth="2.8" fill="currentColor" fillOpacity="0.06" />
          <line x1="28" y1="48" x2="68" y2="48" stroke="currentColor" strokeWidth="3" />
          <line x1="152" y1="48" x2="192" y2="48" stroke="currentColor" strokeWidth="3" />
          <text x="46" y="38" textAnchor="middle" fill="currentColor" className="text-[12px] font-mono">~ AC</text>
          <text x="174" y="38" textAnchor="middle" fill="#0284C7" className="text-[12px] font-mono font-bold">+ DC</text>
          <text x="110" y="52" textAnchor="middle" fill="currentColor" className="text-[10px] font-mono">4×D</text>
        </svg>
      );
    case 'crystal':
      return (
        <svg viewBox="0 0 220 90" className={className} fill="none" aria-label="رمز الكريستالة">
          <line x1="24" y1="45" x2="84" y2="45" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
          <line x1="84" y1="22" x2="84" y2="68" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
          <rect x="96" y="20" width="28" height="50" rx="2" stroke="currentColor" strokeWidth="3" fill="currentColor" fillOpacity="0.1" />
          <line x1="136" y1="22" x2="136" y2="68" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
          <line x1="136" y1="45" x2="196" y2="45" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
          <text x="110" y="13" textAnchor="middle" fill="currentColor" className="text-[10px] font-mono">XTAL (MHz)</text>
        </svg>
      );
    case 'buzzer':
      return (
        <svg viewBox="0 0 220 94" className={className} fill="none" aria-label="رمز البازر">
          <line x1="36" y1="36" x2="84" y2="36" stroke="currentColor" strokeWidth="3" />
          <line x1="36" y1="58" x2="84" y2="58" stroke="currentColor" strokeWidth="3" />
          <path d="M84 22 L126 22 A24 25 0 0 1 126 72 L84 72 Z" stroke="currentColor" strokeWidth="3" fill="currentColor" fillOpacity="0.1" />
          <path d="M148 34 Q162 47 148 60" stroke="#0284C7" strokeWidth="2.8" strokeLinecap="round" />
          <path d="M162 24 Q182 47 162 70" stroke="#0284C7" strokeWidth="2.8" strokeLinecap="round" />
          <text x="58" y="29" textAnchor="middle" fill="currentColor" className="text-[11px] font-mono">+</text>
          <text x="58" y="72" textAnchor="middle" fill="currentColor" className="text-[11px] font-mono">-</text>
        </svg>
      );
    case 'push_button':
      return (
        <svg viewBox="0 0 220 90" className={className} fill="none" aria-label="رمز المفتاح الضاغط">
          <line x1="24" y1="54" x2="78" y2="54" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
          <circle cx="80" cy="54" r="4" fill="currentColor" />
          <circle cx="140" cy="54" r="4" fill="currentColor" />
          <line x1="142" y1="54" x2="196" y2="54" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
          <line x1="76" y1="36" x2="144" y2="36" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
          <line x1="110" y1="16" x2="110" y2="36" stroke="#0284C7" strokeWidth="3" strokeLinecap="round" />
        </svg>
      );
    case 'rocker_switch':
      return (
        <svg viewBox="0 0 220 90" className={className} fill="none" aria-label="رمز مفتاح التشغيل">
          <line x1="24" y1="54" x2="78" y2="54" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
          <circle cx="80" cy="54" r="4" fill="currentColor" />
          <line x1="82" y1="52" x2="136" y2="26" stroke="#0284C7" strokeWidth="3.5" strokeLinecap="round" />
          <circle cx="140" cy="54" r="4" fill="currentColor" />
          <line x1="142" y1="54" x2="196" y2="54" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
          <text x="110" y="76" textAnchor="middle" fill="currentColor" className="text-[10px] font-mono">SPST ON / OFF</text>
        </svg>
      );
    case 'seven_segment':
      return (
        <svg viewBox="0 0 220 96" className={className} fill="none" aria-label="رمز شاشة السبع قطع">
          <rect x="76" y="14" width="68" height="68" rx="6" stroke="currentColor" strokeWidth="2.5" fill="currentColor" fillOpacity="0.06" />
          <line x1="94" y1="24" x2="126" y2="24" stroke="#EF4444" strokeWidth="4" strokeLinecap="round" />
          <line x1="128" y1="28" x2="128" y2="46" stroke="#EF4444" strokeWidth="4" strokeLinecap="round" />
          <line x1="128" y1="52" x2="128" y2="70" stroke="#EF4444" strokeWidth="4" strokeLinecap="round" />
          <line x1="94" y1="74" x2="126" y2="74" stroke="#EF4444" strokeWidth="4" strokeLinecap="round" />
          <line x1="92" y1="52" x2="92" y2="70" stroke="#EF4444" strokeWidth="4" strokeLinecap="round" />
          <line x1="92" y1="28" x2="92" y2="46" stroke="#EF4444" strokeWidth="4" strokeLinecap="round" />
          <line x1="94" y1="49" x2="126" y2="49" stroke="#EF4444" strokeWidth="4" strokeLinecap="round" />
        </svg>
      );
    case 'battery':
      return (
        <svg viewBox="0 0 220 90" className={className} fill="none" aria-label="رمز البطارية">
          <line x1="24" y1="45" x2="88" y2="45" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
          <line x1="88" y1="20" x2="88" y2="70" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
          <line x1="104" y1="33" x2="104" y2="57" stroke="currentColor" strokeWidth="5.5" strokeLinecap="round" />
          <line x1="120" y1="20" x2="120" y2="70" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
          <line x1="136" y1="33" x2="136" y2="57" stroke="currentColor" strokeWidth="5.5" strokeLinecap="round" />
          <line x1="136" y1="45" x2="196" y2="45" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
          <text x="68" y="30" textAnchor="middle" fill="#DC2626" className="text-[13px] font-bold">+</text>
          <text x="154" y="30" textAnchor="middle" fill="currentColor" className="text-[13px] font-bold">-</text>
        </svg>
      );
    case 'pcb':
      return (
        <svg viewBox="0 0 220 90" className={className} fill="none" aria-label="رمز لوحة PCB">
          <rect x="44" y="16" width="132" height="58" rx="6" stroke="#16A34A" strokeWidth="3" fill="#16A34A" fillOpacity="0.1" />
          <path d="M64 34 L96 34 L112 52 L156 52" stroke="#16A34A" strokeWidth="3" strokeLinecap="round" />
          <circle cx="64" cy="34" r="5" fill="#F59E0B" />
          <circle cx="156" cy="52" r="5" fill="#F59E0B" />
          <circle cx="64" cy="56" r="5" fill="#F59E0B" />
          <circle cx="156" cy="32" r="5" fill="#F59E0B" />
        </svg>
      );
    case 'optocoupler':
      return (
        <svg viewBox="0 0 220 94" className={className} fill="none" aria-label="رمز الأوبتوكابلر">
          <rect x="48" y="14" width="124" height="66" rx="6" stroke="currentColor" strokeWidth="2.5" strokeDasharray="4 3" opacity="0.6" />
          <line x1="24" y1="32" x2="68" y2="32" stroke="currentColor" strokeWidth="2.8" />
          <line x1="24" y1="62" x2="68" y2="62" stroke="currentColor" strokeWidth="2.8" />
          <polygon points="62,36 78,36 70,54" stroke="currentColor" strokeWidth="2.2" />
          <line x1="62" y1="54" x2="78" y2="54" stroke="currentColor" strokeWidth="2.5" />
          <path d="M90 42 L110 42 M110 42 L104 38 M110 42 L104 46" stroke="#0284C7" strokeWidth="2.2" />
          <line x1="136" y1="30" x2="136" y2="64" stroke="currentColor" strokeWidth="3.2" />
          <line x1="136" y1="38" x2="160" y2="26" stroke="currentColor" strokeWidth="2.5" />
          <line x1="160" y1="26" x2="196" y2="26" stroke="currentColor" strokeWidth="2.8" />
          <line x1="136" y1="54" x2="160" y2="66" stroke="currentColor" strokeWidth="2.5" />
          <line x1="160" y1="66" x2="196" y2="66" stroke="currentColor" strokeWidth="2.8" />
        </svg>
      );
    case 'ceramic_cap':
      return (
        <svg viewBox="0 0 220 90" className={className} fill="none" aria-label="رمز المكثف غير المستقطب">
          <line x1="20" y1="45" x2="96" y2="45" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
          <line x1="96" y1="20" x2="96" y2="70" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
          <line x1="124" y1="20" x2="124" y2="70" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
          <line x1="124" y1="45" x2="200" y2="45" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
          <text x="110" y="13" textAnchor="middle" fill="currentColor" className="text-[10px] font-mono">C (pF / nF)</text>
        </svg>
      );
    case 'mosfet':
      return (
        <svg viewBox="0 0 220 96" className={className} fill="none" aria-label="رمز الموسفيت N-Channel">
          <circle cx="110" cy="48" r="32" stroke="currentColor" strokeWidth="2.5" opacity="0.45" />
          <line x1="36" y1="62" x2="86" y2="62" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
          <line x1="86" y1="28" x2="86" y2="68" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
          <line x1="96" y1="26" x2="96" y2="38" stroke="currentColor" strokeWidth="3.5" />
          <line x1="96" y1="42" x2="96" y2="54" stroke="currentColor" strokeWidth="3.5" />
          <line x1="96" y1="58" x2="96" y2="70" stroke="currentColor" strokeWidth="3.5" />
          <line x1="96" y1="32" x2="132" y2="32" stroke="currentColor" strokeWidth="3" />
          <line x1="132" y1="32" x2="132" y2="8" stroke="currentColor" strokeWidth="3" />
          <line x1="96" y1="48" x2="132" y2="48" stroke="currentColor" strokeWidth="2.5" />
          <line x1="96" y1="64" x2="132" y2="64" stroke="currentColor" strokeWidth="3" />
          <line x1="132" y1="48" x2="132" y2="88" stroke="currentColor" strokeWidth="3" />
          <text x="48" y="54" textAnchor="middle" fill="currentColor" className="text-[11px] font-mono">G</text>
          <text x="148" y="20" textAnchor="middle" fill="currentColor" className="text-[11px] font-mono">D</text>
          <text x="148" y="84" textAnchor="middle" fill="currentColor" className="text-[11px] font-mono">S</text>
        </svg>
      );
    case 'scr':
      return (
        <svg viewBox="0 0 220 90" className={className} fill="none" aria-label="رمز الثايرستور SCR">
          <line x1="22" y1="45" x2="86" y2="45" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
          <polygon points="86,23 86,67 132,45" fill="currentColor" opacity="0.18" stroke="currentColor" strokeWidth="3.5" strokeLinejoin="round" />
          <line x1="134" y1="22" x2="134" y2="68" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
          <line x1="134" y1="45" x2="198" y2="45" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
          <path d="M134 55 L154 74 L176 74" stroke="#0284C7" strokeWidth="3" strokeLinecap="round" />
          <text x="54" y="34" textAnchor="middle" fill="currentColor" className="text-[11px] font-mono">A</text>
          <text x="166" y="34" textAnchor="middle" fill="currentColor" className="text-[11px] font-mono">K</text>
          <text x="184" y="78" textAnchor="start" fill="#0284C7" className="text-[11px] font-mono">G</text>
        </svg>
      );
    case 'triac':
      return (
        <svg viewBox="0 0 220 96" className={className} fill="none" aria-label="رمز الترياك TRIAC">
          <line x1="26" y1="48" x2="78" y2="48" stroke="currentColor" strokeWidth="3.5" />
          <polygon points="78,24 78,52 138,38" stroke="currentColor" strokeWidth="2.8" fill="currentColor" fillOpacity="0.14" />
          <polygon points="138,44 138,72 78,58" stroke="currentColor" strokeWidth="2.8" fill="currentColor" fillOpacity="0.14" />
          <line x1="78" y1="24" x2="78" y2="72" stroke="currentColor" strokeWidth="3" />
          <line x1="138" y1="24" x2="138" y2="72" stroke="currentColor" strokeWidth="3" />
          <line x1="138" y1="48" x2="194" y2="48" stroke="currentColor" strokeWidth="3.5" />
          <path d="M138 64 L156 80 L176 80" stroke="#0284C7" strokeWidth="2.8" strokeLinecap="round" />
          <text x="48" y="38" textAnchor="middle" fill="currentColor" className="text-[10px] font-mono">MT1</text>
          <text x="172" y="38" textAnchor="middle" fill="currentColor" className="text-[10px] font-mono">MT2</text>
          <text x="182" y="84" textAnchor="start" fill="#0284C7" className="text-[10px] font-mono">G</text>
        </svg>
      );
    case 'schottky_diode':
      return (
        <svg viewBox="0 0 220 90" className={className} fill="none" aria-label="رمز دايود شوتكي">
          <line x1="22" y1="45" x2="86" y2="45" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
          <polygon points="86,23 86,67 132,45" fill="currentColor" opacity="0.18" stroke="currentColor" strokeWidth="3.5" strokeLinejoin="round" />
          <path d="M122 28 L122 20 L134 20 L134 70 L146 70 L146 62" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
          <line x1="134" y1="45" x2="198" y2="45" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
          <text x="54" y="34" textAnchor="middle" fill="currentColor" className="text-[11px] font-mono">A</text>
          <text x="166" y="34" textAnchor="middle" fill="currentColor" className="text-[11px] font-mono">K (Vf~0.3V)</text>
        </svg>
      );
    case 'timer_555':
      return (
        <svg viewBox="0 0 220 95" className={className} fill="none" aria-label="رمز مؤقت NE555">
          <rect x="64" y="16" width="92" height="64" rx="6" fill="currentColor" fillOpacity="0.08" stroke="currentColor" strokeWidth="3" />
          {[28, 42, 56, 70].map((y, idx) => (
            <React.Fragment key={y}>
              <line x1="42" y1={y} x2="64" y2={y} stroke="currentColor" strokeWidth="2.8" />
              <line x1="156" y1={y} x2="178" y2={y} stroke="currentColor" strokeWidth="2.8" />
              <text x="34" y={y + 4} textAnchor="end" fill="currentColor" className="text-[9px] font-mono">{idx + 1}</text>
              <text x="186" y={y + 4} textAnchor="start" fill="currentColor" className="text-[9px] font-mono">{8 - idx}</text>
            </React.Fragment>
          ))}
          <text x="110" y="52" textAnchor="middle" fill="#0284C7" className="text-[13px] font-mono font-bold">555</text>
        </svg>
      );
    case 'opamp':
      return (
        <svg viewBox="0 0 220 94" className={className} fill="none" aria-label="رمز مكبر العمليات Op-Amp">
          <polygon points="68,16 68,78 158,47" stroke="currentColor" strokeWidth="3.2" fill="currentColor" fillOpacity="0.08" strokeLinejoin="round" />
          <line x1="28" y1="34" x2="68" y2="34" stroke="currentColor" strokeWidth="3" />
          <line x1="28" y1="60" x2="68" y2="60" stroke="currentColor" strokeWidth="3" />
          <line x1="158" y1="47" x2="196" y2="47" stroke="currentColor" strokeWidth="3" />
          <text x="80" y="39" fill="currentColor" className="text-[13px] font-bold">+</text>
          <text x="80" y="65" fill="currentColor" className="text-[14px] font-bold">-</text>
          <text x="178" y="38" textAnchor="middle" fill="#0284C7" className="text-[10px] font-mono">OUT</text>
        </svg>
      );
    case 'thermistor':
      return (
        <svg viewBox="0 0 220 94" className={className} fill="none" aria-label="رمز الثرمستور الحراري">
          <line x1="22" y1="48" x2="66" y2="48" stroke="currentColor" strokeWidth="3.5" />
          <rect x="66" y="34" width="88" height="28" rx="3" stroke="currentColor" strokeWidth="3" fill="currentColor" fillOpacity="0.08" />
          <line x1="154" y1="48" x2="198" y2="48" stroke="currentColor" strokeWidth="3.5" />
          <path d="M58 72 L152 22 L172 22" stroke="#D97706" strokeWidth="2.8" strokeLinecap="round" />
          <text x="110" y="16" textAnchor="middle" fill="#D97706" className="text-[11px] font-mono font-bold">-t° NTC</text>
        </svg>
      );
    case 'ir_receiver':
      return (
        <svg viewBox="0 0 220 94" className={className} fill="none" aria-label="رمز مستقبل الأشعة تحت الحمراء">
          <rect x="74" y="20" width="72" height="54" rx="6" stroke="currentColor" strokeWidth="2.8" fill="currentColor" fillOpacity="0.08" />
          <line x1="88" y1="74" x2="88" y2="88" stroke="currentColor" strokeWidth="3" />
          <line x1="110" y1="74" x2="110" y2="88" stroke="currentColor" strokeWidth="3" />
          <line x1="132" y1="74" x2="132" y2="88" stroke="currentColor" strokeWidth="3" />
          <path d="M36 32 L58 44 M58 44 L50 45 M58 44 L55 36" stroke="#0284C7" strokeWidth="2.4" strokeLinecap="round" />
          <text x="110" y="50" textAnchor="middle" fill="currentColor" className="text-[11px] font-mono font-bold">IR 38kHz</text>
        </svg>
      );
    case 'reed_switch':
      return (
        <svg viewBox="0 0 220 90" className={className} fill="none" aria-label="رمز المفتاح المغناطيسي">
          <ellipse cx="110" cy="45" rx="48" ry="18" stroke="#0284C7" strokeWidth="2.5" fill="#0284C7" fillOpacity="0.07" />
          <line x1="22" y1="45" x2="112" y2="41" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
          <line x1="198" y1="45" x2="106" y2="51" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
          <text x="110" y="18" textAnchor="middle" fill="currentColor" className="text-[10px] font-mono">REED (N/S)</text>
        </svg>
      );
    case 'transformer':
      return (
        <svg viewBox="0 0 220 94" className={className} fill="none" aria-label="رمز المحول الكهربائي">
          <path d="M56 22 C74 22, 74 37, 56 37 C74 37, 74 52, 56 52 C74 52, 74 67, 56 67" stroke="currentColor" strokeWidth="3" />
          <line x1="24" y1="22" x2="56" y2="22" stroke="currentColor" strokeWidth="3" />
          <line x1="24" y1="67" x2="56" y2="67" stroke="currentColor" strokeWidth="3" />
          <line x1="103" y1="16" x2="103" y2="74" stroke="currentColor" strokeWidth="3" />
          <line x1="115" y1="16" x2="115" y2="74" stroke="currentColor" strokeWidth="3" />
          <path d="M162 24 C144 24, 144 45, 162 45 C144 45, 144 66, 162 66" stroke="currentColor" strokeWidth="3" />
          <line x1="162" y1="24" x2="196" y2="24" stroke="currentColor" strokeWidth="3" />
          <line x1="162" y1="66" x2="196" y2="66" stroke="currentColor" strokeWidth="3" />
        </svg>
      );
    case 'varistor':
      return (
        <svg viewBox="0 0 220 90" className={className} fill="none" aria-label="رمز الفاريستور MOV">
          <line x1="22" y1="45" x2="66" y2="45" stroke="currentColor" strokeWidth="3.5" />
          <rect x="66" y="31" width="88" height="28" rx="3" stroke="currentColor" strokeWidth="3" fill="currentColor" fillOpacity="0.08" />
          <line x1="154" y1="45" x2="198" y2="45" stroke="currentColor" strokeWidth="3.5" />
          <path d="M60 68 L84 68 L138 22 L160 22" stroke="#0284C7" strokeWidth="2.8" strokeLinecap="round" />
          <text x="110" y="16" textAnchor="middle" fill="currentColor" className="text-[10px] font-mono">MOV (U)</text>
        </svg>
      );
    case 'dc_motor':
      return (
        <svg viewBox="0 0 220 94" className={className} fill="none" aria-label="رمز المحرك الكهربائي">
          <line x1="28" y1="47" x2="72" y2="47" stroke="currentColor" strokeWidth="3.5" />
          <rect x="70" y="37" width="10" height="20" fill="currentColor" />
          <circle cx="110" cy="47" r="28" stroke="currentColor" strokeWidth="3" fill="currentColor" fillOpacity="0.08" />
          <rect x="140" y="37" width="10" height="20" fill="currentColor" />
          <line x1="148" y1="47" x2="192" y2="47" stroke="currentColor" strokeWidth="3.5" />
          <text x="110" y="53" textAnchor="middle" fill="currentColor" className="text-[18px] font-mono font-bold">M</text>
        </svg>
      );
    case 'speaker':
      return (
        <svg viewBox="0 0 220 94" className={className} fill="none" aria-label="رمز السماعة">
          <line x1="36" y1="36" x2="80" y2="36" stroke="currentColor" strokeWidth="3" />
          <line x1="36" y1="58" x2="80" y2="58" stroke="currentColor" strokeWidth="3" />
          <rect x="80" y="28" width="24" height="38" stroke="currentColor" strokeWidth="3" fill="currentColor" fillOpacity="0.1" />
          <polygon points="104,28 140,12 140,82 104,66" stroke="currentColor" strokeWidth="3" fill="currentColor" fillOpacity="0.06" />
          <path d="M154 34 Q168 47 154 60" stroke="#0284C7" strokeWidth="2.8" strokeLinecap="round" />
        </svg>
      );
    case 'microphone':
      return (
        <svg viewBox="0 0 220 94" className={className} fill="none" aria-label="رمز الميكروفون">
          <line x1="34" y1="36" x2="86" y2="36" stroke="currentColor" strokeWidth="3" />
          <line x1="34" y1="58" x2="86" y2="58" stroke="currentColor" strokeWidth="3" />
          <circle cx="118" cy="47" r="26" stroke="currentColor" strokeWidth="3" fill="currentColor" fillOpacity="0.08" />
          <line x1="92" y1="21" x2="92" y2="73" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
          <text x="118" y="51" textAnchor="middle" fill="currentColor" className="text-[11px] font-mono">MIC</text>
        </svg>
      );
    case 'lcd_display':
      return (
        <svg viewBox="0 0 220 94" className={className} fill="none" aria-label="رمز شاشة LCD">
          <rect x="44" y="18" width="132" height="58" rx="6" stroke="currentColor" strokeWidth="3" fill="currentColor" fillOpacity="0.08" />
          <rect x="56" y="28" width="108" height="36" rx="3" stroke="#0284C7" strokeWidth="2.2" />
          <text x="110" y="50" textAnchor="middle" fill="#0284C7" className="text-[11px] font-mono font-bold">LCD 16×2</text>
        </svg>
      );
    case 'igbt':
      return (
        <svg viewBox="0 0 220 96" className={className} fill="none" aria-label="رمز ترانزستور IGBT">
          <circle cx="110" cy="48" r="32" stroke="currentColor" strokeWidth="2.5" opacity="0.45" />
          <line x1="36" y1="62" x2="86" y2="62" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
          <line x1="86" y1="28" x2="86" y2="66" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
          <line x1="98" y1="26" x2="98" y2="68" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
          <line x1="98" y1="38" x2="132" y2="18" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" />
          <line x1="132" y1="18" x2="132" y2="6" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" />
          <line x1="98" y1="58" x2="132" y2="78" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" />
          <line x1="132" y1="78" x2="132" y2="90" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" />
          <polygon points="124,74 116,63 110,72" fill="currentColor" />
          <text x="48" y="54" textAnchor="middle" fill="#059669" className="text-[11px] font-mono font-bold">G</text>
          <text x="148" y="18" textAnchor="middle" fill="currentColor" className="text-[11px] font-mono font-bold">C</text>
          <text x="148" y="84" textAnchor="middle" fill="currentColor" className="text-[11px] font-mono font-bold">E</text>
        </svg>
      );
    case 'dual_schottky':
      return (
        <svg viewBox="0 0 220 96" className={className} fill="none" aria-label="رمز الدايود شوتكي المزدوج">
          <line x1="20" y1="48" x2="62" y2="48" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
          <polygon points="62,32 62,64 94,48" fill="currentColor" fillOpacity="0.18" stroke="currentColor" strokeWidth="2.8" strokeLinejoin="round" />
          <path d="M88 35 L88 29 L96 29 L96 67 L104 67 L104 61" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
          <line x1="96" y1="48" x2="124" y2="48" stroke="currentColor" strokeWidth="3" />
          <line x1="110" y1="48" x2="110" y2="86" stroke="#059669" strokeWidth="3.2" strokeLinecap="round" />
          <path d="M116 61 L116 67 L124 67 L124 29 L132 29 L132 35" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
          <polygon points="158,32 158,64 126,48" fill="currentColor" fillOpacity="0.18" stroke="currentColor" strokeWidth="2.8" strokeLinejoin="round" />
          <line x1="158" y1="48" x2="200" y2="48" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
          <text x="32" y="38" textAnchor="middle" fill="currentColor" className="text-[10px] font-mono">A1</text>
          <text x="188" y="38" textAnchor="middle" fill="currentColor" className="text-[10px] font-mono">A2</text>
          <text x="128" y="84" textAnchor="start" fill="#059669" className="text-[10px] font-mono font-bold">K (Common)</text>
        </svg>
      );
    case 'ultrasonic_hcsr04':
      return (
        <svg viewBox="0 0 220 96" className={className} fill="none" aria-label="رمز حساس المسافة HC-SR04">
          <rect x="52" y="16" width="116" height="54" rx="6" stroke="currentColor" strokeWidth="2.8" fill="currentColor" fillOpacity="0.07" />
          {[74, 98, 122, 146].map((x) => (
            <line key={x} x1={x} y1="70" x2={x} y2="88" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" />
          ))}
          <text x="110" y="42" textAnchor="middle" fill="currentColor" className="text-[11px] font-mono font-bold">HC-SR04</text>
          <text x="110" y="56" textAnchor="middle" fill="#059669" className="text-[9px] font-mono">40kHz SONAR</text>
          <path d="M180 30 Q192 43 180 56" stroke="#059669" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M192 22 Q208 43 192 64" stroke="#059669" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      );
    case 'dht_sensor':
      return (
        <svg viewBox="0 0 220 96" className={className} fill="none" aria-label="رمز حساس الحرارة والرطوبة DHT">
          <rect x="64" y="16" width="92" height="54" rx="6" stroke="currentColor" strokeWidth="2.8" fill="currentColor" fillOpacity="0.07" />
          {[82, 100, 118, 136].map((x) => (
            <line key={x} x1={x} y1="70" x2={x} y2="88" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" />
          ))}
          <text x="110" y="40" textAnchor="middle" fill="currentColor" className="text-[11px] font-mono font-bold">DHT11/22</text>
          <text x="110" y="56" textAnchor="middle" fill="#D97706" className="text-[10px] font-mono">°C / %RH</text>
        </svg>
      );
    case 'pir_sensor':
      return (
        <svg viewBox="0 0 220 96" className={className} fill="none" aria-label="رمز حساس الحركة PIR">
          <rect x="64" y="20" width="92" height="50" rx="6" stroke="currentColor" strokeWidth="2.8" fill="currentColor" fillOpacity="0.07" />
          {[84, 110, 136].map((x) => (
            <line key={x} x1={x} y1="70" x2={x} y2="88" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" />
          ))}
          <path d="M32 30 L56 42 M56 42 L48 44 M56 42 L53 34" stroke="#D97706" strokeWidth="2.4" strokeLinecap="round" />
          <path d="M32 52 L56 56 M56 56 L49 60 M56 56 L51 50" stroke="#D97706" strokeWidth="2.4" strokeLinecap="round" />
          <text x="110" y="48" textAnchor="middle" fill="currentColor" className="text-[11px] font-mono font-bold">PIR SENSOR</text>
        </svg>
      );
    case 'servo_sg90':
      return (
        <svg viewBox="0 0 220 96" className={className} fill="none" aria-label="رمز محرك السيرفو SG90">
          <circle cx="118" cy="48" r="28" stroke="currentColor" strokeWidth="3" fill="currentColor" fillOpacity="0.08" />
          <line x1="28" y1="34" x2="92" y2="34" stroke="#F59E0B" strokeWidth="2.8" />
          <line x1="28" y1="48" x2="90" y2="48" stroke="#DC2626" strokeWidth="2.8" />
          <line x1="28" y1="62" x2="92" y2="62" stroke="currentColor" strokeWidth="2.8" />
          <text x="118" y="53" textAnchor="middle" fill="currentColor" className="text-[13px] font-mono font-bold">M</text>
          <path d="M154 28 A26 26 0 0 1 154 68" stroke="#059669" strokeWidth="2.5" strokeLinecap="round" />
          <polygon points="154,23 148,32 159,32" fill="#059669" />
          <text x="54" y="28" textAnchor="middle" fill="#D97706" className="text-[9px] font-mono">PWM</text>
        </svg>
      );
    case 'supercapacitor':
      return (
        <svg viewBox="0 0 220 90" className={className} fill="none" aria-label="رمز المكثف الفائق Supercapacitor">
          <line x1="20" y1="45" x2="92" y2="45" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
          <rect x="92" y="20" width="8" height="50" rx="2" fill="currentColor" />
          <rect x="118" y="20" width="8" height="50" rx="2" fill="#059669" />
          <line x1="126" y1="45" x2="200" y2="45" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
          <text x="70" y="30" textAnchor="middle" fill="#059669" className="text-[14px] font-bold">+</text>
          <text x="150" y="30" textAnchor="middle" fill="currentColor" className="text-[14px] font-bold">-</text>
          <text x="110" y="84" textAnchor="middle" fill="currentColor" className="text-[10px] font-mono">EDLC (F)</text>
        </svg>
      );
    case 'fuse':
    default:
      return (
        <svg viewBox="0 0 220 90" className={className} fill="none" aria-label="رمز الفيوز">
          <line x1="20" y1="45" x2="68" y2="45" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
          <rect x="68" y="30" width="84" height="30" rx="4" stroke="currentColor" strokeWidth="3" />
          <line x1="68" y1="45" x2="152" y2="45" stroke="currentColor" strokeWidth="2.5" />
          <line x1="152" y1="45" x2="200" y2="45" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
          <text x="110" y="20" textAnchor="middle" fill="currentColor" className="text-[11px] font-mono">FUSE (A)</text>
        </svg>
      );
  }
};
