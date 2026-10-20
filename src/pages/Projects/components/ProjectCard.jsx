import { Link } from 'react-router-dom';
import ProjectMedia from '../../../components/ProjectMedia.jsx';
import Reveal from '../../../components/motion/Reveal.jsx';

/* eslint-disable react/prop-types -- Card data comes from the shared checked-in catalog. */
const ProjectCard = ({ project, language, copy, index = 0 }) => {
  const category = copy[project.category] ?? copy.complementary;

  return (
    <Reveal as="article" delay={Math.min(index * 0.09, 0.27)} className="group flex h-full flex-col overflow-hidden rounded-2xl border border-brand-100/70 bg-white/90 p-2.5 shadow-md backdrop-blur transition duration-200 hover:-translate-y-0.5 hover:shadow-brand dark:border-brand-500/20 dark:bg-slate-900/80 sm:p-3">
      <ProjectMedia media={project.heroMedia} title={project.title} language={language} compact />
      <div className="mt-2 flex flex-1 flex-col gap-2">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-base font-semibold text-neutral-900 dark:text-white">{project.title}</h3>
            <span className="mt-1 inline-flex rounded-full bg-brand-50 px-2.5 py-0.5 text-[11px] font-semibold text-brand-700 dark:bg-brand-500/10 dark:text-brand-200">{category}</span>
          </div>
          {project.featured && <span className="shrink-0 rounded-full bg-accent-500/10 px-2.5 py-1 text-[11px] font-semibold text-accent-700 dark:text-accent-300">{copy.featured}</span>}
        </div>
        <p className="text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">{project.description}</p>
        <div className="flex flex-wrap gap-1.5">
          {project.technologies.slice(0, 5).map((technology) => (
            <span key={technology} className="rounded-full border border-neutral-200 bg-white/80 px-2 py-0.5 text-[11px] text-neutral-600 dark:border-slate-700 dark:bg-slate-800/70 dark:text-neutral-200">{technology}</span>
          ))}
          {project.technologies.length > 5 && <span className="rounded-full border border-neutral-200 px-2 py-0.5 text-[11px] text-neutral-500 dark:border-slate-700 dark:text-neutral-300">+{project.technologies.length - 5}</span>}
        </div>
        <div className="mt-auto flex flex-wrap gap-2 pt-1">
          <Link
            to={`/portfolio/Projects/${project.slug}`}
            aria-label={`${copy.view}: ${project.title}`}
            className="inline-flex items-center gap-1.5 rounded-lg bg-brand-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-brand-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-300"
          >{copy.view}<span aria-hidden="true">→</span></Link>
          {project.links.find((item) => item.type === 'repository') && (
            <a href={project.links.find((item) => item.type === 'repository').url} target="_blank" rel="noreferrer" className="inline-flex items-center rounded-lg border border-brand-200 px-3 py-2 text-sm font-semibold text-brand-700 hover:bg-brand-50 dark:border-brand-500/30 dark:text-brand-200 dark:hover:bg-brand-500/10">{copy.repositoryLink}</a>
          )}
        </div>
      </div>
      <span className="sr-only">{index + 1}</span>
    </Reveal>
  );
};

export default ProjectCard;
