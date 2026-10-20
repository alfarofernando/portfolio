import { useLanguage } from '../../../context/LanguageContext.jsx';
import Reveal from '../../../components/motion/Reveal.jsx';
import skills from '../../../../content/skills.json';

const TechnologyCards = () => {
  const { language } = useLanguage();

  return (
    <div className="grid gap-3 md:grid-cols-3">
      {skills.map((group, index) => {
        const isProfessional = group.experience === 'professional';

        return (
          <Reveal
            key={group.id}
            as="section"
            delay={index * 0.09}
            aria-label={group.copy[language].label}
            className={`rounded-2xl border p-3.5 shadow-sm sm:p-4 ${isProfessional
              ? 'border-brand-200/80 bg-brand-50/70 dark:border-brand-500/25 dark:bg-brand-500/[0.06]'
              : 'border-neutral-200 bg-white/70 dark:border-slate-700 dark:bg-slate-800/50'}`}
          >
            <h3 className="text-xs font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400 sm:text-sm">
              {group.copy[language].label}
            </h3>
            <ul className="mt-3 grid grid-cols-2 gap-1.5">
              {group.technologies.map((technology) => (
                <li
                  key={technology}
                  className={`flex min-h-9 items-center rounded-lg border px-2 py-1.5 text-sm font-medium leading-tight ${isProfessional
                    ? 'border-brand-200/70 bg-white/80 text-brand-800 dark:border-brand-400/20 dark:bg-slate-900/70 dark:text-brand-100'
                    : 'border-neutral-200 bg-white/75 text-neutral-700 dark:border-slate-700 dark:bg-slate-900/60 dark:text-neutral-200'}`}
                >
                  {technology}
                </li>
              ))}
            </ul>
          </Reveal>
        );
      })}
    </div>
  );
};

export default TechnologyCards;
