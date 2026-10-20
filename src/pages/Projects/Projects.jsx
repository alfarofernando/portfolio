import { useEffect, useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { getProjects } from './components/Data';
import { Link } from 'react-router-dom';
import ProjectCard from './components/ProjectCard.jsx';
import ScreenPanel from '../../components/ScreenPanel.jsx';

const getFeaturedGroupSize = () => window.innerWidth >= 1280 ? 3 : 2;
const HOME_FEATURED_PROJECT_IDS = [
  'wise-capital',
  'netegia-n4',
  'barlogow-wareg',
  'ms-gbp',
  'cvgenio',
  'portal-sgu',
];

const Projects = () => {
  const { language, locales } = useLanguage();
  const allProjects = getProjects(locales, language);
  const projects = HOME_FEATURED_PROJECT_IDS
    .map((id) => allProjects.find((project) => project.id === id && project.featured))
    .filter(Boolean);
  const copy = locales[language].projectsSection;

  const [groupSize, setGroupSize] = useState(() => typeof window === 'undefined' ? 3 : getFeaturedGroupSize());

  useEffect(() => {
    const handleResize = () => setGroupSize(getFeaturedGroupSize());
    window.addEventListener('resize', handleResize, { passive: true });
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const groups = Array.from({ length: Math.ceil(projects.length / groupSize) }, (_, index) =>
    projects.slice(index * groupSize, (index + 1) * groupSize),
  );

  return <>{groups.map((group, groupIndex) => (
    <ScreenPanel key={`projects-${groupIndex}`} id={groupIndex === 0 ? 'projects' : `projects-featured-${groupIndex + 1}`} titleId={groupIndex === 0 ? 'projects-title' : `projects-title-${groupIndex + 1}`}>
    <section className="px-4 py-5 sm:px-6 lg:px-12 lg:py-2">
        <div className="mx-auto w-full max-w-7xl">
          {groupIndex === 0 && <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center justify-center rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-brand-700 dark:bg-brand-500/10 dark:text-brand-200">
              {copy.badge}
            </span>
            <h2 id="projects-title" className="mt-3 text-3xl font-semibold text-neutral-900 dark:text-white sm:text-4xl">
              {copy.title}
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-neutral-600 dark:text-neutral-300 sm:text-base">
              {copy.description}
            </p>
          </div>}
          {groupIndex > 0 && <h2 id={`projects-title-${groupIndex + 1}`} className="mb-4 text-lg font-semibold text-neutral-900 dark:text-white">{copy.title} · {groupIndex + 1}/{groups.length}</h2>}

          <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {group.map((project, index) => <ProjectCard key={project.id} project={project} language={language} copy={{ ...locales[language].projectCatalog, ...copy, view: copy.viewDetails }} index={index} />)}
          </div>
          {groupIndex === groups.length - 1 && <div className="mt-5 text-center">
            <Link to="/portfolio/Projects/all" className="inline-flex items-center gap-2 rounded-xl border border-brand-300 px-5 py-3 text-sm font-semibold text-brand-700 transition hover:bg-brand-50 dark:border-brand-500/40 dark:text-brand-200 dark:hover:bg-brand-500/10">{copy.catalogLink} <span aria-hidden="true">→</span></Link>
          </div>}
        </div>
    </section>
    </ScreenPanel>
  ))}</>;
};

export default Projects;
