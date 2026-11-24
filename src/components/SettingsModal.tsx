import React, { useCallback, useEffect, useState } from 'react';
import {
  CheckCircle2,
  DownloadCloud,
  Globe,
  Minus,
  Moon,
  Plus,
  RotateCcw,
  Settings,
  ShieldAlert,
  Sun,
  Type,
  WifiOff,
  X,
} from 'lucide-react';
import { ELECTRONIC_COMPONENTS } from '../data/componentsData';
import { ELECTRONIC_PROJECTS } from '../data/projectsData';
import { useLanguage } from '../i18n/LanguageContext';
import { LANGUAGE_OPTIONS } from '../i18n/uiTranslations';

export const FONT_SCALE_STEPS = [85, 92, 100, 112, 125] as const;
export type FontScale = (typeof FONT_SCALE_STEPS)[number];

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  fontScale: FontScale;
  onChangeFontScale: (scale: FontScale) => void;
  isDark: boolean;
  onToggleDark: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  fontScale,
  onChangeFontScale,
  isDark,
  onToggleDark,
}) => {
  const { lang, setLang, t, pick } = useLanguage();
  const [swActive, setSwActive] = useState<boolean>(false);
  const [cachedCount, setCachedCount] = useState<number>(0);
  const [isCaching, setIsCaching] = useState<boolean>(false);
  const [cacheMessage, setCacheMessage] = useState<string>('');

  const inspectOfflineCache = useCallback(async () => {
    try {
      let active = Boolean(window.__PWA_OFFLINE_READY__);
      if ('serviceWorker' in navigator) {
        const reg = await navigator.serviceWorker.getRegistration();
        if (reg?.active || navigator.serviceWorker.controller) {
          active = true;
        }
      }
      setSwActive(active);

      if ('caches' in window) {
        const keys = await caches.keys();
        let total = 0;
        for (const key of keys) {
          const cache = await caches.open(key);
          const entries = await cache.keys();
          total += entries.length;
        }
        setCachedCount(total);
      }
    } catch {
      // Ignore storage/cache inspection restrictions
    }
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    inspectOfflineCache();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    const onOfflineReady = () => {
      setSwActive(true);
      inspectOfflineCache();
    };
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('pwa-offline-ready', onOfflineReady);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('pwa-offline-ready', onOfflineReady);
    };
  }, [isOpen, onClose, inspectOfflineCache]);

  const handleSaveAllForOffline = async () => {
    setIsCaching(true);
    setCacheMessage('');
    try {
      if ('serviceWorker' in navigator) {
        const reg = await navigator.serviceWorker.getRegistration();
        if (reg) {
          await reg.update().catch(() => {});
        }
      }

      if ('caches' in window) {
        const assetUrls = new Set<string>([
          '/',
          '/index.html',
          '/icon.svg',
          '/pwa-192x192.png',
          '/pwa-512x512.png',
          '/apple-touch-icon.png',
        ]);

        for (const comp of ELECTRONIC_COMPONENTS) {
          if (comp.imageUrl.startsWith('/')) {
            assetUrls.add(comp.imageUrl);
          }
        }
        for (const proj of ELECTRONIC_PROJECTS) {
          if (proj.imageUrl.startsWith('/')) {
            assetUrls.add(proj.imageUrl);
          }
        }

        const cache = await caches.open('elec-offline-assets-v1');
        let savedNow = 0;
        await Promise.all(
          Array.from(assetUrls).map(async (url) => {
            try {
              const existing = await cache.match(url);
              if (existing) {
                savedNow += 1;
                return;
              }
              const response = await fetch(url, { cache: 'reload' });
              if (response.ok) {
                await cache.put(url, response);
                savedNow += 1;
              }
            } catch {
              // Ignore individual offline fetch failure
            }
          })
        );

        await inspectOfflineCache();
        setCacheMessage(
          pick(
            `تم التحقق وحفظ ${savedNow} ملفاً وصورة على جهازك للعمل بدون إنترنت.`,
            `${savedNow} fichiers et images vérifiés et enregistrés hors ligne.`,
            `Verified and saved ${savedNow} files and images locally for offline use.`
          )
        );
      } else {
        setCacheMessage(t.settings.offlineFallbackMsg);
      }
    } finally {
      setIsCaching(false);
    }
  };

  if (!isOpen) return null;

  const currentIndex = FONT_SCALE_STEPS.indexOf(fontScale);
  const canDecrease = currentIndex > 0;
  const canIncrease = currentIndex < FONT_SCALE_STEPS.length - 1;

  const handleStep = (delta: -1 | 1) => {
    const nextIdx = Math.min(
      FONT_SCALE_STEPS.length - 1,
      Math.max(0, currentIndex + delta)
    );
    onChangeFontScale(FONT_SCALE_STEPS[nextIdx]);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-950/60 p-0 sm:p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="settings-modal-title"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-t-3xl sm:rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mx-auto mb-4 h-1.5 w-10 rounded-full bg-slate-300 dark:bg-slate-700 sm:hidden" />

        {/* Modal Header */}
        <div className="flex items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50 dark:bg-sky-950 text-sky-600 dark:text-sky-400">
              <Settings className="h-5 w-5" />
            </div>
            <div>
              <h2 id="settings-modal-title" className="text-lg font-extrabold text-slate-900 dark:text-white">
                {t.settings.title}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {t.settings.subtitle}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label={t.settings.closeAria}
            className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-5 space-y-6">
          {/* Section 0: Language Selector */}
          <section className="space-y-2.5">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
              <Globe className="h-4 w-4 text-sky-600 dark:text-sky-400" />
              <span>{t.settings.languageTitle}</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {LANGUAGE_OPTIONS.map((opt) => {
                const active = lang === opt.code;
                return (
                  <button
                    key={opt.code}
                    type="button"
                    onClick={() => setLang(opt.code)}
                    className={`inline-flex min-h-[46px] flex-col items-center justify-center rounded-xl border px-3 py-2 text-xs font-bold transition-colors ${
                      active
                        ? 'border-sky-600 bg-sky-50 text-sky-700 dark:border-sky-500 dark:bg-sky-950/70 dark:text-sky-300'
                        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <span>{opt.nativeLabel}</span>
                    <span className="font-mono-num text-[10px] opacity-60">{opt.shortLabel}</span>
                  </button>
                );
              })}
            </div>
          </section>

          {/* Section 1: Font Size Scaling */}
          <section className="space-y-3 pt-4 border-t border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
                <Type className="h-4 w-4 text-sky-600 dark:text-sky-400" />
                <span>{t.settings.fontSizeTitle}</span>
              </div>
              <span className="text-xs font-bold text-sky-600 dark:text-sky-400 font-mono-num">
                {fontScale}% · {t.settings.scaleLabels[fontScale]}
              </span>
            </div>

            {/* Primary - / + buttons */}
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleStep(-1)}
                disabled={!canDecrease}
                className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-sm font-bold text-slate-800 dark:text-slate-100 transition-colors hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Minus className="h-4 w-4" />
                <span>{t.settings.decrease}</span>
              </button>

              <button
                type="button"
                onClick={() => onChangeFontScale(100)}
                disabled={fontScale === 100}
                className="inline-flex min-h-[48px] items-center justify-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>{t.settings.defaultBtn}</span>
              </button>

              <button
                type="button"
                onClick={() => handleStep(1)}
                disabled={!canIncrease}
                className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl bg-sky-600 px-3 py-2 text-sm font-bold text-white transition-colors hover:bg-sky-700 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Plus className="h-4 w-4" />
                <span>{t.settings.increase}</span>
              </button>
            </div>

            {/* Step Selector Bar */}
            <div className="grid grid-cols-5 gap-1.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 p-1">
              {FONT_SCALE_STEPS.map((step) => {
                const active = fontScale === step;
                return (
                  <button
                    key={step}
                    type="button"
                    onClick={() => onChangeFontScale(step)}
                    className={`min-h-[38px] rounded-lg text-xs font-bold font-mono-num transition-colors ${
                      active
                        ? 'bg-white dark:bg-slate-900 text-sky-600 dark:text-sky-400 shadow-sm'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    {step}%
                  </button>
                );
              })}
            </div>

            {/* Live Typography Preview */}
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 p-3.5">
              <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
                {t.settings.previewLabel}
              </div>
              <div className="text-base font-bold text-slate-900 dark:text-white">
                {t.settings.previewTitle} · <span className="font-mono-num text-sky-600 dark:text-sky-400" dir="ltr">10 kΩ</span>
              </div>
              <p className="mt-1 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                {t.settings.previewDesc}
              </p>
            </div>
          </section>

          {/* Section 2: Appearance */}
          <section className="space-y-2.5 pt-4 border-t border-slate-200 dark:border-slate-800">
            <div className="text-sm font-bold text-slate-900 dark:text-white">
              {t.settings.appearanceTitle}
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  if (isDark) onToggleDark();
                }}
                className={`inline-flex min-h-[46px] items-center justify-center gap-2 rounded-xl border px-3 py-2 text-xs sm:text-sm font-bold transition-colors ${
                  !isDark
                    ? 'border-sky-600 bg-sky-50 text-sky-700 dark:bg-sky-950 dark:text-sky-300'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <Sun className="h-4 w-4 text-amber-500" />
                <span>{t.settings.lightMode}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  if (!isDark) onToggleDark();
                }}
                className={`inline-flex min-h-[46px] items-center justify-center gap-2 rounded-xl border px-3 py-2 text-xs sm:text-sm font-bold transition-colors ${
                  isDark
                    ? 'border-sky-500 bg-sky-950/70 text-sky-300'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <Moon className="h-4 w-4 text-sky-400" />
                <span>{t.settings.darkMode}</span>
              </button>
            </div>
          </section>

          {/* Section 3: Offline Readiness & Asset Caching */}
          <section className="space-y-3 pt-4 border-t border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
                <WifiOff className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                <span>{t.settings.offlineTitle}</span>
              </div>
              <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 font-mono-num">
                {cachedCount > 0 ? `${cachedCount} ${t.settings.offlineSavedCount}` : swActive ? t.settings.offlineReady : t.settings.offlineLocal}
              </span>
            </div>

            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 p-3.5 space-y-2.5">
              <div className="flex items-start gap-2.5 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5 text-emerald-600 dark:text-emerald-400" />
                <span>{t.settings.offlineDesc}</span>
              </div>

              <button
                type="button"
                onClick={handleSaveAllForOffline}
                disabled={isCaching}
                className="inline-flex w-full min-h-[44px] items-center justify-center gap-2 rounded-xl border border-emerald-600/30 bg-emerald-600/10 dark:bg-emerald-500/15 px-4 py-2 text-xs sm:text-sm font-bold text-emerald-700 dark:text-emerald-300 transition-colors hover:bg-emerald-600/20 disabled:opacity-60"
              >
                <DownloadCloud className="h-4 w-4 shrink-0" />
                <span>
                  {isCaching ? t.settings.offlineSyncing : t.settings.offlineSyncBtn}
                </span>
              </button>

              {cacheMessage && (
                <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-300">
                  {cacheMessage}
                </p>
              )}
            </div>
          </section>

          {/* Section 4: Intellectual Property & Anti-Copy Notice */}
          <section className="rounded-xl border border-amber-200/80 dark:border-amber-900/60 bg-amber-50/70 dark:bg-amber-950/30 p-3.5 space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-800 dark:text-amber-300">
              <ShieldAlert className="h-4 w-4 shrink-0" />
              <span>{t.copyrightTitle}</span>
            </div>
            <p className="text-xs leading-relaxed text-slate-700 dark:text-slate-300">
              {t.copyrightWarning}
            </p>
          </section>

          {/* Footer Attribution */}
          <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>{t.creatorPrefix} <strong className="text-slate-800 dark:text-slate-200">{t.creatorName}</strong></span>
            <button
              type="button"
              onClick={onClose}
              className="min-h-[40px] rounded-xl bg-slate-900 dark:bg-sky-600 px-5 py-2 text-xs font-bold text-white hover:bg-slate-800 dark:hover:bg-sky-500"
            >
              {t.settings.done}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
