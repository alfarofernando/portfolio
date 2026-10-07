import { useNavigate } from 'react-router-dom';
import ProjectMedia from '../../../components/ProjectMedia.jsx';

/* eslint-disable react/prop-types -- Card data comes from the shared checked-in catalog. */
const ProjectCard = ({ project, language, copy, index = 0 }) => {
  const navigate = useNavigate();
  const category = copy[project.category] ?? copy.complementary;

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-3xl border border-brand-100/70 bg-white/90 p-5 shadow-lg backdrop-blur dark:border-brand-500/20 dark:bg-slate-900/80">
      <ProjectMedia media={project.heroMedia} title={project.title} language={language} compact />
      <div className="mt-5 flex flex-1 flex-col gap-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">{project.title}</h3>
            <span className="mt-2 inline-flex rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700 dark:bg-brand-500/10 dark:text-brand-200">{category}</span>
          </div>
          {project.featured && <span className="rounded-full bg-accent-500/10 px-3 py-1 text-xs font-semibold text-accent-700 dark:text-accent-300">{copy.featured}</span>}
        </div>
        <p className="text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">{project.description}</p>
        <div className="flex flex-wrap gap-2">
          {project.technologies.slice(0, 5).map((technology) => (
            <span key={technology} className="rounded-full border border-neutral-200 bg-white/80 px-2.5 py-1 text-xs text-neutral-600 dark:border-slate-700 dark:bg-slate-800/70 dark:text-neutral-200">{technology}</span>
          ))}
          {project.technologies.length > 5 && <span className="rounded-full border border-neutral-200 px-2.5 py-1 text-xs text-neutral-500 dark:border-slate-700 dark:text-neutral-300">+{project.technologies.length - 5}</span>}
        </div>
        <div className="mt-auto flex flex-wrap gap-3 pt-2">
          <button
            type="button"
            onClick={() => { navigate(`/portfolio/Projects/${project.slug}`); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            aria-label={`${copy.view}: ${project.title}`}
            className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-300"
          >{copy.view}<span aria-hidden="true">→</span></button>
          {project.links.find((item) => item.type === 'repository') && (
            <a href={project.links.find((item) => item.type === 'repository').url} target="_blank" rel="noreferrer" className="inline-flex items-center rounded-xl border border-brand-200 px-4 py-2.5 text-sm font-semibold text-brand-700 hover:bg-brand-50 dark:border-brand-500/30 dark:text-brand-200 dark:hover:bg-brand-500/10">{copy.repositoryLink}</a>
          )}
        </div>
      </div>
      <span className="sr-only">{index + 1}</span>
    </article>
  );
};

export default ProjectCard;
