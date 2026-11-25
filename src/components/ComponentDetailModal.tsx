import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  AlertTriangle,
  ArrowLeft,
  ArrowLeftRight,
  ArrowRight,
  BookA,
  BookOpenText,
  Bookmark,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Cpu,
  ExternalLink,
  Gauge,
  GitCompareArrows,
  Home,
  Layers,
  Lightbulb,
  Maximize2,
  X,
  XCircle,
} from 'lucide-react';
import { ElectronicComponent } from '../types/electronics';
import { ELECTRONIC_COMPONENTS } from '../data/componentsData';
import { COMPONENT_ALTERNATIVES } from '../data/componentAlternatives';
import { GLOSSARY_TERMS, GlossaryTerm } from '../data/glossaryData';
import { extractGlossaryTermsFromTexts, GlossaryText } from './GlossaryText';
import { ComponentImage } from './ComponentImage';
import { ComponentImageFullscreenModal } from './ComponentImageFullscreenModal';
import { SchematicSymbol } from './SchematicSymbol';
import { ComponentCompareModal } from './ComponentCompareModal';
import { useLanguage } from '../i18n/LanguageContext';
import { getLocalizedComponent } from '../i18n/dataTranslations';

interface ComponentDetailModalProps {
  component: ElectronicComponent;
  isBookmarked: boolean;
  onToggleBookmark: (id: string) => void;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  onTestInMultimeter: (componentId: string) => void;
  onOpenGlossaryTerm?: (termId: string) => void;
  activeGlossaryTermId?: string | null;
  onSelectGlossaryTermId?: (termId: string | null) => void;
  onNavigateHome?: () => void;
  onNavigateCategory?: (category: ElectronicComponent['category']) => void;
  onSelectComponent?: (componentId: string) => void;
  onOpenPinoutGuide?: () => void;
  comfortableReading?: boolean;
  onToggleComfortableReading?: () => void;
}

export const ComponentDetailModal: React.FC<ComponentDetailModalProps> = ({
  component,
  isBookmarked,
  onToggleBookmark,
  onClose,
  onPrev,
  onNext,
  onTestInMultimeter,
  onOpenGlossaryTerm,
  activeGlossaryTermId,
  onSelectGlossaryTermId,
  onNavigateHome,
  onNavigateCategory,
  onSelectComponent,
  onOpenPinoutGuide,
  comfortableReading = false,
  onToggleComfortableReading,
}) => {
  const { lang, isRtl, t, pick } = useLanguage();
  const loc = getLocalizedComponent(component, lang);
  const [internalGlossaryTermId, setInternalGlossaryTermId] = useState<string | null>(null);
  const [selectedAltIndex, setSelectedAltIndex] = useState<number>(0);
  const [showCompareModal, setShowCompareModal] = useState<boolean>(false);
  const [showFullscreenImage, setShowFullscreenImage] = useState<boolean>(false);
  const modalScrollRef = useRef<HTMLDivElement | null>(null);

  const alternativesEntry = COMPONENT_ALTERNATIVES[component.id];
  const activeAlt =
    alternativesEntry && alternativesEntry.alternatives.length > 0
      ? alternativesEntry.alternatives[
          Math.min(selectedAltIndex, alternativesEntry.alternatives.length - 1)
        ]
      : null;

  useEffect(() => {
    setSelectedAltIndex(0);
    setShowCompareModal(false);
    setShowFullscreenImage(false);
    if (modalScrollRef.current) {
      modalScrollRef.current.scrollTop = 0;
    }
  }, [component.id]);

  const effectiveTermId =
    activeGlossaryTermId !== undefined ? activeGlossaryTermId : internalGlossaryTermId;

  const activeGlossaryTerm: GlossaryTerm | null = useMemo(
    () =>
      effectiveTermId
        ? GLOSSARY_TERMS.find((item) => item.id === effectiveTermId) || null
        : null,
    [effectiveTermId]
  );

  const selectGlossaryTerm = (term: GlossaryTerm | null) => {
    const nextId = term ? term.id : null;
    if (onSelectGlossaryTermId) {
      onSelectGlossaryTermId(nextId);
    } else {
      setInternalGlossaryTermId(nextId);
    }
  };

  useEffect(() => {
    if (onSelectGlossaryTermId === undefined) {
      setInternalGlossaryTermId(null);
    }
  }, [component.id, onSelectGlossaryTermId]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (showFullscreenImage) {
          setShowFullscreenImage(false);
        } else if (showCompareModal) {
          setShowCompareModal(false);
        } else if (effectiveTermId) {
          if (onSelectGlossaryTermId) {
            onSelectGlossaryTermId(null);
          } else {
            setInternalGlossaryTermId(null);
          }
        } else {
          onClose();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showFullscreenImage, showCompareModal, effectiveTermId, onSelectGlossaryTermId, onClose]);

  const detectedTerms = useMemo(
    () =>
      extractGlossaryTermsFromTexts(
        [
          loc.shortRole,
          loc.fullRole,
          loc.howItWorks,
          loc.formulaMeaning || '',
          ...loc.pinoutNotes,
          loc.safetyNote,
          ...loc.steps,
          loc.goodReading,
          loc.openFaultReading,
          loc.shortFaultReading,
          loc.degradedReading,
        ],
        lang
      ),
    [loc, lang]
  );

  const isLongText = useMemo(() => {
    const totalLength =
      loc.shortRole.length +
      loc.fullRole.length +
      loc.howItWorks.length +
      (loc.formulaMeaning?.length || 0) +
      loc.pinoutNotes.join(' ').length +
      loc.steps.join(' ').length;
    return totalLength >= 380;
  }, [loc]);

  const proseClass = comfortableReading
    ? 'text-base sm:text-[18px] leading-[2] text-slate-800 dark:text-slate-200'
    : 'text-sm sm:text-base leading-relaxed text-slate-700 dark:text-slate-300';

  const listProseClass = comfortableReading
    ? 'text-base sm:text-[17px] leading-[1.95] text-slate-800 dark:text-slate-200'
    : 'text-sm leading-relaxed text-slate-700 dark:text-slate-300';

  const surfaceCardClass = comfortableReading
    ? 'border-amber-200/70 dark:border-[#334155] bg-[#fffdf8] dark:bg-[#1E293B]'
    : 'border-[#E2E8F0] dark:border-[#334155] bg-white dark:bg-[#1E293B]';

  return (
    <div
      ref={modalScrollRef}
      className={`fixed inset-0 z-50 flex flex-col overflow-y-auto transition-colors ${
        comfortableReading
          ? 'bg-[#faf6ed] text-slate-900 dark:bg-[#0F172A] dark:text-slate-100'
          : 'bg-[#F8FAFC] dark:bg-[#0F172A]'
      }`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="detail-component-title"
    >
      {/* Top Action Header */}
      <header
        className={`sticky top-0 z-30 flex h-14 items-center justify-between gap-2 sm:gap-4 border-b px-4 sm:px-6 backdrop-blur-md ${
          comfortableReading
            ? 'border-amber-200/70 dark:border-[#334155] bg-[#fcf9f2]/95 dark:bg-[#1E293B]/95'
            : 'border-[#E2E8F0] dark:border-[#334155] bg-white/95 dark:bg-[#1E293B]/95'
        }`}
      >
        <button
          type="button"
          onClick={onClose}
          className="inline-flex min-h-[44px] items-center gap-2 rounded-xl px-2 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors whitespace-nowrap shrink-0"
        >
          {isRtl ? <ArrowRight className="h-5 w-5" /> : <ArrowLeft className="h-5 w-5" />}
          <span>{t.detail.backToGuide}</span>
        </button>

        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setShowCompareModal(true)}
            title={pick('مقارنة مع عنصر آخر', 'Comparer avec un autre composant', 'Compare with another component')}
            className="inline-flex min-h-[44px] items-center gap-1.5 rounded-xl border border-[#059669]/40 bg-emerald-50/80 dark:border-emerald-500/40 dark:bg-emerald-950/50 px-3 py-2 text-xs font-bold text-[#059669] dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 transition-colors whitespace-nowrap"
          >
            <GitCompareArrows className="h-4 w-4 shrink-0" />
            <span>{pick('مقارنة', 'Comparer', 'Compare')}</span>
          </button>

          {onToggleComfortableReading && (
            <button
              type="button"
              onClick={onToggleComfortableReading}
              aria-pressed={comfortableReading}
              title={t.detail.comfortableReadingBtn}
              className={`inline-flex min-h-[44px] items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-bold transition-colors whitespace-nowrap ${
                comfortableReading
                  ? 'border-[#059669] bg-emerald-50 text-[#059669] dark:border-emerald-500 dark:bg-emerald-950/60 dark:text-emerald-300'
                  : 'border-[#E2E8F0] dark:border-[#334155] text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              <BookOpenText className="h-4 w-4 shrink-0" />
              <span className="hidden sm:inline">{t.detail.comfortableReadingBtn}</span>
            </button>
          )}

          <button
            type="button"
            onClick={onPrev}
            aria-label={t.detail.prevAria}
            className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl border border-[#E2E8F0] dark:border-[#334155] text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          >
            {isRtl ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
          </button>
          <button
            type="button"
            onClick={onNext}
            aria-label={t.detail.nextAria}
            className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl border border-[#E2E8F0] dark:border-[#334155] text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          >
            {isRtl ? <ChevronLeft className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
          </button>
          <button
            type="button"
            onClick={() => onToggleBookmark(component.id)}
            aria-label={isBookmarked ? t.hero.unsaveAria : t.hero.saveAria}
            className={`flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl border transition-colors ${
              isBookmarked
                ? 'border-[#D97706] bg-amber-50 text-[#D97706] dark:border-amber-500 dark:bg-amber-950/50 dark:text-amber-400'
                : 'border-[#E2E8F0] dark:border-[#334155] text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
            }`}
          >
            <Bookmark className={`h-5 w-5 ${isBookmarked ? 'fill-current' : ''}`} />
          </button>
        </div>
      </header>

      {/* Main Content Container */}
      <main
        className={`mx-auto w-full flex-1 px-4 py-4 sm:px-6 sm:py-6 pb-24 transition-all ${
          comfortableReading ? 'max-w-3xl' : 'max-w-5xl'
        }`}
      >
        {/* Breadcrumb Navigation Trail */}
        <nav
          aria-label={pick('مسار التنقل', 'Fil d’Ariane', 'Breadcrumb')}
          className="mb-4 pb-3 border-b border-[#E2E8F0] dark:border-[#334155] overflow-x-auto"
        >
          <ol className="flex items-center gap-1.5 text-xs sm:text-sm whitespace-nowrap">
            <li className="inline-flex items-center">
              <button
                type="button"
                onClick={() => (onNavigateHome ? onNavigateHome() : onClose())}
                className="inline-flex min-h-[44px] items-center gap-1.5 rounded-lg px-2 py-1 font-medium text-slate-600 dark:text-slate-400 hover:text-[#059669] dark:hover:text-emerald-400 hover:bg-slate-100 dark:hover:bg-[#1E293B] transition-colors"
              >
                <Home className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                <span>{t.nav.components}</span>
              </button>
            </li>

            <li aria-hidden="true" className="text-slate-400 dark:text-slate-600">
              {isRtl ? <ChevronLeft className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
            </li>

            <li className="inline-flex items-center">
              <button
                type="button"
                onClick={() =>
                  onNavigateCategory ? onNavigateCategory(component.category) : onClose()
                }
                className="inline-flex min-h-[44px] items-center rounded-lg px-2 py-1 font-medium text-slate-600 dark:text-slate-400 hover:text-[#059669] dark:hover:text-emerald-400 hover:bg-slate-100 dark:hover:bg-[#1E293B] transition-colors"
              >
                {loc.categoryLabel}
              </button>
            </li>

            <li aria-hidden="true" className="text-slate-400 dark:text-slate-600">
              {isRtl ? <ChevronLeft className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
            </li>

            <li
              aria-current="page"
              className="px-2 py-1 font-bold text-slate-900 dark:text-white truncate max-w-[200px] sm:max-w-xs"
            >
              {loc.name}
            </li>
          </ol>
        </nav>

        {/* Comfortable Reading Status / Long-Text Study Bar */}
        {(comfortableReading || (isLongText && onToggleComfortableReading)) && (
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2 text-xs">
            {comfortableReading ? (
              <div className="flex items-center gap-2 font-semibold text-emerald-700 dark:text-emerald-400">
                <BookOpenText className="h-4 w-4 shrink-0" />
                <span>{t.detail.comfortableReadingActiveHint}</span>
              </div>
            ) : (
              <div className="text-slate-500 dark:text-slate-400">
                {pick(
                  'يحتوي هذا العنصر على شرح تفصيلي طويل — يمكنك تفعيل وضع القراءة المريحة أثناء المذاكرة.',
                  'Cette fiche contient un texte détaillé — activez la lecture confortable pour étudier sans fatigue.',
                  'This guide contains detailed study text — try Comfort Reading for relaxed spacing.'
                )}
              </div>
            )}
            {onToggleComfortableReading && (
              <button
                type="button"
                onClick={onToggleComfortableReading}
                className="font-bold text-[#059669] dark:text-emerald-400 hover:underline whitespace-nowrap"
              >
                {comfortableReading
                  ? pick('إيقاف القراءة المريحة', 'Désactiver', 'Turn off')
                  : pick('تفعيل القراءة المريحة', 'Activer lecture confortable', 'Enable Comfort Reading')}
              </button>
            )}
          </div>
        )}

        {/* Hero Split: Photo + Summary & Schematic Symbol */}
        <section className="grid grid-cols-1 gap-6 lg:grid-cols-12 items-stretch pb-8 border-b border-[#E2E8F0] dark:border-[#334155]">
          <button
            type="button"
            onClick={() => setShowFullscreenImage(true)}
            aria-label={pick(
              `عرض صورة ${loc.name} بملء الشاشة`,
              `Afficher l'image de ${loc.name} en plein écran`,
              `View ${loc.name} image in fullscreen`
            )}
            className={`group relative lg:col-span-6 overflow-hidden rounded-2xl border aspect-[4/3] cursor-zoom-in text-start focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#059669] ${surfaceCardClass}`}
          >
            <ComponentImage
              src={component.imageUrl}
              alt={`${loc.name} (${component.nameEn})`}
              componentId={component.id}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
            />
            <span className="pointer-events-none absolute bottom-3 end-3 inline-flex min-h-[36px] items-center gap-1.5 rounded-xl border border-white/15 bg-slate-900/75 px-3 py-1.5 text-xs font-bold text-white shadow-md backdrop-blur-sm transition-colors group-hover:bg-[#059669]">
              <Maximize2 className="h-3.5 w-3.5 shrink-0" />
              <span>{pick('عرض بملء الشاشة', 'Plein écran', 'Fullscreen')}</span>
            </span>
          </button>

          <div className="lg:col-span-6 flex flex-col justify-between gap-6">
            <div>
              <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
                <span>{loc.categoryLabel}</span>
                <span aria-hidden="true">·</span>
                <span className="font-mono-num">{t.hero.symbolPrefix} {component.symbolLetter}</span>
                <span aria-hidden="true">·</span>
                <span>{t.detail.unitLabel} {loc.unit} ({component.unitSymbol})</span>
              </div>

              <h1
                id="detail-component-title"
                className="mt-2 text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight"
                style={{ textWrap: 'balance' }}
              >
                {loc.name}
              </h1>
              {lang !== 'en' && (
                <p className="mt-1 text-sm font-mono text-slate-500 dark:text-slate-400" dir="ltr">
                  {component.nameEn}
                </p>
              )}

              <p className={`mt-4 ${comfortableReading ? 'text-base sm:text-[18px] leading-[1.95] text-slate-800 dark:text-slate-200' : 'text-base leading-relaxed text-slate-700 dark:text-slate-300'}`}>
                <GlossaryText text={loc.shortRole} onSelectTerm={selectGlossaryTerm} />
              </p>
            </div>

            {/* Schematic Symbol Box */}
            <div className="rounded-2xl border border-[#E2E8F0] dark:border-[#334155] bg-white dark:bg-[#1E293B] p-4 shadow-sm">
              <div className="flex items-center justify-between text-xs font-medium text-slate-500 dark:text-slate-400 mb-2">
                <span>{t.detail.schematicLabel}</span>
                <span className="font-mono-num">{component.symbolLetter}</span>
              </div>
              <div className="flex items-center justify-center rounded-xl bg-[#F8FAFC] dark:bg-[#0F172A] py-3 text-slate-900 dark:text-slate-100">
                <SchematicSymbol componentId={component.id} className="h-24 w-full max-w-[260px]" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5">
              <button
                type="button"
                onClick={() => onTestInMultimeter(component.id)}
                className="sm:col-span-8 inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl bg-[#059669] px-5 py-3 text-sm font-semibold text-white hover:bg-[#047857] active:scale-[0.99] transition-colors shadow-sm"
              >
                <Gauge className="h-5 w-5 shrink-0" />
                <span>{t.detail.testInMultimeter}</span>
              </button>

              <button
                type="button"
                onClick={() => setShowCompareModal(true)}
                className="sm:col-span-4 inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl border border-[#D97706] bg-amber-50/70 dark:bg-amber-950/35 px-4 py-3 text-sm font-bold text-[#D97706] dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/50 active:scale-[0.99] transition-colors"
              >
                <GitCompareArrows className="h-4 w-4 shrink-0" />
                <span>{pick('مقارنة', 'Comparer', 'Compare')}</span>
              </button>
            </div>
          </div>
        </section>

        {/* Section 1: Role in Electronics & Physics */}
        <section className="py-8 border-b border-[#E2E8F0] dark:border-[#334155]">
          <div className="flex items-center gap-2 text-[#059669] dark:text-emerald-400 text-sm font-bold mb-3">
            <Cpu className="h-4 w-4" />
            <h2>{t.detail.sec1Title}</h2>
          </div>

          <div className={`grid grid-cols-1 gap-6 ${comfortableReading ? '' : 'lg:grid-cols-2'}`}>
            <div className={comfortableReading ? 'space-y-6' : 'space-y-4'}>
              <div>
                <h3 className={`font-bold text-slate-900 dark:text-white mb-2 ${comfortableReading ? 'text-base' : 'text-sm'}`}>
                  {t.detail.roleHeading}
                </h3>
                <p className={proseClass}>
                  <GlossaryText text={loc.fullRole} onSelectTerm={selectGlossaryTerm} />
                </p>
              </div>
              <div>
                <h3 className={`font-bold text-slate-900 dark:text-white mb-2 ${comfortableReading ? 'text-base' : 'text-sm'}`}>
                  {t.detail.howWorksHeading}
                </h3>
                <p className={proseClass}>
                  <GlossaryText text={loc.howItWorks} onSelectTerm={selectGlossaryTerm} />
                </p>
              </div>
            </div>

            <div className={comfortableReading ? 'space-y-6' : 'space-y-5'}>
              {component.formula && (
                <div className={`rounded-2xl border p-4 shadow-sm ${surfaceCardClass}`}>
                  <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2">
                    {t.detail.formulaHeading}
                  </div>
                  <div
                    className="font-mono-num text-base sm:text-lg font-bold text-slate-900 dark:text-emerald-300 bg-[#F8FAFC] dark:bg-[#0F172A] rounded-xl px-4 py-2.5 text-center"
                    dir="ltr"
                  >
                    {component.formula.equation}
                  </div>
                  {loc.formulaMeaning && (
                    <p className={`mt-3 ${comfortableReading ? 'text-sm sm:text-base leading-[1.95] text-slate-700 dark:text-slate-300' : 'text-xs sm:text-sm leading-relaxed text-slate-600 dark:text-slate-400'}`}>
                      <GlossaryText text={loc.formulaMeaning} onSelectTerm={selectGlossaryTerm} />
                    </p>
                  )}
                </div>
              )}

              <div>
                <h3 className={`font-bold text-slate-900 dark:text-white mb-2.5 ${comfortableReading ? 'text-base' : 'text-sm'}`}>
                  {t.detail.pinoutHeading}
                </h3>
                <ul className={`${comfortableReading ? 'space-y-3' : 'space-y-2'} ${listProseClass}`}>
                  {loc.pinoutNotes.map((note, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <span className="font-mono-num text-xs font-bold text-[#059669] dark:text-emerald-400 mt-1.5">
                        0{idx + 1}
                      </span>
                      <span>
                        <GlossaryText text={note} onSelectTerm={selectGlossaryTerm} />
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {detectedTerms.length > 0 && (
            <div className="mt-6 pt-5 border-t border-[#E2E8F0] dark:border-[#334155]">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300 mb-2.5">
                <BookA className="h-4 w-4 text-[#059669] dark:text-emerald-400" />
                <span>
                  {pick(
                    'مصطلحات تقنية مشروحة في هذه الصفحة (اضغط على أي مصطلح لفهمه ببساطة):',
                    'Termes techniques liés dans cette fiche (cliquez pour comprendre) :',
                    'Key technical terms in this guide (tap any term to read its simple definition):'
                  )}
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {detectedTerms.map((term) => {
                  const label =
                    lang === 'ar' ? term.termAr : lang === 'fr' ? term.termFr : term.termEn;
                  return (
                    <button
                      key={term.id}
                      type="button"
                      onClick={() => selectGlossaryTerm(term)}
                      className="min-h-[36px] rounded-xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50/70 dark:bg-emerald-950/40 px-3 py-1.5 text-xs font-semibold text-[#059669] dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition-colors"
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </section>

        {/* Section 2: How to Measure with Multimeter */}
        <section className="py-8 border-b border-[#E2E8F0] dark:border-[#334155]">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-2 text-[#059669] dark:text-emerald-400 text-sm font-bold">
              <Gauge className="h-4 w-4" />
              <h2>{t.detail.sec2Title}</h2>
            </div>
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
              {t.detail.requiredMode} {loc.recommendedModeLabel}
              <span className="mx-1.5" aria-hidden="true">·</span>
              {component.measurement.polaritySensitive ? t.detail.polaritySensitive : t.detail.nonPolarized}
            </span>
          </div>

          {/* Safety Callout */}
          <div className={`mb-6 flex items-start gap-3 rounded-2xl border border-amber-300 dark:border-amber-800 bg-amber-50/70 dark:bg-amber-950/35 p-4 text-amber-950 dark:text-amber-100 ${comfortableReading ? 'text-base leading-[1.95]' : 'text-sm'}`}>
            <AlertTriangle className="h-5 w-5 shrink-0 text-[#D97706] dark:text-amber-400 mt-1" />
            <div>
              <span className="font-bold">{t.detail.safetyPrefix} </span>
              <span className={comfortableReading ? 'leading-[1.95]' : 'leading-relaxed'}>
                <GlossaryText text={loc.safetyNote} onSelectTerm={selectGlossaryTerm} />
              </span>
            </div>
          </div>

          {/* Step-by-step */}
          <div className="mb-6">
            <h3 className={`font-bold text-slate-900 dark:text-white mb-3 ${comfortableReading ? 'text-base' : 'text-sm'}`}>
              {t.detail.stepsHeading}
            </h3>
            <ol className={`grid grid-cols-1 gap-3 ${comfortableReading ? '' : 'sm:grid-cols-2'}`}>
              {loc.steps.map((step, idx) => (
                <li
                  key={idx}
                  className={`flex items-start gap-3 rounded-2xl border p-4 shadow-sm ${surfaceCardClass} ${listProseClass}`}
                >
                  <span className="font-mono-num flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-slate-100 dark:bg-[#0F172A] text-xs font-bold text-slate-900 dark:text-white mt-0.5">
                    {idx + 1}
                  </span>
                  <span>
                    <GlossaryText text={step} onSelectTerm={selectGlossaryTerm} />
                  </span>
                </li>
              ))}
            </ol>
          </div>

          {/* Healthy vs Faulty Diagnostics Table */}
          <div className={`overflow-hidden rounded-2xl border shadow-sm ${surfaceCardClass}`}>
            <div className="divide-y divide-[#E2E8F0] dark:divide-[#334155]">
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 p-4">
                <div className="sm:col-span-4 flex items-center gap-2 text-sm font-bold text-[#059669] dark:text-emerald-400">
                  <CheckCircle2 className="h-4 w-4 shrink-0" />
                  <span>{t.detail.goodLabel}</span>
                </div>
                <div className={`sm:col-span-8 ${listProseClass}`}>
                  <GlossaryText text={loc.goodReading} onSelectTerm={selectGlossaryTerm} />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 p-4">
                <div className="sm:col-span-4 flex items-center gap-2 text-sm font-bold text-rose-700 dark:text-rose-400">
                  <XCircle className="h-4 w-4 shrink-0" />
                  <span>{t.detail.openLabel}</span>
                </div>
                <div className={`sm:col-span-8 ${listProseClass}`}>
                  <GlossaryText text={loc.openFaultReading} onSelectTerm={selectGlossaryTerm} />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 p-4">
                <div className="sm:col-span-4 flex items-center gap-2 text-sm font-bold text-rose-700 dark:text-rose-400">
                  <XCircle className="h-4 w-4 shrink-0" />
                  <span>{t.detail.shortLabel}</span>
                </div>
                <div className={`sm:col-span-8 ${listProseClass}`}>
                  <GlossaryText text={loc.shortFaultReading} onSelectTerm={selectGlossaryTerm} />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 p-4">
                <div className="sm:col-span-4 flex items-center gap-2 text-sm font-bold text-[#D97706] dark:text-amber-400">
                  <AlertTriangle className="h-4 w-4 shrink-0" />
                  <span>{t.detail.degradedLabel}</span>
                </div>
                <div className={`sm:col-span-8 ${listProseClass}`}>
                  <GlossaryText text={loc.degradedReading} onSelectTerm={selectGlossaryTerm} />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: Common Alternatives & Quick Comparison */}
        {alternativesEntry && activeAlt && (
          <section className="py-8 border-b border-[#E2E8F0] dark:border-[#334155]">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-2 text-[#059669] dark:text-emerald-400 text-sm font-bold">
                <ArrowLeftRight className="h-4 w-4" />
                <h2>
                  {pick(
                    'قائمة البدائل الشائعة والمقارنة السريعة',
                    'Équivalents courants & Comparaison rapide',
                    'Common Alternatives & Quick Compare'
                  )}
                </h2>
              </div>
              <span className="text-xs font-mono-num font-semibold text-slate-600 dark:text-slate-300" dir="ltr">
                {alternativesEntry.baseline.partName}
              </span>
            </div>

            {/* Selectable Alternatives Strip */}
            <div className="flex flex-wrap gap-2 mb-4" role="tablist" aria-label={pick('البدائل الشائعة', 'Équivalents courants', 'Common Alternatives')}>
              {alternativesEntry.alternatives.map((alt, idx) => {
                const isSelected = idx === selectedAltIndex;
                const altBadge = lang === 'ar' ? alt.badgeAr : lang === 'fr' ? alt.badgeFr : alt.badgeEn;
                return (
                  <button
                    key={alt.partName}
                    type="button"
                    role="tab"
                    aria-selected={isSelected}
                    onClick={() => setSelectedAltIndex(idx)}
                    className={`flex min-h-[44px] flex-col items-start rounded-xl border px-3.5 py-2 text-start transition-colors ${
                      isSelected
                        ? 'border-[#059669] bg-[#059669] text-white shadow-sm'
                        : 'border-[#E2E8F0] dark:border-[#334155] bg-white dark:bg-[#1E293B] text-slate-800 dark:text-slate-100 hover:border-[#059669]'
                    }`}
                  >
                    <span className="text-xs font-extrabold font-mono-num" dir="ltr">
                      {alt.partName}
                    </span>
                    <span
                      className={`text-[11px] font-medium ${
                        isSelected
                          ? 'text-emerald-50'
                          : alt.compatibility === 'pinout-check'
                          ? 'text-[#D97706] dark:text-amber-400'
                          : 'text-slate-500 dark:text-slate-400'
                      }`}
                    >
                      {altBadge}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Side-by-Side Comparison Card */}
            <div className={`overflow-hidden rounded-2xl border shadow-sm ${surfaceCardClass}`}>
              <div className="grid grid-cols-12 border-b border-[#E2E8F0] dark:border-[#334155] bg-slate-50/90 dark:bg-[#0F172A]/70 px-4 py-3 text-xs font-bold">
                <div className="col-span-4 text-slate-500 dark:text-slate-400">
                  {pick('المعيار', 'Critère', 'Parameter')}
                </div>
                <div className="col-span-4 text-slate-800 dark:text-slate-100 font-mono-num truncate" dir="ltr">
                  {alternativesEntry.baseline.partName}
                </div>
                <div className="col-span-4 text-[#059669] dark:text-emerald-400 font-mono-num truncate" dir="ltr">
                  {activeAlt.partName}
                </div>
              </div>

              <div className="divide-y divide-[#E2E8F0] dark:divide-[#334155] text-xs sm:text-sm">
                <div className="grid grid-cols-12 items-center gap-2 px-4 py-3">
                  <div className="col-span-4 font-semibold text-slate-600 dark:text-slate-300">
                    {pick('التغليف / الأرجل', 'Boîtier / Broches', 'Package / Pinout')}
                  </div>
                  <div className="col-span-4 font-mono-num text-slate-800 dark:text-slate-100" dir="ltr">
                    {alternativesEntry.baseline.packageOrFormat}
                  </div>
                  <div
                    className={`col-span-4 font-mono-num font-bold ${
                      activeAlt.compatibility === 'pinout-check'
                        ? 'text-[#D97706] dark:text-amber-400'
                        : 'text-[#059669] dark:text-emerald-400'
                    }`}
                    dir="ltr"
                  >
                    {activeAlt.packageOrFormat}
                  </div>
                </div>

                <div className="grid grid-cols-12 items-center gap-2 px-4 py-3">
                  <div className="col-span-4 font-semibold text-slate-600 dark:text-slate-300">
                    {pick('أقصى جهد', 'Tension max', 'Max Voltage')}
                  </div>
                  <div className="col-span-4 font-mono-num text-slate-800 dark:text-slate-100" dir="ltr">
                    {alternativesEntry.baseline.voltageRating}
                  </div>
                  <div className="col-span-4 font-mono-num font-bold text-slate-900 dark:text-white" dir="ltr">
                    {activeAlt.voltageRating}
                  </div>
                </div>

                <div className="grid grid-cols-12 items-center gap-2 px-4 py-3">
                  <div className="col-span-4 font-semibold text-slate-600 dark:text-slate-300">
                    {pick('التيار / القدرة', 'Courant / Puiss.', 'Current / Power')}
                  </div>
                  <div className="col-span-4 font-mono-num text-slate-800 dark:text-slate-100" dir="ltr">
                    {alternativesEntry.baseline.currentOrPowerRating}
                  </div>
                  <div className="col-span-4 font-mono-num font-bold text-[#059669] dark:text-emerald-400" dir="ltr">
                    {activeAlt.currentOrPowerRating}
                  </div>
                </div>
              </div>

              {/* Technical Difference & Pinout Warning */}
              <div
                className={`border-t px-4 py-3.5 flex items-start gap-2.5 text-xs sm:text-sm leading-relaxed ${
                  activeAlt.compatibility === 'pinout-check'
                    ? 'border-amber-200 dark:border-amber-900/60 bg-amber-50/70 dark:bg-amber-950/30 text-amber-950 dark:text-amber-100'
                    : 'border-[#E2E8F0] dark:border-[#334155] bg-emerald-50/45 dark:bg-emerald-950/20 text-slate-700 dark:text-slate-200'
                }`}
              >
                {activeAlt.compatibility === 'pinout-check' ? (
                  <AlertTriangle className="h-4 w-4 text-[#D97706] dark:text-amber-400 shrink-0 mt-0.5" />
                ) : (
                  <CheckCircle2 className="h-4 w-4 text-[#059669] dark:text-emerald-400 shrink-0 mt-0.5" />
                )}
                <div className="flex-1 space-y-2">
                  <p>
                    {lang === 'ar'
                      ? activeAlt.diffSummaryAr
                      : lang === 'fr'
                      ? activeAlt.diffSummaryFr
                      : activeAlt.diffSummaryEn}
                  </p>
                  {activeAlt.relatedComponentId && onSelectComponent && (
                    <button
                      type="button"
                      onClick={() => onSelectComponent(activeAlt.relatedComponentId!)}
                      className="inline-flex min-h-[36px] items-center gap-1.5 rounded-lg bg-[#059669] px-3 py-1.5 text-xs font-bold text-white hover:bg-[#047857] transition-colors"
                    >
                      <span>
                        {lang === 'ar'
                          ? activeAlt.relatedComponentLabelAr
                          : lang === 'fr'
                          ? activeAlt.relatedComponentLabelFr
                          : activeAlt.relatedComponentLabelEn}
                      </span>
                      <ExternalLink className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Links to Related Components & Pinout Guide */}
            {(alternativesEntry.quickCompareIds?.length || onOpenPinoutGuide) && (
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-slate-300 me-1">
                  <Layers className="h-3.5 w-3.5 text-[#059669] dark:text-emerald-400" />
                  <span>
                    {pick('روابط سريعة للمقارنة:', 'Comparaisons rapides :', 'Quick Compare Links:')}
                  </span>
                </span>

                {onSelectComponent &&
                  alternativesEntry.quickCompareIds?.map((relId) => {
                    const relComp = ELECTRONIC_COMPONENTS.find((c) => c.id === relId);
                    if (!relComp) return null;
                    const relLoc = getLocalizedComponent(relComp, lang);
                    return (
                      <button
                        key={relId}
                        type="button"
                        onClick={() => onSelectComponent(relId)}
                        className="inline-flex min-h-[38px] items-center gap-1.5 rounded-xl border border-[#E2E8F0] dark:border-[#334155] bg-white dark:bg-[#1E293B] px-3 py-1.5 text-xs font-bold text-slate-700 dark:text-slate-200 hover:border-[#059669] hover:text-[#059669] dark:hover:text-emerald-400 transition-colors"
                      >
                        <span>{relLoc.name}</span>
                        <ExternalLink className="h-3 w-3 opacity-70" />
                      </button>
                    );
                  })}

                {onOpenPinoutGuide &&
                  ['transistor', 'mosfet', 'regulator', 'timer_555', 'optocoupler', 'scr', 'triac'].includes(component.id) && (
                    <button
                      type="button"
                      onClick={onOpenPinoutGuide}
                      className="inline-flex min-h-[38px] items-center gap-1.5 rounded-xl border border-amber-300 dark:border-amber-700/60 bg-amber-50/70 dark:bg-amber-950/30 px-3 py-1.5 text-xs font-bold text-[#D97706] dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/40 transition-colors"
                    >
                      <Cpu className="h-3.5 w-3.5" />
                      <span>{t.labTabs.pinout}</span>
                    </button>
                  )}
              </div>
            )}
          </section>
        )}

        {/* Section 4: Types, Applications & Visual Faults */}
        <section className={`pt-8 grid grid-cols-1 gap-8 ${comfortableReading ? '' : 'md:grid-cols-3'}`}>
          <div>
            <h3 className={`font-bold text-slate-900 dark:text-white mb-3 ${comfortableReading ? 'text-base' : 'text-sm'}`}>
              {t.detail.sec3Title}
            </h3>
            <ul className={`${comfortableReading ? 'space-y-3.5 text-base leading-[1.95]' : 'space-y-2.5 text-sm leading-relaxed'} text-slate-600 dark:text-slate-300`}>
              {loc.commonTypes.map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-[#059669] dark:text-emerald-400 font-bold">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className={`font-bold text-slate-900 dark:text-white mb-3 ${comfortableReading ? 'text-base' : 'text-sm'}`}>
              {t.detail.sec4Title}
            </h3>
            <ul className={`${comfortableReading ? 'space-y-3.5 text-base leading-[1.95]' : 'space-y-2.5 text-sm leading-relaxed'} text-slate-600 dark:text-slate-300`}>
              {loc.realWorldUses.map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-[#059669] dark:text-emerald-400 font-bold">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className={`font-bold text-slate-900 dark:text-white mb-3 ${comfortableReading ? 'text-base' : 'text-sm'}`}>
              {t.detail.sec5Title}
            </h3>
            <ul className={`${comfortableReading ? 'space-y-3.5 text-base leading-[1.95]' : 'space-y-2.5 text-sm leading-relaxed'} text-slate-600 dark:text-slate-300`}>
              {loc.visualFaultSigns.map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-rose-600 dark:text-rose-400 font-bold">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>

      {/* Quick Glossary Term Popover Modal */}
      {activeGlossaryTerm && (
        <div
          className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center bg-slate-950/60 p-0 sm:p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          onClick={() => selectGlossaryTerm(null)}
        >
          <div
            className="w-full max-w-md rounded-t-3xl sm:rounded-2xl border border-[#E2E8F0] dark:border-[#334155] bg-white dark:bg-[#1E293B] p-5 sm:p-6 shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3 pb-3 border-b border-[#E2E8F0] dark:border-[#334155]">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-[#059669] dark:text-emerald-400">
                  <BookA className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-base font-extrabold text-slate-900 dark:text-white leading-snug">
                    {lang === 'ar'
                      ? activeGlossaryTerm.termAr
                      : lang === 'fr'
                      ? activeGlossaryTerm.termFr
                      : activeGlossaryTerm.termEn}
                  </h4>
                  {activeGlossaryTerm.symbolOrUnit && (
                    <div className="text-xs font-mono-num text-[#059669] dark:text-emerald-400 font-semibold" dir="ltr">
                      {activeGlossaryTerm.symbolOrUnit}
                    </div>
                  )}
                </div>
              </div>

              <button
                type="button"
                onClick={() => selectGlossaryTerm(null)}
                aria-label={pick('إغلاق', 'Fermer', 'Close')}
                className="flex min-h-[40px] min-w-[40px] items-center justify-center rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 leading-relaxed">
              {lang === 'ar'
                ? activeGlossaryTerm.shortDefAr
                : lang === 'fr'
                ? activeGlossaryTerm.shortDefFr
                : activeGlossaryTerm.shortDefEn}
            </p>

            <p className="text-xs sm:text-sm leading-relaxed text-slate-600 dark:text-slate-300">
              {lang === 'ar'
                ? activeGlossaryTerm.simpleExplainAr
                : lang === 'fr'
                ? activeGlossaryTerm.simpleExplainFr
                : activeGlossaryTerm.simpleExplainEn}
            </p>

            <div className="rounded-xl border border-[#E2E8F0] dark:border-[#334155] bg-[#F8FAFC] dark:bg-[#0F172A] p-3 flex items-start gap-2 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
              <Lightbulb className="h-4 w-4 text-[#D97706] dark:text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-800 dark:text-slate-100">
                  {pick('مثال: ', 'Exemple : ', 'Example: ')}
                </span>
                <span>
                  {lang === 'ar'
                    ? activeGlossaryTerm.exampleAr
                    : lang === 'fr'
                    ? activeGlossaryTerm.exampleFr
                    : activeGlossaryTerm.exampleEn}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between gap-2 pt-2">
              {onOpenGlossaryTerm ? (
                <button
                  type="button"
                  onClick={() => onOpenGlossaryTerm(activeGlossaryTerm.id)}
                  className="inline-flex min-h-[44px] flex-1 items-center justify-center gap-2 rounded-xl bg-[#059669] px-4 py-2 text-xs font-bold text-white hover:bg-[#047857] transition-colors"
                >
                  <span>{pick('فتح في القاموس الشامل', 'Ouvrir dans le lexique', 'Open in Full Glossary')}</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </button>
              ) : (
                <span />
              )}
              <button
                type="button"
                onClick={() => selectGlossaryTerm(null)}
                className="min-h-[44px] rounded-xl border border-[#E2E8F0] dark:border-[#334155] px-4 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              >
                {pick('إغلاق', 'Fermer', 'Close')}
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Side-by-Side Component Comparison Modal */}
      {showCompareModal && (
        <ComponentCompareModal
          currentComponent={component}
          onClose={() => setShowCompareModal(false)}
          onSelectComponent={onSelectComponent}
          onTestInMultimeter={onTestInMultimeter}
        />
      )}
      {/* Fullscreen Image Zoom & Pin Inspection Modal */}
      {showFullscreenImage && (
        <ComponentImageFullscreenModal
          component={component}
          onClose={() => setShowFullscreenImage(false)}
        />
      )}
    </div>
  );
};
