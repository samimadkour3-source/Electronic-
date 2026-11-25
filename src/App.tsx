import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  BookA,
  Bookmark,
  BookOpen,
  CircuitBoard,
  Cpu,
  FolderKanban,
  Gauge,
  GraduationCap,
  Moon,
  MoreHorizontal,
  NotebookPen,
  Search,
  Settings,
  ShieldAlert,
  Sun,
  X,
  Zap,
} from 'lucide-react';
import { CATEGORY_LABELS, ELECTRONIC_COMPONENTS } from './data/componentsData';
import { ElectronicComponent } from './types/electronics';
import { ComponentImage } from './components/ComponentImage';
import { ComponentDetailModal } from './components/ComponentDetailModal';
import { CircuitSimulator } from './components/CircuitSimulator';
import { BreadboardSimulator } from './components/BreadboardSimulator';
import { ProjectsView } from './components/ProjectsView';
import { MultimeterLab } from './components/MultimeterLab';
import { CalculatorsView } from './components/CalculatorsView';
import { ResistorColorReader } from './components/ResistorColorReader';
import { CapacitorCodeReader } from './components/CapacitorCodeReader';
import { PinoutGuideView } from './components/PinoutGuideView';
import { PcbExplorerView } from './components/PcbExplorerView';
import { QuizView } from './components/QuizView';
import { NotesView } from './components/NotesView';
import { GlossaryView } from './components/GlossaryView';
import { PWAInstallButton } from './components/PWAInstallButton';
import { OfflineIndicator } from './components/OfflineIndicator';
import { FONT_SCALE_STEPS, FontScale, SettingsModal } from './components/SettingsModal';
import { SplashScreen } from './components/SplashScreen';
import { LanguageProvider, useLanguage } from './i18n/LanguageContext';
import { getLocalizedComponent } from './i18n/dataTranslations';

type AppTab = 'components' | 'circuit' | 'breadboard' | 'projects' | 'lab' | 'quiz' | 'notes' | 'glossary';
type LabSubTab = 'multimeter' | 'breadboard' | 'pcb' | 'resistor' | 'capacitor' | 'pinout' | 'calculators';

interface AppNavState {
  __elecApp: true;
  depth: number;
  activeTab: AppTab;
  labSubTab: LabSubTab;
  categoryFilter: string;
  selectedComponentId: string | null;
  selectedProjectId: string | null;
  glossaryTermModalId: string | null;
  focusedGlossaryTermId: string | null;
  isSettingsOpen: boolean;
}

const DEFAULT_NAV_STATE: AppNavState = {
  __elecApp: true,
  depth: 0,
  activeTab: 'components',
  labSubTab: 'multimeter',
  categoryFilter: 'all',
  selectedComponentId: null,
  selectedProjectId: null,
  glossaryTermModalId: null,
  focusedGlossaryTermId: null,
  isSettingsOpen: false,
};

function AppContent() {
  const { lang, isRtl, t, pick } = useLanguage();

  const [navState, setNavState] = useState<AppNavState>(() => {
    try {
      const st = window.history.state;
      if (st && st.__elecApp) {
        return { ...DEFAULT_NAV_STATE, ...st, __elecApp: true };
      }
    } catch {
      // Ignore history access restrictions
    }
    return DEFAULT_NAV_STATE;
  });
  const navRef = useRef<AppNavState>(navState);

  const [simTargetId, setSimTargetId] = useState<string>('resistor');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [moreMenuOpen, setMoreMenuOpen] = useState<boolean>(false);
  const moreMenuRef = useRef<HTMLDivElement | null>(null);

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

  const [comfortableReading, setComfortableReading] = useState<boolean>(() => {
    try {
      return localStorage.getItem('elec_comfortable_reading_v1') === 'true';
    } catch {
      return false;
    }
  });

  const {
    activeTab,
    labSubTab,
    categoryFilter,
    selectedComponentId,
    selectedProjectId,
    glossaryTermModalId,
    focusedGlossaryTermId,
    isSettingsOpen,
  } = navState;

  const selectedComponent = useMemo(
    () =>
      selectedComponentId
        ? ELECTRONIC_COMPONENTS.find((c) => c.id === selectedComponentId) || null
        : null,
    [selectedComponentId]
  );

  const pushNav = useCallback(
    (patch: Partial<Omit<AppNavState, '__elecApp' | 'depth'>>) => {
      const prev = navRef.current;
      const next: AppNavState = {
        ...prev,
        ...patch,
        __elecApp: true,
        depth: prev.depth + 1,
      };
      if (
        next.activeTab === prev.activeTab &&
        next.labSubTab === prev.labSubTab &&
        next.categoryFilter === prev.categoryFilter &&
        next.selectedComponentId === prev.selectedComponentId &&
        next.selectedProjectId === prev.selectedProjectId &&
        next.glossaryTermModalId === prev.glossaryTermModalId &&
        next.focusedGlossaryTermId === prev.focusedGlossaryTermId &&
        next.isSettingsOpen === prev.isSettingsOpen
      ) {
        return;
      }
      navRef.current = next;
      setNavState(next);
      try {
        window.history.pushState(next, '');
      } catch {
        // Ignore history restrictions
      }
    },
    []
  );

  const replaceNav = useCallback(
    (patch: Partial<Omit<AppNavState, '__elecApp' | 'depth'>>) => {
      const prev = navRef.current;
      const next: AppNavState = {
        ...prev,
        ...patch,
        __elecApp: true,
      };
      navRef.current = next;
      setNavState(next);
      try {
        window.history.replaceState(next, '');
      } catch {
        // Ignore history restrictions
      }
    },
    []
  );

  useEffect(() => {
    try {
      if (!window.history.state || !window.history.state.__elecApp) {
        window.history.replaceState(navRef.current, '');
      }
    } catch {
      // Ignore history restrictions
    }

    const handlePopState = (event: PopStateEvent) => {
      const st = event.state;
      if (st && st.__elecApp) {
        const next: AppNavState = {
          ...DEFAULT_NAV_STATE,
          ...st,
          __elecApp: true,
        };
        navRef.current = next;
        setNavState(next);
      } else {
        const fallback: AppNavState = { ...DEFAULT_NAV_STATE, depth: 0 };
        navRef.current = fallback;
        setNavState(fallback);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navItems: { id: AppTab; label: string; mobileLabel: string; icon: React.FC<{ className?: string }> }[] =
    useMemo(
      () => [
        { id: 'components', label: t.nav.components, mobileLabel: t.nav.componentsMobile, icon: Cpu },
        { id: 'circuit', label: t.nav.circuit, mobileLabel: t.nav.circuitMobile, icon: Zap },
        { id: 'breadboard', label: t.nav.breadboard, mobileLabel: t.nav.breadboardMobile, icon: CircuitBoard },
        { id: 'projects', label: t.nav.projects, mobileLabel: t.nav.projectsMobile, icon: FolderKanban },
        { id: 'lab', label: t.nav.lab, mobileLabel: t.nav.labMobile, icon: Gauge },
        { id: 'quiz', label: t.nav.quiz, mobileLabel: t.nav.quizMobile, icon: GraduationCap },
        { id: 'glossary', label: t.nav.glossary, mobileLabel: t.nav.glossaryMobile, icon: BookA },
        { id: 'notes', label: t.nav.notes, mobileLabel: t.nav.notesMobile, icon: NotebookPen },
      ],
      [t]
    );

  const mobilePrimaryTabs: AppTab[] = ['components', 'circuit', 'lab', 'projects'];
  const mobileMoreTabs: AppTab[] = ['breadboard', 'quiz', 'glossary', 'notes'];

  useEffect(() => {
    if (!moreMenuOpen) return;
    const handleOutside = (e: MouseEvent) => {
      if (moreMenuRef.current && !moreMenuRef.current.contains(e.target as Node)) {
        setMoreMenuOpen(false);
      }
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMoreMenuOpen(false);
    };
    document.addEventListener('mousedown', handleOutside);
    window.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handleOutside);
      window.removeEventListener('keydown', handleKey);
    };
  }, [moreMenuOpen]);

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
    try {
      localStorage.setItem('elec_comfortable_reading_v1', comfortableReading ? 'true' : 'false');
    } catch {
      // Ignore storage errors
    }
  }, [comfortableReading]);

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
    setSimTargetId(componentId);
    pushNav({
      selectedComponentId: null,
      glossaryTermModalId: null,
      activeTab: 'lab',
      labSubTab: 'multimeter',
    });
  };

  const handleOpenComponentById = (componentId: string) => {
    const found = ELECTRONIC_COMPONENTS.find((c) => c.id === componentId);
    if (found) {
      pushNav({
        selectedComponentId: found.id,
        glossaryTermModalId: null,
      });
    }
  };

  const handleStepComponent = (direction: -1 | 1) => {
    if (!selectedComponent) return;
    const idx = ELECTRONIC_COMPONENTS.findIndex((c) => c.id === selectedComponent.id);
    if (idx === -1) return;
    const nextIdx = (idx + direction + ELECTRONIC_COMPONENTS.length) % ELECTRONIC_COMPONENTS.length;
    replaceNav({
      selectedComponentId: ELECTRONIC_COMPONENTS[nextIdx].id,
      glossaryTermModalId: null,
    });
  };

  const handleCloseComponentModal = () => {
    if (
      navRef.current.depth > 0 &&
      window.history.state?.selectedComponentId === navRef.current.selectedComponentId &&
      !navRef.current.glossaryTermModalId
    ) {
      window.history.back();
    } else {
      replaceNav({ selectedComponentId: null, glossaryTermModalId: null });
    }
  };

  const handleCloseSettingsModal = () => {
    if (navRef.current.depth > 0 && window.history.state?.isSettingsOpen) {
      window.history.back();
    } else {
      replaceNav({ isSettingsOpen: false });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-slate-900 dark:bg-[#0F172A] dark:text-slate-100">
      <SplashScreen isDark={isDark} />
      {/* Top Bar Contract: Zone 1 (Brand) — Zone 2 (Nav Links on Desktop) — Zone 3 (1 Primary Action) */}
      <header className="sticky top-0 z-30 border-b border-[#E2E8F0] dark:border-[#334155] bg-white/95 dark:bg-[#1E293B]/95 backdrop-blur-md">
        <div className="mx-auto flex h-12 md:h-14 max-w-7xl items-center justify-between gap-6 px-4 sm:px-6">
          {/* Zone 1: Single text element wordmark */}
          <button
            type="button"
            onClick={() =>
              pushNav({
                activeTab: 'components',
                selectedComponentId: null,
                glossaryTermModalId: null,
              })
            }
            className="font-display text-base sm:text-lg font-extrabold tracking-tight text-slate-900 dark:text-white whitespace-nowrap shrink-0"
          >
            {t.brand}
          </button>

          {/* Zone 2: Concise single-line nav links (desktop) */}
          <nav className="hidden md:flex items-center gap-2.5 lg:gap-4 text-xs lg:text-[13px] font-semibold" aria-label="Main navigation">
            {navItems
              .filter((item) => item.id !== 'breadboard')
              .map((item) => {
                const active =
                  activeTab === item.id || (item.id === 'lab' && activeTab === 'breadboard');
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => pushNav({ activeTab: item.id })}
                    className={`relative py-1 transition-colors whitespace-nowrap shrink-0 ${
                      active
                        ? 'text-[#059669] dark:text-emerald-400'
                        : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    {item.label}
                    {active && (
                      <span className="absolute bottom-0 right-0 left-0 h-0.5 rounded-full bg-[#059669] dark:bg-emerald-400" />
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
        {/* Persistent Workspace Bar: Creator/Offline metadata + Theme & Settings */}
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#E2E8F0] dark:border-[#334155]">
          <div className="text-xs font-medium text-slate-500 dark:text-slate-400">
            <span>{t.creatorPrefix} </span>
            <strong className="font-semibold text-slate-800 dark:text-slate-100">{t.creatorName}</strong>
            <span className="mx-1.5" aria-hidden="true">·</span>
            <span>{t.offlineBadge}</span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setIsDark((d) => !d)}
              aria-label={isDark ? t.topbar.themeLight : t.topbar.themeDark}
              className="inline-flex min-h-[44px] items-center gap-1.5 rounded-xl border border-[#E2E8F0] dark:border-[#334155] bg-white dark:bg-[#1E293B] px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-700/60 transition-colors whitespace-nowrap shrink-0 shadow-sm"
            >
              {isDark ? <Sun className="h-4 w-4 text-[#D97706] dark:text-amber-400" /> : <Moon className="h-4 w-4 text-slate-600" />}
              <span className="hidden sm:inline">{isDark ? t.topbar.themeLight : t.topbar.themeDark}</span>
            </button>

            <button
              type="button"
              onClick={() => pushNav({ isSettingsOpen: true })}
              aria-label={t.topbar.settings}
              className="inline-flex min-h-[44px] items-center gap-2 rounded-xl border border-[#E2E8F0] dark:border-[#334155] bg-white dark:bg-[#1E293B] px-3.5 py-2 text-xs font-bold text-slate-800 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-700/60 transition-colors whitespace-nowrap shrink-0 shadow-sm"
            >
              <Settings className="h-4 w-4 text-[#059669] dark:text-emerald-400" />
              <span className="hidden xs:inline sm:inline">{t.topbar.settings}</span>
              {fontScale !== 100 && (
                <span className="font-mono-num text-[#059669] dark:text-emerald-400" dir="ltr">
                  {fontScale}%
                </span>
              )}
            </button>
          </div>
        </div>

        {activeTab === 'components' && (
          <div className="space-y-6">
            {/* Hero Intro + Interactive Tools & Calculators Hub */}
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-12 items-stretch">
              <section className="lg:col-span-7 relative overflow-hidden rounded-2xl border border-[#E2E8F0] dark:border-[#334155] bg-gradient-to-br from-white via-emerald-50/55 to-slate-50 dark:from-[#1E293B] dark:via-emerald-950/35 dark:to-[#1E293B] p-5 sm:p-7 shadow-sm flex flex-col justify-between">
                {/* Subtle PCB Emerald & Copper Gold Trace Motif */}
                <svg
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-y-0 end-0 h-full w-64 text-[#059669]/15 dark:text-emerald-400/15"
                  viewBox="0 0 240 200"
                  fill="none"
                >
                  <path d="M20 40H110L135 65H220" stroke="currentColor" strokeWidth="2" />
                  <path d="M40 95H95L120 120H210" stroke="currentColor" strokeWidth="2" />
                  <path d="M60 155H140L165 130H230" stroke="currentColor" strokeWidth="2" />
                  <circle cx="110" cy="40" r="4" fill="#D97706" fillOpacity="0.4" />
                  <circle cx="120" cy="120" r="4" fill="currentColor" />
                  <circle cx="165" cy="130" r="4" fill="#D97706" fillOpacity="0.4" />
                  <circle cx="220" cy="65" r="5" stroke="currentColor" strokeWidth="2" />
                  <circle cx="210" cy="120" r="5" stroke="#D97706" strokeOpacity="0.45" strokeWidth="2" />
                </svg>

                <div className="relative z-10 max-w-2xl">
                  <div className="text-xs font-bold tracking-wide text-[#059669] dark:text-emerald-400 mb-1.5">
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
                </div>
              </section>

              {/* Interactive Tools & Calculators Section (5 tools in balanced 2+2+1 grid) */}
              <section className="lg:col-span-5 flex flex-col justify-between">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-base font-bold text-slate-800 dark:text-slate-100">
                    {pick('الأدوات والحاسبات التفاعلية', 'Outils et calculateurs interactifs', 'Interactive Tools & Calculators')}
                  </h2>
                  <span className="text-xs font-bold text-[#059669] dark:text-emerald-400">
                    {pick('5 أدوات', '5 outils', '5 tools')}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 flex-1">
                  {/* Card 1: Resistor Color Reader */}
                  <button
                    type="button"
                    onClick={() => pushNav({ activeTab: 'lab', labSubTab: 'resistor' })}
                    className={`flex flex-col items-start p-3.5 bg-white dark:bg-[#1E293B] rounded-2xl border border-[#E2E8F0] dark:border-[#334155] shadow-sm hover:border-[#059669] dark:hover:border-emerald-500 hover:shadow-md transition-all group ${
                      isRtl ? 'text-right' : 'text-left'
                    }`}
                  >
                    <div className="w-9 h-9 rounded-xl bg-amber-100/90 dark:bg-amber-900/35 text-[#D97706] dark:text-amber-400 flex items-center justify-center mb-2.5 group-hover:scale-110 transition-transform">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 12h3l2-4 4 8 4-8 2 4h3" />
                      </svg>
                    </div>
                    <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white mb-0.5">
                      {pick('قارئ المقاومات', 'Lecteur résistances', 'Resistor Reader')}
                    </span>
                    <span className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 leading-snug">
                      {pick('حساب القيمة بالألوان', 'Calcul par code couleur', 'Decode bands & SMD')}
                    </span>
                  </button>

                  {/* Card 2: Multimeter Simulator */}
                  <button
                    type="button"
                    onClick={() => pushNav({ activeTab: 'lab', labSubTab: 'multimeter' })}
                    className={`flex flex-col items-start p-3.5 bg-white dark:bg-[#1E293B] rounded-2xl border border-[#E2E8F0] dark:border-[#334155] shadow-sm hover:border-[#059669] dark:hover:border-emerald-500 hover:shadow-md transition-all group ${
                      isRtl ? 'text-right' : 'text-left'
                    }`}
                  >
                    <div className="w-9 h-9 rounded-xl bg-emerald-100/90 dark:bg-emerald-900/35 text-[#059669] dark:text-emerald-400 flex items-center justify-center mb-2.5 group-hover:scale-110 transition-transform">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white mb-0.5">
                      {pick('محاكي الملتيميتر', 'Simulateur multimètre', 'Multimeter Sim')}
                    </span>
                    <span className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 leading-snug">
                      {pick('فحص رقمي وراسم إشارة', 'Mesure & Oscilloscope', 'Meter & Oscilloscope')}
                    </span>
                  </button>

                  {/* Card 3: Capacitor Code Reader */}
                  <button
                    type="button"
                    onClick={() => pushNav({ activeTab: 'lab', labSubTab: 'capacitor' })}
                    className={`flex flex-col items-start p-3.5 bg-white dark:bg-[#1E293B] rounded-2xl border border-[#E2E8F0] dark:border-[#334155] shadow-sm hover:border-[#059669] dark:hover:border-emerald-500 hover:shadow-md transition-all group ${
                      isRtl ? 'text-right' : 'text-left'
                    }`}
                  >
                    <div className="w-9 h-9 rounded-xl bg-amber-100/90 dark:bg-amber-900/35 text-[#D97706] dark:text-amber-400 flex items-center justify-center mb-2.5 group-hover:scale-110 transition-transform">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 12h6M15 12h6M9 6v12M15 6v12" />
                      </svg>
                    </div>
                    <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white mb-0.5">
                      {pick('قارئ رموز المكثفات', 'Code condensateurs', 'Capacitor Reader')}
                    </span>
                    <span className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 leading-snug">
                      {pick('تحويل 104 و 472 لـ pF و µF', 'Convertir 104 / 472 en µF', 'Decode 104 / 472 instantly')}
                    </span>
                  </button>

                  {/* Card 4: Component Pinout Reference */}
                  <button
                    type="button"
                    onClick={() => pushNav({ activeTab: 'lab', labSubTab: 'pinout' })}
                    className={`flex flex-col items-start p-3.5 bg-white dark:bg-[#1E293B] rounded-2xl border border-[#E2E8F0] dark:border-[#334155] shadow-sm hover:border-[#059669] dark:hover:border-emerald-500 hover:shadow-md transition-all group ${
                      isRtl ? 'text-right' : 'text-left'
                    }`}
                  >
                    <div className="w-9 h-9 rounded-xl bg-emerald-100/90 dark:bg-emerald-900/35 text-[#059669] dark:text-emerald-400 flex items-center justify-center mb-2.5 group-hover:scale-110 transition-transform">
                      <Cpu className="w-5 h-5" />
                    </div>
                    <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white mb-0.5">
                      {pick('دليل أطراف العناصر', 'Brochage (Pinout)', 'Pinout Guide')}
                    </span>
                    <span className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 leading-snug">
                      {pick('BC547, IRFZ44N, 7805, 555', 'BC547, IRFZ44N, 7805, 555', 'BC547, IRFZ44N, 7805, 555')}
                    </span>
                  </button>

                  {/* Card 5: LED & Resistor Calculator (Full width, right-aligned directly beside icon) */}
                  <button
                    type="button"
                    onClick={() => pushNav({ activeTab: 'lab', labSubTab: 'calculators' })}
                    className={`col-span-2 flex items-center justify-between gap-3 p-4 bg-white dark:bg-[#1E293B] rounded-2xl border border-[#E2E8F0] dark:border-[#334155] shadow-sm hover:border-[#059669] dark:hover:border-emerald-500 hover:shadow-md transition-all group ${
                      isRtl ? 'text-right' : 'text-left'
                    }`}
                  >
                    <div className="flex items-center justify-start gap-3.5 min-w-0 flex-1">
                      <div className="w-11 h-11 rounded-xl bg-emerald-100/90 dark:bg-emerald-900/35 text-[#059669] dark:text-emerald-400 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                      </div>
                      <div className={`flex flex-col items-start min-w-0 flex-1 ${isRtl ? 'text-right' : 'text-left'}`}>
                        <span className="block w-full font-bold text-sm text-slate-900 dark:text-white mb-0.5 leading-snug">
                          {pick('حاسبة الليد والمقاومة المناسبة', 'Calculateur LED & résistance', 'LED & Resistor Calculator')}
                        </span>
                        <span className="block w-full text-xs text-slate-500 dark:text-slate-400 leading-snug">
                          {pick('تحديد قيمة المقاومة المناسبة لحماية الليد', 'Protéger vos LED par résistance', 'Find safe series resistor for LEDs')}
                        </span>
                      </div>
                    </div>

                    <svg
                      className={`w-5 h-5 text-slate-400 group-hover:text-[#059669] dark:group-hover:text-emerald-400 transition-all shrink-0 ${
                        isRtl ? 'group-hover:-translate-x-1' : 'rotate-180 group-hover:translate-x-1'
                      }`}
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                </div>
              </section>
            </div>

            {/* Search & Interactive Category + Favorites Filters */}
            <section className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div className="relative w-full lg:max-w-sm">
                <Search className="pointer-events-none absolute start-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t.hero.searchPlaceholder}
                  aria-label={t.hero.searchAria}
                  className="w-full min-h-[44px] rounded-xl border border-[#E2E8F0] dark:border-[#334155] bg-white dark:bg-[#1E293B] ps-10 pe-4 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-[#059669] dark:focus:border-emerald-500 focus:outline-none shadow-sm"
                />
              </div>

              <div className="flex flex-wrap items-center gap-1.5 rounded-xl bg-slate-200/70 dark:bg-[#1E293B] p-1.5 border border-[#E2E8F0] dark:border-[#334155]">
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
                      onClick={() => pushNav({ categoryFilter: key })}
                      className={`min-h-[38px] rounded-lg px-3 py-1.5 text-xs font-semibold whitespace-nowrap shrink-0 transition-colors ${
                        active
                          ? 'bg-[#059669] text-white shadow-sm'
                          : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      {t.categories[key]} <span className="font-mono-num opacity-80">({count})</span>
                    </button>
                  );
                })}
                <button
                  type="button"
                  onClick={() => pushNav({ categoryFilter: 'saved' })}
                  aria-pressed={categoryFilter === 'saved'}
                  className={`inline-flex min-h-[38px] items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold whitespace-nowrap shrink-0 transition-colors ${
                    categoryFilter === 'saved'
                      ? 'bg-[#059669] text-white shadow-sm'
                      : 'bg-white/80 dark:bg-[#0F172A]/70 text-[#059669] dark:text-emerald-400 hover:bg-white dark:hover:bg-[#0F172A]'
                  }`}
                >
                  <Bookmark className={`h-3.5 w-3.5 ${bookmarks.length > 0 || categoryFilter === 'saved' ? 'fill-current' : ''}`} />
                  <span>{t.hero.saved}</span>
                  <span className="font-mono-num opacity-85">({bookmarks.length})</span>
                </button>
              </div>
            </section>

            {/* Components Grid */}
            {filteredComponents.length === 0 ? (
              <div className="rounded-2xl border border-[#E2E8F0] dark:border-[#334155] bg-white dark:bg-[#1E293B] p-10 text-center shadow-sm">
                {categoryFilter === 'saved' && bookmarks.length === 0 ? (
                  <Bookmark className="mx-auto h-8 w-8 text-[#D97706] dark:text-amber-400 mb-3" />
                ) : (
                  <BookOpen className="mx-auto h-8 w-8 text-slate-400 mb-3" />
                )}
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 max-w-md mx-auto leading-relaxed">
                  {categoryFilter === 'saved' && bookmarks.length === 0
                    ? t.hero.favoritesEmpty
                    : t.hero.noResults}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    pushNav({ categoryFilter: 'all' });
                    setSearchQuery('');
                  }}
                  className="mt-4 min-h-[44px] rounded-xl bg-[#059669] px-5 py-2 text-xs font-semibold text-white hover:bg-[#047857] transition-colors"
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
                      className="group flex flex-col overflow-hidden rounded-2xl border border-[#E2E8F0] dark:border-[#334155] bg-white dark:bg-[#1E293B] shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md hover:border-[#059669] dark:hover:border-emerald-500"
                    >
                      <button
                        type="button"
                        onClick={() =>
                          pushNav({ selectedComponentId: comp.id, glossaryTermModalId: null })
                        }
                        className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100 dark:bg-[#0F172A] text-start focus-visible:outline-2 focus-visible:outline-[#059669]"
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
                                  ? 'text-[#D97706] dark:text-amber-400'
                                  : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                              }`}
                            >
                              <Bookmark className={`h-4 w-4 ${isSaved ? 'fill-current' : ''}`} />
                            </button>
                          </div>

                          <button
                            type="button"
                            onClick={() =>
                              pushNav({ selectedComponentId: comp.id, glossaryTermModalId: null })
                            }
                            className="mt-0.5 block w-full text-start"
                          >
                            <h2 className="text-sm sm:text-base font-bold leading-snug text-slate-900 dark:text-white group-hover:text-[#059669] dark:group-hover:text-emerald-400 transition-colors">
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

                        <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-[#334155] flex items-center justify-between gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              pushNav({ selectedComponentId: comp.id, glossaryTermModalId: null })
                            }
                            className="min-h-[44px] text-[11px] sm:text-xs font-bold text-[#059669] dark:text-emerald-400 hover:underline whitespace-nowrap"
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
            onOpenCircuitSimulator={() => pushNav({ activeTab: 'circuit' })}
            selectedProjectId={selectedProjectId}
            comfortableReading={comfortableReading}
            onSelectProjectId={(projectId) => {
              if (projectId) {
                pushNav({ selectedProjectId: projectId });
              } else if (navRef.current.depth > 0 && window.history.state?.selectedProjectId) {
                window.history.back();
              } else {
                replaceNav({ selectedProjectId: null });
              }
            }}
          />
        )}

        {(activeTab === 'lab' || activeTab === 'breadboard') && (
          <div className="space-y-6">
            {/* Clean Segmented Switcher across Lab Tools + Breadboard + Simulator Link */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#E2E8F0] dark:border-[#334155]">
              <div className="flex flex-wrap items-center gap-1 rounded-xl bg-slate-200/70 dark:bg-[#1E293B] p-1 border border-[#E2E8F0] dark:border-[#334155]">
                {(
                  [
                    { id: 'multimeter', label: t.labTabs.multimeter },
                    { id: 'breadboard', label: t.labTabs.breadboard },
                    { id: 'pcb', label: t.labTabs.pcb },
                    { id: 'resistor', label: t.labTabs.resistor },
                    { id: 'capacitor', label: t.labTabs.capacitor },
                    { id: 'pinout', label: t.labTabs.pinout },
                    { id: 'calculators', label: t.labTabs.calculators },
                  ] as const
                ).map((sub) => {
                  const effectiveSubTab =
                    activeTab === 'breadboard' ? 'breadboard' : labSubTab;
                  const isActive = effectiveSubTab === sub.id;
                  return (
                    <button
                      key={sub.id}
                      type="button"
                      onClick={() => pushNav({ activeTab: 'lab', labSubTab: sub.id })}
                      className={`min-h-[40px] rounded-lg px-3.5 py-1.5 text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap ${
                        isActive
                          ? 'bg-[#059669] text-white shadow-sm'
                          : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      {sub.label}
                    </button>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={() => pushNav({ activeTab: 'circuit' })}
                className="inline-flex min-h-[40px] items-center gap-1.5 rounded-xl border border-[#E2E8F0] dark:border-[#334155] bg-white dark:bg-[#1E293B] px-3.5 py-1.5 text-xs font-bold text-[#059669] dark:text-emerald-400 hover:border-[#059669] transition-colors whitespace-nowrap shrink-0 shadow-sm"
              >
                <Zap className="h-3.5 w-3.5" />
                <span>{t.nav.circuit}</span>
              </button>
            </div>

            {(activeTab === 'breadboard' ? 'breadboard' : labSubTab) === 'breadboard' ? (
              <BreadboardSimulator />
            ) : labSubTab === 'pcb' ? (
              <PcbExplorerView />
            ) : labSubTab === 'resistor' ? (
              <ResistorColorReader />
            ) : labSubTab === 'multimeter' ? (
              <MultimeterLab key={simTargetId} initialComponentId={simTargetId} />
            ) : labSubTab === 'capacitor' ? (
              <CapacitorCodeReader />
            ) : labSubTab === 'pinout' ? (
              <PinoutGuideView />
            ) : (
              <CalculatorsView />
            )}
          </div>
        )}

        {activeTab === 'quiz' && <QuizView />}
        {activeTab === 'glossary' && (
          <GlossaryView
            focusedTermId={focusedGlossaryTermId}
            comfortableReading={comfortableReading}
            onClearFocus={() => replaceNav({ focusedGlossaryTermId: null })}
          />
        )}
        {activeTab === 'notes' && <NotesView />}
      </main>

      <footer className="border-t border-[#E2E8F0] dark:border-[#334155] bg-white/85 dark:bg-[#1E293B]/85 pb-20 md:pb-6">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400 text-center sm:text-start">
          <div className="font-semibold text-slate-800 dark:text-slate-100">{t.footerAppTitle}</div>
          <div className="flex items-center justify-center gap-1.5 text-[11px] text-[#D97706] dark:text-amber-400 font-medium">
            <ShieldAlert className="h-3.5 w-3.5 shrink-0" />
            <span>{t.footerSingleNotice}</span>
          </div>
        </div>
      </footer>

      {/* Mobile Android Bottom Tab Bar (5 main tabs + More popover) */}
      <div ref={moreMenuRef} className="md:hidden">
        {moreMenuOpen && (
          <div
            role="dialog"
            aria-label={pick('أقسام وإعدادات إضافية', 'Plus de sections et paramètres', 'More sections & settings')}
            className={`fixed bottom-16 z-50 w-[min(calc(100vw-1.5rem),20rem)] rounded-2xl border border-[#E2E8F0] dark:border-[#334155] bg-white dark:bg-[#1E293B] p-3 shadow-2xl space-y-3 ${
              isRtl ? 'left-3' : 'right-3'
            }`}
          >
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-extrabold text-slate-800 dark:text-slate-100">
                {pick('باقي الأقسام والأدوات', 'Autres sections', 'More Sections')}
              </span>
              <button
                type="button"
                onClick={() => setMoreMenuOpen(false)}
                aria-label={pick('إغلاق القائمة', 'Fermer', 'Close')}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {mobileMoreTabs.map((tabId) => {
                const item = navItems.find((n) => n.id === tabId);
                if (!item) return null;
                const Icon = item.icon;
                const active =
                  item.id === 'breadboard'
                    ? (activeTab === 'lab' && labSubTab === 'breadboard') || activeTab === 'breadboard'
                    : activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      if (item.id === 'breadboard') {
                        pushNav({ activeTab: 'lab', labSubTab: 'breadboard' });
                      } else {
                        pushNav({ activeTab: item.id });
                      }
                      setMoreMenuOpen(false);
                    }}
                    className={`flex min-h-[46px] items-center gap-2.5 rounded-xl border px-3 py-2 text-xs font-bold transition-colors ${
                      active
                        ? 'border-[#059669] bg-emerald-50 dark:bg-emerald-950/50 text-[#059669] dark:text-emerald-300'
                        : 'border-[#E2E8F0] dark:border-[#334155] bg-slate-50 dark:bg-[#0F172A]/60 text-slate-700 dark:text-slate-100 hover:border-[#059669]'
                    }`}
                  >
                    <Icon className="h-4 w-4 shrink-0 text-[#059669] dark:text-emerald-400" />
                    <span className="truncate">{item.mobileLabel}</span>
                  </button>
                );
              })}
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 dark:border-[#334155]">
              <button
                type="button"
                onClick={() => {
                  setIsDark((d) => !d);
                  setMoreMenuOpen(false);
                }}
                className="flex min-h-[44px] items-center justify-center gap-2 rounded-xl border border-[#E2E8F0] dark:border-[#334155] bg-white dark:bg-[#0F172A]/70 px-3 py-2 text-xs font-bold text-slate-700 dark:text-slate-100"
              >
                {isDark ? <Sun className="h-4 w-4 text-[#D97706] dark:text-amber-400" /> : <Moon className="h-4 w-4 text-slate-600" />}
                <span className="truncate">{isDark ? t.topbar.themeLight : t.topbar.themeDark}</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setMoreMenuOpen(false);
                  pushNav({ isSettingsOpen: true });
                }}
                className="flex min-h-[44px] items-center justify-center gap-2 rounded-xl border border-[#E2E8F0] dark:border-[#334155] bg-white dark:bg-[#0F172A]/70 px-3 py-2 text-xs font-bold text-slate-800 dark:text-slate-100"
              >
                <Settings className="h-4 w-4 text-[#059669] dark:text-emerald-400" />
                <span className="truncate">{t.topbar.settings}</span>
              </button>
            </div>
          </div>
        )}

        <nav
          className="fixed bottom-0 left-0 right-0 z-40 border-t border-[#E2E8F0] dark:border-[#334155] bg-white/95 dark:bg-[#1E293B]/95 backdrop-blur-md pb-safe"
          aria-label="Mobile navigation"
        >
          <div className="grid grid-cols-5 items-center h-14">
            {mobilePrimaryTabs.map((tabId) => {
              const item = navItems.find((n) => n.id === tabId);
              if (!item) return null;
              const Icon = item.icon;
              const active =
                activeTab === item.id || (item.id === 'lab' && activeTab === 'breadboard');
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setMoreMenuOpen(false);
                    pushNav({ activeTab: item.id });
                  }}
                  className={`relative flex min-h-[44px] flex-col items-center justify-center px-1 transition-colors ${
                    active
                      ? 'text-[#059669] dark:text-emerald-400'
                      : 'text-slate-500 dark:text-slate-400'
                  }`}
                >
                  {active && (
                    <span className="absolute top-0 h-0.5 w-8 rounded-full bg-[#059669] dark:bg-emerald-400" />
                  )}
                  <Icon className="h-[19px] w-[19px]" />
                  <span className="mt-0.5 text-[10px] font-semibold tracking-tight whitespace-nowrap">
                    {item.mobileLabel}
                  </span>
                </button>
              );
            })}

            <button
              type="button"
              onClick={() => setMoreMenuOpen((o) => !o)}
              aria-expanded={moreMenuOpen}
              className={`relative flex min-h-[44px] flex-col items-center justify-center px-1 transition-colors ${
                moreMenuOpen || ['quiz', 'glossary', 'notes'].includes(activeTab)
                  ? 'text-[#059669] dark:text-emerald-400'
                  : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              {(moreMenuOpen || ['quiz', 'glossary', 'notes'].includes(activeTab)) && (
                <span className="absolute top-0 h-0.5 w-8 rounded-full bg-[#059669] dark:bg-emerald-400" />
              )}
              <MoreHorizontal className="h-[19px] w-[19px]" />
              <span className="mt-0.5 text-[10px] font-semibold tracking-tight whitespace-nowrap">
                {pick('المزيد', 'Plus', 'More')}
              </span>
            </button>
          </div>
        </nav>
      </div>

      {/* Component Detail Fullscreen Drawer */}
      {selectedComponent && (
        <ComponentDetailModal
          component={selectedComponent}
          isBookmarked={bookmarks.includes(selectedComponent.id)}
          onToggleBookmark={toggleBookmark}
          onClose={handleCloseComponentModal}
          onPrev={() => handleStepComponent(-1)}
          onNext={() => handleStepComponent(1)}
          onTestInMultimeter={handleOpenMultimeterFor}
          activeGlossaryTermId={glossaryTermModalId}
          onSelectGlossaryTermId={(termId) => {
            if (termId) {
              pushNav({ glossaryTermModalId: termId });
            } else if (navRef.current.depth > 0 && window.history.state?.glossaryTermModalId) {
              window.history.back();
            } else {
              replaceNav({ glossaryTermModalId: null });
            }
          }}
          onOpenGlossaryTerm={(termId) => {
            pushNav({
              selectedComponentId: null,
              glossaryTermModalId: null,
              focusedGlossaryTermId: termId,
              activeTab: 'glossary',
            });
          }}
          onNavigateHome={() => {
            setSearchQuery('');
            pushNav({
              selectedComponentId: null,
              glossaryTermModalId: null,
              selectedProjectId: null,
              categoryFilter: 'all',
              activeTab: 'components',
            });
          }}
          onNavigateCategory={(category) => {
            setSearchQuery('');
            pushNav({
              selectedComponentId: null,
              glossaryTermModalId: null,
              selectedProjectId: null,
              categoryFilter: category,
              activeTab: 'components',
            });
          }}
          onSelectComponent={handleOpenComponentById}
          onOpenPinoutGuide={() => {
            pushNav({
              selectedComponentId: null,
              glossaryTermModalId: null,
              activeTab: 'lab',
              labSubTab: 'pinout',
            });
          }}
          comfortableReading={comfortableReading}
          onToggleComfortableReading={() => setComfortableReading((v) => !v)}
        />
      )}

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={handleCloseSettingsModal}
        fontScale={fontScale}
        onChangeFontScale={setFontScale}
        isDark={isDark}
        onToggleDark={() => setIsDark((d) => !d)}
        comfortableReading={comfortableReading}
        onToggleComfortableReading={() => setComfortableReading((v) => !v)}
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
