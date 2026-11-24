import React, { useMemo, useState } from 'react';
import { useLanguage } from '../i18n/LanguageContext';

interface ColorBand {
  nameAr: string;
  nameFr: string;
  nameEn: string;
  hex: string;
  digit?: number;
  multiplier?: number;
  tolerance?: string;
}

const BAND_COLORS: ColorBand[] = [
  { nameAr: 'أسود', nameFr: 'Noir', nameEn: 'Black', hex: '#18181B', digit: 0, multiplier: 1 },
  { nameAr: 'بني', nameFr: 'Marron', nameEn: 'Brown', hex: '#78350F', digit: 1, multiplier: 10, tolerance: '±1%' },
  { nameAr: 'أحمر', nameFr: 'Rouge', nameEn: 'Red', hex: '#DC2626', digit: 2, multiplier: 100, tolerance: '±2%' },
  { nameAr: 'برتقالي', nameFr: 'Orange', nameEn: 'Orange', hex: '#EA580C', digit: 3, multiplier: 1000 },
  { nameAr: 'أصفر', nameFr: 'Jaune', nameEn: 'Yellow', hex: '#EAB308', digit: 4, multiplier: 10000 },
  { nameAr: 'أخضر', nameFr: 'Vert', nameEn: 'Green', hex: '#16A34A', digit: 5, multiplier: 100000, tolerance: '±0.5%' },
  { nameAr: 'أزرق', nameFr: 'Bleu', nameEn: 'Blue', hex: '#2563EB', digit: 6, multiplier: 1000000, tolerance: '±0.25%' },
  { nameAr: 'بنفسجي', nameFr: 'Violet', nameEn: 'Violet', hex: '#7C3AED', digit: 7, multiplier: 10000000, tolerance: '±0.1%' },
  { nameAr: 'رمادي', nameFr: 'Gris', nameEn: 'Gray', hex: '#64748B', digit: 8 },
  { nameAr: 'أبيض', nameFr: 'Blanc', nameEn: 'White', hex: '#F8FAFC', digit: 9 },
  { nameAr: 'ذهبي', nameFr: 'Or', nameEn: 'Gold', hex: '#D4AF37', multiplier: 0.1, tolerance: '±5%' },
  { nameAr: 'فضي', nameFr: 'Argent', nameEn: 'Silver', hex: '#CBD5E1', multiplier: 0.01, tolerance: '±10%' },
];

const DIGIT_BANDS = BAND_COLORS.filter((b) => b.digit !== undefined);
const MULTIPLIER_BANDS = BAND_COLORS.filter((b) => b.multiplier !== undefined);
const TOLERANCE_BANDS = BAND_COLORS.filter((b) => b.tolerance !== undefined);

const E12_BASE = [1.0, 1.2, 1.5, 1.8, 2.2, 2.7, 3.3, 3.9, 4.7, 5.6, 6.8, 8.2];

function formatOhms(ohms: number): string {
  if (ohms >= 1_000_000) return `${(ohms / 1_000_000).toFixed(ohms % 1_000_000 === 0 ? 0 : 2)} MΩ`;
  if (ohms >= 1000) return `${(ohms / 1000).toFixed(ohms % 1000 === 0 ? 0 : 2)} kΩ`;
  return `${Number(ohms.toFixed(2))} Ω`;
}

function nearestStandardResistor(target: number): number {
  if (target <= 0) return 0;
  const exp = Math.floor(Math.log10(target));
  const candidates: number[] = [];
  for (let e = exp - 1; e <= exp + 1; e++) {
    for (const base of E12_BASE) {
      candidates.push(base * Math.pow(10, e));
    }
  }
  return candidates.reduce((best, curr) =>
    Math.abs(curr - target) < Math.abs(best - target) ? curr : best
  );
}

export const CalculatorsView: React.FC = () => {
  const { pick } = useLanguage();

  // 1. Resistor 4-band state (default Brown-Black-Red-Gold = 1kΩ ±5%)
  const [b1, setB1] = useState(1);
  const [b2, setB2] = useState(0);
  const [multIdx, setMultIdx] = useState(2);
  const [tolIdx, setTolIdx] = useState(6);

  // 2. LED & Ohm's Law state
  const [vs, setVs] = useState(9);
  const [vf, setVf] = useState(2.0);
  const [currentMa, setCurrentMa] = useState(15);

  // 3. Capacitor 3-digit code decoder
  const [capCode, setCapCode] = useState('104');

  const band1 = DIGIT_BANDS[b1];
  const band2 = DIGIT_BANDS[b2];
  const multBand = MULTIPLIER_BANDS[multIdx];
  const tolBand = TOLERANCE_BANDS[tolIdx];

  const resistorOhms = ((band1.digit || 0) * 10 + (band2.digit || 0)) * (multBand.multiplier || 1);

  const ledCalc = useMemo(() => {
    const drop = Math.max(0, vs - vf);
    const amps = currentMa / 1000;
    const exactR = amps > 0 ? drop / amps : 0;
    const stdR = nearestStandardResistor(exactR);
    const watts = drop * amps;
    return { drop, exactR, stdR, watts };
  }, [vs, vf, currentMa]);

  const decodedCap = useMemo(() => {
    const clean = capCode.trim();
    if (!/^\d{3}$/.test(clean)) return null;
    const d1 = Number(clean[0]);
    const d2 = Number(clean[1]);
    const zeros = Number(clean[2]);
    if (zeros > 7) return null;
    const pf = (d1 * 10 + d2) * Math.pow(10, zeros);
    const nf = pf / 1000;
    const uf = nf / 1000;
    return { pf, nf, uf };
  }, [capCode]);

  const bandName = (b: ColorBand) => pick(b.nameAr, b.nameFr, b.nameEn);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
          {pick('الحاسبات الهندسية السريعة', 'Calculateurs électroniques rapides', 'Quick Electronics Calculators')}
        </h2>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
          {pick(
            'أدوات يومية لقراءة ألوان المقاومات، حساب مقاومة الليد، وفك شفرة المكثفات السيراميكية.',
            'Outils pratiques pour le code couleurs des résistances, la résistance de protection LED et le code des condensateurs céramiques.',
            'Everyday engineering tools for resistor color codes, LED series resistors, and ceramic capacitor codes.'
          )}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Calculator 1: Resistor Color Code */}
        <section className="lg:col-span-7 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-6 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {pick('01. حاسبة ألوان المقاومة (4 حلقات)', '01. Code couleurs résistance (4 anneaux)', '01. 4-Band Resistor Color Calculator')}
            </h3>
            <span className="font-mono-num text-lg sm:text-xl font-extrabold text-sky-600 dark:text-sky-400" dir="ltr">
              {formatOhms(resistorOhms)} {tolBand.tolerance}
            </span>
          </div>

          {/* Live SVG Resistor */}
          <div className="flex items-center justify-center rounded-xl bg-slate-50 dark:bg-slate-950 p-4 border border-slate-200 dark:border-slate-800">
            <svg viewBox="0 0 320 90" className="w-full max-w-sm h-20" aria-label={pick('معاينة ألوان المقاومة', 'Aperçu résistance', 'Resistor preview')}>
              <line x1="16" y1="45" x2="72" y2="45" stroke="#94A3B8" strokeWidth="6" strokeLinecap="round" />
              <line x1="248" y1="45" x2="304" y2="45" stroke="#94A3B8" strokeWidth="6" strokeLinecap="round" />
              <path
                d="M72 24 C72 20, 92 20, 102 26 L218 26 C228 20, 248 20, 248 24 L248 66 C248 70, 228 70, 218 64 L102 64 C92 70, 72 70, 72 66 Z"
                fill="#E2C799"
                stroke="#B48A5A"
                strokeWidth="2"
              />
              <rect x="98" y="25" width="14" height="40" fill={band1.hex} />
              <rect x="128" y="26" width="14" height="38" fill={band2.hex} />
              <rect x="158" y="26" width="14" height="38" fill={multBand.hex} />
              <rect x="206" y="25" width="14" height="40" fill={tolBand.hex} />
            </svg>
          </div>

          {/* Selectors */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">
                {pick('الحلقة 1 (العشرات)', 'Anneau 1 (Dizaine)', 'Band 1 (Tens)')}
              </label>
              <select
                value={b1}
                onChange={(e) => setB1(Number(e.target.value))}
                className="w-full min-h-[44px] rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-3 text-xs font-semibold text-slate-900 dark:text-white"
              >
                {DIGIT_BANDS.map((b, i) => (
                  <option key={b.nameEn} value={i}>
                    {bandName(b)} ({b.digit})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">
                {pick('الحلقة 2 (الآحاد)', 'Anneau 2 (Unité)', 'Band 2 (Ones)')}
              </label>
              <select
                value={b2}
                onChange={(e) => setB2(Number(e.target.value))}
                className="w-full min-h-[44px] rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-3 text-xs font-semibold text-slate-900 dark:text-white"
              >
                {DIGIT_BANDS.map((b, i) => (
                  <option key={b.nameEn} value={i}>
                    {bandName(b)} ({b.digit})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">
                {pick('المضاعف (×)', 'Multiplicateur (×)', 'Multiplier (×)')}
              </label>
              <select
                value={multIdx}
                onChange={(e) => setMultIdx(Number(e.target.value))}
                className="w-full min-h-[44px] rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-3 text-xs font-semibold text-slate-900 dark:text-white"
              >
                {MULTIPLIER_BANDS.map((b, i) => (
                  <option key={b.nameEn} value={i}>
                    {bandName(b)} (×{b.multiplier})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">
                {pick('نسبة الخطأ', 'Tolérance', 'Tolerance')}
              </label>
              <select
                value={tolIdx}
                onChange={(e) => setTolIdx(Number(e.target.value))}
                className="w-full min-h-[44px] rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-3 text-xs font-semibold text-slate-900 dark:text-white"
              >
                {TOLERANCE_BANDS.map((b, i) => (
                  <option key={b.nameEn} value={i}>
                    {bandName(b)} ({b.tolerance})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </section>

        {/* Calculator 2: LED Series Resistor */}
        <section className="lg:col-span-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-6 space-y-5">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            {pick('02. حاسبة مقاومة حماية الليد (LED)', '02. Calculateur résistance LED', '02. LED Series Resistor Calculator')}
          </h3>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1.5">
                <label htmlFor="slider-vs" className="text-slate-600 dark:text-slate-400">
                  {pick('جهد المصدر (Vs)', 'Tension d’alimentation (Vs)', 'Supply Voltage (Vs)')}
                </label>
                <span className="font-mono-num text-slate-900 dark:text-white" dir="ltr">{vs.toFixed(1)} V</span>
              </div>
              <input
                id="slider-vs"
                type="range"
                min="3"
                max="24"
                step="0.5"
                value={vs}
                onChange={(e) => setVs(Number(e.target.value))}
                className="w-full accent-sky-600 h-2 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1.5">
                <label htmlFor="slider-vf" className="text-slate-600 dark:text-slate-400">
                  {pick('جهد الليد الأمامي (Vf)', 'Tension directe LED (Vf)', 'LED Forward Voltage (Vf)')}
                </label>
                <span className="font-mono-num text-slate-900 dark:text-white" dir="ltr">{vf.toFixed(1)} V</span>
              </div>
              <input
                id="slider-vf"
                type="range"
                min="1.6"
                max="3.6"
                step="0.1"
                value={vf}
                onChange={(e) => setVf(Number(e.target.value))}
                className="w-full accent-sky-600 h-2 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1.5">
                <label htmlFor="slider-if" className="text-slate-600 dark:text-slate-400">
                  {pick('تيار التشغيل المطلوب (If)', 'Courant souhaité (If)', 'Target Current (If)')}
                </label>
                <span className="font-mono-num text-slate-900 dark:text-white" dir="ltr">{currentMa} mA</span>
              </div>
              <input
                id="slider-if"
                type="range"
                min="5"
                max="30"
                step="1"
                value={currentMa}
                onChange={(e) => setCurrentMa(Number(e.target.value))}
                className="w-full accent-sky-600 h-2 cursor-pointer"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 grid grid-cols-2 gap-4">
            <div>
              <div className="text-xs text-slate-500 dark:text-slate-400">
                {pick('المقاومة القياسية الأقرب', 'Valeur standard proche', 'Nearest Standard R')}
              </div>
              <div className="font-mono-num text-xl font-extrabold text-sky-600 dark:text-sky-400 mt-0.5" dir="ltr">
                {vs <= vf ? 'Vs ≤ Vf' : formatOhms(ledCalc.stdR)}
              </div>
              {vs > vf && (
                <div className="text-[11px] text-slate-500 font-mono-num" dir="ltr">
                  Exact: {Math.round(ledCalc.exactR)} Ω
                </div>
              )}
            </div>
            <div>
              <div className="text-xs text-slate-500 dark:text-slate-400">
                {pick('القدرة المبددة (الواط)', 'Puissance dissipée', 'Power Dissipation')}
              </div>
              <div className="font-mono-num text-xl font-extrabold text-slate-900 dark:text-white mt-0.5" dir="ltr">
                {ledCalc.watts.toFixed(3)} W
              </div>
              <div className="text-[11px] text-slate-500">
                {ledCalc.watts > 0.25
                  ? pick('استخدم مقاومة 0.5W أو 1W', 'Utilisez une résistance 0.5W ou 1W', 'Use a 0.5W or 1W resistor')
                  : pick('تكفي مقاومة 0.25W قياسية', 'Une 0.25W standard suffit', 'Standard 0.25W resistor is safe')}
              </div>
            </div>
          </div>
        </section>

        {/* Calculator 3: Ceramic Capacitor Code Decoder */}
        <section className="lg:col-span-12 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {pick('03. فك شفرة المكثفات السيراميكية (الكود الثلاثي)', '03. Décodeur condensateur céramique (3 chiffres)', '03. Ceramic Capacitor 3-Digit Decoder')}
              </h3>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                {pick(
                  'أدخل الأرقام الثلاثة المطبوعة على المكثف السيراميكي (مثل 104 أو 103 أو 472).',
                  'Saisissez les 3 chiffres imprimés sur le condensateur (ex : 104, 103, 472).',
                  'Enter the 3 digits printed on the ceramic disc capacitor (e.g., 104, 103, 472).'
                )}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {['102', '103', '104', '223', '472', '474'].map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setCapCode(preset)}
                  className={`min-h-[40px] rounded-lg px-3 py-1.5 font-mono-num text-xs font-bold border transition-colors ${
                    capCode === preset
                      ? 'border-sky-600 bg-sky-600 text-white'
                      : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {preset}
                </button>
              ))}
              <input
                type="text"
                inputMode="numeric"
                maxLength={3}
                value={capCode}
                onChange={(e) => setCapCode(e.target.value.replace(/\D/g, '').slice(0, 3))}
                aria-label={pick('كود المكثف الثلاثي', 'Code à 3 chiffres', '3-digit capacitor code')}
                className="w-24 min-h-[40px] rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-3 text-center font-mono-num text-sm font-bold text-slate-900 dark:text-white"
                dir="ltr"
              />
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-slate-200 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-4">
            {decodedCap ? (
              <>
                <div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    {pick('بيكو فاراد (pF)', 'Picofarad (pF)', 'Picofarads (pF)')}
                  </div>
                  <div className="font-mono-num text-lg font-bold text-slate-900 dark:text-white mt-0.5" dir="ltr">
                    {decodedCap.pf.toLocaleString('en-US')} pF
                  </div>
                </div>
                <div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    {pick('نانو فاراد (nF)', 'Nanofarad (nF)', 'Nanofarads (nF)')}
                  </div>
                  <div className="font-mono-num text-lg font-bold text-sky-600 dark:text-sky-400 mt-0.5" dir="ltr">
                    {decodedCap.nf} nF
                  </div>
                </div>
                <div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    {pick('مايكرو فاراد (µF)', 'Microfarad (µF)', 'Microfarads (µF)')}
                  </div>
                  <div className="font-mono-num text-lg font-bold text-slate-900 dark:text-white mt-0.5" dir="ltr">
                    {decodedCap.uf} µF
                  </div>
                </div>
              </>
            ) : (
              <div className="col-span-3 text-sm text-amber-600 dark:text-amber-400">
                {pick(
                  'أدخل 3 أرقام صحيحة (مثال: الرقم الأول والثاني قيمة، والرقم الثالث عدد الأصفار بالبيكو فاراد).',
                  'Entrez 3 chiffres valides (les 2 premiers donnent la valeur, le 3e le nombre de zéros en pF).',
                  'Enter 3 valid digits (first 2 digits are base value, 3rd digit is trailing zeros in pF).'
                )}
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};
