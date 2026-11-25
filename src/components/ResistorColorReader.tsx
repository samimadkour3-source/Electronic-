import React, { useMemo, useState } from 'react';
import { ArrowLeftRight, Check, Info, RotateCcw, Search } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

interface ColorBandDef {
  id: string;
  nameAr: string;
  nameFr: string;
  nameEn: string;
  hex: string;
  textLight: boolean;
  digit?: number;
  multiplier?: number;
  multLabel?: string;
  tolerance?: number;
  tolLabel?: string;
}

const BAND_DEFS: ColorBandDef[] = [
  { id: 'black', nameAr: 'أسود', nameFr: 'Noir', nameEn: 'Black', hex: '#18181B', textLight: true, digit: 0, multiplier: 1, multLabel: '×1 Ω' },
  { id: 'brown', nameAr: 'بني', nameFr: 'Marron', nameEn: 'Brown', hex: '#78350F', textLight: true, digit: 1, multiplier: 10, multLabel: '×10 Ω', tolerance: 1, tolLabel: '±1%' },
  { id: 'red', nameAr: 'أحمر', nameFr: 'Rouge', nameEn: 'Red', hex: '#DC2626', textLight: true, digit: 2, multiplier: 100, multLabel: '×100 Ω', tolerance: 2, tolLabel: '±2%' },
  { id: 'orange', nameAr: 'برتقالي', nameFr: 'Orange', nameEn: 'Orange', hex: '#EA580C', textLight: true, digit: 3, multiplier: 1000, multLabel: '×1 kΩ' },
  { id: 'yellow', nameAr: 'أصفر', nameFr: 'Jaune', nameEn: 'Yellow', hex: '#EAB308', textLight: false, digit: 4, multiplier: 10000, multLabel: '×10 kΩ' },
  { id: 'green', nameAr: 'أخضر', nameFr: 'Vert', nameEn: 'Green', hex: '#16A34A', textLight: true, digit: 5, multiplier: 100000, multLabel: '×100 kΩ', tolerance: 0.5, tolLabel: '±0.5%' },
  { id: 'blue', nameAr: 'أزرق', nameFr: 'Bleu', nameEn: 'Blue', hex: '#2563EB', textLight: true, digit: 6, multiplier: 1000000, multLabel: '×1 MΩ', tolerance: 0.25, tolLabel: '±0.25%' },
  { id: 'violet', nameAr: 'بنفسجي', nameFr: 'Violet', nameEn: 'Violet', hex: '#7C3AED', textLight: true, digit: 7, multiplier: 10000000, multLabel: '×10 MΩ', tolerance: 0.1, tolLabel: '±0.1%' },
  { id: 'gray', nameAr: 'رمادي', nameFr: 'Gris', nameEn: 'Gray', hex: '#64748B', textLight: true, digit: 8, tolerance: 0.05, tolLabel: '±0.05%' },
  { id: 'white', nameAr: 'أبيض', nameFr: 'Blanc', nameEn: 'White', hex: '#F8FAFC', textLight: false, digit: 9 },
  { id: 'gold', nameAr: 'ذهبي', nameFr: 'Or', nameEn: 'Gold', hex: '#D4AF37', textLight: false, multiplier: 0.1, multLabel: '×0.1 Ω', tolerance: 5, tolLabel: '±5%' },
  { id: 'silver', nameAr: 'فضي', nameFr: 'Argent', nameEn: 'Silver', hex: '#CBD5E1', textLight: false, multiplier: 0.01, multLabel: '×0.01 Ω', tolerance: 10, tolLabel: '±10%' },
];

const DIGIT_BANDS = BAND_DEFS.filter((b) => b.digit !== undefined);
const FIRST_DIGIT_BANDS = DIGIT_BANDS.filter((b) => (b.digit ?? 0) > 0);
const MULTIPLIER_BANDS = BAND_DEFS.filter((b) => b.multiplier !== undefined);
const TOLERANCE_BANDS = BAND_DEFS.filter((b) => b.tolerance !== undefined);

const E96_VALUES = [
  100, 102, 105, 107, 110, 113, 115, 118, 121, 124, 127, 130,
  133, 137, 140, 143, 147, 150, 154, 158, 162, 165, 169, 174,
  178, 182, 187, 191, 196, 200, 205, 210, 215, 221, 226, 232,
  237, 243, 249, 255, 261, 267, 274, 280, 287, 294, 301, 309,
  316, 324, 332, 340, 348, 357, 365, 374, 383, 392, 402, 412,
  422, 432, 442, 453, 464, 475, 487, 499, 511, 523, 536, 549,
  562, 576, 590, 604, 619, 634, 649, 665, 681, 698, 715, 732,
  750, 768, 787, 806, 825, 845, 866, 887, 909, 931, 953, 976,
];

const E96_MULTIPLIERS: Record<string, number> = {
  Z: 0.001,
  Y: 0.01,
  R: 0.01,
  X: 0.1,
  S: 0.1,
  A: 1,
  B: 10,
  C: 100,
  D: 1000,
  E: 10000,
  F: 100000,
};

function formatOhms(ohms: number): string {
  if (!Number.isFinite(ohms) || ohms < 0) return '—';
  if (ohms >= 1_000_000) {
    const m = ohms / 1_000_000;
    return `${Number(m.toFixed(3))} MΩ`;
  }
  if (ohms >= 1000) {
    const k = ohms / 1000;
    return `${Number(k.toFixed(3))} kΩ`;
  }
  return `${Number(ohms.toFixed(3))} Ω`;
}

function parseResistanceInput(raw: string): number | null {
  const clean = raw.trim().toLowerCase().replace(/,/g, '.').replace(/\s+/g, '');
  if (!clean) return null;
  const match = clean.match(/^(\d+(?:\.\d+)?)(m|k|r|ω|ohm|ohms)?$/i);
  if (!match) return null;
  const num = Number(match[1]);
  if (!Number.isFinite(num) || num <= 0) return null;
  const unit = match[2] || '';
  if (unit === 'm') return num * 1_000_000;
  if (unit === 'k') return num * 1_000;
  return num;
}

function encodeOhmsToBands(
  ohms: number,
  bandCount: 4 | 5
): { d1: string; d2: string; d3: string; mult: string } | null {
  if (!Number.isFinite(ohms) || ohms < 0.01 || ohms > 999_000_000) return null;
  const sigCount = bandCount === 4 ? 2 : 3;
  const exp = Math.floor(Math.log10(ohms));
  const powerOfTen = exp - (sigCount - 1);
  const scaled = Math.round(ohms / Math.pow(10, powerOfTen));
  const maxScaled = Math.pow(10, sigCount) - 1;
  let finalScaled = scaled;
  let finalPow = powerOfTen;
  if (finalScaled > maxScaled) {
    finalScaled = Math.round(finalScaled / 10);
    finalPow += 1;
  }
  const str = String(finalScaled).padStart(sigCount, '0');
  const d1Digit = Number(str[0]);
  const d2Digit = Number(str[1]);
  const d3Digit = sigCount === 3 ? Number(str[2]) : 0;

  const multVal = Math.pow(10, finalPow);
  const multBand = MULTIPLIER_BANDS.find((m) => Math.abs((m.multiplier ?? 0) - multVal) < multVal * 0.05);
  const d1Band = DIGIT_BANDS.find((d) => d.digit === d1Digit);
  const d2Band = DIGIT_BANDS.find((d) => d.digit === d2Digit);
  const d3Band = DIGIT_BANDS.find((d) => d.digit === d3Digit);

  if (!multBand || !d1Band || !d2Band || !d3Band) return null;
  return {
    d1: d1Band.id,
    d2: d2Band.id,
    d3: d3Band.id,
    mult: multBand.id,
  };
}

function decodeSmdCode(raw: string): { ohms: number; rule: 'zero' | 'r_notation' | '3digit' | '4digit' | 'eia96'; tolerance?: string } | null {
  const code = raw.trim().toUpperCase();
  if (!code) return null;

  if (/^0+$/.test(code) || code === '0R0') {
    return { ohms: 0, rule: 'zero' };
  }

  // R notation e.g. 4R7, R22, 0R47
  const rMatch = code.match(/^(\d*)R(\d+)$/);
  if (rMatch) {
    const intPart = rMatch[1] || '0';
    const fracPart = rMatch[2];
    const val = Number(`${intPart}.${fracPart}`);
    if (Number.isFinite(val)) {
      return { ohms: val, rule: 'r_notation' };
    }
  }

  // 3-digit standard e.g. 103, 472, 220
  if (/^\d{3}$/.test(code)) {
    const base = Number(code.slice(0, 2));
    const exp = Number(code[2]);
    return { ohms: base * Math.pow(10, exp), rule: '3digit', tolerance: '±5%' };
  }

  // 4-digit precision e.g. 1002, 4701
  if (/^\d{4}$/.test(code)) {
    const base = Number(code.slice(0, 3));
    const exp = Number(code[3]);
    return { ohms: base * Math.pow(10, exp), rule: '4digit', tolerance: '±1%' };
  }

  // EIA-96 e.g. 01C, 68X
  const e96Match = code.match(/^(\d{2})([A-Z])$/);
  if (e96Match) {
    const idx = Number(e96Match[1]);
    const mult = E96_MULTIPLIERS[e96Match[2]];
    if (idx >= 1 && idx <= 96 && mult !== undefined) {
      return { ohms: E96_VALUES[idx - 1] * mult, rule: 'eia96', tolerance: '±1%' };
    }
  }

  return null;
}

type ReaderMode = '4band' | '5band' | 'smd';
type ActiveSlot = 'b1' | 'b2' | 'b3' | 'mult' | 'tol';

const QUICK_VALUES = [
  { label: '100Ω', ohms: 100 },
  { label: '220Ω', ohms: 220 },
  { label: '330Ω', ohms: 330 },
  { label: '470Ω', ohms: 470 },
  { label: '1kΩ', ohms: 1000 },
  { label: '2.2kΩ', ohms: 2200 },
  { label: '4.7kΩ', ohms: 4700 },
  { label: '10kΩ', ohms: 10000 },
  { label: '47kΩ', ohms: 47000 },
  { label: '100kΩ', ohms: 100000 },
  { label: '1MΩ', ohms: 1000000 },
];

export const ResistorColorReader: React.FC = () => {
  const { pick } = useLanguage();

  const [mode, setMode] = useState<ReaderMode>('4band');
  const [b1Id, setB1Id] = useState<string>('yellow'); // 4
  const [b2Id, setB2Id] = useState<string>('violet'); // 7
  const [b3Id, setB3Id] = useState<string>('black');  // 0 (5-band)
  const [multId, setMultId] = useState<string>('red'); // x100 => 4.7k
  const [tolId, setTolId] = useState<string>('gold');  // ±5%

  const [activeSlot, setActiveSlot] = useState<ActiveSlot>('b1');
  const [reverseInput, setReverseInput] = useState<string>('4.7k');
  const [reverseError, setReverseError] = useState<boolean>(false);
  const [smdCode, setSmdCode] = useState<string>('472');

  const band1 = BAND_DEFS.find((b) => b.id === b1Id) || FIRST_DIGIT_BANDS[0];
  const band2 = BAND_DEFS.find((b) => b.id === b2Id) || DIGIT_BANDS[0];
  const band3 = BAND_DEFS.find((b) => b.id === b3Id) || DIGIT_BANDS[0];
  const multBand = BAND_DEFS.find((b) => b.id === multId) || MULTIPLIER_BANDS[0];
  const tolBand = BAND_DEFS.find((b) => b.id === tolId) || TOLERANCE_BANDS[0];

  const calculated = useMemo(() => {
    const d1 = band1.digit ?? 0;
    const d2 = band2.digit ?? 0;
    const d3 = band3.digit ?? 0;
    const m = multBand.multiplier ?? 1;
    const ohms = mode === '5band' ? (d1 * 100 + d2 * 10 + d3) * m : (d1 * 10 + d2) * m;
    const tolPct = tolBand.tolerance ?? 5;
    const minOhms = ohms * (1 - tolPct / 100);
    const maxOhms = ohms * (1 + tolPct / 100);
    return { ohms, tolPct, minOhms, maxOhms };
  }, [band1, band2, band3, multBand, tolBand, mode]);

  const smdResult = useMemo(() => decodeSmdCode(smdCode), [smdCode]);

  const colorLabel = (b: ColorBandDef) => pick(b.nameAr, b.nameFr, b.nameEn);

  const applyReverseValue = (valStr: string, targetMode?: '4band' | '5band') => {
    setReverseInput(valStr);
    const parsed = parseResistanceInput(valStr);
    const useMode = targetMode ?? (mode === '5band' ? '5band' : '4band');
    if (!parsed) {
      setReverseError(true);
      return;
    }
    const encoded = encodeOhmsToBands(parsed, useMode === '5band' ? 5 : 4);
    if (!encoded) {
      setReverseError(true);
      return;
    }
    setReverseError(false);
    setB1Id(encoded.d1);
    setB2Id(encoded.d2);
    setB3Id(encoded.d3);
    setMultId(encoded.mult);
    if (useMode === '5band' && tolId === 'gold') {
      setTolId('brown');
    }
  };

  const handleModeChange = (nextMode: ReaderMode) => {
    setMode(nextMode);
    if (nextMode === '4band' && activeSlot === 'b3') {
      setActiveSlot('mult');
    }
    if (nextMode === '5band' && tolId === 'gold') {
      setTolId('brown');
    }
    if (nextMode === '4band' && tolId === 'brown') {
      setTolId('gold');
    }
  };

  const slotOptions = useMemo(() => {
    if (activeSlot === 'b1') return FIRST_DIGIT_BANDS;
    if (activeSlot === 'b2' || activeSlot === 'b3') return DIGIT_BANDS;
    if (activeSlot === 'mult') return MULTIPLIER_BANDS;
    return TOLERANCE_BANDS;
  }, [activeSlot]);

  const currentSlotBandId =
    activeSlot === 'b1'
      ? b1Id
      : activeSlot === 'b2'
      ? b2Id
      : activeSlot === 'b3'
      ? b3Id
      : activeSlot === 'mult'
      ? multId
      : tolId;

  const setSlotBandId = (id: string) => {
    setReverseError(false);
    if (activeSlot === 'b1') setB1Id(id);
    else if (activeSlot === 'b2') setB2Id(id);
    else if (activeSlot === 'b3') setB3Id(id);
    else if (activeSlot === 'mult') setMultId(id);
    else setTolId(id);
  };

  const slotsMeta: { key: ActiveSlot; label: string; band: ColorBandDef }[] =
    mode === '5band'
      ? [
          { key: 'b1', label: pick('الحلقة 1', 'Anneau 1', 'Band 1'), band: band1 },
          { key: 'b2', label: pick('الحلقة 2', 'Anneau 2', 'Band 2'), band: band2 },
          { key: 'b3', label: pick('الحلقة 3', 'Anneau 3', 'Band 3'), band: band3 },
          { key: 'mult', label: pick('المضاعف', 'Multip.', 'Multiplier'), band: multBand },
          { key: 'tol', label: pick('نسبة الخطأ', 'Tolérance', 'Tolerance'), band: tolBand },
        ]
      : [
          { key: 'b1', label: pick('الحلقة 1', 'Anneau 1', 'Band 1'), band: band1 },
          { key: 'b2', label: pick('الحلقة 2', 'Anneau 2', 'Band 2'), band: band2 },
          { key: 'mult', label: pick('المضاعف', 'Multip.', 'Multiplier'), band: multBand },
          { key: 'tol', label: pick('نسبة الخطأ', 'Tolérance', 'Tolerance'), band: tolBand },
        ];

  return (
    <div className="space-y-6">
      {/* Header + Mode Switcher */}
      <section className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            {pick('قارئ ألوان المقاومات (4 و 5 حلقات + SMD)', 'Lecteur de code couleurs des résistances', 'Resistor Color Code Reader (4-Band, 5-Band & SMD)')}
          </h2>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            {pick(
              'اضغط على أي حلقة في المقاومة واختر لونها لقراءة القيمة، أو اكتب قيمة المقاومة لمعرفة ألوانها فوراً.',
              'Touchez un anneau de la résistance pour choisir sa couleur, ou saisissez une valeur pour trouver ses anneaux.',
              'Tap any band on the resistor to set its color, or enter a target resistance value for instant reverse lookup.'
            )}
          </p>
        </div>

        <div className="inline-flex rounded-xl bg-slate-200/70 dark:bg-[#0F172A] p-1 border border-[#E2E8F0] dark:border-[#334155] self-start">
          {(
            [
              { id: '4band', label: pick('4 حلقات', '4 anneaux', '4-Band') },
              { id: '5band', label: pick('5 حلقات', '5 anneaux', '5-Band') },
              { id: 'smd', label: pick('مقاومات SMD', 'CMS / SMD', 'SMD Code') },
            ] as const
          ).map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => handleModeChange(m.id)}
              className={`min-h-[40px] rounded-lg px-3.5 py-1.5 text-xs font-bold transition-colors whitespace-nowrap ${
                mode === m.id
                  ? 'bg-[#059669] text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
      </section>

      {mode === 'smd' ? (
        /* SMD Resistor Code Reader */
        <section className="rounded-2xl border border-[#E2E8F0] dark:border-[#334155] bg-white dark:bg-[#1E293B] p-5 sm:p-6 space-y-6 shadow-sm">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 items-center">
            <div className="lg:col-span-5 flex flex-col items-center justify-center rounded-2xl bg-[#F8FAFC] dark:bg-[#0F172A] p-6 border border-[#E2E8F0] dark:border-[#334155]">
              {/* Realistic SMD Chip Resistor Graphic */}
              <svg viewBox="0 0 260 120" className="w-full max-w-[260px]" aria-label="SMD resistor preview">
                <rect x="24" y="24" width="38" height="72" rx="4" fill="#cbd5e1" stroke="#64748b" strokeWidth="2" />
                <rect x="198" y="24" width="38" height="72" rx="4" fill="#cbd5e1" stroke="#64748b" strokeWidth="2" />
                <rect x="58" y="20" width="144" height="80" rx="5" fill="#18181b" stroke="#334155" strokeWidth="2" />
                <text
                  x="130"
                  y="70"
                  textAnchor="middle"
                  className="fill-slate-100 text-[32px] font-extrabold font-mono"
                  direction="ltr"
                >
                  {smdCode.trim().toUpperCase() || '---'}
                </text>
              </svg>
              <div className="mt-3 text-xs text-slate-500 dark:text-slate-400">
                {pick('شريحة مقاومة سطحية (SMD)', 'Résistance CMS (SMD)', 'Surface-Mount Resistor Package')}
              </div>
            </div>

            <div className="lg:col-span-7 space-y-4">
              <div>
                <label htmlFor="smd-input" className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  {pick('أدخل الرمز المطبوع على المقاومة السطحية:', 'Saisissez le marquage imprimé sur le composant CMS :', 'Enter marking printed on the SMD resistor:')}
                </label>
                <div className="flex flex-wrap items-center gap-2">
                  <input
                    id="smd-input"
                    type="text"
                    maxLength={5}
                    value={smdCode}
                    onChange={(e) => setSmdCode(e.target.value.toUpperCase().slice(0, 5))}
                    placeholder="472"
                    dir="ltr"
                    className="w-36 min-h-[44px] rounded-xl border border-[#E2E8F0] dark:border-[#334155] bg-[#F8FAFC] dark:bg-[#0F172A] px-4 text-center font-mono-num text-base font-extrabold text-slate-900 dark:text-slate-100 uppercase focus:border-[#059669] focus:outline-none"
                  />
                  {['103', '472', '220', '4R7', 'R22', '1002', '01C', '000'].map((ex) => (
                    <button
                      key={ex}
                      type="button"
                      onClick={() => setSmdCode(ex)}
                      className={`min-h-[40px] rounded-lg px-3 py-1 font-mono-num text-xs font-bold border transition-colors ${
                        smdCode.toUpperCase() === ex
                          ? 'border-[#059669] bg-[#059669] text-white'
                          : 'border-[#E2E8F0] dark:border-[#334155] bg-[#F8FAFC] dark:bg-[#0F172A] text-slate-700 dark:text-slate-200 hover:border-[#059669]'
                      }`}
                    >
                      {ex}
                    </button>
                  ))}
                </div>
              </div>

              {smdResult ? (
                <div className="rounded-xl border border-emerald-200 dark:border-emerald-800/70 bg-emerald-50/70 dark:bg-[#0F172A] p-4 space-y-2">
                  <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                    {pick('القيمة المقروءة:', 'Valeur décodée :', 'Decoded Resistance:')}
                  </div>
                  <div className="text-3xl font-extrabold font-mono-num text-[#059669] dark:text-emerald-400" dir="ltr">
                    {formatOhms(smdResult.ohms)} {smdResult.tolerance || ''}
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {smdResult.rule === 'zero' &&
                      pick('مقاومة صفرية (Jumper) تُستخدم كجسر توصيل على اللوحة.', 'Résistance 0 Ω utilisée comme pont de liaison (jumper).', 'Zero-ohm jumper link used to bridge PCB traces.')}
                    {smdResult.rule === 'r_notation' &&
                      pick('الحرف R يمثل الفاصلة العشرية للوحدة أوم (مثلاً 4R7 = 4.7Ω).', 'La lettre R remplace la virgule décimale en ohms (ex : 4R7 = 4.7 Ω).', 'The letter R represents the decimal point in ohms (e.g., 4R7 = 4.7 Ω).')}
                    {smdResult.rule === '3digit' &&
                      pick('كود ثلاثي قياسي: أول رقمين للقيمة والرقم الثالث هو عدد الأصفار.', 'Code à 3 chiffres : les 2 premiers donnent la valeur, le 3e le nombre de zéros.', 'Standard 3-digit code: first two digits are significant, 3rd digit is power of 10.')}
                    {smdResult.rule === '4digit' &&
                      pick('كود رباعي دقيق (±1%): أول 3 أرقام للقيمة والرابع هو عدد الأصفار.', 'Code à 4 chiffres de précision (±1%) : 3 chiffres + multiplicateur.', 'Precision 4-digit code (±1%): first three digits are significant, 4th is multiplier.')}
                    {smdResult.rule === 'eia96' &&
                      pick('كود EIA-96 عالي الدقة (±1%): الرقم يمثل ترتيباً في جدول E96 والحرف هو المضاعف.', 'Code EIA-96 haute précision (±1%) : index E96 + lettre multiplicatrice.', 'High-precision EIA-96 code (±1%): 2-digit E96 index + multiplier letter.')}
                  </p>
                </div>
              ) : (
                <div className="rounded-xl border border-amber-200 dark:border-amber-800/60 bg-amber-50/70 dark:bg-amber-950/30 p-4 text-xs font-semibold text-[#D97706] dark:text-amber-300">
                  {pick(
                    'أدخل كوداً صالحاً مثل: 103 أو 472 أو 1002 أو 4R7 أو 01C.',
                    'Entrez un code valide comme 103, 472, 1002, 4R7 ou 01C.',
                    'Enter a valid SMD marking such as 103, 472, 1002, 4R7, or 01C.'
                  )}
                </div>
              )}
            </div>
          </div>
        </section>
      ) : (
        /* 4-Band & 5-Band Interactive Color Code Reader */
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 items-start">
          {/* Left Main Stage: Visual Interactive Resistor + Result + Swatches */}
          <section className="lg:col-span-8 rounded-2xl border border-[#E2E8F0] dark:border-[#334155] bg-white dark:bg-[#1E293B] p-5 sm:p-6 space-y-5 shadow-sm">
            {/* Result Readout Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#E2E8F0] dark:border-[#334155]">
              <div>
                <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  {pick('قيمة المقاومة المقروءة', 'Valeur nominale lue', 'Nominal Resistance Value')}
                </div>
                <div className="mt-0.5 text-3xl sm:text-4xl font-extrabold font-mono-num text-[#059669] dark:text-emerald-400" dir="ltr">
                  {formatOhms(calculated.ohms)} <span className="text-xl sm:text-2xl text-slate-700 dark:text-slate-300">{tolBand.tolLabel}</span>
                </div>
              </div>

              <div className="text-start sm:text-end">
                <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  {pick('نطاق الفحص المقبول بالملتيميتر', 'Plage acceptable au multimètre', 'Valid Multimeter Range')}
                </div>
                <div className="mt-0.5 text-sm sm:text-base font-bold font-mono-num text-slate-800 dark:text-slate-100" dir="ltr">
                  {formatOhms(calculated.minOhms)} — {formatOhms(calculated.maxOhms)}
                </div>
              </div>
            </div>

            {/* Interactive SVG Axial Resistor */}
            <div className="rounded-2xl bg-[#F8FAFC] dark:bg-[#0F172A] p-4 sm:p-6 border border-[#E2E8F0] dark:border-[#334155]">
              <svg
                viewBox="0 0 560 170"
                className="w-full max-w-2xl mx-auto select-none"
                aria-label={pick('مقاومة تفاعلية - اضغط على أي حلقة لتغيير لونها', 'Résistance interactive', 'Interactive resistor band selector')}
              >
                <defs>
                  <linearGradient id="leadGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#e2e8f0" />
                    <stop offset="50%" stopColor="#94a3b8" />
                    <stop offset="100%" stopColor="#cbd5e1" />
                  </linearGradient>
                  <linearGradient id="bodyBeige" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f1dec0" />
                    <stop offset="35%" stopColor="#e2c799" />
                    <stop offset="100%" stopColor="#c5a16a" />
                  </linearGradient>
                  <linearGradient id="bodyBlue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#93c5fd" />
                    <stop offset="35%" stopColor="#60a5fa" />
                    <stop offset="100%" stopColor="#2563eb" />
                  </linearGradient>
                </defs>

                {/* Metal Leads */}
                <rect x="16" y="74" width="110" height="12" rx="6" fill="url(#leadGrad)" />
                <rect x="434" y="74" width="110" height="12" rx="6" fill="url(#leadGrad)" />

                {/* Resistor Ceramic Body */}
                <path
                  d="M118 42 C118 32, 158 32, 174 44 L386 44 C402 32, 442 32, 442 42 L442 118 C442 128, 402 128, 386 116 L174 116 C158 128, 118 128, 118 118 Z"
                  fill={mode === '5band' ? 'url(#bodyBlue)' : 'url(#bodyBeige)'}
                  stroke={mode === '5band' ? '#1d4ed8' : '#a17a47'}
                  strokeWidth="2.2"
                />

                {/* Interactive Color Bands */}
                {(mode === '5band'
                  ? [
                      { key: 'b1' as ActiveSlot, x: 146, y: 38, h: 84, band: band1 },
                      { key: 'b2' as ActiveSlot, x: 202, y: 44, h: 72, band: band2 },
                      { key: 'b3' as ActiveSlot, x: 248, y: 44, h: 72, band: band3 },
                      { key: 'mult' as ActiveSlot, x: 294, y: 44, h: 72, band: multBand },
                      { key: 'tol' as ActiveSlot, x: 392, y: 38, h: 84, band: tolBand },
                    ]
                  : [
                      { key: 'b1' as ActiveSlot, x: 148, y: 38, h: 84, band: band1 },
                      { key: 'b2' as ActiveSlot, x: 212, y: 44, h: 72, band: band2 },
                      { key: 'mult' as ActiveSlot, x: 266, y: 44, h: 72, band: multBand },
                      { key: 'tol' as ActiveSlot, x: 390, y: 38, h: 84, band: tolBand },
                    ]
                ).map((slot, idx) => {
                  const isActive = activeSlot === slot.key;
                  return (
                    <g
                      key={slot.key}
                      onClick={() => setActiveSlot(slot.key)}
                      style={{ cursor: 'pointer' }}
                    >
                      <rect
                        x={slot.x}
                        y={slot.y}
                        width="24"
                        height={slot.h}
                        rx="2"
                        fill={slot.band.hex}
                        stroke={isActive ? '#059669' : '#0f172a'}
                        strokeOpacity={isActive ? 1 : 0.25}
                        strokeWidth={isActive ? 3 : 1}
                      />
                      {isActive && (
                        <polygon
                          points={`${slot.x + 12},18 ${slot.x + 5},8 ${slot.x + 19},8`}
                          fill="#059669"
                        />
                      )}
                      <text
                        x={slot.x + 12}
                        y="148"
                        textAnchor="middle"
                        className={`text-[11px] font-bold font-mono-num ${
                          isActive ? 'fill-[#059669] dark:fill-emerald-400' : 'fill-slate-500 dark:fill-slate-400'
                        }`}
                      >
                        {slot.key === 'mult' ? '×' : slot.key === 'tol' ? '±%' : idx + 1}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* Band Selector Tabs */}
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-2">
              {slotsMeta.map((slot) => {
                const isActive = activeSlot === slot.key;
                return (
                  <button
                    key={slot.key}
                    type="button"
                    onClick={() => setActiveSlot(slot.key)}
                    className={`flex min-h-[48px] items-center gap-2.5 rounded-xl border px-3 py-2 text-start transition-all ${
                      isActive
                        ? 'border-[#059669] bg-emerald-50/70 dark:bg-emerald-950/50 ring-2 ring-[#059669]/20'
                        : 'border-[#E2E8F0] dark:border-[#334155] bg-[#F8FAFC] dark:bg-[#0F172A] hover:border-[#059669]'
                    }`}
                  >
                    <span
                      className="h-6 w-4 rounded border border-slate-400/50 shrink-0"
                      style={{ backgroundColor: slot.band.hex }}
                    />
                    <div className="min-w-0">
                      <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 truncate">
                        {slot.label}
                      </div>
                      <div className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                        {colorLabel(slot.band)}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Tactile Color Swatch Grid for Currently Selected Band */}
            <div className="space-y-2.5">
              <div className="text-xs font-bold text-slate-700 dark:text-slate-200">
                {pick('اختر اللون للحلقة المحددة:', 'Choisissez la couleur de l’anneau sélectionné :', 'Pick color for selected band:')}
              </div>
              <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                {slotOptions.map((c) => {
                  const selected = currentSlotBandId === c.id;
                  const valText =
                    activeSlot === 'mult'
                      ? c.multLabel
                      : activeSlot === 'tol'
                      ? c.tolLabel
                      : String(c.digit);

                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setSlotBandId(c.id)}
                      className={`flex min-h-[48px] items-center justify-between gap-2 rounded-xl border px-2.5 py-2 text-xs font-bold transition-transform ${
                        selected ? 'ring-2 ring-[#059669] scale-[1.02] border-[#059669]' : 'border-slate-300/60 dark:border-[#334155] hover:scale-[1.01]'
                      }`}
                      style={{
                        backgroundColor: c.hex,
                        color: c.textLight ? '#ffffff' : '#0f172a',
                      }}
                    >
                      <div className="min-w-0 text-start">
                        <div className="truncate leading-tight">{colorLabel(c)}</div>
                        <div className="text-[10px] opacity-90 font-mono-num" dir="ltr">
                          {valText}
                        </div>
                      </div>
                      {selected && <Check className="h-4 w-4 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Right Deck: Reverse Value -> Color Lookup + Quick Reading Tips */}
          <aside className="lg:col-span-4 space-y-4">
            {/* Value-to-Color Reverse Converter */}
            <section className="rounded-2xl border border-[#E2E8F0] dark:border-[#334155] bg-white dark:bg-[#1E293B] p-5 space-y-4 shadow-sm">
              <div className="flex items-center gap-2">
                <ArrowLeftRight className="h-4 w-4 text-[#059669] dark:text-emerald-400" />
                <h3 className="text-sm font-extrabold text-slate-900 dark:text-slate-100">
                  {pick('تحويل عكسي (من القيمة للألوان)', 'Conversion inverse (Valeur → Couleurs)', 'Reverse Lookup (Value → Bands)')}
                </h3>
              </div>

              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="pointer-events-none absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    value={reverseInput}
                    onChange={(e) => applyReverseValue(e.target.value)}
                    placeholder="4.7k, 330, 1M"
                    dir="ltr"
                    aria-label={pick('أدخل قيمة المقاومة', 'Saisir la valeur', 'Enter resistance value')}
                    className="w-full min-h-[44px] rounded-xl border border-[#E2E8F0] dark:border-[#334155] bg-[#F8FAFC] dark:bg-[#0F172A] ps-9 pe-3 font-mono-num text-sm font-bold text-slate-900 dark:text-slate-100 focus:border-[#059669] focus:outline-none"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => applyReverseValue('4.7k')}
                  aria-label={pick('إعادة ضبط', 'Réinitialiser', 'Reset')}
                  className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl border border-[#E2E8F0] dark:border-[#334155] text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <RotateCcw className="h-4 w-4" />
                </button>
              </div>

              {reverseError && (
                <p className="text-xs font-semibold text-[#D97706] dark:text-amber-400">
                  {pick(
                    'اكتب رقماً صحيحاً مع اختيار الوحدة مثل 330 أو 4.7k أو 1M.',
                    'Entrez une valeur valide telle que 330, 4.7k ou 1M.',
                    'Enter a valid resistance such as 330, 4.7k, or 1M.'
                  )}
                </p>
              )}

              <div>
                <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-2">
                  {pick('قيم قياسية شائعة (اضغط للتطبيق):', 'Valeurs E12 courantes :', 'Common Standard Values:')}
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {QUICK_VALUES.map((qv) => (
                    <button
                      key={qv.label}
                      type="button"
                      onClick={() => applyReverseValue(qv.label.replace('Ω', ''))}
                      className={`min-h-[36px] rounded-lg border px-2.5 py-1 font-mono-num text-xs font-bold transition-colors ${
                        Math.abs(calculated.ohms - qv.ohms) < qv.ohms * 0.01
                          ? 'border-[#059669] bg-emerald-50 dark:bg-emerald-950/60 text-[#059669] dark:text-emerald-300'
                          : 'border-[#E2E8F0] dark:border-[#334155] bg-[#F8FAFC] dark:bg-[#0F172A] text-slate-700 dark:text-slate-200 hover:border-[#059669]'
                      }`}
                    >
                      {qv.label}
                    </button>
                  ))}
                </div>
              </div>
            </section>

            {/* How to orient resistor tip */}
            <section className="rounded-2xl border border-[#E2E8F0] dark:border-[#334155] bg-white dark:bg-[#1E293B] p-5 space-y-2.5 text-xs leading-relaxed text-slate-600 dark:text-slate-300 shadow-sm">
              <div className="flex items-center gap-2 font-extrabold text-slate-900 dark:text-slate-100">
                <Info className="h-4 w-4 text-[#D97706] dark:text-amber-400 shrink-0" />
                <span>{pick('من أي جهة نبدأ القراءة؟', 'Dans quel sens lire ?', 'Which Side Do You Read From?')}</span>
              </div>
              <p>
                {pick(
                  'ضع الحلقة الذهبية أو الفضية (أو الحلقة الأبعد عن البقية) جهة اليمين دائماً، ثم ابدأ بقراءة الألوان من اليسار إلى اليمين.',
                  'Placez toujours l’anneau Or ou Argent (le plus espacé) à droite, puis lisez les couleurs de gauche à droite.',
                  'Hold the resistor with the Gold or Silver band (or the wider-spaced band) on the right, then read bands left to right.'
                )}
              </p>
            </section>
          </aside>
        </div>
      )}

      {/* Complete EIA Color Code Reference Table */}
      <section className="rounded-2xl border border-[#E2E8F0] dark:border-[#334155] bg-white dark:bg-[#1E293B] p-5 overflow-x-auto shadow-sm">
        <h3 className="text-sm font-extrabold text-slate-900 dark:text-slate-100 mb-3">
          {pick('الجدول المرجعي الكامل لألوان المقاومات', 'Tableau de référence des couleurs', 'Complete Resistor Color Code Reference Chart')}
        </h3>
        <table className="w-full min-w-[560px] text-xs">
          <thead>
            <tr className="border-b border-[#E2E8F0] dark:border-[#334155] text-slate-500 dark:text-slate-400">
              <th className="py-2 text-start font-bold">{pick('اللون', 'Couleur', 'Color')}</th>
              <th className="py-2 text-center font-bold">{pick('الرقم', 'Chiffre', 'Digit')}</th>
              <th className="py-2 text-center font-bold">{pick('المضاعف', 'Multiplicateur', 'Multiplier')}</th>
              <th className="py-2 text-center font-bold">{pick('نسبة الخطأ', 'Tolérance', 'Tolerance')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E2E8F0] dark:divide-[#334155]">
            {BAND_DEFS.map((b) => (
              <tr key={b.id} className="hover:bg-slate-50 dark:hover:bg-[#0F172A]/60">
                <td className="py-2">
                  <div className="flex items-center gap-2.5 font-bold text-slate-900 dark:text-slate-100">
                    <span
                      className="h-4 w-7 rounded border border-slate-300 dark:border-slate-600 shrink-0"
                      style={{ backgroundColor: b.hex }}
                    />
                    <span>{colorLabel(b)}</span>
                  </div>
                </td>
                <td className="py-2 text-center font-mono-num font-semibold text-slate-700 dark:text-slate-300">
                  {b.digit !== undefined ? b.digit : '—'}
                </td>
                <td className="py-2 text-center font-mono-num font-semibold text-slate-700 dark:text-slate-300" dir="ltr">
                  {b.multLabel || '—'}
                </td>
                <td className="py-2 text-center font-mono-num font-semibold text-slate-700 dark:text-slate-300" dir="ltr">
                  {b.tolLabel || '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
};
