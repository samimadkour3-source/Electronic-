import React, { useCallback, useEffect, useState } from 'react';
import { Download, X } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { useLanguage } from '../i18n/LanguageContext';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const { t } = useLanguage();
  const [showGuide, setShowGuide] = useState(false);

  const openGuide = useCallback(() => {
    try {
      const base =
        window.history.state && typeof window.history.state === 'object'
          ? window.history.state
          : {};
      window.history.pushState({ ...base, __pwaGuide: true }, '');
    } catch {
      // Ignore history errors
    }
    setShowGuide(true);
  }, []);

  const closeGuide = useCallback(() => {
    if (window.history.state?.__pwaGuide) {
      window.history.back();
    } else {
      setShowGuide(false);
    }
  }, []);

  useEffect(() => {
    if (!showGuide) return;
    const onPopState = (e: PopStateEvent) => {
      if (!e.state?.__pwaGuide) {
        setShowGuide(false);
      }
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeGuide();
    };
    window.addEventListener('popstate', onPopState);
    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('popstate', onPopState);
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [showGuide, closeGuide]);

  if (isInstalled) {
    return null;
  }

  const handleClick = async () => {
    if (isInstallable) {
      await install();
    } else {
      openGuide();
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        className="inline-flex min-h-[40px] items-center gap-2 rounded-xl bg-[#059669] px-3.5 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#047857] active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#059669] whitespace-nowrap shrink-0"
      >
        <Download className="h-4 w-4 shrink-0" />
        <span>{t.pwa.installBtn}</span>
      </button>

      {showGuide && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-950/60 p-0 sm:p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="pwa-install-title"
          onClick={closeGuide}
        >
          <div
            className="w-full max-w-md rounded-t-3xl sm:rounded-2xl border border-slate-200 dark:border-[#334155] bg-white dark:bg-[#1E293B] p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mx-auto mb-4 h-1.5 w-10 rounded-full bg-slate-300 dark:bg-slate-600 sm:hidden" />
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <img
                  src="/icon-192.png?v=2"
                  alt=""
                  width={44}
                  height={44}
                  className="h-11 w-11 shrink-0 rounded-xl shadow-sm object-cover"
                />
                <div>
                  <h3 id="pwa-install-title" className="text-base font-bold text-slate-900 dark:text-white">
                    {t.pwa.modalTitle}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {t.pwa.modalSubtitle}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={closeGuide}
                aria-label={t.settings.closeAria}
                className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-5 space-y-3 text-sm text-slate-700 dark:text-slate-300">
              {isIOS ? (
                <ol className="list-decimal list-inside space-y-2 leading-relaxed">
                  {t.pwa.iosSteps.map((step, i) => (
                    <li key={i}>{step}</li>
                  ))}
                </ol>
              ) : (
                <ol className="list-decimal list-inside space-y-2 leading-relaxed">
                  {t.pwa.androidSteps.map((step, i) => (
                    <li key={i}>{step}</li>
                  ))}
                </ol>
              )}
            </div>

            <button
              type="button"
              onClick={closeGuide}
              className="mt-6 w-full min-h-[44px] rounded-xl bg-[#059669] py-2.5 text-sm font-semibold text-white hover:bg-[#047857] transition-colors"
            >
              {t.pwa.gotIt}
            </button>
          </div>
        </div>
      )}
    </>
  );
};
