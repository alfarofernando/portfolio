import { useLanguage } from '../../context/LanguageContext';
import { getProjects } from './components/Data';
import { Link } from 'react-router-dom';
import ProjectCard from './components/ProjectCard.jsx';

const Projects = () => {
  const { language, locales } = useLanguage();
  const projects = getProjects(locales, language).filter((project) => project.featured);
  const copy = locales[language].projectsSection;

  return (
    <section id="Projects" className="px-4 pb-24 pt-12 sm:px-6 sm:pt-16 lg:px-12">
        <div className="mx-auto w-full max-w-7xl">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center justify-center rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-brand-700 dark:bg-brand-500/10 dark:text-brand-200">
              {copy.badge}
            </span>
            <h2 className="mt-4 text-3xl font-semibold text-neutral-900 dark:text-white sm:text-4xl">
              {copy.title}
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-neutral-600 dark:text-neutral-300 sm:text-base">
              {copy.description}
            </p>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {projects.map((project, index) => <ProjectCard key={project.id} project={project} language={language} copy={{ ...locales[language].projectCatalog, ...copy, view: copy.viewDetails }} index={index} />)}
          </div>
          <div className="mt-9 text-center">
            <Link to="/portfolio/Projects/all" className="inline-flex items-center gap-2 rounded-xl border border-brand-300 px-5 py-3 text-sm font-semibold text-brand-700 transition hover:bg-brand-50 dark:border-brand-500/40 dark:text-brand-200 dark:hover:bg-brand-500/10">{copy.catalogLink} <span aria-hidden="true">→</span></Link>
          </div>
        </div>
    </section>
  );
};

export default Projects;
