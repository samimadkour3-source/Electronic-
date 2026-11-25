import React, { useEffect, useState } from 'react';
import { useLanguage } from '../i18n/LanguageContext';

interface SplashScreenProps {
  isDark?: boolean;
}

const SPLASH_DURATION_MS = 2500;
const FADE_OUT_MS = 380;

export const SplashScreen: React.FC<SplashScreenProps> = () => {
  const { isRtl, pick } = useLanguage();
  const [progress, setProgress] = useState<number>(0);
  const [fadingOut, setFadingOut] = useState<boolean>(false);
  const [mounted, setMounted] = useState<boolean>(true);
  const [imgError, setImgError] = useState<boolean>(false);

  useEffect(() => {
    let rafId = 0;
    let fadeTimer: ReturnType<typeof setTimeout> | undefined;
    const startTime = performance.now();

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const ratio = Math.min(1, elapsed / SPLASH_DURATION_MS);
      const eased = 1 - Math.pow(1 - ratio, 1.35);
      const pct = Math.min(100, Math.round(eased * 100));
      setProgress(pct);

      if (ratio < 1) {
        rafId = requestAnimationFrame(tick);
      } else {
        setProgress(100);
        setFadingOut(true);
        fadeTimer = setTimeout(() => {
          setMounted(false);
        }, FADE_OUT_MS);
      }
    };

    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      if (fadeTimer) clearTimeout(fadeTimer);
    };
  }, []);

  if (!mounted) return null;

  const appTitle = pick(
    'دليل العناصر الإلكترونية بالصور وطرق القياس',
    "Guide des Composants Électroniques par l'Image et Mesure",
    'Electronic Components Visual & Testing Guide'
  );

  const authorText = pick(
    'تطوير وإعداد: الأستاذ سامي مذكور',
    'Conception et développement : Prof. Sami Madkour',
    'Developed by: Prof. Sami Madkour'
  );

  const copyrightText = pick(
    'جميع الحقوق محفوظة © 2026',
    'Tous droits réservés © 2026',
    'All Rights Reserved © 2026'
  );

  const loadingLabel = pick('جاري التحميل', 'Chargement', 'Loading');

  return (
    <div
      dir={isRtl ? 'rtl' : 'ltr'}
      role="status"
      aria-live="polite"
      aria-label={appTitle}
      className={`fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-[#0C1524] text-slate-100 transition-opacity duration-350 ease-out ${
        fadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      style={{
        background:
          'radial-gradient(circle at 50% 45%, #122236 0%, #0C1524 72%, #09111E 100%)',
      }}
    >
      {/* Aspect-locked 3:4 stage ensures title, central emblem, copyright, and bottom progress zone never clip or collide on any viewport */}
      <div className="relative w-full max-w-[min(100vw,calc(100dvh*0.75))] aspect-[3/4] select-none overflow-hidden">
        {!imgError ? (
          <>
            <img
              src="/splash-bg.png"
              alt={appTitle}
              referrerPolicy="no-referrer"
              decoding="sync"
              draggable={false}
              onError={() => setImgError(true)}
              className="h-full w-full object-contain pointer-events-none"
            />
            {/* Soft perimeter feathering so the 3:4 artwork blends seamlessly into wider or taller viewports */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0"
              style={{
                boxShadow: 'inset 0 0 28px 12px #0C1524',
              }}
            />
          </>
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center px-6 text-center pb-28">
            <h1 className="text-xl sm:text-2xl font-extrabold text-white mb-4">
              {appTitle}
            </h1>
            <p className="text-sm font-bold text-slate-200">{authorText}</p>
            <p className="text-xs text-slate-400 mt-1">{copyrightText}</p>
          </div>
        )}

        {/* Animated Progress Bar seated cleanly in the empty dark space below the copyright */}
        <div className="absolute inset-x-0 top-[80.5%] bottom-[4.5%] flex flex-col items-center justify-center px-9 sm:px-14">
          <div className="w-full max-w-[300px] sm:max-w-[330px] space-y-2">
            <div className="flex items-center justify-between px-1.5 text-xs">
              <span className="font-semibold tracking-wide text-slate-300/90">
                {loadingLabel}
              </span>
              <span
                dir="ltr"
                className="font-mono-num tabular-nums text-sm font-extrabold text-[#34D399]"
              >
                {progress}%
              </span>
            </div>

            <div
              className="h-4 w-full overflow-hidden rounded-full border-2 border-[#059669] bg-[#09121F]/90 p-0.5 shadow-lg shadow-emerald-950/60"
              role="progressbar"
              aria-valuenow={progress}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              <div
                className="h-full rounded-full transition-[width] duration-75 ease-linear"
                style={{
                  width: `${progress}%`,
                  background: isRtl
                    ? 'linear-gradient(270deg, #059669 0%, #10B981 72%, #D97706 100%)'
                    : 'linear-gradient(90deg, #059669 0%, #10B981 72%, #D97706 100%)',
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
