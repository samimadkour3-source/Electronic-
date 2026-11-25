import React, { useMemo, useState } from 'react';
import { useLanguage } from '../i18n/LanguageContext';

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

  // 1. LED & Ohm's Law state
  const [vs, setVs] = useState(9);
  const [vf, setVf] = useState(2.0);
  const [currentMa, setCurrentMa] = useState(15);

  // 2. Capacitor 3-digit code decoder
  const [capCode, setCapCode] = useState('104');

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

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-slate-100">
          {pick('حاسبة الليد والمكثفات السريعة', 'Calculateurs LED & Condensateurs', 'LED & Capacitor Quick Calculators')}
        </h2>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
          {pick(
            'أدوات يومية لحساب مقاومة حماية الليد وفك شفرة المكثفات السيراميكية.',
            'Outils pratiques pour la résistance de protection LED et le code des condensateurs céramiques.',
            'Everyday engineering tools for LED series resistors and ceramic capacitor 3-digit codes.'
          )}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Calculator 1: LED Series Resistor */}
        <section className="lg:col-span-6 rounded-2xl border border-[#E2E8F0] dark:border-[#334155] bg-white dark:bg-[#1E293B] p-5 sm:p-6 space-y-5 shadow-sm">
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
            {pick('01. حاسبة مقاومة حماية الليد (LED)', '01. Calculateur résistance LED', '01. LED Series Resistor Calculator')}
          </h3>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1.5">
                <label htmlFor="slider-vs" className="text-slate-600 dark:text-slate-400">
                  {pick('جهد المصدر (Vs)', 'Tension d’alimentation (Vs)', 'Supply Voltage (Vs)')}
                </label>
                <span className="font-mono-num text-slate-900 dark:text-slate-100" dir="ltr">{vs.toFixed(1)} V</span>
              </div>
              <input
                id="slider-vs"
                type="range"
                min="3"
                max="24"
                step="0.5"
                value={vs}
                onChange={(e) => setVs(Number(e.target.value))}
                className="w-full accent-[#059669] h-2 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1.5">
                <label htmlFor="slider-vf" className="text-slate-600 dark:text-slate-400">
                  {pick('جهد الليد الأمامي (Vf)', 'Tension directe LED (Vf)', 'LED Forward Voltage (Vf)')}
                </label>
                <span className="font-mono-num text-slate-900 dark:text-slate-100" dir="ltr">{vf.toFixed(1)} V</span>
              </div>
              <input
                id="slider-vf"
                type="range"
                min="1.6"
                max="3.6"
                step="0.1"
                value={vf}
                onChange={(e) => setVf(Number(e.target.value))}
                className="w-full accent-[#059669] h-2 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1.5">
                <label htmlFor="slider-if" className="text-slate-600 dark:text-slate-400">
                  {pick('تيار التشغيل المطلوب (If)', 'Courant souhaité (If)', 'Target Current (If)')}
                </label>
                <span className="font-mono-num text-slate-900 dark:text-slate-100" dir="ltr">{currentMa} mA</span>
              </div>
              <input
                id="slider-if"
                type="range"
                min="5"
                max="30"
                step="1"
                value={currentMa}
                onChange={(e) => setCurrentMa(Number(e.target.value))}
                className="w-full accent-[#059669] h-2 cursor-pointer"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-[#E2E8F0] dark:border-[#334155] grid grid-cols-2 gap-4">
            <div>
              <div className="text-xs text-slate-500 dark:text-slate-400">
                {pick('المقاومة القياسية الأقرب', 'Valeur standard proche', 'Nearest Standard R')}
              </div>
              <div className="font-mono-num text-xl font-extrabold text-[#059669] dark:text-emerald-400 mt-0.5" dir="ltr">
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
              <div className="font-mono-num text-xl font-extrabold text-slate-900 dark:text-slate-100 mt-0.5" dir="ltr">
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

        {/* Calculator 2: Ceramic Capacitor Code Decoder */}
        <section className="lg:col-span-6 rounded-2xl border border-[#E2E8F0] dark:border-[#334155] bg-white dark:bg-[#1E293B] p-5 sm:p-6 flex flex-col justify-between shadow-sm">
          <div className="flex flex-col gap-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                {pick('02. فك شفرة المكثفات السيراميكية (الكود الثلاثي)', '02. Décodeur condensateur céramique (3 chiffres)', '02. Ceramic Capacitor 3-Digit Decoder')}
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
                      ? 'border-[#059669] bg-[#059669] text-white'
                      : 'border-[#E2E8F0] dark:border-[#334155] bg-[#F8FAFC] dark:bg-[#0F172A] text-slate-700 dark:text-slate-300 hover:border-[#059669]'
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
                className="w-24 min-h-[40px] rounded-xl border border-[#E2E8F0] dark:border-[#334155] bg-[#F8FAFC] dark:bg-[#0F172A] px-3 text-center font-mono-num text-sm font-bold text-slate-900 dark:text-slate-100 focus:border-[#059669] focus:outline-none"
                dir="ltr"
              />
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-[#E2E8F0] dark:border-[#334155] grid grid-cols-1 sm:grid-cols-3 gap-4">
            {decodedCap ? (
              <>
                <div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    {pick('بيكو فاراد (pF)', 'Picofarad (pF)', 'Picofarads (pF)')}
                  </div>
                  <div className="font-mono-num text-lg font-bold text-slate-900 dark:text-slate-100 mt-0.5" dir="ltr">
                    {decodedCap.pf.toLocaleString('en-US')} pF
                  </div>
                </div>
                <div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    {pick('نانو فاراد (nF)', 'Nanofarad (nF)', 'Nanofarads (nF)')}
                  </div>
                  <div className="font-mono-num text-lg font-bold text-[#059669] dark:text-emerald-400 mt-0.5" dir="ltr">
                    {decodedCap.nf} nF
                  </div>
                </div>
                <div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    {pick('مايكرو فاراد (µF)', 'Microfarad (µF)', 'Microfarads (µF)')}
                  </div>
                  <div className="font-mono-num text-lg font-bold text-slate-900 dark:text-slate-100 mt-0.5" dir="ltr">
                    {decodedCap.uf} µF
                  </div>
                </div>
              </>
            ) : (
              <div className="col-span-3 text-sm text-[#D97706] dark:text-amber-400">
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
