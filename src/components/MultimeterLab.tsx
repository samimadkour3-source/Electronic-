import React, { useMemo, useState } from 'react';
import {
  Activity,
  AlertTriangle,
  ArrowLeftRight,
  Bug,
  CheckCircle2,
  Compass,
  Hash,
  Lightbulb,
  Shuffle,
  Volume2,
  VolumeX,
  XCircle,
} from 'lucide-react';
import { ELECTRONIC_COMPONENTS } from '../data/componentsData';
import { ComponentCondition, ElectronicComponent, MultimeterMode } from '../types/electronics';
import { ComponentImage } from './ComponentImage';
import { SchematicSymbol } from './SchematicSymbol';
import { OscilloscopeDisplay } from './OscilloscopeDisplay';
import { useLanguage } from '../i18n/LanguageContext';
import { getLocalizedComponent } from '../i18n/dataTranslations';

interface MultimeterLabProps {
  initialComponentId?: string;
}

type LabActivityMode = 'explore' | 'fault_challenge';

interface MysteryFaultCase {
  round: number;
  componentId: string;
  trueCondition: ComponentCondition;
  customDriftedReadings: Partial<Record<MultimeterMode, string>>;
  customReverseReadings: Partial<Record<MultimeterMode, string>>;
}

function randomPick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateCustomDegradedReadings(comp: ElectronicComponent): {
  forward: Partial<Record<MultimeterMode, string>>;
  reverse: Partial<Record<MultimeterMode, string>>;
} {
  const rec = comp.measurement.recommendedMode;
  const baseDegraded = comp.measurement.simValues.degraded;

  if (comp.id === 'resistor' || comp.id === 'potentiometer' || comp.id === 'ldr' || comp.id === 'thermistor') {
    const drifted = randomPick(['48.6 kΩ', '142.3 kΩ', '2.84 MΩ', '14.2 Ω', '860 kΩ']);
    return {
      forward: { ...baseDegraded, OHM: drifted },
      reverse: { ...baseDegraded, OHM: drifted },
    };
  }

  if (comp.id === 'capacitor' || comp.id === 'ceramic_cap') {
    const capVal = comp.id === 'capacitor'
      ? randomPick(['11.8 µF (↓)', '24.5 µF (↓)', '6.2 µF (↓)'])
      : randomPick(['18 nF (↓)', '320 pF (↓)', '4.5 nF (↓)']);
    const leakOhm = randomPick(['340 Ω', '1.15 kΩ', '480 Ω']);
    return {
      forward: { ...baseDegraded, CAP: capVal, OHM: leakOhm },
      reverse: { ...baseDegraded, CAP: capVal, OHM: leakOhm },
    };
  }

  if (rec === 'DIODE') {
    const fwdV = randomPick(['0.195 V', '1.48 V', '0.260 V']);
    const revV = randomPick(['0.385 V (Leak)', '0.620 V (Leak)', '1.12 V (Leak)']);
    const leakOhm = randomPick(['420 Ω', '1.8 kΩ', '650 Ω']);
    return {
      forward: { ...baseDegraded, DIODE: fwdV, OHM: leakOhm },
      reverse: { ...baseDegraded, DIODE: revV, OHM: leakOhm },
    };
  }

  if (rec === 'VOLT_DC') {
    const badV = randomPick(['2.14 V (↓)', '8.75 V (↑)', '1.42 V (↓)', '0.85 V (↓)']);
    return {
      forward: { ...baseDegraded, VOLT_DC: badV },
      reverse: { ...baseDegraded, VOLT_DC: `-${badV}` },
    };
  }

  const badOhm = randomPick(['68.5 Ω', '0.9 Ω', '4.2 kΩ', '310 Ω']);
  return {
    forward: { ...baseDegraded, OHM: badOhm },
    reverse: { ...baseDegraded, OHM: badOhm },
  };
}

function createMysteryChallenge(round: number, prevComponentId?: string): MysteryFaultCase {
  const pool = ELECTRONIC_COMPONENTS.filter((c) => c.id !== prevComponentId);
  const pickedComp = randomPick(pool.length > 0 ? pool : ELECTRONIC_COMPONENTS);
  const weightedConditions: ComponentCondition[] = [
    'open',
    'short',
    'degraded',
    'open',
    'short',
    'degraded',
    'degraded',
    'good',
  ];
  const trueCondition = randomPick(weightedConditions);
  const custom =
    trueCondition === 'degraded'
      ? generateCustomDegradedReadings(pickedComp)
      : { forward: {}, reverse: {} };

  return {
    round,
    componentId: pickedComp.id,
    trueCondition,
    customDriftedReadings: custom.forward,
    customReverseReadings: custom.reverse,
  };
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
      { id: 'degraded', label: pick('قيمة خاطئة / تسريب', 'Valeur erronée / Fuite', 'Drifted / Leaky') },
    ],
    [pick]
  );

  const [activityMode, setActivityMode] = useState<LabActivityMode>('explore');
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
  const [displayView, setDisplayView] = useState<'digital' | 'oscilloscope'>('digital');

  // Fault Simulation Challenge State
  const [mysteryCase, setMysteryCase] = useState<MysteryFaultCase>(() =>
    createMysteryChallenge(1, initialComponentId)
  );
  const [testedModes, setTestedModes] = useState<MultimeterMode[]>([]);
  const [userGuess, setUserGuess] = useState<ComponentCondition | null>(null);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [score, setScore] = useState<{ correct: number; total: number }>({ correct: 0, total: 0 });

  const activeComponentId = activityMode === 'fault_challenge' ? mysteryCase.componentId : selectedId;
  const activeCondition = activityMode === 'fault_challenge' ? mysteryCase.trueCondition : condition;

  const component = useMemo(
    () => ELECTRONIC_COMPONENTS.find((c) => c.id === activeComponentId) || ELECTRONIC_COMPONENTS[0],
    [activeComponentId]
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

  const startNextFaultRound = () => {
    const next = createMysteryChallenge(mysteryCase.round + 1, mysteryCase.componentId);
    setMysteryCase(next);
    setMode('OFF');
    setProbesSwapped(false);
    setTestedModes([]);
    setUserGuess(null);
    setShowHint(false);
  };

  const handleSwitchActivityMode = (nextActivity: LabActivityMode) => {
    setActivityMode(nextActivity);
    if (nextActivity === 'fault_challenge') {
      const next = createMysteryChallenge(mysteryCase.round, selectedId);
      setMysteryCase(next);
      setMode('OFF');
      setProbesSwapped(false);
      setTestedModes([]);
      setUserGuess(null);
      setShowHint(false);
    } else {
      const comp = ELECTRONIC_COMPONENTS.find((c) => c.id === selectedId) || ELECTRONIC_COMPONENTS[0];
      setMode(comp.measurement.recommendedMode);
      setProbesSwapped(false);
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
    if (activityMode === 'fault_challenge' && nextMode !== 'OFF') {
      setTestedModes((prev) => (prev.includes(nextMode) ? prev : [...prev, nextMode]));
    }
    const willBeep =
      nextMode === 'DIODE' &&
      ((activeCondition === 'short' && component.measurement.simValues.beepOnShort) ||
        (activeCondition === 'good' && component.measurement.simValues.beepOnGood));
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

  const handleSubmitDiagnosis = (guess: ComponentCondition) => {
    if (userGuess !== null || testedModes.length === 0) return;
    setUserGuess(guess);
    setScore((prev) => ({
      correct: prev.correct + (guess === mysteryCase.trueCondition ? 1 : 0),
      total: prev.total + 1,
    }));
  };

  const reading = useMemo(() => {
    if (mode === 'OFF') return '---';
    const sim = component.measurement.simValues;
    if (activeCondition === 'good') {
      return probesSwapped ? sim.goodReverse[mode] : sim.goodForward[mode];
    }
    if (activityMode === 'fault_challenge' && activeCondition === 'degraded') {
      const override = probesSwapped
        ? mysteryCase.customReverseReadings[mode]
        : mysteryCase.customDriftedReadings[mode];
      if (override) return override;
    }
    return sim[activeCondition][mode];
  }, [activeCondition, activityMode, component, mode, mysteryCase, probesSwapped]);

  const isBeeping =
    mode === 'DIODE' &&
    ((activeCondition === 'short' && component.measurement.simValues.beepOnShort) ||
      (activeCondition === 'good' && component.measurement.simValues.beepOnGood));

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
    if (activeCondition === 'good') {
      return {
        status: 'good' as const,
        title:
          probesSwapped && component.measurement.polaritySensitive
            ? pick('انحياز عكسي سليم (قطبية معكوسة)', 'Polarisation inverse correcte', 'Healthy Reverse Bias (Probes Swapped)')
            : pick('نتيجة الفحص: العنصر سليم', 'Diagnostic : Composant sain', 'Result: Component Healthy'),
        message: loc.goodReading,
      };
    }
    if (activeCondition === 'open') {
      return {
        status: 'fault' as const,
        title: pick('نتيجة الفحص: عطل قطع داخلي (Open)', 'Diagnostic : Circuit ouvert (Open)', 'Result: Open Circuit Fault'),
        message: loc.openFaultReading,
      };
    }
    if (activeCondition === 'short') {
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
  }, [activeCondition, component.measurement.polaritySensitive, isRecommendedMode, loc, mode, pick, probesSwapped]);

  const revealDiagnosisMessage = useMemo(() => {
    if (mysteryCase.trueCondition === 'good') return loc.goodReading;
    if (mysteryCase.trueCondition === 'open') return loc.openFaultReading;
    if (mysteryCase.trueCondition === 'short') return loc.shortFaultReading;
    return loc.degradedReading;
  }, [loc, mysteryCase.trueCondition]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
            {pick('مختبر القياس التفاعلي بالملتيميتر', 'Laboratoire de mesure au multimètre', 'Interactive Multimeter Testing Lab')}
          </h2>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            {activityMode === 'fault_challenge'
              ? pick(
                  'وضع محاكاة الأعطال: افحص العنصر المجهول بقرص الملتيميتر وعكس الأقطاب ثم حدد نوع العطل المكتشف.',
                  'Mode Simulation de pannes : mesurez le composant inconnu et identifiez son défaut.',
                  'Fault Challenge Mode: probe the mystery component using the meter dial and identify its condition.'
                )
              : pick(
                  'اختر العنصر وحالته، ثم بدّل وضع الملتيميتر والأقطاب لمحاكاة القراءة الحقيقية.',
                  'Choisissez un composant et son état, puis tournez le sélecteur et inversez les sondes.',
                  'Select a component and fault state, switch the meter dial, and swap probes to observe real readings.'
                )}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Explore vs Fault Simulation Mode Switcher */}
          <div className="inline-flex items-center gap-1 rounded-xl bg-slate-200/70 dark:bg-[#0F172A] p-1 border border-[#E2E8F0] dark:border-[#334155]">
            <button
              type="button"
              onClick={() => handleSwitchActivityMode('explore')}
              className={`inline-flex min-h-[38px] items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-colors whitespace-nowrap ${
                activityMode === 'explore'
                  ? 'bg-[#059669] text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Compass className="h-3.5 w-3.5" />
              <span>{pick('استكشاف حر', 'Mode libre', 'Free Explore')}</span>
            </button>
            <button
              type="button"
              onClick={() => handleSwitchActivityMode('fault_challenge')}
              className={`inline-flex min-h-[38px] items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-colors whitespace-nowrap ${
                activityMode === 'fault_challenge'
                  ? 'bg-[#D97706] text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Bug className="h-3.5 w-3.5" />
              <span>{pick('محاكاة الأعطال', 'Simulation de pannes', 'Fault Simulation')}</span>
            </button>
          </div>

          <button
            type="button"
            onClick={() => setSoundEnabled((v) => !v)}
            className="inline-flex min-h-[44px] items-center gap-2 rounded-xl border border-[#E2E8F0] dark:border-[#334155] bg-white dark:bg-[#1E293B] px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-[#F8FAFC] dark:hover:bg-[#334155]/60 shadow-sm"
          >
            {soundEnabled ? <Volume2 className="h-4 w-4 text-[#059669] dark:text-emerald-400" /> : <VolumeX className="h-4 w-4 text-slate-400" />}
            <span>{soundEnabled ? pick('صوت الجرس مفعّل', 'Bip activé', 'Beeper On') : pick('صوت الجرس مكتوم', 'Bip coupé', 'Beeper Muted')}</span>
          </button>
        </div>
      </div>

      {/* Top Specimen Strip: Component Selector in Explore Mode OR Mystery Challenge Header */}
      {activityMode === 'explore' ? (
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
                      ? 'border-[#059669] bg-[#059669] text-white shadow-sm'
                      : 'border-[#E2E8F0] dark:border-[#334155] bg-white dark:bg-[#1E293B] text-slate-700 dark:text-slate-300 hover:bg-[#F8FAFC] dark:hover:bg-[#334155]/60'
                  }`}
                >
                  {itemLoc.name}
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-amber-300/80 dark:border-amber-700/60 bg-amber-50/70 dark:bg-amber-950/25 p-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#D97706] text-white">
              <Bug className="h-5 w-5" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2 text-sm font-extrabold text-slate-900 dark:text-white">
                <span>
                  {pick(`التحدي رقم #${mysteryCase.round}: `, `Défi n°${mysteryCase.round} : `, `Challenge #${mysteryCase.round}: `)}
                  {loc.name}
                </span>
                <span className="font-mono-num text-xs text-[#D97706] dark:text-amber-400" dir="ltr">
                  ({score.correct}/{score.total})
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                {pick(
                  'تم حقن قيمة عشوائية أو عطل مخفي في هذا العنصر. استخدم قرص الملتيميتر وعكس الأقطاب لاكتشافه.',
                  'Une valeur erronée ou panne cachée a été injectée. Testez avec le multimètre pour la découvrir.',
                  'A hidden fault or drifted reading was generated for this part. Test with the meter dial to diagnose it.'
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowHint((h) => !h)}
              className="inline-flex min-h-[40px] items-center gap-1.5 rounded-xl border border-amber-300 dark:border-amber-700 bg-white dark:bg-[#1E293B] px-3 py-1.5 text-xs font-bold text-[#D97706] dark:text-amber-300 hover:bg-amber-50 dark:hover:bg-amber-950/40 transition-colors"
            >
              <Lightbulb className="h-3.5 w-3.5" />
              <span>{pick('تلميح القياس', 'Indice', 'Hint')}</span>
            </button>
            <button
              type="button"
              onClick={startNextFaultRound}
              className="inline-flex min-h-[40px] items-center gap-1.5 rounded-xl bg-[#059669] px-3.5 py-1.5 text-xs font-bold text-white hover:bg-[#047857] transition-colors shadow-sm"
            >
              <Shuffle className="h-3.5 w-3.5" />
              <span>{pick('تحدٍ عشوائي جديد', 'Nouveau défi', 'New Random Fault')}</span>
            </button>
          </div>
        </div>
      )}

      {activityMode === 'fault_challenge' && showHint && (
        <div className="rounded-xl border border-emerald-200 dark:border-emerald-800/70 bg-emerald-50/70 dark:bg-emerald-950/30 px-4 py-3 text-xs font-semibold text-emerald-950 dark:text-emerald-100 flex items-center gap-2">
          <Lightbulb className="h-4 w-4 text-[#059669] dark:text-emerald-400 shrink-0" />
          <span>
            {pick(
              `تلميح: استخدم ${loc.recommendedModeLabel} لقياس ${loc.name}${component.measurement.polaritySensitive ? '، وجرّب عكس الأقطاب لملاحظة الفرق في القراءة.' : '.'}`,
              `Indice : utilisez ${loc.recommendedModeLabel} pour tester ${loc.name}${component.measurement.polaritySensitive ? ' et testez dans les deux sens.' : '.'}`,
              `Hint: Switch dial to ${loc.recommendedModeLabel} for ${loc.name}${component.measurement.polaritySensitive ? ', and test both probe polarities.' : '.'}`
            )}
          </span>
        </div>
      )}

      {/* Two-Zone Sandbox Layout (Interactive DMM + Controls/Diagnostics) */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 items-stretch">
        {/* Left/Right Stage: Digital Multimeter + Test Bench */}
        <div className="lg:col-span-6 rounded-2xl border border-[#334155] bg-[#1E293B] text-white p-5 sm:p-6 flex flex-col justify-between gap-5 shadow-sm">
          {/* Display Header + Digital / Oscilloscope Switcher */}
          <div>
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2 text-xs text-slate-300">
                <span>
                  {displayView === 'oscilloscope'
                    ? pick('راسم الإشارة اللحظي (Oscilloscope)', 'Oscilloscope en temps réel', 'Real-Time Oscilloscope')
                    : pick('شاشة الملتيميتر الرقمي (True RMS)', 'Écran Multimètre Numérique (True RMS)', 'Digital Multimeter LCD (True RMS)')}
                </span>
                <span className="text-slate-500" aria-hidden="true">·</span>
                <span className="font-mono-num text-emerald-400 font-semibold">{mode}</span>
              </div>

              <div className="inline-flex items-center gap-1 rounded-xl bg-[#0F172A] p-1 border border-[#334155]">
                <button
                  type="button"
                  onClick={() => setDisplayView('digital')}
                  className={`inline-flex min-h-[34px] items-center gap-1.5 rounded-lg px-2.5 py-1 text-[11px] font-semibold transition-colors whitespace-nowrap shrink-0 ${
                    displayView === 'digital'
                      ? 'bg-[#059669] text-white shadow-sm'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  <Hash className="h-3.5 w-3.5" />
                  <span>{pick('رقمي', 'Numérique', 'Digital')}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setDisplayView('oscilloscope')}
                  className={`inline-flex min-h-[34px] items-center gap-1.5 rounded-lg px-2.5 py-1 text-[11px] font-semibold transition-colors whitespace-nowrap shrink-0 ${
                    displayView === 'oscilloscope'
                      ? 'bg-[#059669] text-white shadow-sm'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  <Activity className="h-3.5 w-3.5" />
                  <span>{pick('رسم بياني لحظي', 'Oscilloscope', 'Oscilloscope')}</span>
                </button>
              </div>
            </div>

            {displayView === 'digital' ? (
              <div className="rounded-xl bg-[#C7D3BA] text-slate-950 px-4 py-5 shadow-inner border-4 border-slate-800">
                <div className="flex items-center justify-between text-[11px] font-mono font-bold text-slate-700 mb-1">
                  <span>
                    {probesSwapped
                      ? pick('الأقطاب معكوسة (- / +)', 'Sondes inversées (- / +)', 'Probes Swapped (- / +)')
                      : pick('توصيل قياسي (+ / -)', 'Polarité normale (+ / -)', 'Standard Polarity (+ / -)')}
                  </span>
                  <span>{isBeeping ? '🔊 BEEP' : mode === 'OFF' ? 'STANDBY' : 'AUTO'}</span>
                </div>
                <div
                  className="font-mono-num text-2xl sm:text-3xl font-bold tracking-tight text-left truncate"
                  dir="ltr"
                >
                  {mode === 'OFF' && activityMode === 'fault_challenge'
                    ? pick('اختر وضعاً للقياس', 'SELECT MODE', 'SELECT MODE')
                    : reading}
                </div>
              </div>
            ) : (
              <OscilloscopeDisplay
                component={component}
                mode={mode}
                condition={activeCondition}
                probesSwapped={probesSwapped}
                reading={reading}
              />
            )}
          </div>

          {/* Dial Mode Buttons */}
          <div>
            <div className="text-xs font-semibold text-slate-300 mb-2">
              {pick('2. قرص اختيار وضع القياس', '2. Sélecteur de mode', '2. Function Dial Mode')}
            </div>
            <div className="grid grid-cols-5 gap-1.5 bg-[#0F172A] border border-[#334155] p-1.5 rounded-xl">
              {dialModes.map((m) => {
                const active = mode === m.id;
                const showRecommendedBadge =
                  (activityMode === 'explore' || userGuess !== null) &&
                  m.id === component.measurement.recommendedMode;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => handleModeChange(m.id)}
                    className={`min-h-[46px] flex flex-col items-center justify-center rounded-lg px-1 py-1.5 text-center transition-colors ${
                      active
                        ? 'bg-[#059669] text-white font-bold shadow-sm'
                        : 'text-slate-300 hover:bg-[#1E293B]'
                    }`}
                  >
                    <span className="font-mono-num text-xs leading-none" dir="ltr">{m.short}</span>
                    <span className="mt-1 text-[10px] leading-none opacity-90 truncate max-w-full">
                      {showRecommendedBadge ? pick('موصى به', 'Conseillé', 'Best') : m.label.split(' ')[0]}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Probe Polarity & Physical Specimen Preview */}
          <div className="flex items-center justify-between gap-4 rounded-xl bg-[#0F172A] p-3.5 border border-[#334155]">
            <div className="flex items-center gap-3 min-w-0">
              <div className="h-14 w-18 shrink-0 overflow-hidden rounded-lg bg-[#1E293B] border border-[#334155]">
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
        <div className="lg:col-span-6 flex flex-col justify-between gap-5 rounded-2xl border border-[#E2E8F0] dark:border-[#334155] bg-white dark:bg-[#1E293B] p-5 sm:p-6 shadow-sm">
          {activityMode === 'explore' ? (
            <>
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
                            ? 'border-[#059669] bg-[#059669] text-white shadow-sm'
                            : 'border-[#E2E8F0] dark:border-[#334155] bg-[#F8FAFC] dark:bg-[#0F172A] text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#334155]/60'
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
                    ? 'border-emerald-200 dark:border-emerald-800/70 bg-emerald-50/70 dark:bg-emerald-950/30 text-emerald-950 dark:text-emerald-100'
                    : diagnosticVerdict.status === 'fault'
                    ? 'border-rose-200 dark:border-rose-900 bg-rose-50/70 dark:bg-rose-950/40 text-rose-950 dark:text-rose-100'
                    : diagnosticVerdict.status === 'warning'
                    ? 'border-amber-200 dark:border-amber-800/70 bg-amber-50/70 dark:bg-amber-950/30 text-amber-950 dark:text-amber-100'
                    : 'border-[#E2E8F0] dark:border-[#334155] bg-[#F8FAFC] dark:bg-[#0F172A] text-slate-900 dark:text-slate-100'
                }`}
              >
                <div className="flex items-center gap-2 font-bold text-sm mb-1.5">
                  {diagnosticVerdict.status === 'good' && <CheckCircle2 className="h-4 w-4 text-[#059669] dark:text-emerald-400 shrink-0" />}
                  {diagnosticVerdict.status === 'fault' && <XCircle className="h-4 w-4 text-rose-600 dark:text-rose-400 shrink-0" />}
                  {diagnosticVerdict.status === 'warning' && <AlertTriangle className="h-4 w-4 text-[#D97706] dark:text-amber-400 shrink-0" />}
                  <span>{diagnosticVerdict.title}</span>
                </div>
                <p className="text-sm leading-relaxed opacity-90">{diagnosticVerdict.message}</p>
              </div>
            </>
          ) : (
            <>
              {/* Fault Challenge Diagnosis Choices */}
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-xs font-bold text-slate-600 dark:text-slate-400">
                    {pick('3. ما هو تشخيصك للعطل بعد القياس؟', '3. Quel est votre diagnostic ?', '3. Submit Your Fault Diagnosis')}
                  </span>
                  {testedModes.length > 0 && (
                    <span className="text-[11px] font-mono-num font-bold text-[#059669] dark:text-emerald-400" dir="ltr">
                      {pick('الأوضاع المختبرة:', 'Testés:', 'Tested:')} {testedModes.join(', ')}
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {conditions.map((c) => {
                    const isPicked = userGuess === c.id;
                    const isTrue = mysteryCase.trueCondition === c.id;
                    const revealed = userGuess !== null;

                    let btnClass =
                      'border-[#E2E8F0] dark:border-[#334155] bg-[#F8FAFC] dark:bg-[#0F172A] text-slate-800 dark:text-slate-200 hover:border-[#059669]';
                    if (revealed) {
                      if (isTrue) {
                        btnClass = 'border-[#059669] bg-[#059669] text-white shadow-sm';
                      } else if (isPicked && !isTrue) {
                        btnClass = 'border-rose-500 bg-rose-600 text-white';
                      } else {
                        btnClass =
                          'border-[#E2E8F0] dark:border-[#334155] bg-[#F8FAFC] dark:bg-[#0F172A] text-slate-400 dark:text-slate-500';
                      }
                    }

                    return (
                      <button
                        key={c.id}
                        type="button"
                        disabled={revealed || testedModes.length === 0}
                        onClick={() => handleSubmitDiagnosis(c.id)}
                        className={`min-h-[46px] rounded-xl px-3 py-2 text-xs font-bold border transition-colors disabled:cursor-not-allowed ${btnClass}`}
                      >
                        {c.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Challenge Feedback Card */}
              {userGuess === null ? (
                <div className="rounded-2xl border border-[#E2E8F0] dark:border-[#334155] bg-[#F8FAFC] dark:bg-[#0F172A] p-4 text-xs sm:text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                  {testedModes.length === 0
                    ? pick(
                        'ابدأ بتحريك قرص الملتيميتر (مثل Ω أو Diod/Beep أو Cap أو V DC) لقراءة استجابة العنصر، ثم اختر تشخيصك من الأزرار أعلاه.',
                        'Sélectionnez d’abord un mode de mesure sur le multimètre pour lire le composant, puis choisissez votre diagnostic.',
                        'First select a measurement dial mode (Ω, Diode/Beep, Cap, or V DC) to inspect the component, then choose your diagnosis above.'
                      )
                    : pick(
                        `ممتاز! يمكنك مقارنة القراءة في وضع (${mode}) أو عكس الأقطاب أو تشغيل الرسم البياني اللحظي، ثم الضغط على التشخيص الصحيح أعلاه.`,
                        `Bien ! Comparez la lecture en mode (${mode}), inversez les sondes ou observez l’oscilloscope, puis validez votre diagnostic.`,
                        `Good! Compare readings in (${mode}), try swapping probes or checking the oscilloscope, then pick the matching diagnosis above.`
                      )}
                </div>
              ) : (
                <div
                  className={`rounded-2xl border p-4 space-y-2.5 ${
                    userGuess === mysteryCase.trueCondition
                      ? 'border-emerald-200 dark:border-emerald-800/70 bg-emerald-50/70 dark:bg-emerald-950/30 text-emerald-950 dark:text-emerald-100'
                      : 'border-rose-200 dark:border-rose-900 bg-rose-50/70 dark:bg-rose-950/40 text-rose-950 dark:text-rose-100'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 font-extrabold text-sm">
                      {userGuess === mysteryCase.trueCondition ? (
                        <CheckCircle2 className="h-4 w-4 text-[#059669] dark:text-emerald-400 shrink-0" />
                      ) : (
                        <XCircle className="h-4 w-4 text-rose-600 dark:text-rose-400 shrink-0" />
                      )}
                      <span>
                        {userGuess === mysteryCase.trueCondition
                          ? pick('تشخيص صحيح! أحسنت اكتشاف الحالة', 'Diagnostic exact ! Bien joué', 'Spot On! Accurate Diagnosis')
                          : pick(
                              `تشخيص غير دقيق — الحالة الحقيقية: ${conditions.find((x) => x.id === mysteryCase.trueCondition)?.label}`,
                              `Diagnostic incorrect — État réel : ${conditions.find((x) => x.id === mysteryCase.trueCondition)?.label}`,
                              `Not quite — Actual condition: ${conditions.find((x) => x.id === mysteryCase.trueCondition)?.label}`
                            )}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs sm:text-sm leading-relaxed opacity-90">{revealDiagnosisMessage}</p>
                  <button
                    type="button"
                    onClick={startNextFaultRound}
                    className="inline-flex min-h-[40px] items-center gap-1.5 rounded-xl bg-[#059669] px-4 py-2 text-xs font-bold text-white hover:bg-[#047857] transition-colors"
                  >
                    <Shuffle className="h-3.5 w-3.5" />
                    <span>{pick('الانتقال لعنصر وعطل جديد', 'Défi suivant', 'Next Random Challenge')}</span>
                  </button>
                </div>
              )}
            </>
          )}

          {/* Schematic + Quick Tips */}
          <div className="flex items-center gap-4 pt-3 border-t border-[#E2E8F0] dark:border-[#334155]">
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

