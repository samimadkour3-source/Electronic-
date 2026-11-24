import React, { useEffect, useMemo, useRef, useState } from 'react';
import { BookA, Lightbulb, Search } from 'lucide-react';
import { GLOSSARY_TERMS, GlossaryCategory } from '../data/glossaryData';
import { useLanguage } from '../i18n/LanguageContext';

interface GlossaryViewProps {
  focusedTermId?: string | null;
  onClearFocus?: () => void;
}

export const GlossaryView: React.FC<GlossaryViewProps> = ({
  focusedTermId,
  onClearFocus,
}) => {
  const { lang, pick } = useLanguage();
  const [categoryFilter, setCategoryFilter] = useState<'all' | GlossaryCategory>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [highlightedId, setHighlightedId] = useState<string | null>(null);
  const cardRefs = useRef<Record<string, HTMLElement | null>>({});

  useEffect(() => {
    if (!focusedTermId) return;
    setCategoryFilter('all');
    setSearchQuery('');
    setHighlightedId(focusedTermId);

    const timer = window.setTimeout(() => {
      const target = cardRefs.current[focusedTermId];
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      onClearFocus?.();
    }, 80);

    const clearHighlight = window.setTimeout(() => {
      setHighlightedId(null);
    }, 4500);

    return () => {
      window.clearTimeout(timer);
      window.clearTimeout(clearHighlight);
    };
  }, [focusedTermId, onClearFocus]);

  const categoryLabels: Record<'all' | GlossaryCategory, string> = useMemo(
    () => ({
      all: pick('الكل', 'Tous', 'All'),
      basics: pick('أساسيات الكهرباء', 'Bases électriques', 'Electrical Basics'),
      circuits: pick('الدوائر وأشباه الموصلات', 'Circuits & Semi.', 'Circuits & Devices'),
      measurement: pick('القياس والفحص', 'Mesures & Tests', 'Testing & Faults'),
    }),
    [pick]
  );

  const filteredTerms = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return GLOSSARY_TERMS.filter((item) => {
      if (categoryFilter !== 'all' && item.category !== categoryFilter) return false;
      if (!q) return true;
      return (
        item.termAr.toLowerCase().includes(q) ||
        item.termFr.toLowerCase().includes(q) ||
        item.termEn.toLowerCase().includes(q) ||
        item.shortDefAr.toLowerCase().includes(q) ||
        item.shortDefFr.toLowerCase().includes(q) ||
        item.shortDefEn.toLowerCase().includes(q) ||
        item.simpleExplainAr.toLowerCase().includes(q) ||
        item.simpleExplainFr.toLowerCase().includes(q) ||
        item.simpleExplainEn.toLowerCase().includes(q)
      );
    });
  }, [categoryFilter, searchQuery]);

  const counts = useMemo(
    () => ({
      all: GLOSSARY_TERMS.length,
      basics: GLOSSARY_TERMS.filter((t) => t.category === 'basics').length,
      circuits: GLOSSARY_TERMS.filter((t) => t.category === 'circuits').length,
      measurement: GLOSSARY_TERMS.filter((t) => t.category === 'measurement').length,
    }),
    []
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <section className="pb-5 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-2xl">
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {pick(
              'قاموس المصطلحات الإلكترونية للمبتدئين',
              'Lexique des termes électroniques',
              'Beginner’s Electronics Technical Glossary'
            )}
          </h2>
          <p className="mt-1.5 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            {pick(
              'شرح مبسط وأمثلة عملية لأهم المصطلحات الهندسية والقياسات التي تقابلك في شرح العناصر والمخططات.',
              'Définitions simples et exemples concrets des principaux termes utilisés dans les fiches de composants.',
              'Plain-language definitions and practical analogies for core technical terms linked inside component guides.'
            )}
          </p>
        </div>
      </section>

      {/* Search & Category Filter */}
      <section className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative w-full lg:max-w-sm">
          <Search className="pointer-events-none absolute start-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={pick(
              'ابحث عن مصطلح (مثلاً: الفولتية، الشورت، PWM)...',
              'Chercher un terme (ex : tension, court-circuit, PWM)...',
              'Search a term (e.g. voltage, short, PWM)...'
            )}
            aria-label={pick('البحث في القاموس', 'Rechercher dans le lexique', 'Search glossary')}
            className="w-full min-h-[44px] rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 ps-10 pe-4 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-sky-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-1 overflow-x-auto rounded-xl bg-slate-200/70 dark:bg-slate-900 p-1 border border-slate-200/60 dark:border-slate-800">
          {(['all', 'basics', 'circuits', 'measurement'] as const).map((cat) => {
            const active = categoryFilter === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setCategoryFilter(cat)}
                className={`min-h-[38px] rounded-lg px-3 py-1.5 text-xs font-semibold whitespace-nowrap shrink-0 transition-colors ${
                  active
                    ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {categoryLabels[cat]} <span className="font-mono-num opacity-75">({counts[cat]})</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Terms Grid */}
      {filteredTerms.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-10 text-center space-y-3">
          <BookA className="mx-auto h-8 w-8 text-slate-400" />
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            {pick('لا توجد مصطلحات مطابقة لبحثك.', 'Aucun terme ne correspond à votre recherche.', 'No glossary terms match your search.')}
          </p>
          <button
            type="button"
            onClick={() => {
              setCategoryFilter('all');
              setSearchQuery('');
            }}
            className="min-h-[44px] rounded-xl bg-sky-600 px-5 py-2 text-xs font-bold text-white hover:bg-sky-700"
          >
            {pick('عرض جميع المصطلحات', 'Afficher tout', 'Show all terms')}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {filteredTerms.map((item) => {
            const title =
              lang === 'ar' ? item.termAr : lang === 'fr' ? item.termFr : item.termEn;
            const shortDef =
              lang === 'ar' ? item.shortDefAr : lang === 'fr' ? item.shortDefFr : item.shortDefEn;
            const explain =
              lang === 'ar'
                ? item.simpleExplainAr
                : lang === 'fr'
                ? item.simpleExplainFr
                : item.simpleExplainEn;
            const example =
              lang === 'ar' ? item.exampleAr : lang === 'fr' ? item.exampleFr : item.exampleEn;
            const isHighlighted = highlightedId === item.id;

            return (
              <article
                key={item.id}
                ref={(el) => {
                  cardRefs.current[item.id] = el;
                }}
                className={`rounded-2xl border p-5 transition-all space-y-3 ${
                  isHighlighted
                    ? 'border-sky-500 bg-sky-50/60 dark:border-sky-400 dark:bg-sky-950/40 shadow-md ring-2 ring-sky-500/20'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-sky-300 dark:hover:border-sky-800'
                }`}
              >
                {/* Unboxed metadata header */}
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
                  <span className="text-sky-700 dark:text-sky-400 font-semibold">
                    {categoryLabels[item.category]}
                  </span>
                  {item.symbolOrUnit && (
                    <span className="font-mono-num text-slate-700 dark:text-slate-300 font-bold" dir="ltr">
                      {item.symbolOrUnit}
                    </span>
                  )}
                </div>

                <div>
                  <h3 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white leading-snug">
                    {title}
                  </h3>
                  {lang !== 'en' && (
                    <div className="mt-0.5 text-xs font-mono text-slate-400" dir="ltr">
                      {item.termEn}
                    </div>
                  )}
                </div>

                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 leading-relaxed">
                  {shortDef}
                </p>

                <p className="text-xs sm:text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                  {explain}
                </p>

                <div className="pt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-start gap-2 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                  <Lightbulb className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-800 dark:text-slate-100">
                      {pick('مثال عملي: ', 'Exemple : ', 'Example: ')}
                    </span>
                    <span>{example}</span>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
};
