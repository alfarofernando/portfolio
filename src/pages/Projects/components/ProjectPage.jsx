import { Link, useParams } from 'react-router-dom';
import { useLanguage } from '../../../context/LanguageContext.jsx';
import { getProjects, resolveProjectKey } from './Data.jsx';
import { projectCatalog } from '../../../data/projectModel.js';
import ProjectMedia from '../../../components/ProjectMedia.jsx';
import ProjectGallery from './ProjectGallery.jsx';

const ProjectPage = () => {
  const { language, locales } = useLanguage();
  const { slug } = useParams();
  const copy = locales[language].projectPage;
  const projectId = resolveProjectKey(projectCatalog, slug);
  const project = getProjects(locales, language).find((item) => item.id === projectId);

  if (!project) {
    return (
      <div className="flex min-h-[55vh] items-center justify-center px-4 py-20 text-center">
        <div className="max-w-md rounded-3xl border border-brand-100 bg-white/90 p-10 text-neutral-700 shadow-lg dark:border-brand-500/20 dark:bg-slate-900/80 dark:text-neutral-200">
          <p className="text-2xl font-semibold">{copy.notFoundTitle}</p>
          <Link to="/portfolio/Projects/all" className="mt-6 inline-flex rounded-xl bg-brand-600 px-5 py-3 text-sm font-semibold text-white hover:bg-brand-700">{copy.notFoundAction}</Link>
        </div>
      </div>
    );
  }

  const externalLinks = project.links.filter((item) => ['official', 'demo', 'repository'].includes(item.type));
  const linkLabels = { official: copy.officialLink, demo: copy.demoLink, repository: copy.repositoryButton };

  return (
    <section className="px-4 pb-24 pt-8 sm:px-6 lg:px-12">
      <div className="mx-auto max-w-5xl space-y-7">
        <article className="rounded-3xl border border-brand-100/70 bg-white/95 p-6 shadow-xl dark:border-brand-500/20 dark:bg-slate-900/85 sm:p-9">
          <Link to="/portfolio/Projects/all" className="inline-flex items-center gap-2 rounded-full border border-neutral-200 px-3 py-2 text-xs font-semibold text-neutral-600 hover:border-brand-300 dark:border-slate-700 dark:text-neutral-200">← {copy.catalogLabel}</Link>
          <div className="mt-7 grid gap-7 md:grid-cols-[minmax(0,0.85fr),minmax(0,1.15fr)] md:items-center">
            <ProjectMedia media={project.heroMedia} title={project.title} language={language} eager />
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-600 dark:text-brand-200">{locales[language].projectCatalog[project.category]}</p>
              <h1 className="mt-3 text-3xl font-semibold text-neutral-900 dark:text-white sm:text-4xl">{project.title}</h1>
              <p className="mt-4 leading-relaxed text-neutral-600 dark:text-neutral-300">{project.description}</p>
              <div className="mt-5 flex flex-wrap gap-2">
                {project.technologies.map((technology) => <span key={technology} className="rounded-full border border-brand-100 bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700 dark:border-brand-500/30 dark:bg-brand-500/10 dark:text-brand-200">{technology}</span>)}
              </div>
            </div>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <section className="rounded-2xl border border-neutral-200 bg-white/75 p-5 dark:border-slate-700 dark:bg-slate-950/40">
              <h2 className="text-xs font-semibold uppercase tracking-wide text-brand-600 dark:text-brand-200">{copy.contextLabel}</h2>
              <p className="mt-2 text-sm leading-relaxed text-neutral-700 dark:text-neutral-200">{project.context}</p>
            </section>
            <section className="rounded-2xl border border-neutral-200 bg-white/75 p-5 dark:border-slate-700 dark:bg-slate-950/40">
              <h2 className="text-xs font-semibold uppercase tracking-wide text-brand-600 dark:text-brand-200">{copy.roleLabel}</h2>
              <p className="mt-2 text-sm leading-relaxed text-neutral-700 dark:text-neutral-200">{project.role}</p>
            </section>
          </div>

          <div className="mt-5 grid gap-5 md:grid-cols-2">
            <section className="rounded-2xl border border-neutral-200 p-5 dark:border-slate-700">
              <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">{copy.contributionsLabel}</h2>
              <ul className="mt-4 space-y-3">{project.contributions.map((item) => <li key={item} className="flex gap-3 text-sm leading-relaxed text-neutral-700 dark:text-neutral-200"><span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-brand-500" />{item}</li>)}</ul>
            </section>
            <section className="rounded-2xl border border-neutral-200 p-5 dark:border-slate-700">
              <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">{copy.outcomesLabel}</h2>
              <ul className="mt-4 space-y-3">{project.outcomes.map((item) => <li key={item} className="flex gap-3 text-sm leading-relaxed text-neutral-700 dark:text-neutral-200"><span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-accent-500" />{item}</li>)}</ul>
            </section>
          </div>
        </article>

        {project.screenshots.length > 0 && (
          <div className="rounded-3xl border border-neutral-200/80 bg-white/90 p-4 shadow-lg dark:border-slate-700 dark:bg-slate-900/80 sm:p-6">
            <ProjectGallery items={project.screenshots} projectTitle={project.title} copy={copy} />
          </div>
        )}

        {externalLinks.length > 0 && (
          <nav aria-label={project.title} className="flex flex-wrap gap-3 rounded-3xl border border-brand-100/70 bg-white/90 p-5 shadow-md dark:border-brand-500/20 dark:bg-slate-900/80">
            {externalLinks.map((item) => <a key={`${item.type}-${item.url}`} href={item.url} target="_blank" rel="noreferrer" className="rounded-xl border border-brand-200 px-4 py-2.5 text-sm font-semibold text-brand-700 hover:bg-brand-50 dark:border-brand-500/30 dark:text-brand-200 dark:hover:bg-brand-500/10">{linkLabels[item.type]} ↗</a>)}
          </nav>
        )}
      </div>
    </section>
  );
};

export default ProjectPage;
