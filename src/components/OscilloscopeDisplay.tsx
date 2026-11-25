import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Activity, Pause, Play, RotateCcw, ZoomIn, ZoomOut } from 'lucide-react';
import { ComponentCondition, ElectronicComponent, MultimeterMode } from '../types/electronics';
import { useLanguage } from '../i18n/LanguageContext';

export type ScopeSignalSource = 'auto' | 'ripple' | 'pwm' | 'noise';

interface OscilloscopeDisplayProps {
  component: ElectronicComponent;
  mode: MultimeterMode;
  condition: ComponentCondition;
  probesSwapped: boolean;
  reading: string;
}

interface SignalProfile {
  suggestedVDiv: number;
  baseVoltage: number;
  captionAr: string;
  captionFr: string;
  captionEn: string;
  sample: (t: number) => number;
}

const V_DIV_STEPS = [0.5, 1, 2, 5, 10, 20, 50, 100];
const MS_DIV_STEPS = [10, 25, 50, 100];

function parseVoltageFromString(text: string): number | null {
  if (!text || text === '---' || text === 'OL') return null;
  const mvMatch = text.match(/(-?\d+(?:\.\d+)?)\s*mV/i);
  if (mvMatch) return parseFloat(mvMatch[1]) / 1000;
  const vMatch = text.match(/(-?\d+(?:\.\d+)?)\s*V/i);
  if (vMatch) return parseFloat(vMatch[1]);
  return null;
}

function buildSignalProfile(
  component: ElectronicComponent,
  mode: MultimeterMode,
  condition: ComponentCondition,
  probesSwapped: boolean,
  reading: string,
  signalSource: ScopeSignalSource
): SignalProfile {
  const polaritySign = component.measurement.polaritySensitive && probesSwapped ? -1 : 1;

  if (mode === 'OFF') {
    return {
      suggestedVDiv: 1,
      baseVoltage: 0,
      captionAr: 'الجهاز متوقف (OFF) — لا يوجد جهد قياس على المجسات.',
      captionFr: 'Multimètre éteint (OFF) — aucune tension de mesure.',
      captionEn: 'Meter turned OFF — no measurement voltage on probes.',
      sample: (t) => Math.sin(t * 37) * 0.008,
    };
  }

  const parsedCurrentV = parseVoltageFromString(reading);
  const parsedForwardVoltDc = parseVoltageFromString(component.measurement.simValues.goodForward.VOLT_DC);
  const parsedCondVoltDc = parseVoltageFromString(
    condition === 'good'
      ? probesSwapped
        ? component.measurement.simValues.goodReverse.VOLT_DC
        : component.measurement.simValues.goodForward.VOLT_DC
      : component.measurement.simValues[condition].VOLT_DC
  );

  // Override test stimuli (Ripple / PWM / Noise)
  if (signalSource === 'ripple') {
    const base = parsedCurrentV !== null && Math.abs(parsedCurrentV) > 0.1 ? Math.abs(parsedCurrentV) : 5.0;
    const rippleAmp = condition === 'good' ? base * 0.06 : condition === 'short' ? 0.05 : base * 0.35;
    const vDiv = base > 50 ? 100 : base > 12 ? 5 : base > 4 ? 2 : 1;
    return {
      suggestedVDiv: vDiv,
      baseVoltage: base * polaritySign,
      captionAr:
        condition === 'good'
          ? 'محاكاة تموّج التغذية (DC + Ripple): تموّج طفيف طبيعي على الخط المستمر.'
          : 'محاكاة تموّج التغذية: تموّجات حادة نتيجة ضعف التنعيم أو التلف.',
      captionFr:
        condition === 'good'
          ? 'Simulation d’ondulation (DC + Ripple) : légère ondulation normale.'
          : 'Simulation d’ondulation : forte ondulation due au défaut.',
      captionEn:
        condition === 'good'
          ? 'DC + Ripple injection: minimal healthy ripple on supply rail.'
          : 'DC + Ripple injection: severe voltage ripple from fault.',
      sample: (t) => {
        if (condition === 'short') return Math.sin(t * 24) * 0.04;
        const saw = ((t * 4) % 1) - 0.5;
        return polaritySign * (base + rippleAmp * (0.65 * Math.sin(t * 25.1) + 0.35 * saw));
      },
    };
  }

  if (signalSource === 'pwm') {
    const highV = parsedCurrentV !== null && Math.abs(parsedCurrentV) > 0.4 ? Math.abs(parsedCurrentV) : 5.0;
    const vDiv = highV > 50 ? 100 : highV > 12 ? 5 : highV > 4 ? 2 : 1;
    return {
      suggestedVDiv: vDiv,
      baseVoltage: highV * 0.5 * polaritySign,
      captionAr: 'إشارة نبضية مربعة (PWM) لاختبار استجابة العنصر للتبديل السريع.',
      captionFr: 'Signal carré PWM pour observer la réponse en commutation.',
      captionEn: 'Square PWM stimulus to inspect fast switching voltage transitions.',
      sample: (t) => {
        if (condition === 'short') return 0.03 * Math.sin(t * 40);
        if (condition === 'open') return 0.06 * Math.sin(t * 18.8);
        const phase = (t * 2.2) % 1;
        const duty = condition === 'degraded' ? 0.35 + 0.15 * Math.sin(t * 3.1) : 0.55;
        const val = phase < duty ? highV : 0;
        const ring = condition === 'degraded' && phase < 0.08 ? Math.sin(t * 95) * (highV * 0.18) : 0;
        return polaritySign * (val + ring);
      },
    };
  }

  if (signalSource === 'noise') {
    const base = parsedCurrentV !== null && Math.abs(parsedCurrentV) > 0.2 ? Math.abs(parsedCurrentV) : 3.3;
    const vDiv = base > 50 ? 100 : base > 12 ? 5 : 2;
    return {
      suggestedVDiv: vDiv,
      baseVoltage: base * polaritySign,
      captionAr: 'محاكاة تلامس مهتز (Loose Contact) — لاحظ الانقطاعات المفاجئة في الفولتية.',
      captionFr: 'Simulation de faux contact — chutes de tension intermittentes.',
      captionEn: 'Loose-contact simulation — erratic intermittent voltage dropouts.',
      sample: (t) => {
        const hash = Math.abs(Math.sin(t * 17.3) * Math.cos(t * 7.9));
        if (hash < 0.32) return 0.02 * Math.sin(t * 60);
        const spike = Math.sin(t * 83) * (base * 0.14);
        return polaritySign * Math.max(0, base + spike);
      },
    };
  }

  // AUTO: Physics-accurate behavior by component & fault state
  if (condition === 'short') {
    const shortV = parsedCurrentV ?? 0;
    const vDiv = shortV > 8 ? 5 : 1;
    return {
      suggestedVDiv: vDiv,
      baseVoltage: shortV,
      captionAr:
        shortV > 5
          ? 'قصر داخلي يمرر جهد الدخل كاملاً للخرج دون تنظيم!'
          : 'قصر صريح (Short): هبوط الفولتية إلى الصفر تقريباً.',
      captionFr:
        shortV > 5
          ? 'Court-circuit interne : la tension d’entrée passe directement en sortie !'
          : 'Court-circuit franc (Short) : tension effondrée près de 0 V.',
      captionEn:
        shortV > 5
          ? 'Internal pass-through short: raw input voltage leaking straight to output!'
          : 'Dead short fault: voltage collapsed near 0.00 V.',
      sample: (t) => shortV + Math.sin(t * 31) * (shortV > 5 ? 0.45 : 0.025),
    };
  }

  if (condition === 'open') {
    const openV = parsedCondVoltDc ?? 0;
    if (openV > 0.5) {
      const vDiv = openV > 10 ? 5 : 2;
      return {
        suggestedVDiv: vDiv,
        baseVoltage: openV,
        captionAr: `عطل قطع (Open): الجهد عالق عند ${openV.toFixed(1)}V دون استجابة أو تنظيم.`,
        captionFr: `Circuit ouvert : tension bloquée à ${openV.toFixed(1)} V sans régulation.`,
        captionEn: `Open fault: rail stuck at ${openV.toFixed(1)} V without regulation or switching.`,
        sample: (t) => openV + Math.sin(t * 18.8) * 0.32,
      };
    }
    return {
      suggestedVDiv: 1,
      baseVoltage: 0,
      captionAr: 'عطل قطع (Open): خط مسطح مع التقاط طفيف لضوضاء 50Hz لعدم اكتمال المسار.',
      captionFr: 'Circuit ouvert (Open) : ligne nulle avec léger bruit parasite 50 Hz.',
      captionEn: 'Open circuit fault: flat zero baseline with tiny 50 Hz floating probe hum.',
      sample: (t) => Math.sin(t * 18.85) * 0.055 + Math.sin(t * 47) * 0.015,
    };
  }

  // Capacitors: RC exponential charge/discharge curves
  if (component.id === 'capacitor' || component.id === 'ceramic_cap') {
    const isDegraded = condition === 'degraded';
    const targetV = isDegraded ? 2.1 : 3.2;
    return {
      suggestedVDiv: 1,
      baseVoltage: targetV * polaritySign,
      captionAr: isDegraded
        ? 'شحن ناقص وتسريب سريع للفولتية في المكثف التالف (ESR مرتفع).'
        : 'منحنى شحن أُسّي للمكثف السليم (RC Charging Curve) وثبات الجهد عند الامتلاء.',
      captionFr: isDegraded
        ? 'Charge incomplète et fuite rapide sur condensateur dégradé.'
        : 'Courbe exponentielle de charge RC d’un condensateur sain.',
      captionEn: isDegraded
        ? 'Degraded capacitor: rapid voltage droop and leaky charge plateau.'
        : 'Healthy RC exponential charging curve holding steady at peak.',
      sample: (t) => {
        const cycle = t % 2.4;
        if (cycle < 1.85) {
          const tau = isDegraded ? 0.18 : 0.34;
          const v = targetV * (1 - Math.exp(-cycle / tau));
          const leak = isDegraded ? Math.max(0, (cycle - 0.45) * 0.52) : 0;
          const ripple = isDegraded ? Math.sin(t * 28) * 0.09 : Math.sin(t * 20) * 0.012;
          return polaritySign * Math.max(0, v - leak + ripple);
        }
        // Quick discharge reset before next cycle
        const decay = Math.exp(-(cycle - 1.85) / 0.07);
        return polaritySign * targetV * decay;
      },
    };
  }

  // 555 Timer: Astable Square Wave Oscillation
  if (component.id === 'timer_555') {
    const isDeg = condition === 'degraded';
    const peakV = isDeg ? 2.6 : 5.0;
    return {
      suggestedVDiv: 2,
      baseVoltage: peakV,
      captionAr: isDeg
        ? 'إشارة نبضية مشوّهة وغير مستقرة التردد في مؤقت 555 التالف.'
        : 'موجة مربعة متذبذبة من خرج مؤقت 555 (0V ↔ 5.0V).',
      captionFr: isDeg
        ? 'Signal carré instable et affaibli en sortie du NE555.'
        : 'Signal carré astable propre en sortie du NE555 (0V ↔ 5,0V).',
      captionEn: isDeg
        ? 'Degraded 555 output: sagging amplitude with frequency jitter.'
        : 'Healthy 555 astable square-wave oscillation (0V ↔ 5.0V).',
      sample: (t) => {
        const freq = isDeg ? 2.4 + 0.5 * Math.sin(t * 2.1) : 2.5;
        const phase = (t * freq) % 1;
        const base = phase < 0.58 ? peakV : isDeg ? 0.45 : 0.04;
        return base + (isDeg ? Math.sin(t * 53) * 0.18 : Math.sin(t * 30) * 0.02);
      },
    };
  }

  // IR Receiver: Modulated Digital Data Pulses
  if (component.id === 'ir_receiver') {
    const isDeg = condition === 'degraded';
    return {
      suggestedVDiv: 2,
      baseVoltage: isDeg ? 2.4 : 5.0,
      captionAr: isDeg
        ? 'تذبذب عشوائي وتشويش على خط إشارة مستقبل الأشعة تحت الحمراء.'
        : 'نبضات بيانات رقمية (Active-Low) على خرج مستقبل الريموت.',
      captionFr: isDeg
        ? 'Bruit aléatoire sur la ligne de signal du récepteur IR.'
        : 'Trains d’impulsions numériques IR (Active-Low) sur la sortie.',
      captionEn: isDeg
        ? 'Degraded IR receiver: erratic noise on data output.'
        : 'Healthy IR receiver: crisp active-low remote data bursts.',
      sample: (t) => {
        if (isDeg) {
          return 2.4 + Math.sin(t * 37) * 0.85 + Math.cos(t * 71) * 0.45;
        }
        const frame = t % 2.0;
        if (frame < 0.75) {
          const bit = Math.floor(frame * 18) % 2;
          return bit === 0 ? 0.12 : 4.95;
        }
        return 5.0 + Math.sin(t * 22) * 0.02;
      },
    };
  }

  // Op-Amp: Amplified Sine Wave vs Clipped Distortion
  if (component.id === 'opamp') {
    const isDeg = condition === 'degraded';
    if (probesSwapped && condition === 'good') {
      return {
        suggestedVDiv: 1,
        baseVoltage: 0.02,
        captionAr: 'خرج مكبر العمليات في حالة السكون المنخفض (0.02V).',
        captionFr: 'Sortie de l’ampli-op à l’état bas (0,02 V).',
        captionEn: 'Op-amp output held in low state (0.02 V).',
        sample: (t) => 0.02 + Math.sin(t * 16) * 0.015,
      };
    }
    return {
      suggestedVDiv: 5,
      baseVoltage: isDeg ? 4.9 : 6.0,
      captionAr: isDeg
        ? 'تشوّه وقصّ (Clipping) في موجة خرج مكبر العمليات.'
        : 'موجة جيبية مكبّرة بسلاسة حتى ~11.8V على خرج مكبر العمليات.',
      captionFr: isDeg
        ? 'Signal écrêté et distordu en sortie de l’amplificateur opérationnel.'
        : 'Onde sinusoïdale amplifiée jusqu’à ~11,8 V sans distorsion.',
      captionEn: isDeg
        ? 'Degraded op-amp: asymmetric clipping and reduced output swing.'
        : 'Healthy op-amp: clean amplified sine waveform up to ~11.8 V.',
      sample: (t) => {
        const raw = 6.0 + 5.7 * Math.sin(t * 8.5);
        if (isDeg) {
          return Math.min(4.95, Math.max(0.4, raw * 0.65 + Math.sin(t * 43) * 0.25));
        }
        return raw;
      },
    };
  }

  // Bridge Rectifier
  if (component.id === 'bridge_rectifier') {
    const isDeg = condition === 'degraded';
    if (probesSwapped && condition === 'good') {
      return {
        suggestedVDiv: 1,
        baseVoltage: 0,
        captionAr: 'قطبية معكوسة: الجهد صفر على القنطرة.',
        captionFr: 'Polarité inversée : tension nulle.',
        captionEn: 'Probes reversed across bridge output: 0.00 V.',
        sample: (t) => Math.sin(t * 25) * 0.02,
      };
    }
    return {
      suggestedVDiv: 100,
      baseVoltage: isDeg ? 155 : 310,
      captionAr: isDeg
        ? 'عطل أحد الدايودات: تموّج نصف موجي عميق غير مستقر!'
        : 'جهد مستمر موحّد مع تموّج تنعيم طبيعي حول 310V.',
      captionFr: isDeg
        ? 'Une diode défaillante : chute profonde en redressement mono-alternance !'
        : 'Tension redressée et lissée autour de 310 V.',
      captionEn: isDeg
        ? 'Faulty rectifier leg: deep half-wave voltage drops!'
        : 'Full-wave rectified DC rail around 310 V with smoothing ripple.',
      sample: (t) => {
        if (isDeg) {
          const half = Math.max(0, Math.sin(t * 9.5));
          return 75 + 170 * half;
        }
        return 304 + 11 * Math.abs(Math.sin(t * 14));
      },
    };
  }

  // Voltage Regulator & Zener Diode
  if (component.id === 'regulator' || component.id === 'zener') {
    const isDeg = condition === 'degraded';
    const target = parsedCondVoltDc ?? (component.id === 'zener' ? 12.02 : 5.01);
    return {
      suggestedVDiv: target > 8 ? 5 : 2,
      baseVoltage: target,
      captionAr: isDeg
        ? `تذبذب وهبوط في تنظيم الجهد (~${target.toFixed(1)}V) مع تموّج واضح.`
        : `تنظيم جهد مستمر ثابت بدقة (${target.toFixed(2)}V).`,
      captionFr: isDeg
        ? `Régulation instable avec ondulation (~${target.toFixed(1)} V).`
        : `Tension régulée stable (${target.toFixed(2)} V).`,
      captionEn: isDeg
        ? `Weak regulation: sagging ~${target.toFixed(1)} V with heavy ripple.`
        : `Clean regulated DC rail steady at ${target.toFixed(2)} V.`,
      sample: (t) => {
        if (isDeg) {
          return target + 0.55 * Math.sin(t * 19) + 0.22 * (((t * 6) % 1) - 0.5);
        }
        return target + Math.sin(t * 27) * 0.018;
      },
    };
  }

  // Crystal Oscillator
  if (component.id === 'crystal') {
    const isDeg = condition === 'degraded';
    return {
      suggestedVDiv: 1,
      baseVoltage: 1.65,
      captionAr: isDeg
        ? 'تذبذب متقطع وغير منتظم من الكريستالة التالفة.'
        : 'موجة تذبذب جيبية منتظمة لتوليد نبضة الساعة (Clock).',
      captionFr: isDeg
        ? 'Oscillation intermittente sur quartz dégradé.'
        : 'Oscillation sinusoïdale propre du quartz (Horloge).',
      captionEn: isDeg
        ? 'Degraded crystal: intermittent amplitude dropouts.'
        : 'Healthy crystal: steady sinusoidal clock oscillation.',
      sample: (t) => {
        if (isDeg) {
          const burst = Math.sin(t * 3.2) > -0.15 ? 1 : 0.15;
          return 1.65 + burst * 0.9 * Math.sin(t * 28);
        }
        return 1.65 + 1.45 * Math.sin(t * 26);
      },
    };
  }

  // Switches, Relays, Push-Buttons, Reed Switches (Contact Bounce)
  if (
    component.id === 'push_button' ||
    component.id === 'rocker_switch' ||
    component.id === 'reed_switch' ||
    component.id === 'relay'
  ) {
    const isDeg = condition === 'degraded';
    return {
      suggestedVDiv: 2,
      baseVoltage: 2.5,
      captionAr: isDeg
        ? 'ارتداد التلامس المؤكسد (Contact Bounce): لاحظ الذبذبات عند الفتح والغلق!'
        : 'انتقال نظيف وحاد للفولتية بين حالتي التوصيل والفصل (0V ↔ 5V).',
      captionFr: isDeg
        ? 'Rebond de contact oxydé : oscillations rapides lors de la commutation !'
        : 'Commutation franche et propre entre 0 V et 5 V.',
      captionEn: isDeg
        ? 'Oxidized contact bounce: rapid erratic spikes during switching!'
        : 'Clean snap transition between open (5 V) and closed (0 V).',
      sample: (t) => {
        const cycle = t % 2.0;
        const closed = cycle < 1.0;
        if (isDeg && (cycle < 0.25 || (cycle > 1.0 && cycle < 1.25))) {
          return 2.5 + 2.2 * Math.sin(t * 95);
        }
        return (closed ? (isDeg ? 0.65 : 0.02) : 4.95) + Math.sin(t * 22) * 0.015;
      },
    };
  }

  // Sensors & Potentiometer
  if (component.id === 'potentiometer' || component.id === 'ldr' || component.id === 'thermistor') {
    const isDeg = condition === 'degraded';
    return {
      suggestedVDiv: 2,
      baseVoltage: 2.5,
      captionAr: isDeg
        ? 'انقطاعات مفاجئة (Crackling) في الجهد عند تحريك المقاومة المتغيرة أو تغير الحساس.'
        : 'تغيّر انسيابي متصل في الفولتية المقاسة تبعاً لقيمة العنصر.',
      captionFr: isDeg
        ? 'Coupures brusques du signal dues à une piste usée.'
        : 'Variation continue et fluide de la tension mesurée.',
      captionEn: isDeg
        ? 'Worn track / degraded sensor: abrupt signal dropouts during sweep.'
        : 'Smooth continuous analog voltage variation over time.',
      sample: (t) => {
        const smooth = 2.5 + 1.8 * Math.sin(t * 2.1);
        if (isDeg && Math.sin(t * 19.7) > 0.55) {
          return 0.05;
        }
        return smooth + (isDeg ? Math.sin(t * 61) * 0.28 : Math.sin(t * 17) * 0.015);
      },
    };
  }

  // Audio / Transducers
  if (component.id === 'microphone' || component.id === 'speaker' || component.id === 'buzzer') {
    const isDeg = condition === 'degraded';
    const amp = component.id === 'buzzer' ? 2.2 : 1.1;
    return {
      suggestedVDiv: 1,
      baseVoltage: 0,
      captionAr: isDeg
        ? 'موجة صوتية ضعيفة ومشوهة بسبب تلف الغشاء أو الملف.'
        : 'إشارة موجية صوتية متناوبة متغيرة السعة والتردد بمرور الوقت.',
      captionFr: isDeg
        ? 'Signal acoustique faible et distordu.'
        : 'Forme d’onde acoustique modulée en temps réel.',
      captionEn: isDeg
        ? 'Muffled, distorted acoustic signal from degraded coil/diaphragm.'
        : 'Dynamic modulated audio/piezo waveform over time.',
      sample: (t) => {
        const envelope = 0.45 + 0.55 * Math.sin(t * 2.4);
        const carrier = Math.sin(t * 19.5) + 0.4 * Math.sin(t * 34.2);
        return (isDeg ? 0.28 : amp) * envelope * carrier;
      },
    };
  }

  // Battery
  if (component.id === 'battery') {
    const target = parsedCurrentV !== null ? Math.abs(parsedCurrentV) : parsedForwardVoltDc ?? 9.0;
    const isDeg = condition === 'degraded';
    const vDiv = target > 8 ? 5 : 2;
    return {
      suggestedVDiv: vDiv,
      baseVoltage: target * polaritySign,
      captionAr: isDeg
        ? 'هبوط متكرر في جهد البطارية تحت الحمل بسبب ارتفاع المقاومة الداخلية.'
        : `جهد مستمر نقي ومستقر للبطارية (${(target * polaritySign).toFixed(2)}V).`,
      captionFr: isDeg
        ? 'Chutes de tension répétées sous charge (batterie fatiguée).'
        : `Tension continue propre et stable (${(target * polaritySign).toFixed(2)} V).`,
      captionEn: isDeg
        ? 'Weak battery: voltage sags sharply during periodic load pulses.'
        : `Steady clean DC battery voltage (${(target * polaritySign).toFixed(2)} V).`,
      sample: (t) => {
        if (isDeg) {
          const loadPulse = (t % 1.8) < 0.7 ? -1.4 : 0;
          return polaritySign * (target + loadPulse + Math.sin(t * 23) * 0.08);
        }
        return polaritySign * (target + Math.sin(t * 16) * 0.015);
      },
    };
  }

  // Transformer (AC secondary step-down visualization)
  if (component.id === 'transformer') {
    const isDeg = condition === 'degraded';
    return {
      suggestedVDiv: 5,
      baseVoltage: 0,
      captionAr: isDeg
        ? 'جهد متردد منخفض ومشوّه بسبب قصر جزئي في اللفات.'
        : 'إشارة تيار متردد جيبية نقية (AC Sine Wave) على ملف المحول.',
      captionFr: isDeg
        ? 'Onde alternative affaiblie par spires en court-circuit.'
        : 'Onde sinusoïdale alternative pure (AC) au secondaire.',
      captionEn: isDeg
        ? 'Partially shorted windings: attenuated, distorted AC sine wave.'
        : 'Clean sinusoidal AC waveform across transformer winding.',
      sample: (t) => (isDeg ? 4.2 : 12.0) * Math.sin(t * 12.5) + (isDeg ? Math.sin(t * 39) * 0.8 : 0),
    };
  }

  // DC Motor
  if (component.id === 'dc_motor') {
    const isDeg = condition === 'degraded';
    return {
      suggestedVDiv: 2,
      baseVoltage: 5.0,
      captionAr: isDeg
        ? 'شرارات وفقدان تلامس حاد بسبب تآكل الفحمات (Brushes).'
        : 'تذبذب تبديل الملفات الطبيعي (Commutator Ripple) أثناء دوران المحرك.',
      captionFr: isDeg
        ? 'Forts parasites de commutation (balais usés).'
        : 'Ondulation normale du collecteur pendant la rotation.',
      captionEn: isDeg
        ? 'Worn motor brushes causing sharp commutation dropouts & spikes.'
        : 'Normal commutator ripple riding on motor drive voltage.',
      sample: (t) => {
        if (isDeg) {
          return 3.6 + 1.4 * Math.sin(t * 35) + (Math.sin(t * 17) > 0.6 ? -2.4 : 0);
        }
        return 5.0 + 0.35 * Math.abs(Math.sin(t * 21));
      },
    };
  }

  // Supercapacitor slow charge/hold curve
  if (component.id === 'supercapacitor') {
    const isDeg = condition === 'degraded';
    const peakV = isDeg ? 1.4 : 2.52;
    return {
      suggestedVDiv: 1,
      baseVoltage: peakV * polaritySign,
      captionAr: isDeg
        ? 'تفريغ ذاتي سريع وهبوط جهد بسبب ارتفاع ESR في المكثف الفائق التالف.'
        : 'شحن سلس ومستقر للمكثف الفائق مع ثبات الجهد عند ~2.52V.',
      captionFr: isDeg
        ? 'Autodécharge rapide due à une forte résistance interne (ESR).'
        : 'Charge progressive du supercondensateur avec maintien stable à ~2,52 V.',
      captionEn: isDeg
        ? 'Degraded supercap: rapid voltage droop from excessive ESR leakage.'
        : 'Healthy EDLC supercapacitor charging cleanly and holding ~2.52 V.',
      sample: (t) => {
        const cycle = t % 3.2;
        if (cycle < 2.1) {
          const tau = 0.62;
          const v = peakV * (1 - Math.exp(-cycle / tau));
          return polaritySign * (v + Math.sin(t * 20) * 0.012);
        }
        const decayRate = isDeg ? 0.35 : 4.5;
        return polaritySign * peakV * Math.exp(-(cycle - 2.1) / decayRate);
      },
    };
  }

  // Servo SG90: 50Hz Control PWM Pulses
  if (component.id === 'servo_sg90') {
    const isDeg = condition === 'degraded';
    return {
      suggestedVDiv: 2,
      baseVoltage: 5.0,
      captionAr: isDeg
        ? 'نبضة PWM مشوشة مع هبوط جهد التغذية عند حركة السيرفو.'
        : 'نبضات تحكم السيرفو PWM (50Hz) بجهد 5V ثابت لتحديد الزاوية.',
      captionFr: isDeg
        ? 'Impulsions PWM perturbées avec chute de tension sous charge.'
        : 'Trains d’impulsions PWM 50 Hz propres commandant l’angle du servo.',
      captionEn: isDeg
        ? 'Degraded servo: jittery PWM pulses and voltage sag under load.'
        : 'Clean 50 Hz servo control PWM pulses (5 V peak).',
      sample: (t) => {
        const phase = (t * 2.5) % 1;
        const duty = isDeg ? 0.14 + 0.06 * Math.sin(t * 9) : 0.18;
        const amp = isDeg ? 3.6 : 5.0;
        return (phase < duty ? amp : 0.03) + (isDeg ? Math.sin(t * 48) * 0.25 : Math.sin(t * 25) * 0.015);
      },
    };
  }

  // Ultrasonic HC-SR04 Echo Pulse / DHT11 1-Wire Data / PIR Trigger
  if (component.id === 'ultrasonic_hcsr04' || component.id === 'dht_sensor' || component.id === 'pir_sensor') {
    const isDeg = condition === 'degraded';
    const highV = component.id === 'pir_sensor' ? 3.3 : 5.0;
    return {
      suggestedVDiv: 2,
      baseVoltage: highV,
      captionAr: isDeg
        ? 'إشارة رقمية عالقة أو مشوّشة على خط خرج الحساس.'
        : 'نبضات خرج رقمية نظيفة لحساس الاستشعار مع تغذية مستقرة.',
      captionFr: isDeg
        ? 'Signal de sortie bloqué ou bruité sur la broche du capteur.'
        : 'Impulsions numériques propres sur la ligne de signal du capteur.',
      captionEn: isDeg
        ? 'Degraded sensor output: latched rail or unstable noisy dropouts.'
        : 'Healthy sensor digital output pulses with clean logic transitions.',
      sample: (t) => {
        if (isDeg) {
          return highV * 0.85 + Math.sin(t * 42) * 0.65;
        }
        if (component.id === 'pir_sensor') {
          const trig = (t % 2.8) < 1.5;
          return (trig ? 3.31 : 0.02) + Math.sin(t * 20) * 0.015;
        }
        const frame = (t * 1.8) % 1;
        if (component.id === 'dht_sensor') {
          return frame < 0.35 && Math.floor(t * 26) % 2 === 0 ? 0.1 : 4.95;
        }
        return (frame < 0.28 ? 5.0 : 0.04) + Math.sin(t * 24) * 0.015;
      },
    };
  }

  // Fallback for Diode / LED / Transistor / MOSFET / IC / Resistor / Inductor
  const baseV =
    parsedCurrentV !== null
      ? parsedCurrentV
      : mode === 'DIODE'
      ? 2.85
      : parsedForwardVoltDc && parsedForwardVoltDc > 0
      ? parsedForwardVoltDc
      : 1.5;

  const isPolarityBlocked = component.measurement.polaritySensitive && probesSwapped && mode === 'DIODE';
  const effectiveBase = isPolarityBlocked ? 0 : baseV * polaritySign;
  const absMax = Math.max(1, Math.abs(effectiveBase));
  const vDiv = absMax > 50 ? 50 : absMax > 12 ? 5 : absMax > 4 ? 2 : 1;

  return {
    suggestedVDiv: vDiv,
    baseVoltage: effectiveBase,
    captionAr: isPolarityBlocked
      ? 'انحياز عكسي: الملتيميتر يحجب مرور التيار عبر الوصلة (0V).'
      : condition === 'degraded'
      ? 'فولتية متذبذبة وغير مستقرة تشير إلى تسريب أو تلف داخلي.'
      : `جهد مستمر مستقر على طرفي العنصر (~${effectiveBase.toFixed(2)}V).`,
    captionFr: isPolarityBlocked
      ? 'Polarisation inverse : jonction bloquée (0 V).'
      : condition === 'degraded'
      ? 'Tension instable indiquant une fuite interne.'
      : `Tension stable mesurée aux bornes (~${effectiveBase.toFixed(2)} V).`,
    captionEn: isPolarityBlocked
      ? 'Reverse biased: junction blocks current flow (0 V).'
      : condition === 'degraded'
      ? 'Unstable fluctuating voltage indicating internal leakage.'
      : `Steady probe/circuit voltage (~${effectiveBase.toFixed(2)} V).`,
    sample: (t) => {
      if (isPolarityBlocked) return Math.sin(t * 25) * 0.015;
      if (condition === 'degraded') {
        return effectiveBase + Math.sin(t * 19) * (absMax * 0.28) + Math.cos(t * 47) * 0.12;
      }
      if (component.id === 'inductor') {
        const pulse = ((t * 1.4) % 1) < 0.06 ? 1.8 : 0;
        return effectiveBase + pulse + Math.sin(t * 22) * 0.02;
      }
      return effectiveBase + Math.sin(t * 21) * Math.max(0.012, absMax * 0.015);
    },
  };
}

export const OscilloscopeDisplay: React.FC<OscilloscopeDisplayProps> = ({
  component,
  mode,
  condition,
  probesSwapped,
  reading,
}) => {
  const { pick } = useLanguage();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [paused, setPaused] = useState(false);
  const [autoScale, setAutoScale] = useState(true);
  const [manualVDiv, setManualVDiv] = useState<number>(2);
  const [msPerDiv, setMsPerDiv] = useState<number>(50);
  const [signalSource, setSignalSource] = useState<ScopeSignalSource>('auto');
  const [resetTick, setResetTick] = useState(0);

  const [metrics, setMetrics] = useState({
    vNow: 0,
    vMin: 0,
    vMax: 0,
    vAvg: 0,
  });

  const profile = useMemo(
    () => buildSignalProfile(component, mode, condition, probesSwapped, reading, signalSource),
    [component, condition, mode, probesSwapped, reading, signalSource]
  );

  const activeVDiv = autoScale ? profile.suggestedVDiv : manualVDiv;

  // Store buffered samples for smooth real-time scrolling
  const bufferRef = useRef<number[]>([]);
  const simTimeRef = useRef<number>(0);

  // Reset buffer cleanly when user hits Clear
  useEffect(() => {
    bufferRef.current = [];
    simTimeRef.current = 0;
  }, [resetTick]);

  // Pre-seed waveform briefly when component/mode/condition changes so graph appears immediately
  useEffect(() => {
    const count = 240;
    const dt = (msPerDiv * 10) / 1000 / count;
    const seeded: number[] = [];
    let t = simTimeRef.current;
    for (let i = 0; i < count; i++) {
      t += dt;
      seeded.push(profile.sample(t));
    }
    bufferRef.current = seeded;
    simTimeRef.current = t;

    const min = Math.min(...seeded);
    const max = Math.max(...seeded);
    const avg = seeded.reduce((a, b) => a + b, 0) / seeded.length;
    setMetrics({
      vNow: seeded[seeded.length - 1] ?? 0,
      vMin: min,
      vMax: max,
      vAvg: avg,
    });
  }, [msPerDiv, profile]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let animId = 0;
    let lastTs = performance.now();
    let metricsAcc = 0;

    const traceColor =
      mode === 'OFF'
        ? '#64748B'
        : condition === 'short' || condition === 'open'
        ? '#FB7185'
        : condition === 'degraded'
        ? '#FBBF24'
        : '#34D399';

    const drawFrame = (now: number) => {
      const dtSec = Math.min(0.05, Math.max(0.001, (now - lastTs) / 1000));
      lastTs = now;

      if (!paused && !prefersReducedMotion) {
        const totalWindowSec = (msPerDiv * 10) / 1000;
        const maxSamples = 240;
        const sampleInterval = totalWindowSec / maxSamples;
        const steps = Math.max(1, Math.min(8, Math.round(dtSec / sampleInterval)));
        for (let s = 0; s < steps; s++) {
          simTimeRef.current += sampleInterval;
          bufferRef.current.push(profile.sample(simTimeRef.current));
          if (bufferRef.current.length > maxSamples) {
            bufferRef.current.shift();
          }
        }

        metricsAcc += dtSec;
        if (metricsAcc >= 0.14 && bufferRef.current.length > 0) {
          metricsAcc = 0;
          const samples = bufferRef.current;
          let min = Infinity;
          let max = -Infinity;
          let sum = 0;
          for (let i = 0; i < samples.length; i++) {
            const v = samples[i];
            if (v < min) min = v;
            if (v > max) max = v;
            sum += v;
          }
          setMetrics({
            vNow: samples[samples.length - 1],
            vMin: min,
            vMax: max,
            vAvg: sum / samples.length,
          });
        }
      }

      // Sync crisp HiDPI dimensions
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const targetW = Math.max(280, Math.round(rect.width * dpr));
      const targetH = Math.max(160, Math.round(rect.height * dpr));
      if (canvas.width !== targetW || canvas.height !== targetH) {
        canvas.width = targetW;
        canvas.height = targetH;
      }

      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      // Instrument deep phosphor screen
      ctx.fillStyle = '#061311';
      ctx.fillRect(0, 0, w, h);

      // Graticule grid: 10 horizontal divs x 6 vertical divs
      const cols = 10;
      const rows = 6;
      const dx = w / cols;
      const dy = h / rows;

      ctx.strokeStyle = 'rgba(52, 211, 153, 0.11)';
      ctx.lineWidth = Math.max(1, dpr * 0.75);
      for (let c = 1; c < cols; c++) {
        const x = c * dx;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let r = 1; r < rows; r++) {
        const y = r * dy;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      // 0V Center / Baseline Axis (row 3 when bipolar, or row 4.5 when positive-dominant)
      const samples = bufferRef.current;
      const hasNegative = samples.some((v) => v < -0.15);
      const zeroRow = hasNegative ? 3 : 4.5;
      const zeroY = zeroRow * dy;

      ctx.save();
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.35)';
      ctx.setLineDash([4 * dpr, 4 * dpr]);
      ctx.beginPath();
      ctx.moveTo(0, zeroY);
      ctx.lineTo(w, zeroY);
      ctx.stroke();
      ctx.restore();

      // Zero-Volt marker tag on left axis
      ctx.fillStyle = 'rgba(203, 213, 225, 0.72)';
      ctx.font = `600 ${Math.round(10 * dpr)}px monospace`;
      ctx.fillText('0V', 6 * dpr, Math.max(14 * dpr, zeroY - 5 * dpr));

      // Waveform Trace
      if (samples.length > 1) {
        const pixelsPerVolt = dy / activeVDiv;
        const mapY = (v: number) => {
          const y = zeroY - v * pixelsPerVolt;
          return Math.max(4 * dpr, Math.min(h - 4 * dpr, y));
        };

        // Subtle phosphor under-fill
        ctx.beginPath();
        for (let i = 0; i < samples.length; i++) {
          const x = (i / (samples.length - 1)) * w;
          const y = mapY(samples[i]);
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.lineTo(w, zeroY);
        ctx.lineTo(0, zeroY);
        ctx.closePath();
        ctx.fillStyle =
          mode === 'OFF'
            ? 'rgba(100, 116, 139, 0.08)'
            : condition === 'short' || condition === 'open'
            ? 'rgba(251, 113, 133, 0.11)'
            : condition === 'degraded'
            ? 'rgba(251, 191, 36, 0.11)'
            : 'rgba(52, 211, 153, 0.12)';
        ctx.fill();

        // Main sharp phosphor trace
        ctx.save();
        ctx.strokeStyle = traceColor;
        ctx.lineWidth = 2.2 * dpr;
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';
        ctx.shadowColor = traceColor;
        ctx.shadowBlur = 6 * dpr;
        ctx.beginPath();
        for (let i = 0; i < samples.length; i++) {
          const x = (i / (samples.length - 1)) * w;
          const y = mapY(samples[i]);
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
        ctx.restore();

        // Leading real-time cursor beam point
        const lastY = mapY(samples[samples.length - 1]);
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(w - 3 * dpr, lastY, 3.2 * dpr, 0, Math.PI * 2);
        ctx.fill();
      }

      if (!paused && !prefersReducedMotion) {
        animId = requestAnimationFrame(drawFrame);
      }
    };

    animId = requestAnimationFrame(drawFrame);
    return () => cancelAnimationFrame(animId);
  }, [activeVDiv, condition, mode, msPerDiv, paused, profile]);

  const vpp = Math.max(0, metrics.vMax - metrics.vMin);

  const cycleVDiv = (dir: -1 | 1) => {
    setAutoScale(false);
    const idx = V_DIV_STEPS.indexOf(activeVDiv);
    const safeIdx = idx === -1 ? 2 : idx;
    const nextIdx = Math.max(0, Math.min(V_DIV_STEPS.length - 1, safeIdx + dir));
    setManualVDiv(V_DIV_STEPS[nextIdx]);
  };

  const stimulusOptions: { id: ScopeSignalSource; label: string }[] = [
    { id: 'auto', label: pick('تلقائي', 'Auto', 'Auto') },
    { id: 'ripple', label: pick('تموّج DC', 'Ondulation', 'DC Ripple') },
    { id: 'pwm', label: pick('نبضة PWM', 'Impulsion', 'PWM Pulse') },
    { id: 'noise', label: pick('تلامس مهتز', 'Faux contact', 'Loose Contact') },
  ];

  return (
    <div className="space-y-3">
      {/* Scope Bezel & Canvas */}
      <div className="rounded-xl bg-[#040D0B] border-2 border-[#334155] overflow-hidden shadow-inner">
        {/* Top Calibration Strip */}
        <div
          className="flex flex-wrap items-center justify-between gap-2 px-3 py-1.5 bg-[#0F172A]/95 border-b border-[#334155] text-[11px] font-mono-num text-slate-300"
          dir="ltr"
        >
          <div className="flex items-center gap-3">
            <span className="font-bold text-emerald-400">CH1: {activeVDiv}V/div</span>
            <span className="text-amber-300">{msPerDiv}ms/div</span>
          </div>
          <div className="flex items-center gap-2">
            <span className={paused ? 'text-amber-400 font-semibold' : 'text-emerald-400 font-semibold'}>
              {paused ? pick('متوقف مؤقتاً', 'PAUSE', 'HOLD') : pick('قياس مباشر', 'DIRECT', 'RUN')}
            </span>
          </div>
        </div>

        {/* Live Waveform Canvas (always LTR time axis) */}
        <div className="relative w-full h-44 sm:h-48" dir="ltr">
          <canvas
            ref={canvasRef}
            className="block w-full h-full"
            aria-label={pick(
              'رسم بياني لحظي لتقلبات الفولتية بمرور الوقت',
              'Oscilloscope en temps réel de la tension',
              'Live voltage-over-time oscilloscope waveform'
            )}
          />
        </div>

        {/* Live Tabular Voltage Metrics */}
        <div
          className="grid grid-cols-4 gap-1 px-3 py-2 bg-[#0F172A]/95 border-t border-[#334155] text-center"
          dir="ltr"
        >
          <div>
            <div className="text-[10px] text-slate-400">Vnow</div>
            <div className="font-mono-num text-xs font-bold text-emerald-400">
              {metrics.vNow >= 0 ? '+' : ''}
              {metrics.vNow.toFixed(2)}V
            </div>
          </div>
          <div>
            <div className="text-[10px] text-slate-400">Vpp</div>
            <div className="font-mono-num text-xs font-bold text-amber-300">{vpp.toFixed(2)}V</div>
          </div>
          <div>
            <div className="text-[10px] text-slate-400">Vmax</div>
            <div className="font-mono-num text-xs font-bold text-slate-200">{metrics.vMax.toFixed(2)}V</div>
          </div>
          <div>
            <div className="text-[10px] text-slate-400">Vavg</div>
            <div className="font-mono-num text-xs font-bold text-amber-300">{metrics.vAvg.toFixed(2)}V</div>
          </div>
        </div>
      </div>

      {/* Live Waveform Interpretation Caption */}
      <p className="text-xs text-slate-300 leading-relaxed flex items-start gap-2">
        <Activity className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
        <span>{pick(profile.captionAr, profile.captionFr, profile.captionEn)}</span>
      </p>

      {/* Scope Controls: Play/Pause, V/div, Timebase, Stimulus */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setPaused((p) => !p)}
            className="inline-flex min-h-[36px] items-center gap-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 px-2.5 py-1 text-[11px] font-semibold text-white transition-colors whitespace-nowrap"
          >
            {paused ? <Play className="h-3.5 w-3.5 text-emerald-400" /> : <Pause className="h-3.5 w-3.5 text-amber-400" />}
            <span>{paused ? pick('استئناف', 'Reprendre', 'Run') : pick('تثبيت', 'Pause', 'Hold')}</span>
          </button>

          <button
            type="button"
            onClick={() => setResetTick((t) => t + 1)}
            title={pick('تصفير الرسم البياني', 'Réinitialiser le tracé', 'Reset trace')}
            aria-label={pick('تصفير الرسم البياني', 'Réinitialiser le tracé', 'Reset trace')}
            className="inline-flex min-h-[36px] items-center justify-center rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 px-2.5 py-1 text-slate-300 hover:text-white transition-colors"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* V/div & Timebase Controls */}
        <div className="flex items-center gap-1.5" dir="ltr">
          <button
            type="button"
            onClick={() => cycleVDiv(-1)}
            title="Zoom in V/div"
            aria-label="Zoom in voltage scale"
            className="inline-flex min-h-[36px] items-center justify-center rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 px-2 text-slate-300 hover:text-white"
          >
            <ZoomIn className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setAutoScale(true)}
            className={`min-h-[36px] rounded-lg px-2 text-[11px] font-mono-num font-semibold border transition-colors ${
              autoScale
                ? 'bg-[#059669] border-emerald-500 text-white'
                : 'bg-[#0F172A] border-[#334155] text-slate-300 hover:bg-[#1E293B]'
            }`}
          >
            AUTO
          </button>
          <button
            type="button"
            onClick={() => cycleVDiv(1)}
            title="Zoom out V/div"
            aria-label="Zoom out voltage scale"
            className="inline-flex min-h-[36px] items-center justify-center rounded-lg bg-[#0F172A] hover:bg-[#1E293B] border border-[#334155] px-2 text-slate-300 hover:text-white"
          >
            <ZoomOut className="h-3.5 w-3.5" />
          </button>

          <select
            value={msPerDiv}
            onChange={(e) => setMsPerDiv(Number(e.target.value))}
            aria-label={pick('القاعدة الزمنية', 'Base de temps', 'Timebase')}
            className="min-h-[36px] rounded-lg bg-[#0F172A] border border-[#334155] px-2 text-[11px] font-mono-num text-slate-200 focus:outline-none focus:border-[#059669]"
          >
            {MS_DIV_STEPS.map((ms) => (
              <option key={ms} value={ms}>
                {ms}ms/div
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Signal Stimulus Mode Selector */}
      <div className="grid grid-cols-4 gap-1 bg-[#0F172A] border border-[#334155] p-1 rounded-xl">
        {stimulusOptions.map((opt) => {
          const active = signalSource === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => setSignalSource(opt.id)}
              className={`min-h-[34px] rounded-lg px-1.5 py-1 text-[11px] font-semibold transition-colors truncate ${
                active
                  ? 'bg-[#059669] text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-[#1E293B]'
              }`}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};
