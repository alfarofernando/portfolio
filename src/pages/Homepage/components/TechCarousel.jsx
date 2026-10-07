import { useLanguage } from '../../../context/LanguageContext.jsx';
import skills from '../../../../content/skills.json';

const TechCarousel = () => {
  const { language } = useLanguage();

  return (
    <div className="space-y-4">
      {skills.map((group) => (
        <section key={group.id} aria-label={group.copy[language].label}>
          <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400">{group.copy[language].label}</h3>
          <ul className="flex flex-wrap gap-2">
            {group.technologies.map((technology) => (
              <li key={technology} className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${group.experience === 'professional' ? 'border-brand-200 bg-brand-50 text-brand-700 dark:border-brand-500/30 dark:bg-brand-500/10 dark:text-brand-200' : 'border-neutral-200 bg-white/75 text-neutral-600 dark:border-slate-700 dark:bg-slate-800/70 dark:text-neutral-200'}`}>{technology}</li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
};

export default TechCarousel;
