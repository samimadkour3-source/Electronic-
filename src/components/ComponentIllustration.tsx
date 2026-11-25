import React from 'react';

interface ComponentIllustrationProps {
  componentId: string;
  className?: string;
}

export const ComponentIllustration: React.FC<ComponentIllustrationProps> = ({
  componentId,
  className = 'h-full w-full',
}) => {
  switch (componentId) {
    case 'bridge_rectifier':
      return (
        <svg viewBox="0 0 400 300" className={className} aria-label="قنطرة التوحيد RS207">
          <defs>
            <linearGradient id="bg-bench" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#E2E8F0" />
              <stop offset="100%" stopColor="#CBD5E1" />
            </linearGradient>
            <linearGradient id="metal-pin" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#94A3B8" />
              <stop offset="50%" stopColor="#F1F5F9" />
              <stop offset="100%" stopColor="#64748B" />
            </linearGradient>
          </defs>
          <rect width="400" height="300" fill="url(#bg-bench)" />
          <ellipse cx="200" cy="238" rx="88" ry="14" fill="#64748B" opacity="0.25" />
          {/* 4 Pins */}
          <rect x="132" y="165" width="10" height="72" rx="3" fill="url(#metal-pin)" />
          <rect x="174" y="165" width="10" height="72" rx="3" fill="url(#metal-pin)" />
          <rect x="216" y="165" width="10" height="72" rx="3" fill="url(#metal-pin)" />
          <rect x="258" y="165" width="10" height="72" rx="3" fill="url(#metal-pin)" />
          {/* Package Body */}
          <path d="M114 78 L272 78 L286 92 L286 172 L114 172 Z" fill="#1E293B" stroke="#0F172A" strokeWidth="3" />
          <rect x="122" y="84" width="148" height="4" fill="#334155" opacity="0.7" />
          <text x="200" y="114" textAnchor="middle" fill="#CBD5E1" className="text-[18px] font-mono font-bold">RS207</text>
          <text x="200" y="135" textAnchor="middle" fill="#94A3B8" className="text-[12px] font-mono">BRIDGE 2A 1000V</text>
          {/* Pin Labels */}
          <text x="137" y="160" textAnchor="middle" fill="#38BDF8" className="text-[15px] font-mono font-bold">+</text>
          <text x="179" y="160" textAnchor="middle" fill="#E2E8F0" className="text-[15px] font-mono font-bold">~</text>
          <text x="221" y="160" textAnchor="middle" fill="#E2E8F0" className="text-[15px] font-mono font-bold">~</text>
          <text x="263" y="160" textAnchor="middle" fill="#F87171" className="text-[16px] font-mono font-bold">-</text>
        </svg>
      );

    case 'crystal':
      return (
        <svg viewBox="0 0 400 300" className={className} aria-label="كريستالة المذبذب">
          <defs>
            <linearGradient id="bg-cry" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#E2E8F0" />
              <stop offset="100%" stopColor="#CBD5E1" />
            </linearGradient>
            <linearGradient id="chrome" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#94A3B8" />
              <stop offset="35%" stopColor="#F8FAFC" />
              <stop offset="70%" stopColor="#CBD5E1" />
              <stop offset="100%" stopColor="#64748B" />
            </linearGradient>
          </defs>
          <rect width="400" height="300" fill="url(#bg-cry)" />
          <ellipse cx="200" cy="242" rx="76" ry="12" fill="#64748B" opacity="0.25" />
          {/* Two Leads */}
          <rect x="164" y="166" width="8" height="72" rx="3" fill="#94A3B8" />
          <rect x="228" y="166" width="8" height="72" rx="3" fill="#94A3B8" />
          {/* Base Flange */}
          <rect x="130" y="152" width="140" height="16" rx="6" fill="#64748B" stroke="#475569" strokeWidth="2" />
          {/* Metal Can HC-49S */}
          <rect x="138" y="76" width="124" height="78" rx="36" fill="url(#chrome)" stroke="#64748B" strokeWidth="2.5" />
          <text x="200" y="114" textAnchor="middle" fill="#1E293B" className="text-[16px] font-mono font-bold">16.000</text>
          <text x="200" y="134" textAnchor="middle" fill="#475569" className="text-[12px] font-mono font-semibold">MHz HC-49</text>
        </svg>
      );

    case 'buzzer':
      return (
        <svg viewBox="0 0 400 300" className={className} aria-label="البازر الإلكتروني">
          <defs>
            <linearGradient id="bg-buz" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#E2E8F0" />
              <stop offset="100%" stopColor="#CBD5E1" />
            </linearGradient>
            <radialGradient id="buz-top" cx="40%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#334155" />
              <stop offset="100%" stopColor="#0F172A" />
            </radialGradient>
          </defs>
          <rect width="400" height="300" fill="url(#bg-buz)" />
          <ellipse cx="200" cy="236" rx="82" ry="14" fill="#475569" opacity="0.28" />
          {/* Leads */}
          <rect x="172" y="185" width="7" height="50" rx="2" fill="#94A3B8" />
          <rect x="221" y="185" width="7" height="42" rx="2" fill="#94A3B8" />
          {/* Cylindrical Side */}
          <path d="M130 120 L130 182 A70 22 0 0 0 270 182 L270 120 Z" fill="#0F172A" />
          {/* Top Face */}
          <ellipse cx="200" cy="120" rx="70" ry="30" fill="url(#buz-top)" stroke="#475569" strokeWidth="2.5" />
          {/* Sound Hole */}
          <ellipse cx="200" cy="120" rx="14" ry="7" fill="#020617" stroke="#64748B" strokeWidth="2" />
          {/* Polarity + Sticker */}
          <circle cx="155" cy="118" r="9" fill="none" stroke="#E2E8F0" strokeWidth="1.8" />
          <text x="155" y="122" textAnchor="middle" fill="#E2E8F0" className="text-[12px] font-bold">+</text>
          <text x="200" y="172" textAnchor="middle" fill="#94A3B8" className="text-[11px] font-mono">5V ACTIVE BUZZER</text>
        </svg>
      );

    case 'push_button':
      return (
        <svg viewBox="0 0 400 300" className={className} aria-label="المفتاح الضاغط Tactile Switch">
          <defs>
            <linearGradient id="bg-btn" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#E2E8F0" />
              <stop offset="100%" stopColor="#CBD5E1" />
            </linearGradient>
          </defs>
          <rect width="400" height="300" fill="url(#bg-btn)" />
          <ellipse cx="200" cy="234" rx="76" ry="12" fill="#64748B" opacity="0.25" />
          {/* 4 Gull-wing Pins */}
          <path d="M138 175 L122 175 L122 222 L134 222 L134 188 L146 188" fill="#94A3B8" stroke="#64748B" strokeWidth="1.5" />
          <path d="M262 175 L278 175 L278 222 L266 222 L266 188 L254 188" fill="#94A3B8" stroke="#64748B" strokeWidth="1.5" />
          {/* Plastic Base */}
          <rect x="138" y="138" width="124" height="58" rx="6" fill="#1E293B" stroke="#0F172A" strokeWidth="2.5" />
          {/* Metallic Top Cover */}
          <rect x="142" y="128" width="116" height="22" rx="4" fill="#CBD5E1" stroke="#64748B" strokeWidth="2" />
          {/* Corner Rivets */}
          <circle cx="154" cy="139" r="4" fill="#64748B" />
          <circle cx="246" cy="139" r="4" fill="#64748B" />
          {/* Plunger Button */}
          <rect x="176" y="92" width="48" height="38" rx="6" fill="#0F172A" stroke="#334155" strokeWidth="2" />
          <ellipse cx="200" cy="94" rx="22" ry="6" fill="#334155" />
          <text x="200" y="176" textAnchor="middle" fill="#94A3B8" className="text-[11px] font-mono">TACTILE 6x6mm</text>
        </svg>
      );

    case 'rocker_switch':
      return (
        <svg viewBox="0 0 400 300" className={className} aria-label="مفتاح التشغيل Rocker Switch">
          <defs>
            <linearGradient id="bg-rock" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#E2E8F0" />
              <stop offset="100%" stopColor="#CBD5E1" />
            </linearGradient>
          </defs>
          <rect width="400" height="300" fill="url(#bg-rock)" />
          <ellipse cx="200" cy="242" rx="70" ry="12" fill="#475569" opacity="0.25" />
          {/* Brass Terminals */}
          <rect x="164" y="188" width="12" height="46" rx="2" fill="#D97706" stroke="#92400E" strokeWidth="1.5" />
          <rect x="224" y="188" width="12" height="46" rx="2" fill="#D97706" stroke="#92400E" strokeWidth="1.5" />
          {/* Switch Housing */}
          <rect x="142" y="106" width="116" height="86" rx="6" fill="#1E293B" stroke="#0F172A" strokeWidth="2.5" />
          {/* Bezel */}
          <rect x="130" y="96" width="140" height="22" rx="5" fill="#0F172A" />
          {/* Tilted Red Rocker */}
          <polygon points="146,96 248,68 254,96" fill="#DC2626" stroke="#991B1B" strokeWidth="2" />
          <text x="174" y="92" fill="#FFFFFF" className="text-[12px] font-mono font-bold">I</text>
          <text x="234" y="88" fill="#FEE2E2" className="text-[12px] font-mono font-bold">O</text>
          <text x="200" y="156" textAnchor="middle" fill="#94A3B8" className="text-[12px] font-mono">6A 250VAC</text>
        </svg>
      );

    case 'seven_segment':
      return (
        <svg viewBox="0 0 400 300" className={className} aria-label="شاشة السبع قطع 7-Segment">
          <defs>
            <linearGradient id="bg-7seg" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#E2E8F0" />
              <stop offset="100%" stopColor="#CBD5E1" />
            </linearGradient>
          </defs>
          <rect width="400" height="300" fill="url(#bg-7seg)" />
          <ellipse cx="200" cy="248" rx="84" ry="12" fill="#475569" opacity="0.25" />
          {/* Bottom Pins */}
          {[156, 178, 200, 222, 244].map((x) => (
            <rect key={x} x={x - 3} y="216" width="6" height="28" rx="2" fill="#94A3B8" />
          ))}
          {/* Black Display Body */}
          <rect x="134" y="48" width="132" height="172" rx="8" fill="#1E293B" stroke="#0F172A" strokeWidth="3" />
          <rect x="144" y="58" width="112" height="152" rx="4" fill="#0F172A" />
          {/* 7 Lit Segments showing "8." */}
          <g fill="#EF4444">
            {/* a */}<polygon points="172,72 222,72 216,82 178,82" />
            {/* b */}<polygon points="226,76 234,84 228,128 220,122" />
            {/* c */}<polygon points="222,136 228,144 222,188 214,180" />
            {/* d */}<polygon points="164,184 214,184 218,194 158,194" />
            {/* e */}<polygon points="162,136 170,142 164,182 156,188" />
            {/* f */}<polygon points="166,76 174,84 168,124 160,130" />
            {/* g */}<polygon points="170,128 218,128 222,133 216,138 168,138 164,133" />
            {/* dp */}<circle cx="240" cy="190" r="6" />
          </g>
        </svg>
      );

    case 'battery':
      return (
        <svg viewBox="0 0 400 300" className={className} aria-label="البطارية وبطارية الشحن">
          <defs>
            <linearGradient id="bg-bat" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#E2E8F0" />
              <stop offset="100%" stopColor="#CBD5E1" />
            </linearGradient>
            <linearGradient id="liion" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#38BDF8" />
              <stop offset="50%" stopColor="#0284C7" />
              <stop offset="100%" stopColor="#0369A1" />
            </linearGradient>
          </defs>
          <rect width="400" height="300" fill="url(#bg-bat)" />
          <ellipse cx="145" cy="238" rx="68" ry="12" fill="#475569" opacity="0.25" />
          <ellipse cx="275" cy="238" rx="60" ry="12" fill="#475569" opacity="0.25" />

          {/* 9V Battery on Left */}
          <rect x="94" y="88" width="96" height="145" rx="10" fill="#0F172A" stroke="#334155" strokeWidth="2.5" />
          <rect x="94" y="88" width="96" height="46" rx="8" fill="#D97706" />
          <rect x="114" y="72" width="16" height="16" rx="3" fill="#CBD5E1" />
          <polygon points="150,70 168,70 164,88 154,88" fill="#94A3B8" />
          <text x="142" y="118" textAnchor="middle" fill="#0F172A" className="text-[18px] font-mono font-extrabold">9V</text>
          <text x="142" y="176" textAnchor="middle" fill="#F8FAFC" className="text-[12px] font-mono font-bold">ALKALINE</text>
          <text x="122" y="102" textAnchor="middle" fill="#0F172A" className="text-[12px] font-bold">+</text>
          <text x="160" y="102" textAnchor="middle" fill="#0F172A" className="text-[12px] font-bold">-</text>

          {/* 18650 Li-ion Rechargeable on Right */}
          <rect x="232" y="70" width="84" height="163" rx="14" fill="url(#liion)" stroke="#075985" strokeWidth="2" />
          <rect x="258" y="60" width="32" height="10" rx="3" fill="#CBD5E1" />
          <rect x="232" y="82" width="84" height="14" fill="#E0F2FE" opacity="0.45" />
          <text x="274" y="148" textAnchor="middle" fill="#FFFFFF" className="text-[15px] font-mono font-bold">18650</text>
          <text x="274" y="168" textAnchor="middle" fill="#E0F2FE" className="text-[12px] font-mono">3.7V Li-Ion</text>
          <text x="274" y="186" textAnchor="middle" fill="#BAE6FD" className="text-[11px] font-mono">2600mAh</text>
        </svg>
      );

    case 'pcb':
      return (
        <svg viewBox="0 0 400 300" className={className} aria-label="لوحة الدوائر المطبوعة PCB">
          <defs>
            <linearGradient id="bg-pcb" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#E2E8F0" />
              <stop offset="100%" stopColor="#CBD5E1" />
            </linearGradient>
          </defs>
          <rect width="400" height="300" fill="url(#bg-pcb)" />
          <rect x="64" y="54" width="276" height="196" rx="12" fill="#0F172A" opacity="0.18" />
          {/* Green Solder Mask Board */}
          <rect x="60" y="48" width="276" height="196" rx="12" fill="#15803D" stroke="#166534" strokeWidth="3" />
          {/* Mounting Holes */}
          {[
            [78, 66],
            [318, 66],
            [78, 226],
            [318, 226],
          ].map(([cx, cy], idx) => (
            <g key={idx}>
              <circle cx={cx} cy={cy} r="9" fill="#FBBF24" />
              <circle cx={cx} cy={cy} r="5" fill="#CBD5E1" />
            </g>
          ))}
          {/* Copper Traces */}
          <g stroke="#22C55E" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <path d="M110 95 L155 95 L175 115 L235 115" />
            <path d="M110 130 L145 130 L165 150 L250 150" />
            <path d="M110 165 L140 165 L165 190 L285 190" />
            <path d="M235 85 L285 85 L285 150" />
          </g>
          {/* Gold Solder Pads */}
          {[
            [110, 95], [110, 130], [110, 165],
            [235, 115], [250, 150], [285, 190],
            [235, 85], [285, 150],
          ].map(([cx, cy], idx) => (
            <g key={idx}>
              <circle cx={cx} cy={cy} r="8" fill="#FBBF24" stroke="#B45309" strokeWidth="1.5" />
              <circle cx={cx} cy={cy} r="3" fill="#0F172A" />
            </g>
          ))}
          {/* Silkscreen Chip Footprint */}
          <rect x="170" y="88" width="52" height="84" rx="4" fill="none" stroke="#FFFFFF" strokeWidth="1.8" strokeDasharray="4 3" opacity="0.85" />
          <text x="196" y="135" textAnchor="middle" fill="#FFFFFF" className="text-[11px] font-mono font-bold">U1 PCB</text>
        </svg>
      );

    case 'ceramic_cap':
      return (
        <svg viewBox="0 0 400 300" className={className} aria-label="المكثف السيراميكي">
          <rect width="400" height="300" fill="#E2E8F0" />
          <ellipse cx="200" cy="242" rx="68" ry="12" fill="#475569" opacity="0.22" />
          <rect x="176" y="166" width="8" height="72" rx="3" fill="#94A3B8" />
          <rect x="216" y="166" width="8" height="72" rx="3" fill="#94A3B8" />
          <ellipse cx="200" cy="118" rx="54" ry="56" fill="#D97706" stroke="#B45309" strokeWidth="3" />
          <ellipse cx="186" cy="100" rx="22" ry="26" fill="#F59E0B" opacity="0.45" />
          <text x="200" y="114" textAnchor="middle" fill="#451A03" className="text-[22px] font-mono font-extrabold">104</text>
          <text x="200" y="136" textAnchor="middle" fill="#78350F" className="text-[12px] font-mono font-bold">50V</text>
        </svg>
      );

    case 'mosfet':
      return (
        <svg viewBox="0 0 400 300" className={className} aria-label="ترانزستور الموسفيت MOSFET">
          <rect width="400" height="300" fill="#E2E8F0" />
          <ellipse cx="200" cy="248" rx="76" ry="12" fill="#475569" opacity="0.24" />
          <rect x="156" y="176" width="10" height="68" rx="2" fill="#94A3B8" />
          <rect x="195" y="176" width="10" height="68" rx="2" fill="#94A3B8" />
          <rect x="234" y="176" width="10" height="68" rx="2" fill="#94A3B8" />
          <rect x="148" y="48" width="104" height="46" rx="4" fill="#CBD5E1" stroke="#64748B" strokeWidth="2.5" />
          <circle cx="200" cy="68" r="13" fill="#E2E8F0" stroke="#64748B" strokeWidth="2.5" />
          <rect x="142" y="90" width="116" height="88" rx="5" fill="#1E293B" stroke="#0F172A" strokeWidth="2.5" />
          <text x="200" y="128" textAnchor="middle" fill="#F8FAFC" className="text-[18px] font-mono font-bold">IRFZ44N</text>
          <text x="200" y="150" textAnchor="middle" fill="#38BDF8" className="text-[12px] font-mono">N-CH MOSFET</text>
          <text x="161" y="218" textAnchor="middle" fill="#1E293B" className="text-[12px] font-mono font-bold">G</text>
          <text x="200" y="218" textAnchor="middle" fill="#1E293B" className="text-[12px] font-mono font-bold">D</text>
          <text x="239" y="218" textAnchor="middle" fill="#1E293B" className="text-[12px] font-mono font-bold">S</text>
        </svg>
      );

    case 'scr':
      return (
        <svg viewBox="0 0 400 300" className={className} aria-label="الثايرستور SCR">
          <rect width="400" height="300" fill="#E2E8F0" />
          <ellipse cx="200" cy="248" rx="76" ry="12" fill="#475569" opacity="0.24" />
          <rect x="156" y="176" width="10" height="68" rx="2" fill="#94A3B8" />
          <rect x="195" y="176" width="10" height="68" rx="2" fill="#94A3B8" />
          <rect x="234" y="176" width="10" height="68" rx="2" fill="#94A3B8" />
          <rect x="148" y="48" width="104" height="46" rx="4" fill="#CBD5E1" stroke="#64748B" strokeWidth="2.5" />
          <circle cx="200" cy="68" r="13" fill="#E2E8F0" stroke="#64748B" strokeWidth="2.5" />
          <rect x="142" y="90" width="116" height="88" rx="5" fill="#1E293B" stroke="#0F172A" strokeWidth="2.5" />
          <text x="200" y="128" textAnchor="middle" fill="#F8FAFC" className="text-[19px] font-mono font-bold">BT151</text>
          <text x="200" y="150" textAnchor="middle" fill="#F59E0B" className="text-[12px] font-mono">SCR THYRISTOR</text>
          <text x="161" y="218" textAnchor="middle" fill="#1E293B" className="text-[12px] font-mono font-bold">K</text>
          <text x="200" y="218" textAnchor="middle" fill="#1E293B" className="text-[12px] font-mono font-bold">A</text>
          <text x="239" y="218" textAnchor="middle" fill="#1E293B" className="text-[12px] font-mono font-bold">G</text>
        </svg>
      );

    case 'triac':
      return (
        <svg viewBox="0 0 400 300" className={className} aria-label="الترياك TRIAC">
          <rect width="400" height="300" fill="#E2E8F0" />
          <ellipse cx="200" cy="248" rx="76" ry="12" fill="#475569" opacity="0.24" />
          <rect x="156" y="176" width="10" height="68" rx="2" fill="#94A3B8" />
          <rect x="195" y="176" width="10" height="68" rx="2" fill="#94A3B8" />
          <rect x="234" y="176" width="10" height="68" rx="2" fill="#94A3B8" />
          <rect x="148" y="48" width="104" height="46" rx="4" fill="#CBD5E1" stroke="#64748B" strokeWidth="2.5" />
          <circle cx="200" cy="68" r="13" fill="#E2E8F0" stroke="#64748B" strokeWidth="2.5" />
          <rect x="142" y="90" width="116" height="88" rx="5" fill="#1E293B" stroke="#0F172A" strokeWidth="2.5" />
          <text x="200" y="128" textAnchor="middle" fill="#F8FAFC" className="text-[19px] font-mono font-bold">BT136</text>
          <text x="200" y="150" textAnchor="middle" fill="#34D399" className="text-[12px] font-mono">AC TRIAC 600V</text>
          <text x="159" y="218" textAnchor="middle" fill="#1E293B" className="text-[11px] font-mono font-bold">MT1</text>
          <text x="200" y="218" textAnchor="middle" fill="#1E293B" className="text-[11px] font-mono font-bold">MT2</text>
          <text x="239" y="218" textAnchor="middle" fill="#1E293B" className="text-[12px] font-mono font-bold">G</text>
        </svg>
      );

    case 'schottky_diode':
      return (
        <svg viewBox="0 0 400 300" className={className} aria-label="دايود شوتكي">
          <rect width="400" height="300" fill="#E2E8F0" />
          <ellipse cx="200" cy="212" rx="124" ry="14" fill="#475569" opacity="0.24" />
          <rect x="44" y="143" width="312" height="14" rx="4" fill="#94A3B8" stroke="#64748B" strokeWidth="1.5" />
          <rect x="116" y="106" width="168" height="88" rx="12" fill="#0F172A" stroke="#334155" strokeWidth="3" />
          <rect x="136" y="106" width="24" height="88" fill="#CBD5E1" />
          <text x="220" y="144" textAnchor="middle" fill="#F8FAFC" className="text-[18px] font-mono font-bold">SR560</text>
          <text x="220" y="168" textAnchor="middle" fill="#38BDF8" className="text-[12px] font-mono">SCHOTTKY 5A</text>
        </svg>
      );

    case 'timer_555':
      return (
        <svg viewBox="0 0 400 300" className={className} aria-label="مؤقت NE555">
          <rect width="400" height="300" fill="#E2E8F0" />
          <ellipse cx="200" cy="222" rx="108" ry="14" fill="#475569" opacity="0.25" />
          {[126, 174, 222, 270].map((x) => (
            <g key={x}>
              <rect x={x - 7} y="64" width="14" height="32" rx="2" fill="#CBD5E1" stroke="#64748B" strokeWidth="1.5" />
              <rect x={x - 7} y="184" width="14" height="36" rx="2" fill="#CBD5E1" stroke="#64748B" strokeWidth="1.5" />
            </g>
          ))}
          <rect x="98" y="90" width="204" height="98" rx="8" fill="#1E293B" stroke="#0F172A" strokeWidth="3" />
          <path d="M98 124 A14 14 0 0 1 98 152" fill="#334155" />
          <circle cx="122" cy="164" r="7" fill="#94A3B8" />
          <text x="206" y="136" textAnchor="middle" fill="#F8FAFC" className="text-[24px] font-mono font-extrabold">NE555P</text>
          <text x="206" y="160" textAnchor="middle" fill="#38BDF8" className="text-[12px] font-mono">PRECISION TIMER</text>
        </svg>
      );

    case 'opamp':
      return (
        <svg viewBox="0 0 400 300" className={className} aria-label="مكبر العمليات LM358">
          <rect width="400" height="300" fill="#E2E8F0" />
          <ellipse cx="200" cy="222" rx="108" ry="14" fill="#475569" opacity="0.25" />
          {[126, 174, 222, 270].map((x) => (
            <g key={x}>
              <rect x={x - 7} y="64" width="14" height="32" rx="2" fill="#CBD5E1" stroke="#64748B" strokeWidth="1.5" />
              <rect x={x - 7} y="184" width="14" height="36" rx="2" fill="#CBD5E1" stroke="#64748B" strokeWidth="1.5" />
            </g>
          ))}
          <rect x="98" y="90" width="204" height="98" rx="8" fill="#0F172A" stroke="#334155" strokeWidth="3" />
          <circle cx="122" cy="164" r="7" fill="#94A3B8" />
          <text x="204" y="136" textAnchor="middle" fill="#F8FAFC" className="text-[24px] font-mono font-extrabold">LM358N</text>
          <text x="204" y="160" textAnchor="middle" fill="#FBBF24" className="text-[12px] font-mono">DUAL OP-AMP</text>
        </svg>
      );

    case 'thermistor':
      return (
        <svg viewBox="0 0 400 300" className={className} aria-label="الثرمستور الحراري NTC">
          <rect width="400" height="300" fill="#E2E8F0" />
          <ellipse cx="200" cy="242" rx="64" ry="12" fill="#475569" opacity="0.24" />
          <rect x="174" y="164" width="8" height="74" rx="3" fill="#94A3B8" />
          <rect x="218" y="164" width="8" height="74" rx="3" fill="#94A3B8" />
          <circle cx="200" cy="116" r="52" fill="#166534" stroke="#14532D" strokeWidth="3" />
          <ellipse cx="182" cy="96" rx="18" ry="22" fill="#22C55E" opacity="0.3" />
          <text x="200" y="112" textAnchor="middle" fill="#F8FAFC" className="text-[17px] font-mono font-bold">NTC</text>
          <text x="200" y="134" textAnchor="middle" fill="#BBF7D0" className="text-[13px] font-mono font-bold">10D-9</text>
        </svg>
      );

    case 'ir_receiver':
      return (
        <svg viewBox="0 0 400 300" className={className} aria-label="مستقبل الأشعة تحت الحمراء">
          <rect width="400" height="300" fill="#E2E8F0" />
          <ellipse cx="200" cy="242" rx="70" ry="12" fill="#475569" opacity="0.24" />
          <rect x="160" y="168" width="8" height="70" rx="2" fill="#94A3B8" />
          <rect x="196" y="168" width="8" height="70" rx="2" fill="#94A3B8" />
          <rect x="232" y="168" width="8" height="70" rx="2" fill="#94A3B8" />
          <rect x="148" y="76" width="104" height="94" rx="10" fill="#0F172A" stroke="#334155" strokeWidth="3" />
          <circle cx="200" cy="122" r="28" fill="#1E293B" stroke="#475569" strokeWidth="2" />
          <ellipse cx="192" cy="112" rx="10" ry="12" fill="#64748B" opacity="0.45" />
          <text x="200" y="162" textAnchor="middle" fill="#94A3B8" className="text-[11px] font-mono">TSOP1838</text>
        </svg>
      );

    case 'reed_switch':
      return (
        <svg viewBox="0 0 400 300" className={className} aria-label="المفتاح المغناطيسي Reed Switch">
          <rect width="400" height="300" fill="#E2E8F0" />
          <ellipse cx="200" cy="204" rx="134" ry="12" fill="#475569" opacity="0.22" />
          <rect x="46" y="146" width="308" height="8" rx="3" fill="#94A3B8" />
          <rect x="112" y="122" width="176" height="56" rx="26" fill="#E0F2FE" fillOpacity="0.8" stroke="#38BDF8" strokeWidth="3" />
          <line x1="126" y1="145" x2="210" y2="145" stroke="#D97706" strokeWidth="5" strokeLinecap="round" />
          <line x1="274" y1="155" x2="190" y2="155" stroke="#D97706" strokeWidth="5" strokeLinecap="round" />
          <text x="200" y="96" textAnchor="middle" fill="#334155" className="text-[14px] font-mono font-bold">MAGNETIC REED</text>
        </svg>
      );

    case 'transformer':
      return (
        <svg viewBox="0 0 400 300" className={className} aria-label="المحول الكهربائي">
          <rect width="400" height="300" fill="#E2E8F0" />
          <ellipse cx="200" cy="242" rx="112" ry="14" fill="#475569" opacity="0.25" />
          <rect x="104" y="76" width="192" height="148" rx="8" fill="#64748B" stroke="#334155" strokeWidth="3" />
          <rect x="138" y="64" width="124" height="172" rx="6" fill="#B45309" stroke="#78350F" strokeWidth="2.5" />
          <rect x="148" y="100" width="104" height="100" rx="4" fill="#FDE047" stroke="#CA8A04" strokeWidth="2" />
          <text x="200" y="144" textAnchor="middle" fill="#0F172A" className="text-[16px] font-mono font-extrabold">220V → 12V</text>
          <text x="200" y="168" textAnchor="middle" fill="#334155" className="text-[12px] font-mono font-bold">50/60Hz 1A</text>
          <line x1="80" y1="124" x2="104" y2="124" stroke="#EF4444" strokeWidth="6" strokeLinecap="round" />
          <line x1="80" y1="172" x2="104" y2="172" stroke="#EF4444" strokeWidth="6" strokeLinecap="round" />
          <line x1="296" y1="124" x2="320" y2="124" stroke="#2563EB" strokeWidth="6" strokeLinecap="round" />
          <line x1="296" y1="172" x2="320" y2="172" stroke="#2563EB" strokeWidth="6" strokeLinecap="round" />
        </svg>
      );

    case 'varistor':
      return (
        <svg viewBox="0 0 400 300" className={className} aria-label="الفاريستور MOV">
          <rect width="400" height="300" fill="#E2E8F0" />
          <ellipse cx="200" cy="242" rx="70" ry="12" fill="#475569" opacity="0.24" />
          <rect x="172" y="166" width="8" height="72" rx="3" fill="#94A3B8" />
          <rect x="220" y="166" width="8" height="72" rx="3" fill="#94A3B8" />
          <circle cx="200" cy="116" r="56" fill="#0284C7" stroke="#0369A1" strokeWidth="3" />
          <text x="200" y="110" textAnchor="middle" fill="#FFFFFF" className="text-[17px] font-mono font-extrabold">10D471K</text>
          <text x="200" y="132" textAnchor="middle" fill="#E0F2FE" className="text-[12px] font-mono">MOV 300VAC</text>
        </svg>
      );

    case 'dc_motor':
      return (
        <svg viewBox="0 0 400 300" className={className} aria-label="محرك التيار المستمر">
          <rect width="400" height="300" fill="#E2E8F0" />
          <ellipse cx="200" cy="222" rx="116" ry="14" fill="#475569" opacity="0.25" />
          <rect x="64" y="142" width="56" height="16" rx="4" fill="#94A3B8" stroke="#475569" strokeWidth="2" />
          <rect x="120" y="96" width="160" height="108" rx="16" fill="#CBD5E1" stroke="#64748B" strokeWidth="3" />
          <rect x="274" y="110" width="24" height="80" rx="4" fill="#1E293B" />
          <rect x="298" y="128" width="16" height="12" rx="2" fill="#F59E0B" />
          <rect x="298" y="160" width="16" height="12" rx="2" fill="#F59E0B" />
          <text x="200" y="146" textAnchor="middle" fill="#0F172A" className="text-[18px] font-mono font-extrabold">DC 3-12V</text>
          <text x="200" y="168" textAnchor="middle" fill="#475569" className="text-[12px] font-mono">RF-300 MOTOR</text>
        </svg>
      );

    case 'speaker':
      return (
        <svg viewBox="0 0 400 300" className={className} aria-label="السماعة الصوتية">
          <rect width="400" height="300" fill="#E2E8F0" />
          <ellipse cx="200" cy="242" rx="88" ry="12" fill="#475569" opacity="0.24" />
          <circle cx="200" cy="144" r="88" fill="#1E293B" stroke="#0F172A" strokeWidth="4" />
          <circle cx="200" cy="144" r="70" fill="#334155" stroke="#475569" strokeWidth="2" />
          <circle cx="200" cy="144" r="54" fill="#0F172A" />
          <circle cx="200" cy="144" r="22" fill="#475569" stroke="#64748B" strokeWidth="2" />
          <text x="200" y="258" textAnchor="middle" fill="#334155" className="text-[13px] font-mono font-bold">8Ω · 2W SPEAKER</text>
        </svg>
      );

    case 'microphone':
      return (
        <svg viewBox="0 0 400 300" className={className} aria-label="الميكروفون المكثف">
          <rect width="400" height="300" fill="#E2E8F0" />
          <ellipse cx="200" cy="236" rx="68" ry="12" fill="#475569" opacity="0.24" />
          <rect x="174" y="168" width="8" height="64" rx="3" fill="#94A3B8" />
          <rect x="218" y="168" width="8" height="64" rx="3" fill="#94A3B8" />
          <rect x="144" y="88" width="112" height="82" rx="14" fill="#CBD5E1" stroke="#64748B" strokeWidth="3" />
          <circle cx="200" cy="116" r="30" fill="#1E293B" stroke="#475569" strokeWidth="2" />
          <text x="200" y="121" textAnchor="middle" fill="#94A3B8" className="text-[11px] font-mono">MIC</text>
          <text x="178" y="246" textAnchor="middle" fill="#DC2626" className="text-[13px] font-mono font-bold">+</text>
          <text x="222" y="246" textAnchor="middle" fill="#1E293B" className="text-[13px] font-mono font-bold">-</text>
        </svg>
      );

    case 'lcd_display':
      return (
        <svg viewBox="0 0 400 300" className={className} aria-label="شاشة LCD 16x2">
          <rect width="400" height="300" fill="#E2E8F0" />
          <rect x="52" y="72" width="296" height="156" rx="10" fill="#15803D" stroke="#14532D" strokeWidth="3" />
          <rect x="74" y="96" width="252" height="106" rx="6" fill="#0F172A" />
          <rect x="88" y="110" width="224" height="78" rx="4" fill="#1D4ED8" />
          <text x="200" y="142" textAnchor="middle" fill="#FFFFFF" className="text-[18px] font-mono font-bold">SAMI LAB 16x2</text>
          <text x="200" y="168" textAnchor="middle" fill="#BAE6FD" className="text-[14px] font-mono">V=5.00V I=22mA</text>
          {[96, 110, 124, 138, 152, 166, 180, 194, 208, 222, 236, 250].map((x) => (
            <circle key={x} cx={x} cy="84" r="4" fill="#FBBF24" />
          ))}
        </svg>
      );

    case 'zener':
      return (
        <svg viewBox="0 0 400 300" className={className} aria-label="دايود زينر Zener Diode">
          <defs>
            <linearGradient id="bg-zener" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#E2E8F0" />
              <stop offset="100%" stopColor="#CBD5E1" />
            </linearGradient>
            <linearGradient id="zener-glass" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FDBA74" />
              <stop offset="45%" stopColor="#EA580C" />
              <stop offset="100%" stopColor="#9A3412" />
            </linearGradient>
          </defs>
          <rect width="400" height="300" fill="url(#bg-zener)" />
          <ellipse cx="200" cy="216" rx="134" ry="14" fill="#475569" opacity="0.24" />
          {/* Axial Tinned Copper Leads */}
          <rect x="40" y="143" width="320" height="14" rx="5" fill="#94A3B8" stroke="#64748B" strokeWidth="1.5" />
          {/* Orange DO-35 / DO-41 Glass Body */}
          <rect x="118" y="110" width="164" height="80" rx="16" fill="url(#zener-glass)" stroke="#7C2D12" strokeWidth="2.5" />
          {/* Inner Silicon Die / Copper Slug */}
          <rect x="184" y="128" width="32" height="44" rx="4" fill="#78350F" opacity="0.55" />
          {/* Black Cathode Band */}
          <rect x="134" y="110" width="24" height="80" fill="#0F172A" />
          {/* Glass Highlight */}
          <rect x="164" y="118" width="104" height="10" rx="5" fill="#FFEDD5" opacity="0.45" />
          <text x="218" y="146" textAnchor="middle" fill="#FFF7ED" className="text-[16px] font-mono font-extrabold">1N4733</text>
          <text x="218" y="167" textAnchor="middle" fill="#FED7AA" className="text-[12px] font-mono font-bold">5.1V ZENER</text>
          <text x="146" y="96" textAnchor="middle" fill="#0F172A" className="text-[13px] font-mono font-bold">K (-)</text>
          <text x="262" y="96" textAnchor="middle" fill="#475569" className="text-[13px] font-mono font-bold">A (+)</text>
        </svg>
      );

    case 'igbt':
      return (
        <svg viewBox="0 0 400 300" className={className} aria-label="ترانزستور IGBT للقدرة العالية">
          <defs>
            <linearGradient id="bg-igbt" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#E2E8F0" />
              <stop offset="100%" stopColor="#CBD5E1" />
            </linearGradient>
          </defs>
          <rect width="400" height="300" fill="url(#bg-igbt)" />
          <ellipse cx="200" cy="252" rx="86" ry="12" fill="#475569" opacity="0.24" />
          {/* 3 Heavy Leads */}
          <rect x="150" y="180" width="12" height="68" rx="2" fill="#94A3B8" stroke="#64748B" strokeWidth="1.2" />
          <rect x="194" y="180" width="12" height="68" rx="2" fill="#94A3B8" stroke="#64748B" strokeWidth="1.2" />
          <rect x="238" y="180" width="12" height="68" rx="2" fill="#94A3B8" stroke="#64748B" strokeWidth="1.2" />
          {/* TO-247 Top Copper/Aluminum Tab */}
          <rect x="140" y="42" width="120" height="44" rx="5" fill="#CBD5E1" stroke="#64748B" strokeWidth="2.5" />
          <circle cx="200" cy="64" r="14" fill="#E2E8F0" stroke="#475569" strokeWidth="2.5" />
          {/* Epoxy Body */}
          <rect x="132" y="74" width="136" height="108" rx="6" fill="#0F172A" stroke="#020617" strokeWidth="2.5" />
          <rect x="140" y="80" width="120" height="5" fill="#334155" />
          <text x="200" y="122" textAnchor="middle" fill="#F8FAFC" className="text-[17px] font-mono font-extrabold">FGA25N120</text>
          <text x="200" y="144" textAnchor="middle" fill="#10B981" className="text-[12px] font-mono font-bold">IGBT 1200V 25A</text>
          <text x="200" y="164" textAnchor="middle" fill="#94A3B8" className="text-[10px] font-mono">TO-247 POWER</text>
          <text x="156" y="226" textAnchor="middle" fill="#0F172A" className="text-[13px] font-mono font-bold">G</text>
          <text x="200" y="226" textAnchor="middle" fill="#0F172A" className="text-[13px] font-mono font-bold">C</text>
          <text x="244" y="226" textAnchor="middle" fill="#0F172A" className="text-[13px] font-mono font-bold">E</text>
        </svg>
      );

    case 'dual_schottky':
      return (
        <svg viewBox="0 0 400 300" className={className} aria-label="الدايود شوتكي المزدوج MBR20100CT">
          <defs>
            <linearGradient id="bg-dsch" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#E2E8F0" />
              <stop offset="100%" stopColor="#CBD5E1" />
            </linearGradient>
          </defs>
          <rect width="400" height="300" fill="url(#bg-dsch)" />
          <ellipse cx="200" cy="248" rx="80" ry="12" fill="#475569" opacity="0.24" />
          {/* 3 Leads */}
          <rect x="154" y="178" width="11" height="66" rx="2" fill="#94A3B8" />
          <rect x="194.5" y="178" width="11" height="66" rx="2" fill="#94A3B8" />
          <rect x="235" y="178" width="11" height="66" rx="2" fill="#94A3B8" />
          {/* Metal Tab */}
          <rect x="146" y="46" width="108" height="44" rx="4" fill="#CBD5E1" stroke="#64748B" strokeWidth="2.5" />
          <circle cx="200" cy="66" r="13" fill="#E2E8F0" stroke="#64748B" strokeWidth="2.5" />
          {/* TO-220 Body */}
          <rect x="140" y="88" width="120" height="92" rx="5" fill="#1E293B" stroke="#0F172A" strokeWidth="2.5" />
          <text x="200" y="114" textAnchor="middle" fill="#F8FAFC" className="text-[15px] font-mono font-extrabold">MBR20100CT</text>
          {/* Mini Common-Cathode Symbol Printed on Package */}
          <line x1="166" y1="142" x2="234" y2="142" stroke="#D97706" strokeWidth="2" />
          <polygon points="175,134 175,150 189,142" fill="#D97706" />
          <polygon points="225,134 225,150 211,142" fill="#D97706" />
          <line x1="191" y1="133" x2="191" y2="151" stroke="#FBBF24" strokeWidth="2.2" />
          <line x1="209" y1="133" x2="209" y2="151" stroke="#FBBF24" strokeWidth="2.2" />
          <line x1="200" y1="142" x2="200" y2="158" stroke="#34D399" strokeWidth="2.2" />
          <text x="200" y="172" textAnchor="middle" fill="#94A3B8" className="text-[10px] font-mono">20A 100V DUAL</text>
          <text x="160" y="220" textAnchor="middle" fill="#0F172A" className="text-[12px] font-mono font-bold">A1</text>
          <text x="200" y="220" textAnchor="middle" fill="#059669" className="text-[12px] font-mono font-bold">K</text>
          <text x="240" y="220" textAnchor="middle" fill="#0F172A" className="text-[12px] font-mono font-bold">A2</text>
        </svg>
      );

    case 'ultrasonic_hcsr04':
      return (
        <svg viewBox="0 0 400 300" className={className} aria-label="حساس المسافة فوق الصوتي HC-SR04">
          <defs>
            <linearGradient id="bg-hcsr04" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#E2E8F0" />
              <stop offset="100%" stopColor="#CBD5E1" />
            </linearGradient>
            <radialGradient id="mesh-can" cx="40%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#F8FAFC" />
              <stop offset="70%" stopColor="#94A3B8" />
              <stop offset="100%" stopColor="#475569" />
            </radialGradient>
          </defs>
          <rect width="400" height="300" fill="url(#bg-hcsr04)" />
          <ellipse cx="200" cy="248" rx="130" ry="12" fill="#475569" opacity="0.22" />
          {/* 4 Header Pins */}
          {[164, 188, 212, 236].map((x) => (
            <rect key={x} x={x - 3} y="198" width="6" height="44" rx="2" fill="#FBBF24" stroke="#B45309" strokeWidth="1" />
          ))}
          {/* Blue PCB */}
          <rect x="64" y="78" width="272" height="122" rx="10" fill="#1D4ED8" stroke="#1E3A8A" strokeWidth="3" />
          {/* Corner Mounting Holes */}
          {[[78, 92], [322, 92], [78, 186], [322, 186]].map(([cx, cy], idx) => (
            <circle key={idx} cx={cx} cy={cy} r="6" fill="#E2E8F0" stroke="#FBBF24" strokeWidth="2" />
          ))}
          {/* 4MHz Quartz Crystal Between Transducers */}
          <rect x="180" y="88" width="40" height="18" rx="6" fill="#CBD5E1" stroke="#475569" strokeWidth="1.5" />
          {/* Left & Right Ultrasonic Metal Transducer Cans */}
          <circle cx="122" cy="138" r="44" fill="url(#mesh-can)" stroke="#334155" strokeWidth="3" />
          <circle cx="122" cy="138" r="32" fill="#1E293B" stroke="#64748B" strokeWidth="2" />
          <circle cx="122" cy="138" r="14" fill="#475569" />
          <circle cx="278" cy="138" r="44" fill="url(#mesh-can)" stroke="#334155" strokeWidth="3" />
          <circle cx="278" cy="138" r="32" fill="#1E293B" stroke="#64748B" strokeWidth="2" />
          <circle cx="278" cy="138" r="14" fill="#475569" />
          {/* Labels */}
          <text x="122" y="192" textAnchor="middle" fill="#FFFFFF" className="text-[11px] font-mono font-bold">T</text>
          <text x="278" y="192" textAnchor="middle" fill="#FFFFFF" className="text-[11px] font-mono font-bold">R</text>
          <text x="200" y="144" textAnchor="middle" fill="#FFFFFF" className="text-[12px] font-mono font-extrabold">HC-SR04</text>
          <text x="164" y="256" textAnchor="middle" fill="#0F172A" className="text-[9px] font-mono font-bold">VCC</text>
          <text x="188" y="256" textAnchor="middle" fill="#0F172A" className="text-[9px] font-mono font-bold">Trig</text>
          <text x="212" y="256" textAnchor="middle" fill="#0F172A" className="text-[9px] font-mono font-bold">Echo</text>
          <text x="236" y="256" textAnchor="middle" fill="#0F172A" className="text-[9px] font-mono font-bold">GND</text>
        </svg>
      );

    case 'dht_sensor':
      return (
        <svg viewBox="0 0 400 300" className={className} aria-label="حساس الحرارة والرطوبة DHT11 و DHT22">
          <defs>
            <linearGradient id="bg-dht" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#E2E8F0" />
              <stop offset="100%" stopColor="#CBD5E1" />
            </linearGradient>
          </defs>
          <rect width="400" height="300" fill="url(#bg-dht)" />
          <ellipse cx="145" cy="248" rx="68" ry="11" fill="#475569" opacity="0.22" />
          <ellipse cx="268" cy="248" rx="62" ry="11" fill="#475569" opacity="0.22" />

          {/* Left: DHT11 Classic Blue Grid Sensor */}
          {[112, 134, 156, 178].map((x) => (
            <rect key={x} x={x - 3} y="182" width="6" height="58" rx="2" fill="#94A3B8" />
          ))}
          <rect x="92" y="64" width="106" height="122" rx="8" fill="#0284C7" stroke="#0369A1" strokeWidth="3" />
          {/* Ventilation Grid Slots */}
          {[78, 98, 118].map((y) => (
            <g key={y}>
              <rect x="104" y={y} width="24" height="12" rx="2" fill="#0F172A" opacity="0.7" />
              <rect x="133" y={y} width="24" height="12" rx="2" fill="#0F172A" opacity="0.7" />
              <rect x="162" y={y} width="24" height="12" rx="2" fill="#0F172A" opacity="0.7" />
            </g>
          ))}
          <text x="145" y="160" textAnchor="middle" fill="#FFFFFF" className="text-[14px] font-mono font-extrabold">DHT11</text>
          <text x="145" y="176" textAnchor="middle" fill="#BAE6FD" className="text-[10px] font-mono">0–50°C</text>

          {/* Right: DHT22 White High-Precision Sensor */}
          {[236, 258, 280, 302].map((x) => (
            <rect key={x} x={x - 3} y="190" width="6" height="50" rx="2" fill="#94A3B8" />
          ))}
          <rect x="218" y="54" width="100" height="138" rx="8" fill="#F8FAFC" stroke="#94A3B8" strokeWidth="2.5" />
          <circle cx="268" cy="68" r="5" fill="#CBD5E1" stroke="#64748B" strokeWidth="1.5" />
          {[84, 102, 120].map((y) => (
            <g key={y}>
              <rect x="230" y={y} width="22" height="11" rx="2" fill="#CBD5E1" />
              <rect x="257" y={y} width="22" height="11" rx="2" fill="#CBD5E1" />
              <rect x="284" y={y} width="22" height="11" rx="2" fill="#CBD5E1" />
            </g>
          ))}
          <text x="268" y="162" textAnchor="middle" fill="#0F172A" className="text-[14px] font-mono font-extrabold">DHT22</text>
          <text x="268" y="178" textAnchor="middle" fill="#059669" className="text-[10px] font-mono font-bold">-40..80°C</text>
        </svg>
      );

    case 'pir_sensor':
      return (
        <svg viewBox="0 0 400 300" className={className} aria-label="حساس الحركة PIR HC-SR501">
          <defs>
            <linearGradient id="bg-pir" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#E2E8F0" />
              <stop offset="100%" stopColor="#CBD5E1" />
            </linearGradient>
            <radialGradient id="fresnel" cx="42%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="70%" stopColor="#E2E8F0" />
              <stop offset="100%" stopColor="#94A3B8" />
            </radialGradient>
          </defs>
          <rect width="400" height="300" fill="url(#bg-pir)" />
          <ellipse cx="200" cy="248" rx="112" ry="12" fill="#475569" opacity="0.22" />
          {/* 3 Bottom Header Pins */}
          {[174, 200, 226].map((x) => (
            <rect key={x} x={x - 3} y="206" width="6" height="34" rx="2" fill="#FBBF24" stroke="#B45309" strokeWidth="1" />
          ))}
          {/* Green PCB Base */}
          <rect x="86" y="70" width="228" height="142" rx="10" fill="#15803D" stroke="#14532D" strokeWidth="3" />
          {/* Mounting Holes */}
          <circle cx="102" cy="86" r="6" fill="#E2E8F0" />
          <circle cx="298" cy="86" r="6" fill="#E2E8F0" />
          {/* Orange Adjustment Potentiometers (Sx & Tx) */}
          <rect x="98" y="168" width="26" height="26" rx="4" fill="#EA580C" stroke="#9A3412" strokeWidth="2" />
          <line x1="104" y1="181" x2="118" y2="181" stroke="#FED7AA" strokeWidth="2.5" />
          <rect x="276" y="168" width="26" height="26" rx="4" fill="#EA580C" stroke="#9A3412" strokeWidth="2" />
          <line x1="289" y1="174" x2="289" y2="188" stroke="#FED7AA" strokeWidth="2.5" />
          {/* White Faceted Fresnel Dome Lens */}
          <circle cx="200" cy="134" r="56" fill="url(#fresnel)" stroke="#CBD5E1" strokeWidth="3" />
          <ellipse cx="200" cy="134" rx="38" ry="38" fill="none" stroke="#CBD5E1" strokeWidth="1.5" strokeDasharray="6 4" />
          <ellipse cx="200" cy="134" rx="18" ry="18" fill="none" stroke="#CBD5E1" strokeWidth="1.5" />
          <text x="174" y="254" textAnchor="middle" fill="#0F172A" className="text-[10px] font-mono font-bold">VCC</text>
          <text x="200" y="254" textAnchor="middle" fill="#059669" className="text-[10px] font-mono font-bold">OUT</text>
          <text x="226" y="254" textAnchor="middle" fill="#0F172A" className="text-[10px] font-mono font-bold">GND</text>
          <text x="111" y="162" textAnchor="middle" fill="#FFFFFF" className="text-[9px] font-mono font-bold">Sx</text>
          <text x="289" y="162" textAnchor="middle" fill="#FFFFFF" className="text-[9px] font-mono font-bold">Tx</text>
        </svg>
      );

    case 'servo_sg90':
      return (
        <svg viewBox="0 0 400 300" className={className} aria-label="محرك السيرفو SG90">
          <defs>
            <linearGradient id="bg-servo" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#E2E8F0" />
              <stop offset="100%" stopColor="#CBD5E1" />
            </linearGradient>
          </defs>
          <rect width="400" height="300" fill="url(#bg-servo)" />
          <ellipse cx="184" cy="246" rx="108" ry="12" fill="#475569" opacity="0.22" />
          {/* 3-Wire Ribbon Cable + Dupont Plug */}
          <path d="M236 198 C286 198, 294 218, 326 218" stroke="#78350F" strokeWidth="7" fill="none" strokeLinecap="round" />
          <path d="M236 188 C288 188, 296 206, 326 206" stroke="#DC2626" strokeWidth="7" fill="none" strokeLinecap="round" />
          <path d="M236 178 C290 178, 298 194, 326 194" stroke="#F59E0B" strokeWidth="7" fill="none" strokeLinecap="round" />
          <rect x="322" y="186" width="24" height="38" rx="3" fill="#1E293B" stroke="#0F172A" strokeWidth="2" />
          {/* Mounting Ears */}
          <rect x="102" y="122" width="164" height="16" rx="4" fill="#0284C7" stroke="#0369A1" strokeWidth="2" />
          {/* Blue Translucent SG90 Body */}
          <rect x="128" y="88" width="112" height="136" rx="8" fill="#0EA5E9" stroke="#0369A1" strokeWidth="3" />
          <rect x="136" y="142" width="96" height="58" rx="5" fill="#0369A1" opacity="0.45" />
          {/* Top Gear Housing */}
          <circle cx="164" cy="86" r="26" fill="#0284C7" stroke="#0369A1" strokeWidth="2.5" />
          {/* White Servo Horn Arm */}
          <rect x="150" y="54" width="96" height="22" rx="11" fill="#F8FAFC" stroke="#94A3B8" strokeWidth="2" />
          <circle cx="164" cy="65" r="7" fill="#CBD5E1" stroke="#64748B" strokeWidth="2" />
          {[192, 210, 228].map((x) => (
            <circle key={x} cx={x} cy="65" r="2.5" fill="#64748B" />
          ))}
          <text x="184" y="168" textAnchor="middle" fill="#FFFFFF" className="text-[16px] font-mono font-extrabold">SG90</text>
          <text x="184" y="186" textAnchor="middle" fill="#E0F2FE" className="text-[10px] font-mono">MICRO SERVO 9g</text>
          <text x="334" y="242" textAnchor="middle" fill="#0F172A" className="text-[9px] font-mono font-bold">PWM · +5V · GND</text>
        </svg>
      );

    case 'supercapacitor':
      return (
        <svg viewBox="0 0 400 300" className={className} aria-label="المكثف الفائق Supercapacitor">
          <defs>
            <linearGradient id="bg-scap" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#E2E8F0" />
              <stop offset="100%" stopColor="#CBD5E1" />
            </linearGradient>
            <linearGradient id="scap-body" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#047857" />
              <stop offset="35%" stopColor="#10B981" />
              <stop offset="75%" stopColor="#059669" />
              <stop offset="100%" stopColor="#065F46" />
            </linearGradient>
          </defs>
          <rect width="400" height="300" fill="url(#bg-scap)" />
          <ellipse cx="200" cy="248" rx="84" ry="12" fill="#475569" opacity="0.24" />
          {/* Heavy Leads (+ longer) */}
          <rect x="166" y="192" width="10" height="54" rx="3" fill="#94A3B8" stroke="#64748B" strokeWidth="1.5" />
          <rect x="224" y="192" width="10" height="44" rx="3" fill="#94A3B8" stroke="#64748B" strokeWidth="1.5" />
          {/* Cylindrical Can */}
          <rect x="134" y="64" width="132" height="132" rx="14" fill="url(#scap-body)" stroke="#064E3B" strokeWidth="3" />
          {/* Metallic Top Rim */}
          <ellipse cx="200" cy="68" rx="64" ry="12" fill="#CBD5E1" stroke="#64748B" strokeWidth="2" />
          <line x1="176" y1="68" x2="224" y2="68" stroke="#64748B" strokeWidth="2" />
          {/* White Negative Polarity Stripe on Right */}
          <rect x="230" y="76" width="24" height="114" rx="3" fill="#F8FAFC" opacity="0.9" />
          <text x="242" y="108" textAnchor="middle" fill="#0F172A" className="text-[16px] font-mono font-extrabold">-</text>
          <text x="242" y="142" textAnchor="middle" fill="#0F172A" className="text-[16px] font-mono font-extrabold">-</text>
          <text x="242" y="176" textAnchor="middle" fill="#0F172A" className="text-[16px] font-mono font-extrabold">-</text>
          {/* Main Spec Label */}
          <text x="184" y="122" textAnchor="middle" fill="#FFFFFF" className="text-[18px] font-mono font-extrabold">2.7V 10F</text>
          <text x="184" y="144" textAnchor="middle" fill="#D1FAE5" className="text-[11px] font-mono font-bold">SUPERCAP</text>
          <text x="184" y="162" textAnchor="middle" fill="#A7F3D0" className="text-[10px] font-mono">EDLC ENERGY</text>
          <text x="171" y="256" textAnchor="middle" fill="#059669" className="text-[13px] font-mono font-bold">+</text>
          <text x="229" y="252" textAnchor="middle" fill="#0F172A" className="text-[13px] font-mono font-bold">-</text>
        </svg>
      );

    case 'optocoupler':
    default:
      return (
        <svg viewBox="0 0 400 300" className={className} aria-label="العازل الضوئي Optocoupler PC817">
          <defs>
            <linearGradient id="bg-opt" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#E2E8F0" />
              <stop offset="100%" stopColor="#CBD5E1" />
            </linearGradient>
          </defs>
          <rect width="400" height="300" fill="url(#bg-opt)" />
          <ellipse cx="200" cy="222" rx="82" ry="12" fill="#475569" opacity="0.25" />
          {/* 4 Gull-wing Pins */}
          <rect x="150" y="54" width="16" height="30" rx="3" fill="#CBD5E1" stroke="#64748B" strokeWidth="1.5" />
          <rect x="234" y="54" width="16" height="30" rx="3" fill="#CBD5E1" stroke="#64748B" strokeWidth="1.5" />
          <rect x="150" y="182" width="16" height="34" rx="3" fill="#CBD5E1" stroke="#64748B" strokeWidth="1.5" />
          <rect x="234" y="182" width="16" height="34" rx="3" fill="#CBD5E1" stroke="#64748B" strokeWidth="1.5" />
          {/* DIP-4 Black Epoxy Body */}
          <rect x="122" y="80" width="156" height="106" rx="8" fill="#1E293B" stroke="#0F172A" strokeWidth="3" />
          {/* Pin 1 Dot */}
          <circle cx="146" cy="164" r="6" fill="#94A3B8" />
          <text x="200" y="126" textAnchor="middle" fill="#E2E8F0" className="text-[19px] font-mono font-bold">PC817</text>
          <text x="200" y="148" textAnchor="middle" fill="#94A3B8" className="text-[12px] font-mono">OPTOCOUPLER</text>
          <text x="158" y="234" textAnchor="middle" fill="#475569" className="text-[11px] font-mono">1 (+)</text>
          <text x="242" y="234" textAnchor="middle" fill="#475569" className="text-[11px] font-mono">2 (-)</text>
        </svg>
      );
  }
};
