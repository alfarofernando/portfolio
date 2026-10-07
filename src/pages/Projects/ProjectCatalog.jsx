import { useMemo, useState } from 'react';
import { useLanguage } from '../../context/LanguageContext.jsx';
import { getProjects } from './components/Data.jsx';
import ProjectCard from './components/ProjectCard.jsx';

const ProjectCatalog = () => {
  const { language, locales } = useLanguage();
  const copy = locales[language].projectCatalog;
  const projects = getProjects(locales, language);
  const [category, setCategory] = useState('all');
  const categories = [
    ['all', copy.all], ['professional', copy.professional], ['own', copy.own],
    ['operations', copy.operations], ['complementary', copy.complementary],
  ];
  const visibleProjects = useMemo(() => category === 'all' ? projects : projects.filter((project) => project.category === category), [category, projects]);

  return (
    <section className="px-4 pb-24 pt-8 sm:px-6 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <header className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-600 dark:text-brand-200">{copy.kicker}</p>
          <h1 className="mt-3 text-3xl font-semibold text-neutral-900 dark:text-white sm:text-4xl">{copy.title}</h1>
          <p className="mt-4 text-sm leading-relaxed text-neutral-600 dark:text-neutral-300 sm:text-base">{copy.description}</p>
        </header>

        <div className="mt-8 flex flex-wrap justify-center gap-2" role="group" aria-label={copy.title}>
          {categories.map(([value, label]) => (
            <button key={value} type="button" onClick={() => setCategory(value)} aria-pressed={category === value}
              className={`rounded-full border px-4 py-2 text-sm font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-300 ${category === value ? 'border-brand-600 bg-brand-600 text-white' : 'border-neutral-200 bg-white/80 text-neutral-700 hover:border-brand-300 dark:border-slate-700 dark:bg-slate-900/70 dark:text-neutral-200'}`}>
              {label}
            </button>
          ))}
        </div>

        {visibleProjects.length ? (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {visibleProjects.map((project, index) => <ProjectCard key={project.id} project={project} language={language} copy={copy} index={index} />)}
          </div>
        ) : (
          <p className="mt-10 rounded-2xl border border-neutral-200 bg-white/80 p-8 text-center text-neutral-600 dark:border-slate-700 dark:bg-slate-900/70 dark:text-neutral-300">{copy.empty}</p>
        )}
      </div>
    </section>
  );
};

export default ProjectCatalog;
