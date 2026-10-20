import { useMemo, useState } from 'react';
import { useLanguage } from '../../context/LanguageContext.jsx';
import { useScreenScroll } from '../../context/ScreenScrollContext.jsx';
import ScreenPanel from '../../components/ScreenPanel.jsx';
import { getProjects } from './components/Data.jsx';
import ProjectCard from './components/ProjectCard.jsx';
import Reveal from '../../components/motion/Reveal.jsx';

const ProjectCatalog = () => {
  const { language, locales } = useLanguage();
  const { goToPanel } = useScreenScroll();
  const copy = locales[language].projectCatalog;
  const projects = getProjects(locales, language);
  const [category, setCategory] = useState('all');
  const categories = [
    ['all', copy.all], ['professional', copy.professional], ['own', copy.own],
    ['operations', copy.operations], ['complementary', copy.complementary],
  ];
  const visibleProjects = useMemo(() => category === 'all' ? projects : projects.filter((project) => project.category === category), [category, projects]);

  const chooseCategory = (value) => {
    setCategory(value);
    window.requestAnimationFrame(() => goToPanel('projects-catalog', { behavior: 'auto' }));
  };

  const renderFilters = (label = copy.title) => (
    <div className="flex flex-wrap justify-center gap-2" role="group" aria-label={label}>
      {categories.map(([value, text]) => (
        <button key={value} type="button" onClick={() => chooseCategory(value)} aria-pressed={category === value}
          className={`rounded-full border px-3 py-2 text-xs font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-300 sm:px-4 sm:text-sm ${category === value ? 'border-brand-600 bg-brand-600 text-white' : 'border-neutral-200 bg-white/80 text-neutral-700 hover:border-brand-300 dark:border-slate-700 dark:bg-slate-900/70 dark:text-neutral-200'}`}>
          {text}
        </button>
      ))}
    </div>
  );

  return (
    <ScreenPanel
      id="projects-catalog"
      titleId="catalog-title"
      first
      aliases={['projects-intro', ...Array.from({ length: 11 }, (_, index) => `projects-page-${index + 1}`)]}
    >
      <section className="px-4 py-6 sm:px-6 lg:px-12 lg:py-3">
        <div className="mx-auto max-w-7xl">
          <Reveal as="header" className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-600 dark:text-brand-200">{copy.kicker}</p>
            <h1 id="catalog-title" className="mt-3 text-3xl font-semibold text-neutral-900 dark:text-white sm:text-4xl">{copy.title}</h1>
            <p className="mt-4 text-sm leading-relaxed text-neutral-600 dark:text-neutral-300 sm:text-base">{copy.description}</p>
          </Reveal>
          <div className="mt-5">{renderFilters()}</div>
          {visibleProjects.length ? (
            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {visibleProjects.map((project, index) => <ProjectCard key={project.id} project={project} language={language} copy={copy} index={index} />)}
            </div>
          ) : (
            <Reveal role="status" className="mx-auto mt-5 max-w-3xl rounded-2xl border border-neutral-200 bg-white/80 p-6 text-center text-neutral-600 dark:border-slate-700 dark:bg-slate-900/70 dark:text-neutral-300">
              {copy.empty}
            </Reveal>
          )}
        </div>
      </section>
    </ScreenPanel>
  );
};

export default ProjectCatalog;
