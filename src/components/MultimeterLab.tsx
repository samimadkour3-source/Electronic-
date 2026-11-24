import React, { useMemo, useState } from 'react';
import { ArrowLeftRight, CheckCircle2, AlertTriangle, Volume2, VolumeX, XCircle } from 'lucide-react';
import { ELECTRONIC_COMPONENTS } from '../data/componentsData';
import { ComponentCondition, MultimeterMode } from '../types/electronics';
import { ComponentImage } from './ComponentImage';
import { SchematicSymbol } from './SchematicSymbol';
import { useLanguage } from '../i18n/LanguageContext';
import { getLocalizedComponent } from '../i18n/dataTranslations';

interface MultimeterLabProps {
  initialComponentId?: string;
}

export const MultimeterLab: React.FC<MultimeterLabProps> = ({ initialComponentId }) => {
  const { lang, pick } = useLanguage();

  const dialModes: { id: MultimeterMode; label: string; short: string }[] = useMemo(
    () => [
      { id: 'OFF', label: pick('إيقاف', 'Arrêt', 'OFF'), short: 'OFF' },
      { id: 'OHM', label: pick('الأوم (Ω)', 'Ohms (Ω)', 'Ohms (Ω)'), short: 'Ω' },
      { id: 'DIODE', label: pick('دايود / جرس', 'Diode / Bip', 'Diode / Beep'), short: '⊳| 🔊' },
      { id: 'CAP', label: pick('السعة (┤├)', 'Capacité', 'Cap (┤├)'), short: '┤├' },
      { id: 'VOLT_DC', label: pick('جهد مستمر', 'Tension DC', 'DC Volts'), short: 'V DC' },
    ],
    [pick]
  );

  const conditions: { id: ComponentCondition; label: string }[] = useMemo(
    () => [
      { id: 'good', label: pick('عنصر سليم', 'Composant sain', 'Healthy Part') },
      { id: 'open', label: pick('عطل قطع (Open)', 'Circuit ouvert (Open)', 'Open Fault') },
      { id: 'short', label: pick('عطل قصر (Short)', 'Court-circuit (Short)', 'Short Fault') },
      { id: 'degraded', label: pick('ضعف / تسريب', 'Fuite / Dégradé', 'Degraded / Leaky') },
    ],
    [pick]
  );

  const [selectedId, setSelectedId] = useState<string>(
    initialComponentId || ELECTRONIC_COMPONENTS[0].id
  );
  const [mode, setMode] = useState<MultimeterMode>(() => {
    const comp = ELECTRONIC_COMPONENTS.find((c) => c.id === (initialComponentId || ELECTRONIC_COMPONENTS[0].id));
    return comp?.measurement.recommendedMode || 'OHM';
  });
  const [condition, setCondition] = useState<ComponentCondition>('good');
  const [probesSwapped, setProbesSwapped] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const component = useMemo(
    () => ELECTRONIC_COMPONENTS.find((c) => c.id === selectedId) || ELECTRONIC_COMPONENTS[0],
    [selectedId]
  );

  const loc = getLocalizedComponent(component, lang);

  const playBeep = () => {
    if (!soundEnabled || typeof window === 'undefined') return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(2400, ctx.currentTime);
      gain.gain.setValueAtTime(0.06, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.18);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.19);
    } catch {
      // Ignore audio errors if blocked
    }
  };

  const handleSelectComponent = (id: string) => {
    setSelectedId(id);
    const comp = ELECTRONIC_COMPONENTS.find((c) => c.id === id);
    if (comp) {
      setMode(comp.measurement.recommendedMode);
    }
    setProbesSwapped(false);
  };

  const handleModeChange = (nextMode: MultimeterMode) => {
    setMode(nextMode);
    const willBeep =
      nextMode === 'DIODE' &&
      ((condition === 'short' && component.measurement.simValues.beepOnShort) ||
        (condition === 'good' && component.measurement.simValues.beepOnGood));
    if (willBeep) {
      playBeep();
    }
  };

  const handleConditionChange = (nextCond: ComponentCondition) => {
    setCondition(nextCond);
    const willBeep =
      mode === 'DIODE' &&
      ((nextCond === 'short' && component.measurement.simValues.beepOnShort) ||
        (nextCond === 'good' && component.measurement.simValues.beepOnGood));
    if (willBeep) {
      playBeep();
    }
  };

  const reading = useMemo(() => {
    if (mode === 'OFF') return '---';
    const sim = component.measurement.simValues;
    if (condition === 'good') {
      return probesSwapped ? sim.goodReverse[mode] : sim.goodForward[mode];
    }
    return sim[condition][mode];
  }, [component, condition, mode, probesSwapped]);

  const isBeeping =
    mode === 'DIODE' &&
    ((condition === 'short' && component.measurement.simValues.beepOnShort) ||
      (condition === 'good' && component.measurement.simValues.beepOnGood));

  const isRecommendedMode = mode === component.measurement.recommendedMode;

  const diagnosticVerdict = useMemo(() => {
    if (mode === 'OFF') {
      return {
        status: 'neutral' as const,
        title: pick('الجهاز مغلق (OFF)', 'Multimètre éteint (OFF)', 'Meter Turned OFF'),
        message: pick(
          `اختر وضع القياس الموصى به (${loc.recommendedModeLabel}) لبدء اختبار ${loc.name}.`,
          `Sélectionnez le mode recommandé (${loc.recommendedModeLabel}) pour tester : ${loc.name}.`,
          `Select the recommended mode (${loc.recommendedModeLabel}) to test ${loc.name}.`
        ),
      };
    }
    if (!isRecommendedMode) {
      return {
        status: 'warning' as const,
        title: pick('وضع قياس غير قياسي لهذا العنصر', 'Mode non standard pour ce composant', 'Non-standard mode for this part'),
        message: pick(
          `يفضل قياس ${loc.name} على ${loc.recommendedModeLabel} للحصول على تشخيص دقيق.`,
          `Il est préférable de mesurer ${loc.name} en mode ${loc.recommendedModeLabel}.`,
          `For best accuracy, measure ${loc.name} using ${loc.recommendedModeLabel}.`
        ),
      };
    }
    if (condition === 'good') {
      return {
        status: 'good' as const,
        title:
          probesSwapped && component.measurement.polaritySensitive
            ? pick('انحياز عكسي سليم (قطبية معكوسة)', 'Polarisation inverse correcte', 'Healthy Reverse Bias (Probes Swapped)')
            : pick('نتيجة الفحص: العنصر سليم', 'Diagnostic : Composant sain', 'Result: Component Healthy'),
        message: loc.goodReading,
      };
    }
    if (condition === 'open') {
      return {
        status: 'fault' as const,
        title: pick('نتيجة الفحص: عطل قطع داخلي (Open)', 'Diagnostic : Circuit ouvert (Open)', 'Result: Open Circuit Fault'),
        message: loc.openFaultReading,
      };
    }
    if (condition === 'short') {
      return {
        status: 'fault' as const,
        title: pick('نتيجة الفحص: عطل قصر / شورت (Short)', 'Diagnostic : Court-circuit (Short)', 'Result: Short Circuit Fault'),
        message: loc.shortFaultReading,
      };
    }
    return {
      status: 'warning' as const,
      title: pick('نتيجة الفحص: ضعف أو تسريب', 'Diagnostic : Fuite ou composant dégradé', 'Result: Degraded / Leaky'),
      message: loc.degradedReading,
    };
  }, [component.measurement.polaritySensitive, condition, isRecommendedMode, loc, mode, pick, probesSwapped]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
            {pick('مختبر القياس التفاعلي بالملتيميتر', 'Laboratoire de mesure au multimètre', 'Interactive Multimeter Testing Lab')}
          </h2>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            {pick(
              'اختر العنصر وحالته، ثم بدّل وضع الملتيميتر والأقطاب لمحاكاة القراءة الحقيقية.',
              'Choisissez un composant et son état, puis tournez le sélecteur et inversez les sondes.',
              'Select a component and fault state, switch the meter dial, and swap probes to observe real readings.'
            )}
          </p>
        </div>

        <button
          type="button"
          onClick={() => setSoundEnabled((v) => !v)}
          className="inline-flex min-h-[44px] items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
        >
          {soundEnabled ? <Volume2 className="h-4 w-4 text-sky-600" /> : <VolumeX className="h-4 w-4 text-slate-400" />}
          <span>{soundEnabled ? pick('صوت الجرس مفعّل', 'Bip activé', 'Beeper On') : pick('صوت الجرس مكتوم', 'Bip coupé', 'Beeper Muted')}</span>
        </button>
      </div>

      {/* Component Selector Strip */}
      <div>
        <label htmlFor="sim-component-select" className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-2">
          {pick('1. اختر العنصر المراد فحصه', '1. Sélectionnez le composant à tester', '1. Choose component to test')}
        </label>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {ELECTRONIC_COMPONENTS.map((item) => {
            const active = item.id === selectedId;
            const itemLoc = getLocalizedComponent(item, lang);
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleSelectComponent(item.id)}
                className={`min-h-[44px] rounded-xl px-3.5 py-2 text-xs font-semibold whitespace-nowrap shrink-0 transition-colors border ${
                  active
                    ? 'border-sky-600 bg-sky-600 text-white'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {itemLoc.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Two-Zone Sandbox Layout (Interactive DMM + Controls/Diagnostics) */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 items-stretch">
        {/* Left/Right Stage: Digital Multimeter + Test Bench */}
        <div className="lg:col-span-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-900 text-white p-5 sm:p-6 flex flex-col justify-between gap-5">
          {/* LCD Display */}
          <div>
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span>{pick('شاشة الملتيميتر الرقمي (True RMS)', 'Écran Multimètre Numérique (True RMS)', 'Digital Multimeter LCD (True RMS)')}</span>
              <span className="font-mono-num">{mode}</span>
            </div>

            <div className="rounded-xl bg-[#C7D3BA] text-slate-950 px-4 py-5 shadow-inner border-4 border-slate-800">
              <div className="flex items-center justify-between text-[11px] font-mono font-bold text-slate-700 mb-1">
                <span>
                  {probesSwapped
                    ? pick('الأقطاب معكوسة (- / +)', 'Sondes inversées (- / +)', 'Probes Swapped (- / +)')
                    : pick('توصيل قياسي (+ / -)', 'Polarité normale (+ / -)', 'Standard Polarity (+ / -)')}
                </span>
                <span>{isBeeping ? '🔊 BEEP' : 'AUTO'}</span>
              </div>
              <div
                className="font-mono-num text-2xl sm:text-3xl font-bold tracking-tight text-left truncate"
                dir="ltr"
              >
                {reading}
              </div>
            </div>
          </div>

          {/* Dial Mode Buttons */}
          <div>
            <div className="text-xs font-semibold text-slate-300 mb-2">
              {pick('2. قرص اختيار وضع القياس', '2. Sélecteur de mode', '2. Function Dial Mode')}
            </div>
            <div className="grid grid-cols-5 gap-1.5 bg-slate-800/90 p-1.5 rounded-xl">
              {dialModes.map((m) => {
                const active = mode === m.id;
                const recommended = m.id === component.measurement.recommendedMode;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => handleModeChange(m.id)}
                    className={`min-h-[46px] flex flex-col items-center justify-center rounded-lg px-1 py-1.5 text-center transition-colors ${
                      active
                        ? 'bg-sky-500 text-white font-bold shadow-sm'
                        : 'text-slate-300 hover:bg-slate-700/70'
                    }`}
                  >
                    <span className="font-mono-num text-xs leading-none" dir="ltr">{m.short}</span>
                    <span className="mt-1 text-[10px] leading-none opacity-90 truncate max-w-full">
                      {recommended ? pick('موصى به', 'Conseillé', 'Best') : m.label.split(' ')[0]}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Probe Polarity & Physical Specimen Preview */}
          <div className="flex items-center justify-between gap-4 rounded-xl bg-slate-800/70 p-3.5 border border-slate-700/80">
            <div className="flex items-center gap-3 min-w-0">
              <div className="h-14 w-18 shrink-0 overflow-hidden rounded-lg bg-slate-950">
                <ComponentImage
                  src={component.imageUrl}
                  alt={loc.name}
                  componentId={component.id}
                />
              </div>
              <div className="min-w-0">
                <div className="text-sm font-bold text-white truncate">{loc.name}</div>
                <div className="mt-0.5 flex items-center gap-2 text-xs text-slate-300">
                  <span className={probesSwapped ? 'text-slate-300' : 'text-rose-400 font-semibold'}>
                    {probesSwapped ? pick('أسود (COM)', 'Noir (COM)', 'Black (COM)') : pick('أحمر (+)', 'Rouge (+)', 'Red (+)')}
                  </span>
                  <span aria-hidden="true">⇄</span>
                  <span className={probesSwapped ? 'text-rose-400 font-semibold' : 'text-slate-300'}>
                    {probesSwapped ? pick('أحمر (+)', 'Rouge (+)', 'Red (+)') : pick('أسود (COM)', 'Noir (COM)', 'Black (COM)')}
                  </span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setProbesSwapped((s) => !s)}
              className="inline-flex min-h-[44px] items-center gap-1.5 rounded-xl bg-slate-700 px-3 py-2 text-xs font-semibold text-white hover:bg-slate-600 whitespace-nowrap shrink-0 transition-colors"
            >
              <ArrowLeftRight className="h-4 w-4" />
              <span>{pick('عكس الأقطاب', 'Inverser sondes', 'Swap Probes')}</span>
            </button>
          </div>
        </div>

        {/* Control & Diagnostic Deck */}
        <div className="lg:col-span-6 flex flex-col justify-between gap-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-6">
          {/* Condition Selector */}
          <div>
            <div className="text-xs font-bold text-slate-600 dark:text-slate-400 mb-2">
              {pick('3. محاكاة حالة العنصر تحت الاختبار', '3. Simuler l’état du composant', '3. Simulate Component Health')}
            </div>
            <div className="grid grid-cols-2 gap-2">
              {conditions.map((c) => {
                const active = condition === c.id;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => handleConditionChange(c.id)}
                    className={`min-h-[44px] rounded-xl px-3 py-2 text-xs font-semibold border transition-colors ${
                      active
                        ? 'border-slate-900 bg-slate-900 text-white dark:border-sky-500 dark:bg-sky-600'
                        : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    {c.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Diagnostic Verdict */}
          <div
            className={`rounded-2xl border p-4 ${
              diagnosticVerdict.status === 'good'
                ? 'border-emerald-200 dark:border-emerald-900 bg-emerald-50/70 dark:bg-emerald-950/40 text-emerald-950 dark:text-emerald-100'
                : diagnosticVerdict.status === 'fault'
                ? 'border-rose-200 dark:border-rose-900 bg-rose-50/70 dark:bg-rose-950/40 text-rose-950 dark:text-rose-100'
                : diagnosticVerdict.status === 'warning'
                ? 'border-amber-200 dark:border-amber-900 bg-amber-50/70 dark:bg-amber-950/40 text-amber-950 dark:text-amber-100'
                : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100'
            }`}
          >
            <div className="flex items-center gap-2 font-bold text-sm mb-1.5">
              {diagnosticVerdict.status === 'good' && <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />}
              {diagnosticVerdict.status === 'fault' && <XCircle className="h-4 w-4 text-rose-600 dark:text-rose-400 shrink-0" />}
              {diagnosticVerdict.status === 'warning' && <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0" />}
              <span>{diagnosticVerdict.title}</span>
            </div>
            <p className="text-sm leading-relaxed opacity-90">{diagnosticVerdict.message}</p>
          </div>

          {/* Schematic + Quick Tips */}
          <div className="flex items-center gap-4 pt-3 border-t border-slate-200 dark:border-slate-800">
            <div className="w-28 shrink-0 text-slate-800 dark:text-slate-200">
              <SchematicSymbol componentId={component.id} className="h-16 w-full" />
            </div>
            <div className="text-xs leading-relaxed text-slate-600 dark:text-slate-400">
              <span className="font-bold text-slate-800 dark:text-slate-200">
                {pick('ملاحظة السلامة: ', 'Consigne de sécurité : ', 'Safety Note: ')}
              </span>
              {loc.safetyNote}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
