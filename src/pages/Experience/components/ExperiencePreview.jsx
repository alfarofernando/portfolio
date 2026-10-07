import { Link } from 'react-router-dom';
import { useLanguage } from '../../../context/LanguageContext.jsx';
import profile from '../../../../content/profile.json';

const ExperiencePreview = () => {
  const { language, locales } = useLanguage();
  const copy = locales[language].experiencePage;
  const employment = profile.copy[language].employment;

  return (
    <section className="px-4 py-8 sm:px-6 lg:px-12">
      <div className="mx-auto flex max-w-6xl flex-col gap-5 rounded-3xl border border-brand-100 bg-white/85 p-6 shadow-md dark:border-brand-500/20 dark:bg-slate-900/70 md:flex-row md:items-center md:justify-between md:p-8">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-600 dark:text-brand-200">{employment.period}</p>
          <h2 className="mt-2 text-2xl font-semibold text-neutral-900 dark:text-white">{employment.company}</h2>
          <p className="mt-2 text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">{copy.description}</p>
        </div>
        <Link to="/portfolio/Experience" className="inline-flex shrink-0 items-center justify-center rounded-xl bg-brand-600 px-5 py-3 text-sm font-semibold text-white hover:bg-brand-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-300">{copy.title}<span className="ml-2" aria-hidden="true">→</span></Link>
      </div>
    </section>
  );
};

export default ExperiencePreview;
