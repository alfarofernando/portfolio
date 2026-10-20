import { useLanguage } from '../../../context/LanguageContext.jsx';
import Reveal from '../../../components/motion/Reveal.jsx';
import skills from '../../../../content/skills.json';

const TechnologyCards = () => {
  const { language, locales } = useLanguage();
  const copy = locales[language].technologyPanel;
  const experienceLevels = {
    professional: {
      label: copy.legend.professional,
      color: 'bg-brand-500',
      chip: 'border-brand-200/70 bg-brand-50/70 text-brand-800 dark:border-brand-400/20 dark:bg-brand-500/10 dark:text-brand-100',
    },
    applied: {
      label: copy.legend.applied,
      color: 'bg-cyan-500',
      chip: 'border-cyan-200/80 bg-cyan-50/70 text-cyan-900 dark:border-cyan-400/20 dark:bg-cyan-500/10 dark:text-cyan-100',
    },
    complementary: {
      label: copy.legend.complementary,
      color: 'bg-slate-400',
      chip: 'border-neutral-200 bg-white/75 text-neutral-700 dark:border-slate-700 dark:bg-slate-900/60 dark:text-neutral-200',
    },
  };

  return (
    <div className="space-y-5">
      <ul aria-label={copy.experienceLegend} className="flex flex-wrap justify-center gap-3 text-xs font-medium text-neutral-600 dark:text-neutral-300">
        {Object.entries(experienceLevels).map(([level, details]) => (
          <li key={level} className="inline-flex items-center gap-2">
            <span aria-hidden="true" className={`h-2.5 w-2.5 rounded-full ${details.color}`} />
            {details.label}
          </li>
        ))}
      </ul>
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {skills.map((group, index) => (
          <Reveal
            key={group.id}
            as="section"
            delay={index * 0.07}
            aria-label={group.copy[language].label}
            className="rounded-2xl border border-neutral-200 bg-white/80 p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800/50"
          >
            <div>
              <h3 className="text-base font-semibold text-neutral-900 dark:text-white">
                {group.copy[language].label}
              </h3>
              <p className="mt-1 text-xs leading-relaxed text-neutral-600 dark:text-neutral-300">
                {group.copy[language].description}
              </p>
            </div>
            <ul className="mt-4 flex flex-wrap gap-2" aria-label={group.copy[language].label}>
              {group.technologies.map((technology) => {
                const level = experienceLevels[technology.experience];

                return (
                  <li
                    key={technology.name}
                    aria-label={`${technology.name}: ${level.label}`}
                    title={level.label}
                    className={`inline-flex min-h-9 items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-medium leading-tight ${level.chip}`}
                  >
                    <span aria-hidden="true" className={`h-2 w-2 shrink-0 rounded-full ${level.color}`} />
                    {technology.name}
                  </li>
                );
              })}
            </ul>
          </Reveal>
        ))}
      </div>
    </div>
  );
};

export default TechnologyCards;
