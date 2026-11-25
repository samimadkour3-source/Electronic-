import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowLeftRight,
  CheckCircle2,
  ExternalLink,
  Gauge,
  GitCompareArrows,
  Search,
  Sparkles,
  X,
} from 'lucide-react';
import { ElectronicComponent } from '../types/electronics';
import { ELECTRONIC_COMPONENTS } from '../data/componentsData';
import { COMPONENT_ALTERNATIVES } from '../data/componentAlternatives';
import { ComponentImage } from './ComponentImage';
import { SchematicSymbol } from './SchematicSymbol';
import { useLanguage } from '../i18n/LanguageContext';
import { getLocalizedComponent } from '../i18n/dataTranslations';

interface ComponentCompareModalProps {
  currentComponent: ElectronicComponent;
  onClose: () => void;
  onSelectComponent?: (componentId: string) => void;
  onTestInMultimeter?: (componentId: string) => void;
}

export const ComponentCompareModal: React.FC<ComponentCompareModalProps> = ({
  currentComponent,
  onClose,
  onSelectComponent,
  onTestInMultimeter,
}) => {
  const { lang, t, pick } = useLanguage();

  const defaultTargetId = useMemo(() => {
    const suggested = COMPONENT_ALTERNATIVES[currentComponent.id]?.quickCompareIds?.find(
      (id) => id !== currentComponent.id && ELECTRONIC_COMPONENTS.some((c) => c.id === id)
    );
    if (suggested) return suggested;
    const idx = ELECTRONIC_COMPONENTS.findIndex((c) => c.id === currentComponent.id);
    const nextComp = ELECTRONIC_COMPONENTS[(idx + 1) % ELECTRONIC_COMPONENTS.length];
    return nextComp.id;
  }, [currentComponent.id]);

  const [leftId, setLeftId] = useState<string>(currentComponent.id);
  const [rightId, setRightId] = useState<string>(defaultTargetId);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [onlyDifferences, setOnlyDifferences] = useState<boolean>(false);

  useEffect(() => {
    setLeftId(currentComponent.id);
    setRightId(defaultTargetId);
    setSearchQuery('');
  }, [currentComponent.id, defaultTargetId]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKey, true);
    return () => window.removeEventListener('keydown', handleKey, true);
  }, [onClose]);

  const leftComp = useMemo(
    () => ELECTRONIC_COMPONENTS.find((c) => c.id === leftId) || currentComponent,
    [leftId, currentComponent]
  );
  const rightComp = useMemo(
    () => ELECTRONIC_COMPONENTS.find((c) => c.id === rightId) || ELECTRONIC_COMPONENTS[0],
    [rightId]
  );

  const leftLoc = useMemo(() => getLocalizedComponent(leftComp, lang), [leftComp, lang]);
  const rightLoc = useMemo(() => getLocalizedComponent(rightComp, lang), [rightComp, lang]);

  const filteredComponents = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return ELECTRONIC_COMPONENTS.filter((comp) => {
      if (comp.id === leftComp.id) return false;
      if (!q) return true;
      const loc = getLocalizedComponent(comp, lang);
      return (
        loc.name.toLowerCase().includes(q) ||
        comp.nameEn.toLowerCase().includes(q) ||
        comp.nameAr.toLowerCase().includes(q) ||
        comp.symbolLetter.toLowerCase().includes(q) ||
        loc.categoryLabel.toLowerCase().includes(q)
      );
    });
  }, [searchQuery, leftComp.id, lang]);

  // Keep rightId valid if search narrowed list to 1+ items and user wants quick selection
  const quickSuggestions = useMemo(() => {
    const ids = COMPONENT_ALTERNATIVES[leftComp.id]?.quickCompareIds || [];
    return ids
      .filter((id) => id !== leftComp.id)
      .map((id) => ELECTRONIC_COMPONENTS.find((c) => c.id === id))
      .filter((c): c is ElectronicComponent => Boolean(c));
  }, [leftComp.id]);

  const categoriesOrder: ElectronicComponent['category'][] = [
    'passive',
    'semiconductor',
    'power',
    'sensor',
  ];

  const handleSwap = () => {
    setLeftId(rightComp.id);
    setRightId(leftComp.id);
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    const q = value.trim().toLowerCase();
    if (!q) return;
    const matches = ELECTRONIC_COMPONENTS.filter((comp) => {
      if (comp.id === leftComp.id) return false;
      const loc = getLocalizedComponent(comp, lang);
      return (
        loc.name.toLowerCase().includes(q) ||
        comp.nameEn.toLowerCase().includes(q) ||
        comp.nameAr.toLowerCase().includes(q) ||
        comp.symbolLetter.toLowerCase().includes(q) ||
        loc.categoryLabel.toLowerCase().includes(q)
      );
    });
    if (matches.length > 0 && !matches.some((m) => m.id === rightId)) {
      setRightId(matches[0].id);
    }
  };

  interface CompareRow {
    id: string;
    label: string;
    leftVal: React.ReactNode;
    rightVal: React.ReactNode;
    isDifferent: boolean;
    mono?: boolean;
  }

  const leftSimReading =
    leftComp.measurement.simValues.goodForward[leftComp.measurement.recommendedMode];
  const rightSimReading =
    rightComp.measurement.simValues.goodForward[rightComp.measurement.recommendedMode];

  const rows: CompareRow[] = [
    {
      id: 'category',
      label: pick('التصنيف', 'Catégorie', 'Category'),
      leftVal: leftLoc.categoryLabel,
      rightVal: rightLoc.categoryLabel,
      isDifferent: leftComp.category !== rightComp.category,
    },
    {
      id: 'symbol',
      label: pick('الرمز في المخططات', 'Symbole schématique', 'Schematic Letter'),
      leftVal: leftComp.symbolLetter,
      rightVal: rightComp.symbolLetter,
      isDifferent: leftComp.symbolLetter !== rightComp.symbolLetter,
      mono: true,
    },
    {
      id: 'unit',
      label: pick('وحدة القياس', 'Unité de mesure', 'Measurement Unit'),
      leftVal: `${leftLoc.unit} (${leftComp.unitSymbol})`,
      rightVal: `${rightLoc.unit} (${rightComp.unitSymbol})`,
      isDifferent: leftComp.unitSymbol !== rightComp.unitSymbol,
    },
    {
      id: 'polarity',
      label: pick('القطبية (+/-)', 'Polarité (+/-)', 'Polarity'),
      leftVal: leftComp.measurement.polaritySensitive
        ? t.detail.polaritySensitive
        : t.detail.nonPolarized,
      rightVal: rightComp.measurement.polaritySensitive
        ? t.detail.polaritySensitive
        : t.detail.nonPolarized,
      isDifferent:
        leftComp.measurement.polaritySensitive !== rightComp.measurement.polaritySensitive,
    },
    {
      id: 'meter_mode',
      label: pick('وضع الملتيميتر الموصى به', 'Mode multimètre recommandé', 'Recommended Meter Mode'),
      leftVal: leftLoc.recommendedModeLabel,
      rightVal: rightLoc.recommendedModeLabel,
      isDifferent:
        leftComp.measurement.recommendedMode !== rightComp.measurement.recommendedMode,
    },
    {
      id: 'good_reading',
      label: pick('قراءة العنصر السليم', 'Lecture composant sain', 'Healthy Reading'),
      leftVal: (
        <div className="space-y-1">
          <div
            className="inline-block rounded-lg bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 font-mono-num text-xs font-bold text-[#059669] dark:text-emerald-300"
            dir="ltr"
          >
            {leftSimReading}
          </div>
          <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-300">
            {leftLoc.goodReading}
          </p>
        </div>
      ),
      rightVal: (
        <div className="space-y-1">
          <div
            className="inline-block rounded-lg bg-amber-50 dark:bg-amber-950/50 px-2 py-0.5 font-mono-num text-xs font-bold text-[#D97706] dark:text-amber-300"
            dir="ltr"
          >
            {rightSimReading}
          </div>
          <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-300">
            {rightLoc.goodReading}
          </p>
        </div>
      ),
      isDifferent: true,
    },
    {
      id: 'faults',
      label: pick('علامات التلف بالقياس (قطع / قصر)', 'Pannes typiques (Ouvert / Court-circuit)', 'Fault Signatures (Open / Short)'),
      leftVal: (
        <div className="space-y-1 text-xs leading-relaxed">
          <p>
            <span className="font-bold text-rose-600 dark:text-rose-400">
              {pick('قطع: ', 'Ouvert : ', 'Open: ')}
            </span>
            {leftLoc.openFaultReading}
          </p>
          <p>
            <span className="font-bold text-rose-600 dark:text-rose-400">
              {pick('قصر: ', 'Court-circuit : ', 'Short: ')}
            </span>
            {leftLoc.shortFaultReading}
          </p>
        </div>
      ),
      rightVal: (
        <div className="space-y-1 text-xs leading-relaxed">
          <p>
            <span className="font-bold text-rose-600 dark:text-rose-400">
              {pick('قطع: ', 'Ouvert : ', 'Open: ')}
            </span>
            {rightLoc.openFaultReading}
          </p>
          <p>
            <span className="font-bold text-rose-600 dark:text-rose-400">
              {pick('قصر: ', 'Court-circuit : ', 'Short: ')}
            </span>
            {rightLoc.shortFaultReading}
          </p>
        </div>
      ),
      isDifferent: true,
    },
    {
      id: 'formula',
      label: pick('القانون الأساسي', 'Loi / Formule', 'Key Formula'),
      leftVal: (
        <span className="font-mono-num text-xs font-semibold text-slate-800 dark:text-slate-200" dir="ltr">
          {leftComp.formula?.equation || '—'}
        </span>
      ),
      rightVal: (
        <span className="font-mono-num text-xs font-semibold text-slate-800 dark:text-slate-200" dir="ltr">
          {rightComp.formula?.equation || '—'}
        </span>
      ),
      isDifferent: leftComp.formula?.equation !== rightComp.formula?.equation,
    },
    {
      id: 'role',
      label: pick('الوظيفة الأساسية', 'Rôle principal', 'Primary Function'),
      leftVal: <p className="text-xs leading-relaxed">{leftLoc.shortRole}</p>,
      rightVal: <p className="text-xs leading-relaxed">{rightLoc.shortRole}</p>,
      isDifferent: true,
    },
    {
      id: 'how_it_works',
      label: pick('مبدأ العمل الداخلي', 'Principe de fonctionnement', 'How It Works'),
      leftVal: <p className="text-xs leading-relaxed">{leftLoc.howItWorks}</p>,
      rightVal: <p className="text-xs leading-relaxed">{rightLoc.howItWorks}</p>,
      isDifferent: true,
    },
    {
      id: 'pinout',
      label: pick('الأطراف والتوصيل', 'Brochage (Pinout)', 'Pinout Notes'),
      leftVal: (
        <ul className="space-y-1 text-xs leading-relaxed list-disc ps-4">
          {leftLoc.pinoutNotes.slice(0, 2).map((n, i) => (
            <li key={i}>{n}</li>
          ))}
        </ul>
      ),
      rightVal: (
        <ul className="space-y-1 text-xs leading-relaxed list-disc ps-4">
          {rightLoc.pinoutNotes.slice(0, 2).map((n, i) => (
            <li key={i}>{n}</li>
          ))}
        </ul>
      ),
      isDifferent: true,
    },
    {
      id: 'uses',
      label: pick('أبرز التطبيقات العملية', 'Applications courantes', 'Real-World Uses'),
      leftVal: (
        <ul className="space-y-1 text-xs leading-relaxed list-disc ps-4">
          {leftLoc.realWorldUses.slice(0, 3).map((u, i) => (
            <li key={i}>{u}</li>
          ))}
        </ul>
      ),
      rightVal: (
        <ul className="space-y-1 text-xs leading-relaxed list-disc ps-4">
          {rightLoc.realWorldUses.slice(0, 3).map((u, i) => (
            <li key={i}>{u}</li>
          ))}
        </ul>
      ),
      isDifferent: true,
    },
  ];

  const visibleRows = onlyDifferences ? rows.filter((r) => r.isDifferent) : rows;

  return (
    <div
      className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center bg-slate-950/70 p-0 sm:p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="compare-modal-title"
      onClick={onClose}
    >
      <div
        className="flex max-h-[94vh] w-full max-w-5xl flex-col overflow-hidden rounded-t-3xl sm:rounded-2xl border border-[#E2E8F0] dark:border-[#334155] bg-[#F8FAFC] dark:bg-[#0F172A] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Modal Header */}
        <div className="flex items-center justify-between gap-3 border-b border-[#E2E8F0] dark:border-[#334155] bg-white dark:bg-[#1E293B] px-4 py-3.5 sm:px-6 shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-[#059669] dark:text-emerald-400">
              <GitCompareArrows className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <h2
                id="compare-modal-title"
                className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white truncate"
              >
                {pick(
                  'مقارنة العناصر جنباً إلى جنب',
                  'Comparaison côte à côte',
                  'Side-by-Side Component Comparison'
                )}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                {pick(
                  'اختر أي عنصر من قاعدة البيانات لعرض الفروقات وخصائص القياس في جدول متقابل.',
                  'Choisissez un second composant dans la base pour comparer leurs spécifications et mesures.',
                  'Pick any component from the database to inspect specs and multimeter tests side by side.'
                )}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label={pick('إغلاق نافذة المقارنة', 'Fermer la comparaison', 'Close comparison')}
            className="flex min-h-[42px] min-w-[42px] shrink-0 items-center justify-center rounded-xl border border-[#E2E8F0] dark:border-[#334155] text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable Comparison Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          {/* Picker & Controls Bar */}
          <div className="rounded-2xl border border-[#E2E8F0] dark:border-[#334155] bg-white dark:bg-[#1E293B] p-4 shadow-sm space-y-3">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-end">
              {/* Base Component Pill (Read-only or swappable) */}
              <div className="lg:col-span-4">
                <label className="block text-[11px] font-bold text-[#059669] dark:text-emerald-400 mb-1">
                  {pick('العنصر الأول (الأساسي)', 'Composant 1 (Base)', 'Component 1 (Base)')}
                </label>
                <div className="flex min-h-[44px] items-center justify-between gap-2 rounded-xl border border-emerald-300 dark:border-emerald-700/70 bg-emerald-50/60 dark:bg-emerald-950/30 px-3 py-2 text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                  <span className="truncate">{leftLoc.name}</span>
                  <span className="font-mono-num text-[11px] text-[#059669] dark:text-emerald-400 shrink-0">
                    {leftComp.symbolLetter}
                  </span>
                </div>
              </div>

              {/* Swap Button */}
              <div className="lg:col-span-1 flex justify-center">
                <button
                  type="button"
                  onClick={handleSwap}
                  title={pick('تبديل موضع العنصرين', 'Inverser les deux composants', 'Swap components')}
                  className="inline-flex min-h-[44px] w-full lg:w-11 items-center justify-center gap-1.5 rounded-xl border border-[#E2E8F0] dark:border-[#334155] bg-[#F8FAFC] dark:bg-[#0F172A] text-slate-700 dark:text-slate-200 hover:border-[#D97706] hover:text-[#D97706] dark:hover:text-amber-400 transition-colors"
                >
                  <ArrowLeftRight className="h-4 w-4" />
                  <span className="lg:hidden text-xs font-bold">
                    {pick('تبديل العنصرين', 'Inverser', 'Swap')}
                  </span>
                </button>
              </div>

              {/* Search + Select Second Component */}
              <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-12 gap-2.5">
                <div className="sm:col-span-5">
                  <label
                    htmlFor="compare-search-input"
                    className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1"
                  >
                    {pick('تصفية سريعة بالاسم', 'Filtrer par nom', 'Quick search')}
                  </label>
                  <div className="relative">
                    <Search className="pointer-events-none absolute top-1/2 -translate-y-1/2 start-3 h-4 w-4 text-slate-400" />
                    <input
                      id="compare-search-input"
                      type="text"
                      value={searchQuery}
                      onChange={(e) => handleSearchChange(e.target.value)}
                      placeholder={pick('ابحث (موسفيت، زينر...)', 'Chercher...', 'Filter parts...')}
                      className="min-h-[44px] w-full rounded-xl border border-[#E2E8F0] dark:border-[#334155] bg-[#F8FAFC] dark:bg-[#0F172A] ps-9 pe-3 text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-[#059669] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="sm:col-span-7">
                  <label
                    htmlFor="compare-target-select"
                    className="block text-[11px] font-bold text-[#D97706] dark:text-amber-400 mb-1"
                  >
                    {pick('العنصر الثاني للمقارنة (من قاعدة البيانات)', 'Composant 2 à comparer', 'Component 2 to Compare')}
                  </label>
                  <select
                    id="compare-target-select"
                    value={rightComp.id}
                    onChange={(e) => setRightId(e.target.value)}
                    className="min-h-[44px] w-full rounded-xl border border-amber-300 dark:border-amber-700/70 bg-amber-50/40 dark:bg-[#0F172A] px-3 text-xs sm:text-sm font-bold text-slate-900 dark:text-white focus:border-[#059669] focus:outline-none"
                  >
                    {searchQuery.trim() ? (
                      filteredComponents.length > 0 ? (
                        filteredComponents.map((comp) => {
                          const loc = getLocalizedComponent(comp, lang);
                          return (
                            <option key={comp.id} value={comp.id}>
                              {loc.name} ({comp.symbolLetter})
                            </option>
                          );
                        })
                      ) : (
                        <option value={rightComp.id}>
                          {pick('لا توجد نتائج مطابقة', 'Aucun résultat', 'No matches')}
                        </option>
                      )
                    ) : (
                      categoriesOrder.map((cat) => {
                        const groupItems = ELECTRONIC_COMPONENTS.filter(
                          (c) => c.category === cat && c.id !== leftComp.id
                        );
                        if (groupItems.length === 0) return null;
                        return (
                          <optgroup key={cat} label={t.categories[cat]}>
                            {groupItems.map((comp) => {
                              const loc = getLocalizedComponent(comp, lang);
                              return (
                                <option key={comp.id} value={comp.id}>
                                  {loc.name} ({comp.symbolLetter})
                                </option>
                              );
                            })}
                          </optgroup>
                        );
                      })
                    )}
                  </select>
                </div>
              </div>
            </div>

            {/* Quick Suggested Pairs + Differences Toggle */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#E2E8F0] dark:border-[#334155]">
              <div className="flex flex-wrap items-center gap-1.5">
                {quickSuggestions.length > 0 && (
                  <>
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-500 dark:text-slate-400 me-1">
                      <Sparkles className="h-3.5 w-3.5 text-[#D97706]" />
                      {pick('مقارنات مقترحة:', 'Suggestions :', 'Suggested:')}
                    </span>
                    {quickSuggestions.map((sComp) => {
                      const sLoc = getLocalizedComponent(sComp, lang);
                      const active = rightComp.id === sComp.id;
                      return (
                        <button
                          key={sComp.id}
                          type="button"
                          onClick={() => setRightId(sComp.id)}
                          className={`min-h-[34px] rounded-lg border px-2.5 py-1 text-xs font-semibold transition-colors ${
                            active
                              ? 'border-[#059669] bg-[#059669] text-white'
                              : 'border-[#E2E8F0] dark:border-[#334155] bg-[#F8FAFC] dark:bg-[#0F172A] text-slate-700 dark:text-slate-200 hover:border-[#059669]'
                          }`}
                        >
                          {sLoc.name}
                        </button>
                      );
                    })}
                  </>
                )}
              </div>

              <button
                type="button"
                onClick={() => setOnlyDifferences((prev) => !prev)}
                aria-pressed={onlyDifferences}
                className={`inline-flex min-h-[34px] items-center gap-1.5 rounded-lg border px-3 py-1 text-xs font-bold transition-colors ${
                  onlyDifferences
                    ? 'border-[#D97706] bg-amber-50 text-[#D97706] dark:border-amber-500 dark:bg-amber-950/50 dark:text-amber-300'
                    : 'border-[#E2E8F0] dark:border-[#334155] bg-[#F8FAFC] dark:bg-[#0F172A] text-slate-600 dark:text-slate-300 hover:border-[#D97706]'
                }`}
              >
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>
                  {onlyDifferences
                    ? pick('إظهار جميع الخصائص', 'Tout afficher', 'Show all rows')
                    : pick('إظهار الاختلافات فقط', 'Différences uniquement', 'Differences only')}
                </span>
              </button>
            </div>
          </div>

          {/* Side-by-Side Visual Preview Cards */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {[
              { comp: leftComp, loc: leftLoc, accent: 'emerald' as const },
              { comp: rightComp, loc: rightLoc, accent: 'amber' as const },
            ].map(({ comp, loc, accent }) => (
              <div
                key={comp.id}
                className={`overflow-hidden rounded-2xl border bg-white dark:bg-[#1E293B] shadow-sm flex flex-col ${
                  accent === 'emerald'
                    ? 'border-emerald-300 dark:border-emerald-700/70'
                    : 'border-amber-300 dark:border-amber-700/70'
                }`}
              >
                <div
                  className={`px-3 py-2 text-[11px] font-extrabold flex items-center justify-between gap-2 ${
                    accent === 'emerald'
                      ? 'bg-emerald-50 dark:bg-emerald-950/50 text-[#059669] dark:text-emerald-300'
                      : 'bg-amber-50 dark:bg-amber-950/40 text-[#D97706] dark:text-amber-300'
                  }`}
                >
                  <span className="truncate">{loc.categoryLabel}</span>
                  <span className="font-mono-num shrink-0">{comp.symbolLetter}</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 p-3 items-center bg-[#F8FAFC] dark:bg-[#0F172A]/60 border-b border-[#E2E8F0] dark:border-[#334155]">
                  <div className="aspect-[4/3] overflow-hidden rounded-xl border border-[#E2E8F0] dark:border-[#334155] bg-white dark:bg-[#1E293B]">
                    <ComponentImage
                      src={comp.imageUrl}
                      alt={loc.name}
                      componentId={comp.id}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex h-full min-h-[82px] items-center justify-center rounded-xl border border-[#E2E8F0] dark:border-[#334155] bg-white dark:bg-[#1E293B] p-2 text-slate-900 dark:text-slate-100">
                    <SchematicSymbol componentId={comp.id} className="h-16 sm:h-20 w-full" />
                  </div>
                </div>

                <div className="p-3 sm:p-4 flex-1 flex flex-col justify-between gap-3">
                  <div>
                    <h3 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white leading-snug">
                      {loc.name}
                    </h3>
                    {lang !== 'en' && (
                      <p className="mt-0.5 text-[11px] font-mono text-slate-500 dark:text-slate-400 truncate" dir="ltr">
                        {comp.nameEn}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {onTestInMultimeter && (
                      <button
                        type="button"
                        onClick={() => {
                          onClose();
                          onTestInMultimeter(comp.id);
                        }}
                        className="inline-flex min-h-[36px] flex-1 items-center justify-center gap-1 rounded-lg bg-[#059669] px-2.5 py-1.5 text-[11px] font-bold text-white hover:bg-[#047857] transition-colors"
                      >
                        <Gauge className="h-3.5 w-3.5 shrink-0" />
                        <span>{pick('فحص بالملتيميتر', 'Tester', 'Meter Test')}</span>
                      </button>
                    )}
                    {onSelectComponent && comp.id !== currentComponent.id && (
                      <button
                        type="button"
                        onClick={() => {
                          onClose();
                          onSelectComponent(comp.id);
                        }}
                        className="inline-flex min-h-[36px] items-center justify-center gap-1 rounded-lg border border-[#E2E8F0] dark:border-[#334155] px-2.5 py-1.5 text-[11px] font-bold text-slate-700 dark:text-slate-200 hover:border-[#059669] hover:text-[#059669] transition-colors"
                      >
                        <span>{pick('فتح البطاقة', 'Ouvrir', 'Open')}</span>
                        <ExternalLink className="h-3 w-3 shrink-0" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Opposing Properties Comparison Table */}
          <div className="overflow-x-auto rounded-2xl border border-[#E2E8F0] dark:border-[#334155] bg-white dark:bg-[#1E293B] shadow-sm">
            <table className="w-full min-w-[540px] border-collapse text-start">
              <thead>
                <tr className="border-b border-[#E2E8F0] dark:border-[#334155] bg-slate-50 dark:bg-[#0F172A]/80 text-xs font-extrabold">
                  <th className="w-[24%] px-4 py-3 text-start text-slate-500 dark:text-slate-400">
                    {pick('الخاصية / المعيار', 'Caractéristique', 'Property / Criterion')}
                  </th>
                  <th className="w-[38%] px-4 py-3 text-start text-[#059669] dark:text-emerald-400 border-s border-[#E2E8F0] dark:border-[#334155]">
                    {leftLoc.name}
                  </th>
                  <th className="w-[38%] px-4 py-3 text-start text-[#D97706] dark:text-amber-400 border-s border-[#E2E8F0] dark:border-[#334155]">
                    {rightLoc.name}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0] dark:divide-[#334155] text-xs sm:text-sm">
                {visibleRows.map((row) => (
                  <tr
                    key={row.id}
                    className="hover:bg-slate-50/70 dark:hover:bg-[#0F172A]/40 transition-colors"
                  >
                    <th
                      scope="row"
                      className="px-4 py-3.5 align-top text-start font-bold text-slate-700 dark:text-slate-200 bg-slate-50/40 dark:bg-[#0F172A]/25"
                    >
                      <div className="flex flex-col gap-1">
                        <span>{row.label}</span>
                        {!row.isDifferent && (
                          <span className="inline-flex w-fit items-center rounded-md bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.5 text-[10px] font-bold text-[#059669] dark:text-emerald-300">
                            {pick('متطابق', 'Identique', 'Same')}
                          </span>
                        )}
                      </div>
                    </th>
                    <td
                      className={`px-4 py-3.5 align-top border-s border-[#E2E8F0] dark:border-[#334155] text-slate-800 dark:text-slate-100 ${
                        row.mono ? 'font-mono-num font-bold' : ''
                      }`}
                    >
                      {row.leftVal}
                    </td>
                    <td
                      className={`px-4 py-3.5 align-top border-s border-[#E2E8F0] dark:border-[#334155] text-slate-800 dark:text-slate-100 ${
                        row.mono ? 'font-mono-num font-bold' : ''
                      }`}
                    >
                      {row.rightVal}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-end gap-2 border-t border-[#E2E8F0] dark:border-[#334155] bg-white dark:bg-[#1E293B] px-4 py-3 sm:px-6 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="min-h-[44px] rounded-xl bg-[#059669] px-5 py-2 text-xs sm:text-sm font-bold text-white hover:bg-[#047857] transition-colors"
          >
            {pick('إغلاق المقارنة', 'Fermer', 'Close Comparison')}
          </button>
        </div>
      </div>
    </div>
  );
};
