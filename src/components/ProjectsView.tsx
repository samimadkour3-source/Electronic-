import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, CheckCircle2, Cpu, ExternalLink, Lightbulb, Wrench } from 'lucide-react';
import { ELECTRONIC_PROJECTS, ElectronicProject } from '../data/projectsData';
import { ComponentImage } from './ComponentImage';
import { ProjectSchematic } from './ProjectSchematic';
import { useLanguage } from '../i18n/LanguageContext';
import { getLocalizedProject } from '../i18n/dataTranslations';

interface ProjectsViewProps {
  onOpenComponentById: (componentId: string) => void;
  onOpenCircuitSimulator: () => void;
}

export const ProjectsView: React.FC<ProjectsViewProps> = ({
  onOpenComponentById,
  onOpenCircuitSimulator,
}) => {
  const { lang, isRtl, pick } = useLanguage();
  const [selectedProject, setSelectedProject] = useState<ElectronicProject | null>(null);

  if (selectedProject) {
    const loc = getLocalizedProject(selectedProject, lang);
    return (
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => setSelectedProject(null)}
            className="inline-flex min-h-[44px] items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            {isRtl ? <ArrowRight className="h-4 w-4" /> : <ArrowLeft className="h-4 w-4" />}
            <span>{pick('العودة لكل المشاريع', 'Retour aux projets', 'Back to all projects')}</span>
          </button>

          <button
            type="button"
            onClick={onOpenCircuitSimulator}
            className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-sky-600 px-4 py-2 text-xs font-semibold text-white hover:bg-sky-700 transition-colors"
          >
            <span>{pick('جرّب المحاكاة في محاكي الدوائر', 'Tester dans le simulateur', 'Try in Circuit Simulator')}</span>
            <ExternalLink className="h-4 w-4" />
          </button>
        </div>

        {/* Project Hero Split: Breadboard Photo + Schematic */}
        <section className="grid grid-cols-1 gap-6 lg:grid-cols-12 items-stretch pb-6 border-b border-slate-200 dark:border-slate-800">
          <div className="lg:col-span-6 overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 aspect-[4/3]">
            <ComponentImage
              src={selectedProject.imageUrl}
              alt={loc.title}
              componentId="ic_chip"
              className="h-full w-full object-cover"
            />
          </div>

          <div className="lg:col-span-6 flex flex-col justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
                <span>{pick('المستوى:', 'Niveau :', 'Level:')} {loc.level}</span>
                <span aria-hidden="true">·</span>
                <span className="font-mono-num" dir="ltr">{selectedProject.voltageAr}</span>
              </div>
              <h2 className="mt-2 text-2xl font-extrabold text-slate-900 dark:text-white">
                {loc.title}
              </h2>
              {lang !== 'en' && (
                <p className="mt-1 text-xs font-mono text-slate-500" dir="ltr">
                  {selectedProject.titleEn}
                </p>
              )}
              <p className="mt-3 text-sm sm:text-base leading-relaxed text-slate-700 dark:text-slate-300">
                {loc.summary}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4">
              <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2">
                {pick('مخطط الدائرة الهندسي (Schematic Diagram)', 'Schéma de principe (Schematic)', 'Circuit Schematic Diagram')}
              </div>
              <div className="rounded-xl bg-slate-50 dark:bg-slate-950 p-2 text-slate-900 dark:text-slate-100">
                <ProjectSchematic projectId={selectedProject.id} className="w-full h-44 sm:h-48" />
              </div>
            </div>
          </div>
        </section>

        {/* How the Whole Circuit Works */}
        <section className="pb-6 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2 text-sky-600 dark:text-sky-400 text-sm font-bold mb-2">
            <Lightbulb className="h-4 w-4" />
            <h3>{pick('01. كيف تعمل الدائرة ككل؟', '01. Comment fonctionne le circuit ?', '01. How the Full Circuit Works')}</h3>
          </div>
          <p className="text-sm sm:text-base leading-relaxed text-slate-700 dark:text-slate-300">
            {loc.howCircuitWorks}
          </p>
        </section>

        {/* Required Components & Role of Each Component */}
        <section className="pb-6 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2 text-sky-600 dark:text-sky-400 text-sm font-bold mb-4">
            <Cpu className="h-4 w-4" />
            <h3>{pick('02. المكونات المطلوبة ودور كل عنصر في المشروع', '02. Composants requis et rôle de chacun', '02. Required Parts & Component Roles')}</h3>
          </div>

          <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 divide-y divide-slate-200 dark:divide-slate-800">
            {loc.parts.map((part, idx) => (
              <div key={idx} className="grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-4 p-4 items-center">
                <div className="sm:col-span-4">
                  <div className="flex items-center gap-2">
                    <span className="font-mono-num text-xs font-bold text-sky-600 dark:text-sky-400">
                      {part.qty}
                    </span>
                    <span className="text-sm font-bold text-slate-900 dark:text-white">
                      {part.name}
                    </span>
                  </div>
                  <div className="mt-0.5 text-xs font-mono text-slate-500 dark:text-slate-400" dir="ltr">
                    {part.spec}
                  </div>
                </div>

                <div className="sm:col-span-6 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  {part.role}
                </div>

                <div className="sm:col-span-2 flex sm:justify-end">
                  {part.componentRefId && (
                    <button
                      type="button"
                      onClick={() => onOpenComponentById(part.componentRefId!)}
                      className="min-h-[38px] text-xs font-semibold text-sky-600 dark:text-sky-400 hover:underline whitespace-nowrap"
                    >
                      {pick('شرح العنصر وقياسه ←', 'Voir fiche & test →', 'Guide & test →')}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Assembly Steps */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-sky-600 dark:text-sky-400 text-sm font-bold">
            <Wrench className="h-4 w-4" />
            <h3>{pick('03. خطوات التجميع العملية على لوحة التجارب', '03. Étapes de montage sur platine d’essai', '03. Breadboard Assembly Steps')}</h3>
          </div>

          <ol className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {loc.assemblySteps.map((step, i) => (
              <li
                key={i}
                className="flex items-start gap-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 text-sm leading-relaxed text-slate-700 dark:text-slate-300"
              >
                <span className="font-mono-num flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white">
                  {i + 1}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>

          <div className="flex items-start gap-3 rounded-2xl border border-emerald-200 dark:border-emerald-900 bg-emerald-50/70 dark:bg-emerald-950/40 p-4 text-sm text-emerald-950 dark:text-emerald-100">
            <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600 dark:text-emerald-400 mt-0.5" />
            <div>
              <span className="font-bold">{pick('نصيحة المعايرة والتشغيل: ', 'Conseil de mise au point : ', 'Tuning & Troubleshooting Tip: ')}</span>
              <span>{loc.troubleshootingTip}</span>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
          {pick('مشاريع إلكترونية تطبيقية خطوة بخطوة', 'Projets électroniques pratiques étape par étape', 'Step-by-Step Practical Electronics Projects')}
        </h2>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
          {pick(
            'تعلّم كيف تتكامل العناصر معاً عبر مشاريع عملية مع صور التجميع على لوحة التجارب والمخطط الهندسي وشرح دور كل قطعة.',
            'Apprenez comment les composants fonctionnent ensemble grâce à des montages sur breadboard avec schéma et rôle détaillé de chaque pièce.',
            'Learn how components work together through hands-on breadboard builds, circuit schematics, and part-by-part explanations.'
          )}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {ELECTRONIC_PROJECTS.map((project) => {
          const loc = getLocalizedProject(project, lang);
          return (
            <button
              key={project.id}
              type="button"
              onClick={() => setSelectedProject(project)}
              className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-start transition-transform hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-sky-600"
            >
              <div className="aspect-[4/3] w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                <ComponentImage
                  src={project.imageUrl}
                  alt={loc.title}
                  componentId="ic_chip"
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                />
              </div>
              <div className="flex flex-1 flex-col justify-between p-5">
                <div>
                  <div className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
                    <span>{loc.level}</span>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono-num" dir="ltr">{project.voltageAr}</span>
                    <span aria-hidden="true">·</span>
                    <span>{project.parts.length} {pick('مكونات', 'composants', 'parts')}</span>
                  </div>
                  <h3 className="mt-2 text-lg font-bold text-slate-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                    {loc.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-slate-600 dark:text-slate-400 line-clamp-2">
                    {loc.summary}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-sky-600 dark:text-sky-400">
                  <span>{pick('عرض المخطط وخطوات التجميع', 'Voir schéma & montage', 'View schematic & assembly')}</span>
                  <span>{isRtl ? '←' : '→'}</span>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
