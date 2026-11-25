import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Maximize2,
  Moon,
  Move,
  RotateCcw,
  Sun,
  X,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';
import { ElectronicComponent } from '../types/electronics';
import { ComponentImage } from './ComponentImage';
import { useLanguage } from '../i18n/LanguageContext';
import { getLocalizedComponent } from '../i18n/dataTranslations';

interface ComponentImageFullscreenModalProps {
  component: ElectronicComponent;
  onClose: () => void;
}

const MIN_ZOOM = 1;
const MAX_ZOOM = 5;

export const ComponentImageFullscreenModal: React.FC<ComponentImageFullscreenModalProps> = ({
  component,
  onClose,
}) => {
  const { lang, isRtl, pick } = useLanguage();
  const loc = getLocalizedComponent(component, lang);

  const [zoom, setZoom] = useState<number>(1);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [lightCanvas, setLightCanvas] = useState<boolean>(false);

  const stageRef = useRef<HTMLDivElement | null>(null);
  const dragStartRef = useRef<{ x: number; y: number; panX: number; panY: number } | null>(null);
  const pinchRef = useRef<{ startDist: number; startZoom: number } | null>(null);

  const clampZoom = (val: number) => Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, Number(val.toFixed(2))));

  const clampPan = useCallback(
    (nextX: number, nextY: number, targetZoom: number) => {
      if (targetZoom <= 1) return { x: 0, y: 0 };
      const rect = stageRef.current?.getBoundingClientRect();
      const maxX = rect ? (rect.width * (targetZoom - 1)) / 2 + 80 : 320 * targetZoom;
      const maxY = rect ? (rect.height * (targetZoom - 1)) / 2 + 80 : 240 * targetZoom;
      return {
        x: Math.min(maxX, Math.max(-maxX, nextX)),
        y: Math.min(maxY, Math.max(-maxY, nextY)),
      };
    },
    []
  );

  const applyZoom = useCallback(
    (nextZoomRaw: number) => {
      const nextZoom = clampZoom(nextZoomRaw);
      setZoom(nextZoom);
      setPan((prev) => clampPan(prev.x, prev.y, nextZoom));
    },
    [clampPan]
  );

  const handleReset = useCallback(() => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  }, []);

  useEffect(() => {
    handleReset();
  }, [component.id, handleReset]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        e.stopPropagation();
        onClose();
      } else if (e.key === '+' || e.key === '=') {
        e.preventDefault();
        applyZoom(zoom + 0.5);
      } else if (e.key === '-' || e.key === '_') {
        e.preventDefault();
        applyZoom(zoom - 0.5);
      } else if (e.key === '0') {
        e.preventDefault();
        handleReset();
      } else if (zoom > 1 && ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault();
        const step = 48;
        setPan((prev) => {
          const dx = e.key === 'ArrowLeft' ? step : e.key === 'ArrowRight' ? -step : 0;
          const dy = e.key === 'ArrowUp' ? step : e.key === 'ArrowDown' ? -step : 0;
          return clampPan(prev.x + dx, prev.y + dy, zoom);
        });
      }
    };

    window.addEventListener('keydown', onKeyDown, true);
    return () => window.removeEventListener('keydown', onKeyDown, true);
  }, [onClose, zoom, applyZoom, handleReset, clampPan]);

  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    e.preventDefault();
    const delta = e.deltaY < 0 ? 0.35 : -0.35;
    applyZoom(zoom + delta);
  };

  const handleDoubleClick = () => {
    if (zoom > 1.2) {
      handleReset();
    } else {
      applyZoom(2.5);
    }
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === 'touch' && pinchRef.current) return;
    if (zoom <= 1) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    setIsDragging(true);
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      panX: pan.x,
      panY: pan.y,
    };
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging || !dragStartRef.current || pinchRef.current) return;
    const dx = e.clientX - dragStartRef.current.x;
    const dy = e.clientY - dragStartRef.current.y;
    setPan(clampPan(dragStartRef.current.panX + dx, dragStartRef.current.panY + dy, zoom));
  };

  const handlePointerEnd = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isDragging) {
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch {
        // Ignore if capture was already released
      }
    }
    setIsDragging(false);
    dragStartRef.current = null;
  };

  const getTouchDist = (touches: React.TouchList) => {
    const dx = touches[0].clientX - touches[1].clientX;
    const dy = touches[0].clientY - touches[1].clientY;
    return Math.hypot(dx, dy);
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length === 2) {
      setIsDragging(false);
      dragStartRef.current = null;
      pinchRef.current = {
        startDist: getTouchDist(e.touches),
        startZoom: zoom,
      };
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length === 2 && pinchRef.current) {
      const dist = getTouchDist(e.touches);
      if (pinchRef.current.startDist > 0) {
        const scaleFactor = dist / pinchRef.current.startDist;
        applyZoom(pinchRef.current.startZoom * scaleFactor);
      }
    }
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length < 2) {
      pinchRef.current = null;
    }
  };

  const zoomPercent = Math.round(zoom * 100);

  return (
    <div
      dir={isRtl ? 'rtl' : 'ltr'}
      role="dialog"
      aria-modal="true"
      aria-labelledby="fullscreen-image-title"
      onClick={onClose}
      className="fixed inset-0 z-[80] flex flex-col bg-slate-950/95 text-slate-100 backdrop-blur-md select-none"
    >
      {/* Top Inspection Bar */}
      <header
        onClick={(e) => e.stopPropagation()}
        className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 bg-slate-900/90 px-3 py-2.5 sm:px-6 shrink-0"
      >
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 min-w-0">
            <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#059669]/20 text-emerald-400">
              <Maximize2 className="h-4 w-4" />
            </span>
            <div className="min-w-0">
              <h2
                id="fullscreen-image-title"
                className="text-sm sm:text-base font-extrabold text-white truncate"
              >
                {loc.name}
              </h2>
              <p className="text-[11px] font-mono text-slate-400 truncate" dir="ltr">
                {component.nameEn} · {component.symbolLetter}
              </p>
            </div>
          </div>
        </div>

        {/* Zoom & Inspection Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <button
            type="button"
            onClick={() => applyZoom(zoom - 0.5)}
            disabled={zoom <= MIN_ZOOM}
            aria-label={pick('تصغير الصورة', 'Dézoomer', 'Zoom out')}
            title={pick('تصغير (-)', 'Dézoomer (-)', 'Zoom out (-)')}
            className="flex min-h-[42px] min-w-[42px] items-center justify-center rounded-xl border border-slate-700 bg-slate-800/90 text-slate-100 hover:border-[#059669] hover:text-emerald-300 disabled:opacity-40 disabled:pointer-events-none transition-colors"
          >
            <ZoomOut className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={handleReset}
            title={pick('إعادة التعيين إلى 100%', 'Réinitialiser à 100%', 'Reset to 100%')}
            className="min-h-[42px] min-w-[60px] rounded-xl border border-slate-700 bg-slate-800/90 px-2.5 text-xs font-bold font-mono-num tabular-nums text-emerald-300 hover:border-[#059669] transition-colors"
            dir="ltr"
          >
            {zoomPercent}%
          </button>

          <button
            type="button"
            onClick={() => applyZoom(zoom + 0.5)}
            disabled={zoom >= MAX_ZOOM}
            aria-label={pick('تكبير الصورة', 'Zoomer', 'Zoom in')}
            title={pick('تكبير (+)', 'Zoomer (+)', 'Zoom in (+)')}
            className="flex min-h-[42px] min-w-[42px] items-center justify-center rounded-xl border border-slate-700 bg-slate-800/90 text-slate-100 hover:border-[#059669] hover:text-emerald-300 disabled:opacity-40 disabled:pointer-events-none transition-colors"
          >
            <ZoomIn className="h-4 w-4" />
          </button>

          {/* Quick Zoom Presets for pin inspection */}
          {[2, 3].map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => applyZoom(preset)}
              className={`hidden sm:inline-flex min-h-[42px] items-center justify-center rounded-xl border px-2.5 text-xs font-bold font-mono-num tabular-nums transition-colors ${
                Math.abs(zoom - preset) < 0.05
                  ? 'border-[#059669] bg-[#059669] text-white'
                  : 'border-slate-700 bg-slate-800/90 text-slate-300 hover:border-emerald-500/60 hover:text-white'
              }`}
              dir="ltr"
            >
              {preset}×
            </button>
          ))}

          {/* Light / Dark inspection surface toggle */}
          <button
            type="button"
            onClick={() => setLightCanvas((v) => !v)}
            aria-pressed={lightCanvas}
            title={pick(
              'تبديل خلفية الفحص (فاتح / داكن)',
              'Changer le fond d’inspection (Clair / Sombre)',
              'Toggle inspection surface (Light / Dark)'
            )}
            className={`flex min-h-[42px] min-w-[42px] items-center justify-center rounded-xl border transition-colors ${
              lightCanvas
                ? 'border-[#D97706] bg-amber-500/20 text-amber-300'
                : 'border-slate-700 bg-slate-800/90 text-slate-200 hover:border-[#D97706] hover:text-amber-300'
            }`}
          >
            {lightCanvas ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          </button>

          {(zoom > 1 || pan.x !== 0 || pan.y !== 0) && (
            <button
              type="button"
              onClick={handleReset}
              aria-label={pick('إعادة ضبط العرض', 'Réinitialiser la vue', 'Reset view')}
              title={pick('إعادة ضبط العرض', 'Réinitialiser la vue', 'Reset view')}
              className="flex min-h-[42px] min-w-[42px] items-center justify-center rounded-xl border border-slate-700 bg-slate-800/90 text-amber-300 hover:border-[#D97706] transition-colors"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
          )}

          <button
            type="button"
            onClick={onClose}
            aria-label={pick('إغلاق العرض بملء الشاشة', 'Fermer le plein écran', 'Close fullscreen')}
            className="flex min-h-[42px] min-w-[42px] items-center justify-center rounded-xl border border-slate-700 bg-slate-800 text-slate-100 hover:bg-rose-600/90 hover:border-rose-500 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </header>

      {/* Main Zoom & Pan Canvas */}
      <div
        ref={stageRef}
        dir="ltr"
        onClick={(e) => e.stopPropagation()}
        onWheel={handleWheel}
        onDoubleClick={handleDoubleClick}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerEnd}
        onPointerCancel={handlePointerEnd}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className={`relative flex-1 overflow-hidden flex items-center justify-center touch-none transition-colors duration-200 ${
          lightCanvas ? 'bg-slate-100' : 'bg-[#080E1A]'
        } ${
          zoom > 1
            ? isDragging
              ? 'cursor-grabbing'
              : 'cursor-grab'
            : 'cursor-zoom-in'
        }`}
      >
        {/* Subtle technical grid on light or dark inspection surface */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-25"
          style={{
            backgroundImage: lightCanvas
              ? 'radial-gradient(#94A3B8 1px, transparent 1px)'
              : 'radial-gradient(#1E293B 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />

        <div
          className="relative flex h-[min(74vh,720px)] w-[min(94vw,1080px)] items-center justify-center p-3 sm:p-6 will-change-transform"
          style={{
            transform: `translate3d(${pan.x}px, ${pan.y}px, 0) scale(${zoom})`,
            transition: isDragging ? 'none' : 'transform 140ms cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          <ComponentImage
            src={component.imageUrl}
            alt={`${loc.name} (${component.nameEn})`}
            componentId={component.id}
            className="h-full w-full object-contain drop-shadow-2xl pointer-events-none select-none"
          />
        </div>

        {/* Live Pan Cue when zoomed */}
        {zoom > 1 && (
          <div
            dir={isRtl ? 'rtl' : 'ltr'}
            className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 inline-flex items-center gap-1.5 rounded-xl border border-slate-700/80 bg-slate-900/85 px-3 py-1.5 text-[11px] font-semibold text-slate-200 shadow-lg backdrop-blur-sm whitespace-nowrap"
          >
            <Move className="h-3.5 w-3.5 text-[#34D399]" />
            <span>
              {pick(
                'اسحب للتحريك وفحص الأرجل',
                'Glissez pour inspecter les broches',
                'Drag to pan and inspect pins'
              )}
            </span>
          </div>
        )}
      </div>

      {/* Bottom Pinout Quick Reference Strip */}
      <footer
        onClick={(e) => e.stopPropagation()}
        className="border-t border-slate-800 bg-slate-900/95 px-4 py-3 sm:px-6 shrink-0"
      >
        <div className="mx-auto flex max-w-5xl flex-col gap-1.5 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-xs text-slate-300 leading-relaxed">
            <span className="font-bold text-[#34D399]">
              {pick('ملاحظات الأطراف: ', 'Brochage : ', 'Pinout Notes: ')}
            </span>
            <span>{loc.pinoutNotes[0]}</span>
            {loc.pinoutNotes[1] && (
              <>
                <span className="mx-1.5 text-slate-600" aria-hidden="true">·</span>
                <span className="text-slate-400">{loc.pinoutNotes[1]}</span>
              </>
            )}
          </div>
          <p className="text-[11px] text-slate-400 shrink-0 whitespace-nowrap">
            {pick(
              'انقر مرتين للتكبير · عجلة الفأرة أو السحب',
              'Double-clic pour zoomer · Molette ou pincement',
              'Double-tap to zoom · Scroll or pinch'
            )}
          </p>
        </div>
      </footer>
    </div>
  );
};
