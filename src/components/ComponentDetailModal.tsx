import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  BookA,
  Bookmark,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Cpu,
  ExternalLink,
  Gauge,
  AlertTriangle,
  Lightbulb,
  X,
  XCircle,
} from 'lucide-react';
import { ElectronicComponent } from '../types/electronics';
import { GlossaryTerm } from '../data/glossaryData';
import { extractGlossaryTermsFromTexts, GlossaryText } from './GlossaryText';
import { ComponentImage } from './ComponentImage';
import { SchematicSymbol } from './SchematicSymbol';
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
}) => {
  const { lang, isRtl, t, pick } = useLanguage();
  const loc = getLocalizedComponent(component, lang);
  const [activeGlossaryTerm, setActiveGlossaryTerm] = useState<GlossaryTerm | null>(null);

  useEffect(() => {
    setActiveGlossaryTerm(null);
  }, [component.id]);

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

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col bg-slate-50 dark:bg-slate-950 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="detail-component-title"
    >
      {/* Top Action Header */}
      <header className="sticky top-0 z-30 flex h-14 items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 px-4 sm:px-6 backdrop-blur-md">
        <button
          type="button"
          onClick={onClose}
          className="inline-flex min-h-[44px] items-center gap-2 rounded-xl px-2 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0"
        >
          {isRtl ? <ArrowRight className="h-5 w-5" /> : <ArrowLeft className="h-5 w-5" />}
          <span>{t.detail.backToGuide}</span>
        </button>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={onPrev}
            aria-label={t.detail.prevAria}
            className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            {isRtl ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
          </button>
          <button
            type="button"
            onClick={onNext}
            aria-label={t.detail.nextAria}
            className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            {isRtl ? <ChevronLeft className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
          </button>
          <button
            type="button"
            onClick={() => onToggleBookmark(component.id)}
            aria-label={isBookmarked ? t.hero.unsaveAria : t.hero.saveAria}
            className={`flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl border transition-colors ${
              isBookmarked
                ? 'border-sky-600 bg-sky-50 text-sky-600 dark:border-sky-500 dark:bg-sky-950 dark:text-sky-400'
                : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Bookmark className={`h-5 w-5 ${isBookmarked ? 'fill-current' : ''}`} />
          </button>
        </div>
      </header>

      {/* Main Content Container */}
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-6 sm:px-6 sm:py-8 pb-24">
        {/* Hero Split: Photo + Summary & Schematic Symbol */}
        <section className="grid grid-cols-1 gap-6 lg:grid-cols-12 items-stretch pb-8 border-b border-slate-200 dark:border-slate-800">
          <div className="lg:col-span-6 overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 aspect-[4/3]">
            <ComponentImage
              src={component.imageUrl}
              alt={`${loc.name} (${component.nameEn})`}
              componentId={component.id}
              className="h-full w-full object-cover"
            />
          </div>

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

              <p className="mt-4 text-base leading-relaxed text-slate-700 dark:text-slate-300">
                <GlossaryText text={loc.shortRole} onSelectTerm={setActiveGlossaryTerm} />
              </p>
            </div>

            {/* Schematic Symbol Box */}
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4">
              <div className="flex items-center justify-between text-xs font-medium text-slate-500 dark:text-slate-400 mb-2">
                <span>{t.detail.schematicLabel}</span>
                <span className="font-mono-num">{component.symbolLetter}</span>
              </div>
              <div className="flex items-center justify-center rounded-xl bg-slate-50 dark:bg-slate-950/70 py-3 text-slate-900 dark:text-slate-100">
                <SchematicSymbol componentId={component.id} className="h-24 w-full max-w-[260px]" />
              </div>
            </div>

            <button
              type="button"
              onClick={() => onTestInMultimeter(component.id)}
              className="inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl bg-sky-600 px-5 py-3 text-sm font-semibold text-white hover:bg-sky-700 active:scale-[0.99] transition-colors"
            >
              <Gauge className="h-5 w-5" />
              <span>{t.detail.testInMultimeter}</span>
            </button>
          </div>
        </section>

        {/* Section 1: Role in Electronics & Physics */}
        <section className="py-8 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2 text-sky-600 dark:text-sky-400 text-sm font-bold mb-3">
            <Cpu className="h-4 w-4" />
            <h2>{t.detail.sec1Title}</h2>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1.5">{t.detail.roleHeading}</h3>
                <p className="text-sm sm:text-base leading-relaxed text-slate-700 dark:text-slate-300">
                  <GlossaryText text={loc.fullRole} onSelectTerm={setActiveGlossaryTerm} />
                </p>
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1.5">{t.detail.howWorksHeading}</h3>
                <p className="text-sm sm:text-base leading-relaxed text-slate-700 dark:text-slate-300">
                  <GlossaryText text={loc.howItWorks} onSelectTerm={setActiveGlossaryTerm} />
                </p>
              </div>
            </div>

            <div className="space-y-5">
              {component.formula && (
                <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4">
                  <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2">
                    {t.detail.formulaHeading}
                  </div>
                  <div
                    className="font-mono-num text-base sm:text-lg font-bold text-slate-900 dark:text-sky-300 bg-slate-50 dark:bg-slate-950 rounded-xl px-4 py-2.5 text-center"
                    dir="ltr"
                  >
                    {component.formula.equation}
                  </div>
                  {loc.formulaMeaning && (
                    <p className="mt-2.5 text-xs sm:text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                      <GlossaryText text={loc.formulaMeaning} onSelectTerm={setActiveGlossaryTerm} />
                    </p>
                  )}
                </div>
              )}

              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-2">{t.detail.pinoutHeading}</h3>
                <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
                  {loc.pinoutNotes.map((note, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 leading-relaxed">
                      <span className="font-mono-num text-xs font-bold text-sky-600 dark:text-sky-400 mt-1">
                        0{idx + 1}
                      </span>
                      <span>
                        <GlossaryText text={note} onSelectTerm={setActiveGlossaryTerm} />
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {detectedTerms.length > 0 && (
            <div className="mt-6 pt-5 border-t border-slate-200/80 dark:border-slate-800/80">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300 mb-2.5">
                <BookA className="h-4 w-4 text-sky-600 dark:text-sky-400" />
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
                      onClick={() => setActiveGlossaryTerm(term)}
                      className="min-h-[36px] rounded-xl border border-sky-200 dark:border-sky-900 bg-sky-50/70 dark:bg-sky-950/40 px-3 py-1.5 text-xs font-semibold text-sky-800 dark:text-sky-300 hover:bg-sky-100 dark:hover:bg-sky-900/60 transition-colors"
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
        <section className="py-8 border-b border-slate-200 dark:border-slate-800">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-2 text-sky-600 dark:text-sky-400 text-sm font-bold">
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
          <div className="mb-6 flex items-start gap-3 rounded-2xl border border-amber-300 dark:border-amber-800 bg-amber-50/70 dark:bg-amber-950/40 p-4 text-sm text-amber-950 dark:text-amber-100">
            <AlertTriangle className="h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
            <div>
              <span className="font-bold">{t.detail.safetyPrefix} </span>
              <span className="leading-relaxed">
                <GlossaryText text={loc.safetyNote} onSelectTerm={setActiveGlossaryTerm} />
              </span>
            </div>
          </div>

          {/* Step-by-step */}
          <div className="mb-6">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3">{t.detail.stepsHeading}</h3>
            <ol className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {loc.steps.map((step, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 text-sm leading-relaxed text-slate-700 dark:text-slate-300"
                >
                  <span className="font-mono-num flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white">
                    {idx + 1}
                  </span>
                  <span>
                    <GlossaryText text={step} onSelectTerm={setActiveGlossaryTerm} />
                  </span>
                </li>
              ))}
            </ol>
          </div>

          {/* Healthy vs Faulty Diagnostics Table */}
          <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <div className="divide-y divide-slate-200 dark:divide-slate-800">
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 p-4">
                <div className="sm:col-span-4 flex items-center gap-2 text-sm font-bold text-emerald-700 dark:text-emerald-400">
                  <CheckCircle2 className="h-4 w-4 shrink-0" />
                  <span>{t.detail.goodLabel}</span>
                </div>
                <div className="sm:col-span-8 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  <GlossaryText text={loc.goodReading} onSelectTerm={setActiveGlossaryTerm} />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 p-4">
                <div className="sm:col-span-4 flex items-center gap-2 text-sm font-bold text-rose-700 dark:text-rose-400">
                  <XCircle className="h-4 w-4 shrink-0" />
                  <span>{t.detail.openLabel}</span>
                </div>
                <div className="sm:col-span-8 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  <GlossaryText text={loc.openFaultReading} onSelectTerm={setActiveGlossaryTerm} />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 p-4">
                <div className="sm:col-span-4 flex items-center gap-2 text-sm font-bold text-rose-700 dark:text-rose-400">
                  <XCircle className="h-4 w-4 shrink-0" />
                  <span>{t.detail.shortLabel}</span>
                </div>
                <div className="sm:col-span-8 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  <GlossaryText text={loc.shortFaultReading} onSelectTerm={setActiveGlossaryTerm} />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 p-4">
                <div className="sm:col-span-4 flex items-center gap-2 text-sm font-bold text-amber-700 dark:text-amber-400">
                  <AlertTriangle className="h-4 w-4 shrink-0" />
                  <span>{t.detail.degradedLabel}</span>
                </div>
                <div className="sm:col-span-8 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  <GlossaryText text={loc.degradedReading} onSelectTerm={setActiveGlossaryTerm} />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: Types, Applications & Visual Faults */}
        <section className="pt-8 grid grid-cols-1 gap-8 md:grid-cols-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3">{t.detail.sec3Title}</h3>
            <ul className="space-y-2.5 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {loc.commonTypes.map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-sky-600 dark:text-sky-400 font-bold">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3">{t.detail.sec4Title}</h3>
            <ul className="space-y-2.5 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {loc.realWorldUses.map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-sky-600 dark:text-sky-400 font-bold">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3">{t.detail.sec5Title}</h3>
            <ul className="space-y-2.5 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
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
          onClick={() => setActiveGlossaryTerm(null)}
        >
          <div
            className="w-full max-w-md rounded-t-3xl sm:rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-6 shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-sky-50 dark:bg-sky-950 text-sky-600 dark:text-sky-400">
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
                    <div className="text-xs font-mono-num text-sky-600 dark:text-sky-400 font-semibold" dir="ltr">
                      {activeGlossaryTerm.symbolOrUnit}
                    </div>
                  )}
                </div>
              </div>

              <button
                type="button"
                onClick={() => setActiveGlossaryTerm(null)}
                aria-label={pick('إغلاق', 'Fermer', 'Close')}
                className="flex min-h-[40px] min-w-[40px] items-center justify-center rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
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

            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 p-3 flex items-start gap-2 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
              <Lightbulb className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
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
                  className="inline-flex min-h-[44px] flex-1 items-center justify-center gap-2 rounded-xl bg-sky-600 px-4 py-2 text-xs font-bold text-white hover:bg-sky-700 transition-colors"
                >
                  <span>{pick('فتح في القاموس الشامل', 'Ouvrir dans le lexique', 'Open in Full Glossary')}</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </button>
              ) : (
                <span />
              )}
              <button
                type="button"
                onClick={() => setActiveGlossaryTerm(null)}
                className="min-h-[44px] rounded-xl border border-slate-200 dark:border-slate-700 px-4 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                {pick('إغلاق', 'Fermer', 'Close')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
