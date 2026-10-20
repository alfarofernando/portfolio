import { Link, useParams } from 'react-router-dom';
import { useLanguage } from '../../../context/LanguageContext.jsx';
import { getProjects, resolveProjectKey } from './Data.jsx';
import { projectCatalog } from '../../../data/projectModel.js';
import ProjectMedia from '../../../components/ProjectMedia.jsx';
import ProjectGallery from './ProjectGallery.jsx';
import Reveal from '../../../components/motion/Reveal.jsx';
import ScreenPanel from '../../../components/ScreenPanel.jsx';

const chunk = (items, size) => Array.from({ length: Math.ceil(items.length / size) }, (_, index) => items.slice(index * size, (index + 1) * size));

const ProjectPage = () => {
  const { language, locales } = useLanguage();
  const { slug } = useParams();
  const copy = locales[language].projectPage;
  const projectId = resolveProjectKey(projectCatalog, slug);
  const project = getProjects(locales, language).find((item) => item.id === projectId);

  if (!project) {
    return (
      <ScreenPanel id="project-not-found" titleId="project-not-found-title" first>
        <div className="flex items-center justify-center px-4 py-10 text-center">
          <div className="max-w-md rounded-3xl border border-brand-100 bg-white/90 p-10 text-neutral-700 shadow-lg dark:border-brand-500/20 dark:bg-slate-900/80 dark:text-neutral-200">
            <h1 id="project-not-found-title" className="text-2xl font-semibold">{copy.notFoundTitle}</h1>
            <Link to="/portfolio/Projects/all" className="mt-6 inline-flex rounded-xl bg-brand-600 px-5 py-3 text-sm font-semibold text-white hover:bg-brand-700">{copy.notFoundAction}</Link>
          </div>
        </div>
      </ScreenPanel>
    );
  }

  const externalLinks = project.links.filter((item) => ['official', 'demo', 'repository'].includes(item.type));
  const linkLabels = { official: copy.officialLink, demo: copy.demoLink, repository: copy.repositoryButton };
  const contributionPages = chunk(project.contributions, 4);
  const outcomePages = chunk(project.outcomes, 4);

  return (
    <>
      <ScreenPanel id="project-overview" titleId="project-title" first>
        <section className="px-4 py-5 sm:px-6 lg:px-12 lg:py-1">
          <article className="mx-auto max-w-6xl rounded-3xl border border-brand-100/70 bg-white/95 p-5 shadow-xl dark:border-brand-500/20 dark:bg-slate-900/85 sm:p-7">
            <Link to="/portfolio/Projects/all" className="inline-flex items-center gap-2 rounded-full border border-neutral-200 px-3 py-2 text-xs font-semibold text-neutral-600 hover:border-brand-300 dark:border-slate-700 dark:text-neutral-200">← {copy.catalogLabel}</Link>
            <div className="mt-4 grid gap-5 md:grid-cols-[minmax(0,0.9fr),minmax(0,1.1fr)] md:items-center">
              <ProjectMedia media={project.heroMedia} title={project.title} language={language} eager fit="contain" detail />
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-600 dark:text-brand-200">{locales[language].projectCatalog[project.category]}</p>
                <h1 id="project-title" className="mt-2 text-3xl font-semibold text-neutral-900 dark:text-white sm:text-4xl">{project.title}</h1>
                <p className="mt-3 leading-relaxed text-neutral-600 dark:text-neutral-300">{project.description}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {project.technologies.map((technology) => <span key={technology} className="rounded-full border border-brand-100 bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700 dark:border-brand-500/30 dark:bg-brand-500/10 dark:text-brand-200">{technology}</span>)}
                </div>
              </div>
            </div>
          </article>
        </section>
      </ScreenPanel>

      <ScreenPanel id="project-context" titleId="project-context-title">
        <section className="px-4 py-5 sm:px-6 lg:px-12 lg:py-1">
          <div className="mx-auto grid max-w-5xl gap-4 md:grid-cols-2">
            <Reveal className="rounded-2xl border border-neutral-200 bg-white/75 p-5 dark:border-slate-700 dark:bg-slate-950/40">
              <h2 id="project-context-title" className="text-xs font-semibold uppercase tracking-wide text-brand-600 dark:text-brand-200">{copy.contextLabel}</h2>
              <p className="mt-2 text-sm leading-relaxed text-neutral-700 dark:text-neutral-200">{project.context}</p>
            </Reveal>
            <Reveal delay={0.09} className="rounded-2xl border border-neutral-200 bg-white/75 p-5 dark:border-slate-700 dark:bg-slate-950/40">
              <h2 className="text-xs font-semibold uppercase tracking-wide text-brand-600 dark:text-brand-200">{copy.roleLabel}</h2>
              <p className="mt-2 text-sm leading-relaxed text-neutral-700 dark:text-neutral-200">{project.role}</p>
            </Reveal>
          </div>
        </section>
      </ScreenPanel>

      {contributionPages.map((items, index) => (
        <ScreenPanel key={`project-contributions-${index}`} id={`project-contributions-${index + 1}`} titleId={`project-contributions-title-${index + 1}`}>
          <section className="px-4 py-5 sm:px-6 lg:px-12 lg:py-1">
            <Reveal as="section" className="mx-auto max-w-5xl rounded-3xl border border-neutral-200 bg-white/90 p-6 dark:border-slate-700 dark:bg-slate-900/75 sm:p-8">
              <h2 id={`project-contributions-title-${index + 1}`} className="text-lg font-semibold text-neutral-900 dark:text-white">{copy.contributionsLabel}{contributionPages.length > 1 ? ` · ${index + 1}/${contributionPages.length}` : ''}</h2>
              <ul className="mt-4 space-y-3">{items.map((item) => <li key={item} className="flex gap-3 text-sm leading-relaxed text-neutral-700 dark:text-neutral-200"><span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-brand-500" />{item}</li>)}</ul>
            </Reveal>
          </section>
        </ScreenPanel>
      ))}

      {outcomePages.map((items, index) => (
        <ScreenPanel key={`project-outcomes-${index}`} id={`project-outcomes-${index + 1}`} titleId={`project-outcomes-title-${index + 1}`}>
          <section className="px-4 py-5 sm:px-6 lg:px-12 lg:py-1">
            <Reveal as="section" className="mx-auto max-w-5xl rounded-3xl border border-neutral-200 bg-white/90 p-6 dark:border-slate-700 dark:bg-slate-900/75 sm:p-8">
              <h2 id={`project-outcomes-title-${index + 1}`} className="text-lg font-semibold text-neutral-900 dark:text-white">{copy.outcomesLabel}{outcomePages.length > 1 ? ` · ${index + 1}/${outcomePages.length}` : ''}</h2>
              <ul className="mt-4 space-y-3">{items.map((item) => <li key={item} className="flex gap-3 text-sm leading-relaxed text-neutral-700 dark:text-neutral-200"><span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-accent-500" />{item}</li>)}</ul>
            </Reveal>
          </section>
        </ScreenPanel>
      ))}

      {project.screenshots.length > 0 && (
        <ScreenPanel id="project-gallery" titleId="project-gallery-title">
          <section className="px-4 py-5 sm:px-6 lg:px-12 lg:py-1">
            <div className="mx-auto max-w-6xl rounded-3xl border border-neutral-200/80 bg-white/90 p-4 shadow-lg dark:border-slate-700 dark:bg-slate-900/80 sm:p-5">
              <h2 id="project-gallery-title" className="mb-3 text-lg font-semibold text-neutral-900 dark:text-white">{copy.galleryLabel}</h2>
              <ProjectGallery items={project.screenshots} projectTitle={project.title} copy={copy} />
            </div>
          </section>
        </ScreenPanel>
      )}

      <ScreenPanel id="project-links" titleId="project-links-title">
        <section className="px-4 py-5 sm:px-6 lg:px-12 lg:py-1">
          <div className="mx-auto max-w-5xl rounded-3xl border border-brand-100/70 bg-white/90 p-6 shadow-md dark:border-brand-500/20 dark:bg-slate-900/80">
            <h2 id="project-links-title" className="text-xl font-semibold text-neutral-900 dark:text-white">{copy.catalogLabel}</h2>
            <nav aria-label={project.title} className="mt-5 flex flex-wrap gap-3">
              <Link to="/portfolio/Projects/all" className="rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-700">← {copy.catalogLabel}</Link>
              {externalLinks.map((item) => <a key={`${item.type}-${item.url}`} href={item.url} target="_blank" rel="noreferrer" className="rounded-xl border border-brand-200 px-4 py-2.5 text-sm font-semibold text-brand-700 hover:bg-brand-50 dark:border-brand-500/30 dark:text-brand-200 dark:hover:bg-brand-500/10">{linkLabels[item.type]} ↗</a>)}
            </nav>
          </div>
        </section>
      </ScreenPanel>
    </>
  );
};

export default ProjectPage;
