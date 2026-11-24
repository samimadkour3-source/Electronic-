import React, { useEffect, useMemo, useState } from 'react';
import {
  Award,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Flame,
  Lock,
  RotateCcw,
  Trophy,
  XCircle,
} from 'lucide-react';
import { QUIZ_LEVEL_META, QUIZ_QUESTIONS, QUIZ_RANKS } from '../data/quizData';
import { QuizLevel, QuizQuestion } from '../types/electronics';
import { useLanguage } from '../i18n/LanguageContext';
import {
  getLocalizedQuizLevelMeta,
  getLocalizedQuizQuestion,
  getLocalizedRank,
} from '../i18n/dataTranslations';

type QuizMode = 'menu' | 'playing' | 'summary';
type PlayPath = 'progressive' | QuizLevel;

interface StoredQuizStats {
  totalPoints: number;
  bestStreak: number;
  answeredCorrectIds: string[];
  completedLevels: QuizLevel[];
}

const STORAGE_KEY = 'elec_quiz_progress_v1';

const DEFAULT_STATS: StoredQuizStats = {
  totalPoints: 0,
  bestStreak: 0,
  answeredCorrectIds: [],
  completedLevels: [],
};

function getRankForPoints(points: number) {
  let current = QUIZ_RANKS[0];
  let next = QUIZ_RANKS[1] ?? null;
  for (let i = 0; i < QUIZ_RANKS.length; i++) {
    if (points >= QUIZ_RANKS[i].minPoints) {
      current = QUIZ_RANKS[i];
      next = QUIZ_RANKS[i + 1] ?? null;
    }
  }
  return { current, next };
}

export const QuizView: React.FC = () => {
  const { lang, isRtl, pick } = useLanguage();

  const [stats, setStats] = useState<StoredQuizStats>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return { ...DEFAULT_STATS, ...JSON.parse(raw) };
    } catch {
      // Ignore storage errors
    }
    return DEFAULT_STATS;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
    } catch {
      // Ignore storage errors
    }
  }, [stats]);

  const [mode, setMode] = useState<QuizMode>('menu');
  const [playPath, setPlayPath] = useState<PlayPath>('progressive');
  const [deck, setDeck] = useState<QuizQuestion[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  // Run-level counters
  const [sessionPoints, setSessionPoints] = useState(0);
  const [sessionCorrect, setSessionCorrect] = useState(0);
  const [streak, setStreak] = useState(0);
  const [lastAwarded, setLastAwarded] = useState<{ base: number; bonus: number } | null>(null);
  const [levelBreakdown, setLevelBreakdown] = useState<Record<QuizLevel, { right: number; total: number }>>({
    beginner: { right: 0, total: 0 },
    intermediate: { right: 0, total: 0 },
    expert: { right: 0, total: 0 },
  });

  const { current: currentRank, next: nextRank } = useMemo(
    () => getRankForPoints(stats.totalPoints),
    [stats.totalPoints]
  );

  const isLevelUnlocked = (lvl: QuizLevel): boolean => {
    if (lvl === 'beginner') return true;
    if (lvl === 'intermediate') {
      return stats.totalPoints >= QUIZ_LEVEL_META.intermediate.unlockPoints || stats.completedLevels.includes('beginner');
    }
    return stats.totalPoints >= QUIZ_LEVEL_META.expert.unlockPoints || stats.completedLevels.includes('intermediate');
  };

  const startQuiz = (path: PlayPath) => {
    let selectedQuestions: QuizQuestion[];
    if (path === 'progressive') {
      const b = QUIZ_QUESTIONS.filter((q) => q.level === 'beginner').slice(0, 3);
      const m = QUIZ_QUESTIONS.filter((q) => q.level === 'intermediate').slice(0, 3);
      const e = QUIZ_QUESTIONS.filter((q) => q.level === 'expert').slice(0, 3);
      selectedQuestions = [...b, ...m, ...e];
    } else {
      selectedQuestions = QUIZ_QUESTIONS.filter((q) => q.level === path);
    }

    setPlayPath(path);
    setDeck(selectedQuestions);
    setCurrentIdx(0);
    setSelectedOption(null);
    setSessionPoints(0);
    setSessionCorrect(0);
    setStreak(0);
    setLastAwarded(null);
    setLevelBreakdown({
      beginner: { right: 0, total: 0 },
      intermediate: { right: 0, total: 0 },
      expert: { right: 0, total: 0 },
    });
    setMode('playing');
  };

  const currentQ = deck[currentIdx];
  const isAnswered = selectedOption !== null;
  const isCorrect = currentQ ? selectedOption === currentQ.correctIndex : false;

  const handleSelect = (optIdx: number) => {
    if (isAnswered || !currentQ) return;
    setSelectedOption(optIdx);

    const correct = optIdx === currentQ.correctIndex;
    setLevelBreakdown((prev) => ({
      ...prev,
      [currentQ.level]: {
        right: prev[currentQ.level].right + (correct ? 1 : 0),
        total: prev[currentQ.level].total + 1,
      },
    }));

    if (correct) {
      const nextStreak = streak + 1;
      const bonus = nextStreak >= 2 ? Math.min(15, (nextStreak - 1) * 5) : 0;
      const gained = currentQ.points + bonus;
      setStreak(nextStreak);
      setSessionCorrect((c) => c + 1);
      setSessionPoints((p) => p + gained);
      setLastAwarded({ base: currentQ.points, bonus });

      setStats((prev) => ({
        ...prev,
        totalPoints: prev.totalPoints + gained,
        bestStreak: Math.max(prev.bestStreak, nextStreak),
        answeredCorrectIds: prev.answeredCorrectIds.includes(currentQ.id)
          ? prev.answeredCorrectIds
          : [...prev.answeredCorrectIds, currentQ.id],
      }));
    } else {
      setStreak(0);
      setLastAwarded({ base: 0, bonus: 0 });
    }
  };

  const handleNext = () => {
    if (currentIdx + 1 >= deck.length) {
      if (playPath !== 'progressive' && deck.length > 0 && sessionCorrect / deck.length >= 0.5) {
        setStats((prev) => ({
          ...prev,
          completedLevels: prev.completedLevels.includes(playPath)
            ? prev.completedLevels
            : [...prev.completedLevels, playPath],
        }));
      } else if (playPath === 'progressive' && sessionCorrect >= 5) {
        setStats((prev) => {
          const nextLevels = new Set<QuizLevel>(prev.completedLevels);
          nextLevels.add('beginner');
          if (levelBreakdown.intermediate.right >= 2) nextLevels.add('intermediate');
          if (levelBreakdown.expert.right >= 2) nextLevels.add('expert');
          return { ...prev, completedLevels: Array.from(nextLevels) };
        });
      }
      setMode('summary');
    } else {
      setCurrentIdx((i) => i + 1);
      setSelectedOption(null);
      setLastAwarded(null);
    }
  };

  const handleResetProgress = () => {
    setStats(DEFAULT_STATS);
  };

  const locCurrentRank = getLocalizedRank(currentRank, lang);
  const locNextRank = nextRank ? getLocalizedRank(nextRank, lang) : null;

  // ======================================
  // VIEW 1: LEVEL & RANK HUB (MENU)
  // ======================================
  if (mode === 'menu') {
    const rankProgressPct = nextRank
      ? Math.min(
          100,
          Math.round(
            ((stats.totalPoints - currentRank.minPoints) /
              (nextRank.minPoints - currentRank.minPoints)) *
              100
          )
        )
      : 100;

    return (
      <div className="mx-auto max-w-4xl space-y-6">
        {/* Header & Rank Banner */}
        <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-6">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="text-xs font-medium text-slate-500 dark:text-slate-400">
                <span>{pick('التصنيف الحالي', 'Rang actuel', 'Current Rank')}</span>
                <span className="mx-1.5" aria-hidden="true">·</span>
                <span className="font-mono-num">
                  {pick(
                    `تم إتقان ${stats.answeredCorrectIds.length} / ${QUIZ_QUESTIONS.length} سؤال`,
                    `${stats.answeredCorrectIds.length} / ${QUIZ_QUESTIONS.length} maîtrisées`,
                    `${stats.answeredCorrectIds.length} / ${QUIZ_QUESTIONS.length} mastered`
                  )}
                </span>
              </div>
              <div className="mt-1.5 flex items-center gap-2.5">
                <Trophy className="h-6 w-6 text-amber-500 shrink-0" />
                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
                  {locCurrentRank.title}
                </h2>
              </div>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                {locCurrentRank.description}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:text-end border-t sm:border-t-0 pt-4 sm:pt-0 border-slate-100 dark:border-slate-800 shrink-0">
              <div>
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  {pick('مجموع النقاط', 'Score total', 'Total Points')}
                </div>
                <div className="font-mono-num text-2xl font-extrabold text-sky-600 dark:text-sky-400" dir="ltr">
                  {stats.totalPoints}
                </div>
              </div>
              <div>
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  {pick('أفضل سلسلة', 'Meilleure série', 'Best Streak')}
                </div>
                <div className="font-mono-num text-2xl font-extrabold text-slate-900 dark:text-white" dir="ltr">
                  {stats.bestStreak}
                </div>
              </div>
            </div>
          </div>

          {/* Progress toward Next Rank */}
          <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between text-xs font-semibold mb-2">
              <span className="text-slate-600 dark:text-slate-400">
                {nextRank && locNextRank
                  ? pick(
                      `التقدم نحو رتبة «${locNextRank.title}» (${nextRank.minPoints} نقطة)`,
                      `Progression vers « ${locNextRank.title} » (${nextRank.minPoints} pts)`,
                      `Progress to "${locNextRank.title}" (${nextRank.minPoints} pts)`
                    )
                  : pick(
                      'وصلت إلى أعلى تصنيف هندسي في التطبيق',
                      'Vous avez atteint le rang d’ingénierie maximal',
                      'You reached the highest engineering rank!'
                    )}
              </span>
              <span className="font-mono-num text-slate-900 dark:text-white" dir="ltr">
                {rankProgressPct}%
              </span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
              <div
                className="h-full bg-sky-600 transition-all duration-300"
                style={{ width: `${rankProgressPct}%` }}
              />
            </div>
          </div>
        </section>

        {/* Primary Action: Progressive Escalating Challenge */}
        <section className="rounded-2xl border border-sky-200 dark:border-sky-900 bg-sky-50/60 dark:bg-sky-950/30 p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-semibold text-sky-700 dark:text-sky-400">
              {pick('الوضع المتدرج · 9 أسئلة متصاعدة الصعوبة', 'Mode progressif · 9 questions évolutives', 'Progressive Mode · 9 Escalating Questions')}
            </div>
            <h3 className="mt-1 text-lg font-extrabold text-slate-900 dark:text-white">
              {pick(
                'التحدي التدرجي الكامل (مبتدئ ← متوسط ← خبير)',
                'Défi Progressif Complet (Débutant → Intermédiaire → Expert)',
                'Full Progressive Challenge (Beginner → Intermediate → Expert)'
              )}
            </h3>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {pick(
                'ابدأ بأسئلة التأسيس السهلة، ثم انتقل تلقائياً لتشخيص الملتيميتر المتوسط، واختتم بمسائل الخبير مع مضاعفة نقاط السلسلة.',
                'Commencez par les bases, passez au diagnostic intermédiaire au multimètre, puis terminez par les défis Expert avec bonus de série.',
                'Start with foundational questions, advance to intermediate multimeter diagnostics, and finish with expert engineering problems plus streak bonuses.'
              )}
            </p>
          </div>
          <button
            type="button"
            onClick={() => startQuiz('progressive')}
            className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl bg-sky-600 px-6 py-3 text-sm font-bold text-white hover:bg-sky-700 transition-colors whitespace-nowrap shrink-0"
          >
            <span>{pick('ابدأ التحدي التدرجي', 'Lancer le défi', 'Start Progressive Quiz')}</span>
            {isRtl ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </button>
        </section>

        {/* Individual Level Cards */}
        <section>
          <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">
            {pick('أو اختر مستوى محدداً للتدريب وجمع النقاط', 'Ou choisissez un niveau spécifique pour vous entraîner', 'Or pick a specific difficulty level')}
          </h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {(['beginner', 'intermediate', 'expert'] as QuizLevel[]).map((lvl) => {
              const meta = QUIZ_LEVEL_META[lvl];
              const locMeta = getLocalizedQuizLevelMeta(lvl, meta, lang);
              const unlocked = isLevelUnlocked(lvl);
              const qCount = QUIZ_QUESTIONS.filter((q) => q.level === lvl).length;
              const solvedCount = QUIZ_QUESTIONS.filter(
                (q) => q.level === lvl && stats.answeredCorrectIds.includes(q.id)
              ).length;
              const completed = stats.completedLevels.includes(lvl);

              return (
                <div
                  key={lvl}
                  className={`flex flex-col justify-between rounded-2xl border p-5 transition-colors ${
                    unlocked
                      ? 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900'
                      : 'border-slate-200/70 dark:border-slate-800/60 bg-slate-100/70 dark:bg-slate-900/40 opacity-85'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
                      <span className="font-mono-num">
                        +{meta.pointsPerQ} {pick('نقطة / سؤال', 'pts / question', 'pts / Q')}
                      </span>
                      <span>
                        {completed
                          ? pick('مكتمل ✓', 'Terminé ✓', 'Completed ✓')
                          : unlocked
                          ? pick(`${solvedCount}/${qCount} محلول`, `${solvedCount}/${qCount} résolus`, `${solvedCount}/${qCount} solved`)
                          : pick(`يفتح عند ${meta.unlockPoints} نقطة`, `Débloqué à ${meta.unlockPoints} pts`, `Unlocks at ${meta.unlockPoints} pts`)}
                      </span>
                    </div>

                    <h4 className="mt-2 text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                      {!unlocked && <Lock className="h-4 w-4 text-slate-400 shrink-0" />}
                      <span>{pick(`المستوى ${locMeta.label}`, `Niveau ${locMeta.label}`, `${locMeta.label} Level`)}</span>
                    </h4>
                    <p className="mt-1.5 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                      {locMeta.description}
                    </p>
                  </div>

                  <button
                    type="button"
                    disabled={!unlocked}
                    onClick={() => startQuiz(lvl)}
                    className={`mt-5 min-h-[44px] w-full rounded-xl py-2.5 text-xs font-bold transition-colors ${
                      unlocked
                        ? 'bg-slate-900 dark:bg-slate-800 text-white hover:bg-slate-800 dark:hover:bg-sky-600'
                        : 'bg-slate-200 dark:bg-slate-800 text-slate-500 cursor-not-allowed'
                    }`}
                  >
                    {unlocked
                      ? pick(
                          `ابدأ اختبار ${locMeta.label} (${qCount} أسئلة)`,
                          `Démarrer ${locMeta.label} (${qCount} Q)`,
                          `Start ${locMeta.label} (${qCount} Qs)`
                        )
                      : pick(
                          `مغلق — اجمع ${meta.unlockPoints - stats.totalPoints} نقطة`,
                          `Verrouillé — ${meta.unlockPoints - stats.totalPoints} pts requis`,
                          `Locked — Earn ${meta.unlockPoints - stats.totalPoints} more pts`
                        )}
                  </button>
                </div>
              );
            })}
          </div>
        </section>

        {/* Ranks Reference Table */}
        <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
              <Award className="h-4 w-4 text-sky-600 dark:text-sky-400" />
              <h3>{pick('تصنيفات ورتب مختبر الإلكترونيك', 'Rangs et titres du laboratoire', 'Lab Ranks & Mastery Tiers')}</h3>
            </div>
            {stats.totalPoints > 0 && (
              <button
                type="button"
                onClick={handleResetProgress}
                className="text-xs font-semibold text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 transition-colors"
              >
                {pick('تصفير السجل', 'Réinitialiser', 'Reset Progress')}
              </button>
            )}
          </div>

          <div className="divide-y divide-slate-200 dark:divide-slate-800">
            {QUIZ_RANKS.map((r) => {
              const reached = stats.totalPoints >= r.minPoints;
              const isCurrent = currentRank.id === r.id;
              const locR = getLocalizedRank(r, lang);
              return (
                <div
                  key={r.id}
                  className={`grid grid-cols-1 sm:grid-cols-12 gap-2 px-5 py-3.5 text-sm items-center ${
                    isCurrent ? 'bg-sky-50/60 dark:bg-sky-950/30' : ''
                  }`}
                >
                  <div className="sm:col-span-4 flex items-center gap-2 font-bold text-slate-900 dark:text-white">
                    {reached ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    ) : (
                      <Lock className="h-4 w-4 text-slate-400 shrink-0" />
                    )}
                    <span>{locR.title}</span>
                  </div>
                  <div className="sm:col-span-6 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                    {locR.description}
                  </div>
                  <div className="sm:col-span-2 sm:text-end font-mono-num text-xs font-bold text-slate-700 dark:text-slate-300" dir="ltr">
                    {r.minPoints}+ pts
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    );
  }

  // ======================================
  // VIEW 2: QUIZ SUMMARY SCREEN
  // ======================================
  if (mode === 'summary') {
    const pct = deck.length > 0 ? Math.round((sessionCorrect / deck.length) * 100) : 0;
    return (
      <div className="mx-auto max-w-2xl rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 space-y-6">
        <div className="text-center">
          <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            {pick('ملخص جولة الاختبار', 'Résumé de la session', 'Quiz Session Summary')} · {pick('التصنيف الحالي:', 'Rang :', 'Rank:')} {locCurrentRank.title}
          </div>
          <div className="font-mono-num mt-2 text-4xl font-extrabold text-sky-600 dark:text-sky-400" dir="ltr">
            {sessionCorrect} / {deck.length} ({pct}%)
          </div>
          <div className="mt-2 font-mono-num text-sm font-bold text-emerald-600 dark:text-emerald-400">
            {pick(
              `+${sessionPoints} نقطة مكتسبة في هذه الجولة · الإجمالي: ${stats.totalPoints} نقطة`,
              `+${sessionPoints} pts gagnés · Total : ${stats.totalPoints} pts`,
              `+${sessionPoints} pts earned · Total: ${stats.totalPoints} pts`
            )}
          </div>
        </div>

        {/* Breakdown by Level if Progressive */}
        {playPath === 'progressive' && (
          <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-200 dark:border-slate-800 text-center">
            {(['beginner', 'intermediate', 'expert'] as QuizLevel[]).map((lvl) => (
              <div key={lvl} className="rounded-xl bg-slate-50 dark:bg-slate-950 p-3 border border-slate-200 dark:border-slate-800">
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  {getLocalizedQuizLevelMeta(lvl, QUIZ_LEVEL_META[lvl], lang).label}
                </div>
                <div className="font-mono-num text-base font-bold text-slate-900 dark:text-white mt-0.5" dir="ltr">
                  {levelBreakdown[lvl].right} / {levelBreakdown[lvl].total}
                </div>
              </div>
            ))}
          </div>
        )}

        <p className="text-sm sm:text-base text-center text-slate-700 dark:text-slate-300 leading-relaxed">
          {pct >= 80
            ? pick(
                'أداء ممتاز! تقدّمك يرفع تصنيفك ويفتح تحديات الخبراء.',
                'Excellente performance ! Votre score fait monter votre rang et débloque le niveau Expert.',
                'Outstanding work! Your progress boosts your rank and unlocks expert challenges.'
              )
            : pct >= 50
            ? pick(
                'نتيجة جيدة جداً! تم إثبات نقاطك، ويمكنك إعادة المحاولة أو استكشاف العناصر في الدليل لرفع الدقة.',
                'Très bon résultat ! Vos points sont enregistrés ; vous pouvez réessayer ou revoir le guide.',
                'Solid result! Your points are saved—retry or review the component guide to push accuracy higher.'
              )
            : pick(
                'تحتاج إلى مراجعة بسيطة لخصائص العناصر وطرق القياس في الدليل، ثم حاول مجدداً لكسب نقاط أعلى.',
                'Une rapide révision du guide et des mesures au multimètre vous aidera à scorer plus haut.',
                'Review component properties and multimeter testing steps in the guide, then try again!'
              )}
        </p>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            onClick={() => startQuiz(playPath)}
            className="flex-1 inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl bg-sky-600 px-5 py-3 text-sm font-semibold text-white hover:bg-sky-700 transition-colors"
          >
            <RotateCcw className="h-4 w-4" />
            <span>{pick('إعادة نفس الاختبار', 'Recommencer ce quiz', 'Retry This Quiz')}</span>
          </button>
          <button
            type="button"
            onClick={() => setMode('menu')}
            className="flex-1 inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-5 py-3 text-sm font-semibold text-slate-800 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
          >
            <span>{pick('لوحة المستويات والنقاط', 'Niveaux & Classement', 'Levels & Ranks')}</span>
          </button>
        </div>
      </div>
    );
  }

  // ======================================
  // VIEW 3: ACTIVE QUESTION VIEW
  // ======================================
  if (!currentQ) return null;
  const levelMeta = getLocalizedQuizLevelMeta(currentQ.level, QUIZ_LEVEL_META[currentQ.level], lang);
  const locQ = getLocalizedQuizQuestion(currentQ, lang);

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      {/* Top Status Strip */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => setMode('menu')}
          className="min-h-[40px] text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
        >
          {isRtl ? '← العودة للمستويات' : '← ' + pick('العودة للمستويات', 'Retour aux niveaux', 'Back to Levels')}
        </button>

        <div className="flex items-center gap-4 text-xs font-bold">
          {streak >= 2 && (
            <span className="inline-flex items-center gap-1 text-amber-600 dark:text-amber-400 font-mono-num">
              <Flame className="h-4 w-4" />
              <span>{pick(`سلسلة ×${streak}`, `Série ×${streak}`, `Streak ×${streak}`)}</span>
            </span>
          )}
          <span className="font-mono-num text-sky-600 dark:text-sky-400" dir="ltr">
            +{sessionPoints} pts
          </span>
          <span className="font-mono-num text-slate-700 dark:text-slate-300" dir="ltr">
            {currentIdx + 1} / {deck.length}
          </span>
        </div>
      </div>

      {/* Progress Track */}
      <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
        <div
          className="h-full bg-sky-600 transition-all duration-200"
          style={{ width: `${((currentIdx + (isAnswered ? 1 : 0)) / deck.length) * 100}%` }}
        />
      </div>

      {/* Question Card */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-6 space-y-5">
        {/* Clean Unboxed Metadata */}
        <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
          <span>{pick('المستوى:', 'Niveau :', 'Level:')} {levelMeta.label}</span>
          <span className="mx-1.5" aria-hidden="true">·</span>
          <span>{locQ.topic}</span>
          <span className="mx-1.5" aria-hidden="true">·</span>
          <span className="font-mono-num">{currentQ.points} {pick('نقطة', 'pts', 'pts')}</span>
        </div>

        <h3 className="text-base sm:text-lg font-bold leading-relaxed text-slate-900 dark:text-white">
          {locQ.question}
        </h3>

        <div className="space-y-2.5">
          {locQ.options.map((opt, idx) => {
            const isPicked = selectedOption === idx;
            const isRight = idx === currentQ.correctIndex;

            let btnStyle =
              'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800';
            if (isAnswered) {
              if (isRight) {
                btnStyle =
                  'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-950 dark:text-emerald-100 font-semibold';
              } else if (isPicked) {
                btnStyle =
                  'border-rose-500 bg-rose-50 dark:bg-rose-950/60 text-rose-950 dark:text-rose-100';
              } else {
                btnStyle =
                  'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 text-slate-400 dark:text-slate-500';
              }
            }

            return (
              <button
                key={idx}
                type="button"
                disabled={isAnswered}
                onClick={() => handleSelect(idx)}
                className={`flex min-h-[48px] w-full items-center justify-between gap-3 rounded-xl border px-4 py-3 text-start text-sm transition-colors ${btnStyle}`}
              >
                <span className="leading-relaxed">{opt}</span>
                {isAnswered && isRight && (
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600 dark:text-emerald-400" />
                )}
                {isAnswered && isPicked && !isRight && (
                  <XCircle className="h-5 w-5 shrink-0 text-rose-600 dark:text-rose-400" />
                )}
              </button>
            );
          })}
        </div>

        {isAnswered && (
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-4">
            <div className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
              <span className={`font-bold ${isCorrect ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                {isCorrect
                  ? pick(
                      `إجابة صحيحة (+${lastAwarded?.base ?? 0}${
                        lastAwarded && lastAwarded.bonus > 0 ? ` و+${lastAwarded.bonus} مكافأة سلسلة` : ''
                      } نقطة) — `,
                      `Bonne réponse (+${lastAwarded?.base ?? 0}${
                        lastAwarded && lastAwarded.bonus > 0 ? ` et +${lastAwarded.bonus} bonus série` : ''
                      } pts) — `,
                      `Correct (+${lastAwarded?.base ?? 0}${
                        lastAwarded && lastAwarded.bonus > 0 ? ` & +${lastAwarded.bonus} streak bonus` : ''
                      } pts) — `
                    )
                  : pick('إجابة غير دقيقة — ', 'Réponse incorrecte — ', 'Incorrect — ')}
              </span>
              {locQ.explanation}
            </div>
            <button
              type="button"
              onClick={handleNext}
              className="w-full min-h-[48px] rounded-xl bg-sky-600 py-3 text-sm font-semibold text-white hover:bg-sky-700 transition-colors"
            >
              {currentIdx + 1 >= deck.length
                ? pick('عرض ملخص الجولة والنقاط', 'Voir le résumé et le score', 'View Session Summary')
                : pick('السؤال التالي', 'Question suivante', 'Next Question')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
