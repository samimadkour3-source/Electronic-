import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  BookA,
  Bookmark,
  BookOpen,
  Check,
  ChevronDown,
  Cpu,
  FolderKanban,
  Gauge,
  Globe,
  GraduationCap,
  Moon,
  NotebookPen,
  Search,
  Settings,
  ShieldAlert,
  Sun,
  Zap,
} from 'lucide-react';
import { CATEGORY_LABELS, ELECTRONIC_COMPONENTS } from './data/componentsData';
import { ElectronicComponent } from './types/electronics';
import { ComponentImage } from './components/ComponentImage';
import { ComponentDetailModal } from './components/ComponentDetailModal';
import { CircuitSimulator } from './components/CircuitSimulator';
import { ProjectsView } from './components/ProjectsView';
import { MultimeterLab } from './components/MultimeterLab';
import { CalculatorsView } from './components/CalculatorsView';
import { QuizView } from './components/QuizView';
import { NotesView } from './components/NotesView';
import { GlossaryView } from './components/GlossaryView';
import { PWAInstallButton } from './components/PWAInstallButton';
import { OfflineIndicator } from './components/OfflineIndicator';
import { FONT_SCALE_STEPS, FontScale, SettingsModal } from './components/SettingsModal';
import { LanguageProvider, useLanguage } from './i18n/LanguageContext';
import { LANGUAGE_OPTIONS } from './i18n/uiTranslations';
import { getLocalizedComponent } from './i18n/dataTranslations';

type AppTab = 'components' | 'circuit' | 'projects' | 'lab' | 'quiz' | 'notes' | 'glossary';
type LabSubTab = 'multimeter' | 'calculators';

function AppContent() {
  const { lang, setLang, isRtl, t } = useLanguage();

  const [activeTab, setActiveTab] = useState<AppTab>('components');
  const [labSubTab, setLabSubTab] = useState<LabSubTab>('multimeter');
  const [simTargetId, setSimTargetId] = useState<string>('resistor');

  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedComponent, setSelectedComponent] = useState<ElectronicComponent | null>(null);
  const [focusedGlossaryTermId, setFocusedGlossaryTermId] = useState<string | null>(null);

  const [langMenuOpen, setLangMenuOpen] = useState<boolean>(false);
  const langMenuRef = useRef<HTMLDivElement | null>(null);

  const [bookmarks, setBookmarks] = useState<string[]>(() => {
    try {
      const raw = localStorage.getItem('elec_bookmarks_v1');
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  const [isDark, setIsDark] = useState<boolean>(() => {
    try {
      return localStorage.getItem('elec_theme_v1') === 'dark';
    } catch {
      return false;
    }
  });

  const [fontScale, setFontScale] = useState<FontScale>(() => {
    try {
      const saved = Number(localStorage.getItem('elec_font_scale_v1'));
      if (FONT_SCALE_STEPS.includes(saved as FontScale)) {
        return saved as FontScale;
      }
      return 100;
    } catch {
      return 100;
    }
  });

  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);

  const navItems: { id: AppTab; label: string; mobileLabel: string; icon: React.FC<{ className?: string }> }[] =
    useMemo(
      () => [
        { id: 'components', label: t.nav.components, mobileLabel: t.nav.componentsMobile, icon: Cpu },
        { id: 'circuit', label: t.nav.circuit, mobileLabel: t.nav.circuitMobile, icon: Zap },
        { id: 'projects', label: t.nav.projects, mobileLabel: t.nav.projectsMobile, icon: FolderKanban },
        { id: 'lab', label: t.nav.lab, mobileLabel: t.nav.labMobile, icon: Gauge },
        { id: 'quiz', label: t.nav.quiz, mobileLabel: t.nav.quizMobile, icon: GraduationCap },
        { id: 'glossary', label: t.nav.glossary, mobileLabel: t.nav.glossaryMobile, icon: BookA },
        { id: 'notes', label: t.nav.notes, mobileLabel: t.nav.notesMobile, icon: NotebookPen },
      ],
      [t]
    );

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    try {
      localStorage.setItem('elec_theme_v1', isDark ? 'dark' : 'light');
    } catch {
      // Ignore storage errors
    }
  }, [isDark]);

  useEffect(() => {
    document.documentElement.style.fontSize = `${fontScale}%`;
    try {
      localStorage.setItem('elec_font_scale_v1', String(fontScale));
    } catch {
      // Ignore storage errors
    }
  }, [fontScale]);

  useEffect(() => {
    if (!langMenuOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (langMenuRef.current && !langMenuRef.current.contains(e.target as Node)) {
        setLangMenuOpen(false);
      }
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLangMenuOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('keydown', handleKey);
    };
  }, [langMenuOpen]);

  const toggleBookmark = (id: string) => {
    setBookmarks((prev) => {
      const next = prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id];
      try {
        localStorage.setItem('elec_bookmarks_v1', JSON.stringify(next));
      } catch {
        // Ignore storage errors
      }
      return next;
    });
  };

  const filteredComponents = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return ELECTRONIC_COMPONENTS.filter((comp) => {
      const matchesCat =
        categoryFilter === 'all'
          ? true
          : categoryFilter === 'saved'
          ? bookmarks.includes(comp.id)
          : comp.category === categoryFilter;
      if (!matchesCat) return false;
      if (!q) return true;
      const loc = getLocalizedComponent(comp, lang);
      return (
        loc.name.toLowerCase().includes(q) ||
        loc.shortRole.toLowerCase().includes(q) ||
        comp.nameAr.toLowerCase().includes(q) ||
        comp.nameEn.toLowerCase().includes(q) ||
        comp.symbolLetter.toLowerCase().includes(q)
      );
    });
  }, [bookmarks, categoryFilter, searchQuery, lang]);

  const handleOpenMultimeterFor = (componentId: string) => {
    setSelectedComponent(null);
    setSimTargetId(componentId);
    setLabSubTab('multimeter');
    setActiveTab('lab');
  };

  const handleOpenComponentById = (componentId: string) => {
    const found = ELECTRONIC_COMPONENTS.find((c) => c.id === componentId);
    if (found) {
      setSelectedComponent(found);
    }
  };

  const handleStepComponent = (direction: -1 | 1) => {
    if (!selectedComponent) return;
    const idx = ELECTRONIC_COMPONENTS.findIndex((c) => c.id === selectedComponent.id);
    if (idx === -1) return;
    const nextIdx = (idx + direction + ELECTRONIC_COMPONENTS.length) % ELECTRONIC_COMPONENTS.length;
    setSelectedComponent(ELECTRONIC_COMPONENTS[nextIdx]);
  };

  const currentLangOption = LANGUAGE_OPTIONS.find((opt) => opt.code === lang) || LANGUAGE_OPTIONS[0];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      {/* Top Bar Contract: Zone 1 (Brand) — Zone 2 (5 Nav Links on Desktop) — Zone 3 (1 Primary Action) */}
      <header className="sticky top-0 z-30 border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md">
        <div className="mx-auto flex h-12 md:h-14 max-w-7xl items-center justify-between gap-6 px-4 sm:px-6">
          {/* Zone 1: Single text element wordmark */}
          <button
            type="button"
            onClick={() => setActiveTab('components')}
            className="font-display text-base sm:text-lg font-extrabold tracking-tight text-slate-900 dark:text-white whitespace-nowrap shrink-0"
          >
            {t.brand}
          </button>

          {/* Zone 2: Concise single-line nav links (desktop) */}
          <nav className="hidden md:flex items-center gap-3.5 lg:gap-5 text-xs lg:text-sm font-semibold" aria-label="Main navigation">
            {navItems.map((item) => {
              const active = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveTab(item.id)}
                  className={`relative py-1 transition-colors whitespace-nowrap shrink-0 ${
                    active
                      ? 'text-sky-600 dark:text-sky-400'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {item.label}
                  {active && (
                    <span className="absolute bottom-0 right-0 left-0 h-0.5 rounded-full bg-sky-600 dark:bg-sky-400" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: 1 Primary Action */}
          <div className="flex items-center shrink-0">
            <PWAInstallButton />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-4 sm:py-6 sm:px-6 pb-24 md:pb-12">
        {/* Persistent Workspace Bar: Creator/Offline metadata + Language Switcher, Theme & Settings Button */}
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-200/80 dark:border-slate-800/80">
          <div className="text-xs font-medium text-slate-500 dark:text-slate-400">
            <span>{t.creatorPrefix} </span>
            <strong className="font-semibold text-slate-800 dark:text-slate-200">{t.creatorName}</strong>
            <span className="mx-1.5" aria-hidden="true">·</span>
            <span>{t.offlineBadge}</span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Language Switcher Dropdown Button (AR / FR / EN) */}
            <div className="relative" ref={langMenuRef}>
              <button
                type="button"
                onClick={() => setLangMenuOpen((o) => !o)}
                aria-expanded={langMenuOpen}
                aria-haspopup="listbox"
                aria-label={t.topbar.languageLabel}
                className="inline-flex min-h-[44px] items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2 text-xs font-bold text-slate-800 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0"
              >
                <Globe className="h-4 w-4 text-sky-600 dark:text-sky-400 shrink-0" />
                <span>{currentLangOption.nativeLabel}</span>
                <ChevronDown className={`h-3.5 w-3.5 text-slate-400 transition-transform ${langMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {langMenuOpen && (
                <div
                  role="listbox"
                  aria-label={t.topbar.languageLabel}
                  className={`absolute top-full mt-1.5 z-40 min-w-[165px] rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-1.5 shadow-xl ${
                    isRtl ? 'left-0' : 'right-0'
                  }`}
                >
                  {LANGUAGE_OPTIONS.map((opt) => {
                    const isSelected = lang === opt.code;
                    return (
                      <button
                        key={opt.code}
                        type="button"
                        role="option"
                        aria-selected={isSelected}
                        onClick={() => {
                          setLang(opt.code);
                          setLangMenuOpen(false);
                        }}
                        className={`flex w-full min-h-[40px] items-center justify-between gap-3 rounded-lg px-3 py-2 text-xs font-semibold transition-colors ${
                          isSelected
                            ? 'bg-sky-50 dark:bg-sky-950/70 text-sky-700 dark:text-sky-300 font-bold'
                            : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <span className="font-mono-num text-[10px] font-bold text-slate-400">{opt.shortLabel}</span>
                          <span>{opt.nativeLabel}</span>
                        </span>
                        {isSelected && <Check className="h-3.5 w-3.5 text-sky-600 dark:text-sky-400 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => setIsDark((d) => !d)}
              aria-label={isDark ? t.topbar.themeLight : t.topbar.themeDark}
              className="inline-flex min-h-[44px] items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0"
            >
              {isDark ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4 text-slate-600" />}
              <span className="hidden sm:inline">{isDark ? t.topbar.themeLight : t.topbar.themeDark}</span>
            </button>

            <button
              type="button"
              onClick={() => setIsSettingsOpen(true)}
              aria-label={t.topbar.settings}
              className="inline-flex min-h-[44px] items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3.5 py-2 text-xs font-bold text-slate-800 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0"
            >
              <Settings className="h-4 w-4 text-sky-600 dark:text-sky-400" />
              <span className="hidden xs:inline sm:inline">{t.topbar.settings}</span>
              {fontScale !== 100 && (
                <span className="font-mono-num text-sky-600 dark:text-sky-400" dir="ltr">
                  {fontScale}%
                </span>
              )}
            </button>
          </div>
        </div>

        {activeTab === 'components' && (
          <div className="space-y-6">
            {/* Hero Intro */}
            <section className="relative overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-gradient-to-br from-white via-sky-50/50 to-slate-100/80 dark:from-slate-900 dark:via-sky-950/30 dark:to-slate-900 p-5 sm:p-7 shadow-sm">
              {/* Subtle PCB Grid Accent */}
              <svg
                aria-hidden="true"
                className="pointer-events-none absolute inset-y-0 end-0 h-full w-64 text-sky-500/10 dark:text-sky-400/10"
                viewBox="0 0 240 200"
                fill="none"
              >
                <path d="M20 40H110L135 65H220" stroke="currentColor" strokeWidth="2" />
                <path d="M40 95H95L120 120H210" stroke="currentColor" strokeWidth="2" />
                <path d="M60 155H140L165 130H230" stroke="currentColor" strokeWidth="2" />
                <circle cx="110" cy="40" r="4" fill="currentColor" />
                <circle cx="120" cy="120" r="4" fill="currentColor" />
                <circle cx="165" cy="130" r="4" fill="currentColor" />
                <circle cx="220" cy="65" r="5" stroke="currentColor" strokeWidth="2" />
                <circle cx="210" cy="120" r="5" stroke="currentColor" strokeWidth="2" />
              </svg>

              <div className="relative z-10 max-w-3xl">
                <div className="text-xs font-bold tracking-wide text-sky-700 dark:text-sky-400 mb-1.5">
                  {t.brand}
                </div>
                <h1
                  className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight"
                  style={{ textWrap: 'balance' }}
                >
                  {t.hero.title}
                </h1>
                <p className="mt-2 text-sm sm:text-base leading-relaxed text-slate-600 dark:text-slate-300">
                  {t.hero.subtitle}
                </p>
                <div className="mt-3 text-xs font-semibold text-slate-500 dark:text-slate-400">
                  {t.hero.statsLine}
                </div>

                {/* Creator Attribution & Anti-Copy Notice */}
                <div className="mt-4 flex items-start gap-2.5 rounded-xl border border-amber-200/80 dark:border-amber-900/60 bg-amber-50/70 dark:bg-amber-950/30 px-3.5 py-2.5 text-xs leading-relaxed text-slate-700 dark:text-slate-300">
                  <ShieldAlert className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white">
                      {t.creatorPrefix} {t.creatorName}
                    </span>
                    <span className="mx-1.5 text-slate-400" aria-hidden="true">·</span>
                    <span>{t.copyrightWarning}</span>
                  </div>
                </div>
              </div>
            </section>

            {/* Search & Interactive Category Filters */}
            <section className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div className="relative w-full lg:max-w-sm">
                <Search className="pointer-events-none absolute start-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t.hero.searchPlaceholder}
                  aria-label={t.hero.searchAria}
                  className="w-full min-h-[44px] rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 ps-10 pe-4 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-sky-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-1 overflow-x-auto rounded-xl bg-slate-200/70 dark:bg-slate-900 p-1 border border-slate-200/60 dark:border-slate-800">
                {(Object.keys(CATEGORY_LABELS) as Array<keyof typeof t.categories>).map((key) => {
                  const active = categoryFilter === key;
                  const count =
                    key === 'all'
                      ? ELECTRONIC_COMPONENTS.length
                      : ELECTRONIC_COMPONENTS.filter((c) => c.category === key).length;
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setCategoryFilter(key)}
                      className={`min-h-[38px] rounded-lg px-3 py-1.5 text-xs font-semibold whitespace-nowrap shrink-0 transition-colors ${
                        active
                          ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      {t.categories[key]} <span className="font-mono-num opacity-75">({count})</span>
                    </button>
                  );
                })}
                <button
                  type="button"
                  onClick={() => setCategoryFilter('saved')}
                  className={`inline-flex min-h-[38px] items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold whitespace-nowrap shrink-0 transition-colors ${
                    categoryFilter === 'saved'
                      ? 'bg-white dark:bg-slate-800 text-sky-600 dark:text-sky-400 shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Bookmark className="h-3.5 w-3.5" />
                  <span>{t.hero.saved} ({bookmarks.length})</span>
                </button>
              </div>
            </section>

            {/* Components Grid */}
            {filteredComponents.length === 0 ? (
              <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-10 text-center">
                <BookOpen className="mx-auto h-8 w-8 text-slate-400 mb-3" />
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  {t.hero.noResults}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setCategoryFilter('all');
                    setSearchQuery('');
                  }}
                  className="mt-4 min-h-[44px] rounded-xl bg-sky-600 px-5 py-2 text-xs font-semibold text-white hover:bg-sky-700"
                >
                  {t.hero.showAll}
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 xl:grid-cols-4">
                {filteredComponents.map((comp) => {
                  const isSaved = bookmarks.includes(comp.id);
                  const loc = getLocalizedComponent(comp, lang);
                  return (
                    <article
                      key={comp.id}
                      className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 transition-all hover:-translate-y-0.5 hover:shadow-md hover:border-sky-300 dark:hover:border-sky-700"
                    >
                      <button
                        type="button"
                        onClick={() => setSelectedComponent(comp)}
                        className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100 dark:bg-slate-800 text-start focus-visible:outline-2 focus-visible:outline-sky-600"
                      >
                        <ComponentImage
                          src={comp.imageUrl}
                          alt={`${loc.name} - ${comp.nameEn}`}
                          componentId={comp.id}
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                        />
                      </button>

                      <div className="flex flex-1 flex-col justify-between p-3 sm:p-4">
                        <div>
                          {/* Clean Unboxed Metadata (Zero-Pill Discipline) */}
                          <div className="flex items-center justify-between gap-1">
                            <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400 truncate">
                              <span>{loc.categoryLabel}</span>
                              <span className="mx-1" aria-hidden="true">·</span>
                              <span className="font-mono-num">{comp.symbolLetter}</span>
                            </div>

                            <button
                              type="button"
                              onClick={() => toggleBookmark(comp.id)}
                              aria-label={isSaved ? t.hero.unsaveAria : t.hero.saveAria}
                              className={`flex min-h-[44px] min-w-[44px] -me-2 items-center justify-center rounded-lg transition-colors ${
                                isSaved
                                  ? 'text-sky-600 dark:text-sky-400'
                                  : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                              }`}
                            >
                              <Bookmark className={`h-4 w-4 ${isSaved ? 'fill-current' : ''}`} />
                            </button>
                          </div>

                          <button
                            type="button"
                            onClick={() => setSelectedComponent(comp)}
                            className="mt-0.5 block w-full text-start"
                          >
                            <h2 className="text-sm sm:text-base font-bold leading-snug text-slate-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                              {loc.name}
                            </h2>
                            {lang !== 'en' && (
                              <div className="text-[11px] font-mono text-slate-400 truncate" dir="ltr">
                                {comp.nameEn}
                              </div>
                            )}
                          </button>

                          <p className="mt-2 text-xs sm:text-sm leading-relaxed text-slate-600 dark:text-slate-300 line-clamp-2">
                            {loc.shortRole}
                          </p>
                        </div>

                        <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                          <button
                            type="button"
                            onClick={() => setSelectedComponent(comp)}
                            className="min-h-[44px] text-[11px] sm:text-xs font-bold text-sky-600 dark:text-sky-400 hover:underline whitespace-nowrap"
                          >
                            {t.hero.readMore}
                          </button>
                          <span className="hidden sm:inline text-[11px] font-mono-num text-slate-500 dark:text-slate-400 truncate">
                            {loc.recommendedModeLabel}
                          </span>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {activeTab === 'circuit' && <CircuitSimulator />}

        {activeTab === 'projects' && (
          <ProjectsView
            onOpenComponentById={handleOpenComponentById}
            onOpenCircuitSimulator={() => setActiveTab('circuit')}
          />
        )}

        {activeTab === 'lab' && (
          <div className="space-y-6">
            {/* Clean Segmented Switcher between Multimeter Lab and Calculators */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
              <div className="inline-flex rounded-xl bg-slate-200/70 dark:bg-slate-900 p-1 border border-slate-200/60 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setLabSubTab('multimeter')}
                  className={`min-h-[40px] rounded-lg px-4 py-1.5 text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap ${
                    labSubTab === 'multimeter'
                      ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {t.labTabs.multimeter}
                </button>
                <button
                  type="button"
                  onClick={() => setLabSubTab('calculators')}
                  className={`min-h-[40px] rounded-lg px-4 py-1.5 text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap ${
                    labSubTab === 'calculators'
                      ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {t.labTabs.calculators}
                </button>
              </div>
            </div>

            {labSubTab === 'multimeter' ? (
              <MultimeterLab key={simTargetId} initialComponentId={simTargetId} />
            ) : (
              <CalculatorsView />
            )}
          </div>
        )}

        {activeTab === 'quiz' && <QuizView />}
        {activeTab === 'glossary' && (
          <GlossaryView
            focusedTermId={focusedGlossaryTermId}
            onClearFocus={() => setFocusedGlossaryTermId(null)}
          />
        )}
        {activeTab === 'notes' && <NotesView />}
      </main>

      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 pb-20 md:pb-6">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 space-y-2 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
            <div>
              <span>{t.footerAppTitle} · {t.creatorPrefix} </span>
              <strong className="font-semibold text-slate-800 dark:text-slate-200">{t.creatorName}</strong>
            </div>
            <div>{t.footerCopyright}</div>
          </div>
          <div className="flex items-center justify-center sm:justify-start gap-1.5 pt-2 border-t border-slate-200/70 dark:border-slate-800/70 text-[11px] text-amber-700 dark:text-amber-400 font-medium text-center sm:text-start">
            <ShieldAlert className="h-3.5 w-3.5 shrink-0" />
            <span>{t.copyrightWarning}</span>
          </div>
        </div>
      </footer>

      {/* Mobile Android Bottom Tab Bar (56px height, total sticky <= 104px < 15% cap) */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md pb-safe"
        aria-label="Mobile navigation"
      >
        <div className="grid grid-cols-7 items-center h-14">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveTab(item.id)}
                className={`flex min-h-[44px] flex-col items-center justify-center px-0.5 transition-colors ${
                  active
                    ? 'text-sky-600 dark:text-sky-400'
                    : 'text-slate-500 dark:text-slate-400'
                }`}
              >
                <Icon className="h-[18px] w-[18px]" />
                <span className="mt-0.5 text-[9.5px] font-semibold tracking-tight whitespace-nowrap">
                  {item.mobileLabel}
                </span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Component Detail Fullscreen Drawer */}
      {selectedComponent && (
        <ComponentDetailModal
          component={selectedComponent}
          isBookmarked={bookmarks.includes(selectedComponent.id)}
          onToggleBookmark={toggleBookmark}
          onClose={() => setSelectedComponent(null)}
          onPrev={() => handleStepComponent(-1)}
          onNext={() => handleStepComponent(1)}
          onTestInMultimeter={handleOpenMultimeterFor}
          onOpenGlossaryTerm={(termId) => {
            setSelectedComponent(null);
            setFocusedGlossaryTermId(termId);
            setActiveTab('glossary');
          }}
        />
      )}

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        fontScale={fontScale}
        onChangeFontScale={setFontScale}
        isDark={isDark}
        onToggleDark={() => setIsDark((d) => !d)}
      />

      <OfflineIndicator />
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}
