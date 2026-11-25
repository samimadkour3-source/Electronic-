import React, { useMemo, useState } from 'react';
import { RotateCcw, ShieldCheck } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

interface ToleranceOption {
  code: string;
  label: string;
  percent: number | null;
  absPf?: number;
}

const TOLERANCE_OPTIONS: ToleranceOption[] = [
  { code: '', label: '—', percent: null },
  { code: 'F', label: 'F (±1%)', percent: 1 },
  { code: 'G', label: 'G (±2%)', percent: 2 },
  { code: 'J', label: 'J (±5%)', percent: 5 },
  { code: 'K', label: 'K (±10%)', percent: 10 },
  { code: 'M', label: 'M (±20%)', percent: 20 },
  { code: 'Z', label: 'Z (+80/-20%)', percent: null },
];

const VOLTAGE_CODES: { code: string; volts: string }[] = [
  { code: '0J', volts: '6.3V' },
  { code: '1A', volts: '10V' },
  { code: '1C', volts: '16V' },
  { code: '1E', volts: '25V' },
  { code: '1H', volts: '50V' },
  { code: '2A', volts: '100V' },
  { code: '2D', volts: '200V' },
  { code: '2E', volts: '250V' },
  { code: '2G', volts: '400V' },
  { code: '2J', volts: '630V' },
];

const PRESET_CODES = ['101', '102', '103', '104', '223', '334', '471', '472', '474', '104K', '4n7', '2u2', '22'];

const REFERENCE_TABLE: { code: string; pf: string; nf: string; uf: string }[] = [
  { code: '100', pf: '10 pF', nf: '0.01 nF', uf: '0.00001 µF' },
  { code: '220', pf: '22 pF', nf: '0.022 nF', uf: '0.000022 µF' },
  { code: '101', pf: '100 pF', nf: '0.1 nF', uf: '0.0001 µF' },
  { code: '471', pf: '470 pF', nf: '0.47 nF', uf: '0.00047 µF' },
  { code: '102', pf: '1,000 pF', nf: '1 nF', uf: '0.001 µF' },
  { code: '472', pf: '4,700 pF', nf: '4.7 nF', uf: '0.0047 µF' },
  { code: '103', pf: '10,000 pF', nf: '10 nF', uf: '0.01 µF' },
  { code: '473', pf: '47,000 pF', nf: '47 nF', uf: '0.047 µF' },
  { code: '104', pf: '100,000 pF', nf: '100 nF', uf: '0.1 µF' },
  { code: '105', pf: '1,000,000 pF', nf: '1,000 nF', uf: '1 µF' },
];

function formatCleanNumber(val: number): string {
  if (!Number.isFinite(val)) return '—';
  if (val === 0) return '0';
  if (val >= 1000) return Number(val.toFixed(4)).toLocaleString('en-US');
  if (val >= 1) return String(Number(val.toFixed(6)));
  // Preserve tiny decimals cleanly without scientific notation when practical
  const fixed = val.toFixed(9).replace(/0+$/, '').replace(/\.$/, '');
  return fixed;
}

interface DecodedCapResult {
  pf: number;
  nf: number;
  uf: number;
  toleranceCode: string;
  formulaExpr: string;
  kind: '3digit' | 'direct' | 'rnotation';
}

function decodeCapacitorString(rawInput: string, fallbackTol: string): DecodedCapResult | null {
  const cleaned = rawInput.trim().replace(/µ/g, 'u').replace(/\s+/g, '');
  if (!cleaned) return null;

  // Extract trailing tolerance letter if present (only when not part of unit letter like 4n7)
  let body = cleaned;
  let tolCode = fallbackTol;
  const tolMatch = cleaned.match(/^(.+?)([BCDFGJKMZ])$/i);
  if (tolMatch && !/^[pnu]$/i.test(tolMatch[2])) {
    body = tolMatch[1];
    tolCode = tolMatch[2].toUpperCase();
  }

  // Case 1: R / p / n / u notation (e.g., 4n7, 2u2, 4R7, p47, n22, u1)
  const rMatch = body.match(/^(\d*)([rRpPnNuU])(\d*)$/);
  if (rMatch) {
    const intPart = rMatch[1] || '0';
    const unitChar = rMatch[2].toLowerCase();
    const fracPart = rMatch[3] || '0';
    if (!rMatch[1] && !rMatch[3]) return null;
    const numeric = parseFloat(`${intPart}.${fracPart}`);
    if (!Number.isFinite(numeric)) return null;

    let pf = numeric;
    let formulaExpr = `${numeric} pF`;
    if (unitChar === 'n') {
      pf = numeric * 1000;
      formulaExpr = `${numeric} nF × 1,000`;
    } else if (unitChar === 'u') {
      pf = numeric * 1_000_000;
      formulaExpr = `${numeric} µF × 1,000,000`;
    } else if (unitChar === 'r') {
      // R-notation: e.g. R47 on ceramic/film usually 0.47 µF if <1, or 4R7 = 4.7 pF
      if (!rMatch[1]) {
        pf = numeric * 1_000_000;
        formulaExpr = `${numeric} µF (R-prefix)`;
      } else {
        pf = numeric;
        formulaExpr = `${numeric} pF (R-decimal)`;
      }
    }
    return {
      pf,
      nf: pf / 1000,
      uf: pf / 1_000_000,
      toleranceCode: tolCode,
      formulaExpr,
      kind: 'rnotation',
    };
  }

  // Case 2: 3-digit EIA code (e.g. 104, 472, 109)
  if (/^\d{3}$/.test(body)) {
    const d1 = Number(body[0]);
    const d2 = Number(body[1]);
    const multDigit = Number(body[2]);
    const sig = d1 * 10 + d2;
    let mult = 1;
    let multLabel = '';
    if (multDigit <= 7) {
      mult = Math.pow(10, multDigit);
      multLabel = `10^${multDigit}`;
    } else if (multDigit === 8) {
      mult = 0.01;
      multLabel = '0.01';
    } else {
      mult = 0.1;
      multLabel = '0.1';
    }
    const pf = sig * mult;
    return {
      pf,
      nf: pf / 1000,
      uf: pf / 1_000_000,
      toleranceCode: tolCode,
      formulaExpr: `${sig} × ${multLabel} pF`,
      kind: '3digit',
    };
  }

  // Case 3: 1 or 2-digit direct pF code (e.g. 22, 47, 5)
  if (/^\d{1,2}$/.test(body)) {
    const pf = Number(body);
    return {
      pf,
      nf: pf / 1000,
      uf: pf / 1_000_000,
      toleranceCode: tolCode,
      formulaExpr: `${pf} pF (Direct)`,
      kind: 'direct',
    };
  }

  return null;
}

export const CapacitorCodeReader: React.FC = () => {
  const { pick } = useLanguage();
  const [codeInput, setCodeInput] = useState('104');
  const [selectedTol, setSelectedTol] = useState('K');

  const decoded = useMemo(
    () => decodeCapacitorString(codeInput, selectedTol),
    [codeInput, selectedTol]
  );

  const tolObj = useMemo(
    () => TOLERANCE_OPTIONS.find((t) => t.code === (decoded?.toleranceCode ?? selectedTol)) || TOLERANCE_OPTIONS[0],
    [decoded?.toleranceCode, selectedTol]
  );

  const rangeInfo = useMemo(() => {
    if (!decoded || tolObj.percent === null) return null;
    const minUf = decoded.uf * (1 - tolObj.percent / 100);
    const maxUf = decoded.uf * (1 + tolObj.percent / 100);
    const minNf = decoded.nf * (1 - tolObj.percent / 100);
    const maxNf = decoded.nf * (1 + tolObj.percent / 100);
    return decoded.nf >= 1
      ? `${formatCleanNumber(minNf)} – ${formatCleanNumber(maxNf)} nF`
      : `${formatCleanNumber(minUf)} – ${formatCleanNumber(maxUf)} µF`;
  }, [decoded, tolObj]);

  const bestSummary = useMemo(() => {
    if (!decoded) return '—';
    if (decoded.uf >= 1) return `${formatCleanNumber(decoded.uf)} µF`;
    if (decoded.nf >= 1) return `${formatCleanNumber(decoded.nf)} nF`;
    return `${formatCleanNumber(decoded.pf)} pF`;
  }, [decoded]);

  const displayBodyCode = (codeInput.trim() || '104').slice(0, 6);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-slate-100">
            {pick('قارئ رموز المكثفات السيراميكية والسطحية', 'Lecteur de codes condensateurs', 'Capacitor Code Reader')}
          </h2>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            {pick(
              'أدخل الكود المطبوع على المكثف (مثل 104 أو 472 أو 4n7) لحساب القيمة فوراً بوحدات pF و nF و µF.',
              'Saisissez le code imprimé sur le condensateur (ex : 104, 472, 4n7) pour obtenir la valeur en pF, nF et µF.',
              'Enter the code printed on a ceramic or SMD capacitor (e.g. 104, 472, 4n7) to convert instantly to pF, nF, and µF.'
            )}
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setCodeInput('104');
            setSelectedTol('K');
          }}
          className="inline-flex min-h-[44px] items-center gap-2 rounded-xl border border-[#E2E8F0] dark:border-[#334155] bg-white dark:bg-[#1E293B] px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 whitespace-nowrap shadow-sm"
        >
          <RotateCcw className="h-4 w-4 text-[#059669] dark:text-emerald-400" />
          <span>{pick('إعادة تعيين (104)', 'Réinitialiser (104)', 'Reset (104)')}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 items-stretch">
        {/* Left Zone: Live Visual Ceramic + SMD Preview & Instant Readouts */}
        <section className="lg:col-span-6 rounded-2xl border border-[#E2E8F0] dark:border-[#334155] bg-white dark:bg-[#1E293B] p-5 sm:p-6 flex flex-col justify-between gap-5 shadow-sm">
          {/* Visual Capacitor Bodies */}
          <div className="rounded-xl bg-[#0F172A] p-4 sm:p-5 border border-[#334155] flex flex-col items-center justify-center gap-3">
            <div className="w-full flex items-center justify-between text-xs text-slate-400">
              <span>{pick('معاينة الطباعة على جسم المكثف', 'Aperçu du marquage', 'Capacitor Marking Preview')}</span>
              <span className="font-mono-num text-emerald-400 font-bold" dir="ltr">
                {bestSummary}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 w-full items-center py-2" dir="ltr">
              {/* Ceramic Disc Capacitor SVG */}
              <div className="flex flex-col items-center">
                <svg viewBox="0 0 150 130" className="w-32 h-28" aria-hidden="true">
                  <path d="M55 82 L55 122 M95 82 L95 122" stroke="#CBD5E1" strokeWidth="4" strokeLinecap="round" />
                  <ellipse cx="75" cy="52" rx="44" ry="38" fill="#D97706" stroke="#F59E0B" strokeWidth="2.5" />
                  <ellipse cx="75" cy="49" rx="37" ry="31" fill="#F59E0B" opacity="0.35" />
                  <text
                    x="75"
                    y="56"
                    textAnchor="middle"
                    fill="#1E1B18"
                    fontSize="18"
                    fontWeight="800"
                    fontFamily="monospace"
                  >
                    {displayBodyCode}
                  </text>
                  <line x1="56" y1="63" x2="94" y2="63" stroke="#1E1B18" strokeWidth="1.5" opacity="0.7" />
                </svg>
                <span className="text-[11px] text-slate-400">
                  {pick('مكثف سيراميكي (Disc)', 'Céramique disque', 'Ceramic Disc')}
                </span>
              </div>

              {/* SMD MLCC / Tantalum Preview */}
              <div className="flex flex-col items-center">
                <svg viewBox="0 0 160 130" className="w-36 h-28" aria-hidden="true">
                  <rect x="24" y="42" width="16" height="44" rx="2" fill="#94A3B8" />
                  <rect x="120" y="42" width="16" height="44" rx="2" fill="#94A3B8" />
                  <rect x="40" y="40" width="80" height="48" rx="3" fill="#B45309" stroke="#F59E0B" strokeWidth="1.5" />
                  <text
                    x="80"
                    y="69"
                    textAnchor="middle"
                    fill="#FEF3C7"
                    fontSize="16"
                    fontWeight="800"
                    fontFamily="monospace"
                  >
                    {displayBodyCode}
                  </text>
                </svg>
                <span className="text-[11px] text-slate-400">
                  {pick('مكثف سطحي (SMD)', 'Condensateur SMD', 'SMD Chip')}
                </span>
              </div>
            </div>
          </div>

          {/* 3-Unit Result Grid */}
          {decoded ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="rounded-xl border border-[#E2E8F0] dark:border-[#334155] bg-[#F8FAFC] dark:bg-[#0F172A] p-3.5">
                  <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                    {pick('بيكو فاراد (pF)', 'Picofarad (pF)', 'Picofarads (pF)')}
                  </div>
                  <div className="font-mono-num text-lg font-extrabold text-slate-900 dark:text-slate-100 mt-1 truncate" dir="ltr">
                    {formatCleanNumber(decoded.pf)} pF
                  </div>
                </div>

                <div className="rounded-xl border border-emerald-200 dark:border-emerald-800/70 bg-emerald-50/70 dark:bg-[#0F172A] p-3.5">
                  <div className="text-[11px] font-semibold text-[#059669] dark:text-emerald-400">
                    {pick('نانو فاراد (nF)', 'Nanofarad (nF)', 'Nanofarads (nF)')}
                  </div>
                  <div className="font-mono-num text-lg font-extrabold text-[#059669] dark:text-emerald-300 mt-1 truncate" dir="ltr">
                    {formatCleanNumber(decoded.nf)} nF
                  </div>
                </div>

                <div className="rounded-xl border border-amber-200 dark:border-amber-800/60 bg-amber-50/70 dark:bg-[#0F172A] p-3.5">
                  <div className="text-[11px] font-semibold text-[#D97706] dark:text-amber-400">
                    {pick('مايكرو فاراد (µF)', 'Microfarad (µF)', 'Microfarads (µF)')}
                  </div>
                  <div className="font-mono-num text-lg font-extrabold text-[#D97706] dark:text-amber-300 mt-1 truncate" dir="ltr">
                    {formatCleanNumber(decoded.uf)} µF
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-[#E2E8F0] dark:border-[#334155] text-xs text-slate-600 dark:text-slate-400">
                <div>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {pick('طريقة الحساب: ', 'Calcul : ', 'Formula: ')}
                  </span>
                  <span className="font-mono-num" dir="ltr">{decoded.formulaExpr}</span>
                </div>
                {rangeInfo && (
                  <div className="flex items-center gap-1.5 text-[#059669] dark:text-emerald-400 font-semibold">
                    <ShieldCheck className="h-3.5 w-3.5 shrink-0" />
                    <span className="font-mono-num" dir="ltr">
                      {tolObj.label}: {rangeInfo}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="rounded-xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/40 p-4 text-xs sm:text-sm text-[#D97706] dark:text-amber-200">
              {pick(
                'صيغة الكود غير مكتملة. جرب كتابة 3 أرقام مثل 104 أو 472، أو رقمين مثل 22، أو صيغة مثل 4n7 و 2u2.',
                'Format non reconnu. Essayez 3 chiffres (104, 472), 2 chiffres (22) ou 4n7 / 2u2.',
                'Invalid code format. Try 3 digits (104, 472), 2 digits (22), or notation like 4n7 / 2u2.'
              )}
            </div>
          )}
        </section>

        {/* Right Zone: Input, Presets, Tolerance & Reference Table */}
        <section className="lg:col-span-6 rounded-2xl border border-[#E2E8F0] dark:border-[#334155] bg-white dark:bg-[#1E293B] p-5 sm:p-6 space-y-5 shadow-sm">
          <div>
            <label htmlFor="cap-reader-input" className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
              {pick('1. أدخل الرمز المطبوع على المكثف', '1. Saisissez le code du condensateur', '1. Enter Printed Capacitor Code')}
            </label>
            <div className="flex items-center gap-2">
              <input
                id="cap-reader-input"
                type="text"
                maxLength={6}
                value={codeInput}
                onChange={(e) => setCodeInput(e.target.value.replace(/[^0-9a-zA-Zµ]/g, '').slice(0, 6))}
                placeholder="104"
                className="flex-1 min-h-[46px] rounded-xl border border-[#E2E8F0] dark:border-[#334155] bg-[#F8FAFC] dark:bg-[#0F172A] px-4 font-mono-num text-lg font-extrabold text-slate-900 dark:text-slate-100 tracking-wider focus:border-[#059669] focus:outline-none"
                dir="ltr"
              />
              <button
                type="button"
                onClick={() => setCodeInput('')}
                className="min-h-[46px] rounded-xl border border-[#E2E8F0] dark:border-[#334155] bg-slate-100 dark:bg-[#0F172A] px-3.5 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800"
              >
                {pick('مسح', 'Effacer', 'Clear')}
              </button>
            </div>
          </div>

          {/* Quick Presets */}
          <div>
            <div className="text-xs font-bold text-slate-600 dark:text-slate-400 mb-2">
              {pick('2. رموز شائعة للاختبار السريع', '2. Codes courants', '2. Common Codes')}
            </div>
            <div className="flex flex-wrap gap-1.5">
              {PRESET_CODES.map((preset) => {
                const active = codeInput.trim().toLowerCase() === preset.toLowerCase();
                return (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setCodeInput(preset)}
                    dir="ltr"
                    className={`min-h-[38px] rounded-lg px-2.5 py-1 font-mono-num text-xs font-bold border transition-colors ${
                      active
                        ? 'border-[#059669] bg-[#059669] text-white'
                        : 'border-[#E2E8F0] dark:border-[#334155] bg-[#F8FAFC] dark:bg-[#0F172A] text-slate-700 dark:text-slate-300 hover:border-[#059669]'
                    }`}
                  >
                    {preset}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tolerance Selector */}
          <div>
            <div className="text-xs font-bold text-slate-600 dark:text-slate-400 mb-2">
              {pick('3. حرف نسبة الخطأ (Tolerance — اختياري)', '3. Tolérance (Optionnel)', '3. Tolerance Letter (Optional)')}
            </div>
            <div className="flex flex-wrap gap-1.5">
              {TOLERANCE_OPTIONS.map((opt) => {
                const active = (decoded?.toleranceCode ?? selectedTol) === opt.code;
                return (
                  <button
                    key={opt.code || 'none'}
                    type="button"
                    onClick={() => setSelectedTol(opt.code)}
                    dir="ltr"
                    className={`min-h-[36px] rounded-lg px-2.5 py-1 font-mono-num text-[11px] font-semibold border transition-colors ${
                      active
                        ? 'border-[#059669] bg-[#059669] text-white'
                        : 'border-[#E2E8F0] dark:border-[#334155] bg-[#F8FAFC] dark:bg-[#0F172A] text-slate-600 dark:text-slate-300 hover:border-[#059669]'
                    }`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* EIA Voltage Codes Quick Strip */}
          <div className="pt-3 border-t border-[#E2E8F0] dark:border-[#334155]">
            <div className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
              {pick('مرجع رموز جهد التحمل المطبوعة (EIA Voltage Codes)', 'Codes de tension maximale (EIA)', 'EIA Voltage Rating Reference')}
            </div>
            <div className="grid grid-cols-5 gap-1.5" dir="ltr">
              {VOLTAGE_CODES.map((vc) => (
                <div
                  key={vc.code}
                  className="rounded-lg bg-[#F8FAFC] dark:bg-[#0F172A] border border-[#E2E8F0] dark:border-[#334155] px-2 py-1.5 text-center"
                >
                  <div className="font-mono-num text-xs font-extrabold text-slate-900 dark:text-slate-100">{vc.code}</div>
                  <div className="font-mono-num text-[10px] text-slate-500 dark:text-slate-400">{vc.volts}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* Reference Table */}
      <section className="rounded-2xl border border-[#E2E8F0] dark:border-[#334155] bg-white dark:bg-[#1E293B] p-5 sm:p-6 shadow-sm">
        <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100 mb-3">
          {pick('جدول تحويل سريع لأشهر قيم المكثفات', 'Tableau de conversion rapide', 'Quick Conversion Reference Table')}
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs sm:text-sm text-start border-collapse">
            <thead>
              <tr className="border-b border-[#E2E8F0] dark:border-[#334155] text-slate-500 dark:text-slate-400">
                <th className="py-2 px-3 font-semibold">{pick('الرمز', 'Code', 'Code')}</th>
                <th className="py-2 px-3 font-semibold">pF</th>
                <th className="py-2 px-3 font-semibold">nF</th>
                <th className="py-2 px-3 font-semibold">µF</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0] dark:divide-[#334155]">
              {REFERENCE_TABLE.map((row) => (
                <tr
                  key={row.code}
                  onClick={() => setCodeInput(row.code)}
                  className="cursor-pointer hover:bg-slate-50 dark:hover:bg-[#0F172A]/60 transition-colors"
                >
                  <td className="py-2 px-3 font-mono-num font-extrabold text-[#059669] dark:text-emerald-400" dir="ltr">
                    {row.code}
                  </td>
                  <td className="py-2 px-3 font-mono-num text-slate-700 dark:text-slate-300" dir="ltr">{row.pf}</td>
                  <td className="py-2 px-3 font-mono-num text-slate-900 dark:text-slate-100 font-semibold" dir="ltr">{row.nf}</td>
                  <td className="py-2 px-3 font-mono-num text-slate-700 dark:text-slate-300" dir="ltr">{row.uf}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};
