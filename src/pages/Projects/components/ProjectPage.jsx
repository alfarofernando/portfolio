import { useParams, useNavigate } from 'react-router-dom';
import { useLanguage } from '../../../context/LanguageContext';
import { getProjects } from './Data';
import { slugify } from '../../../utils/slugify';
import { motion } from 'framer-motion';
import ProjectGallery from './ProjectGallery';

const ProjectPage = () => {
  const { language, locales } = useLanguage();
  const navigate = useNavigate();
  const { slug } = useParams();
  const projectCopy = locales[language].projectPage;
  const localizedProjects = getProjects(locales, language);
  const projectKeyFromSlug = Object.keys(locales)
    .map((localeLanguage) => getProjects(locales, localeLanguage)
      .find((item) => slugify(item.title) === slug)?.key)
    .find(Boolean);
  const project = localizedProjects.find((item) => item.key === projectKeyFromSlug);

  if (!project) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4 py-20 text-center sm:px-6 lg:px-12">
        <div className="max-w-md rounded-3xl border border-brand-100 bg-white/90 p-10 text-neutral-700 shadow-lg dark:border-brand-500/20 dark:bg-slate-900/80 dark:text-neutral-200">
          <p className="text-2xl font-semibold">{projectCopy.notFoundTitle}</p>
          <button
            type="button"
            onClick={() => navigate('/portfolio/Projects')}
            className="mt-6 inline-flex items-center rounded-2xl bg-brand-600 px-5 py-2 text-sm font-semibold text-white shadow-brand transition hover:-translate-y-0.5 hover:bg-brand-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-200"
          >
            {projectCopy.notFoundAction}
          </button>
        </div>
      </div>
    );
  }

  return (
    <section className="px-4 pb-24 pt-24 sm:px-6 sm:pt-28 lg:px-12">
      <div className="mx-auto w-full max-w-5xl space-y-10">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="rounded-4xl border border-brand-100/70 bg-white/95 p-6 shadow-xl backdrop-blur dark:border-brand-500/20 dark:bg-slate-900/85 sm:p-8"
        >
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white/70 px-3 py-1 text-xs font-semibold text-neutral-600 transition hover:-translate-y-0.5 hover:border-brand-200 hover:text-brand-700 dark:border-slate-700 dark:bg-slate-800/70 dark:text-neutral-200"
          >
            {'<'} {projectCopy.back}
          </button>
          <h1 className="mt-6 text-3xl font-semibold text-neutral-900 dark:text-white sm:text-4xl">{project.title}</h1>
          <p className="mt-4 text-sm leading-relaxed text-neutral-600 dark:text-neutral-300 sm:text-base">{project.description}</p>

          <div className="mt-6 flex flex-wrap gap-2">
            {project.technologies.map((tech) => (
              <span
                key={tech}
                className="rounded-full border border-brand-100/70 bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700 dark:border-brand-500/30 dark:bg-brand-500/10 dark:text-brand-200"
              >
                {tech}
              </span>
            ))}
          </div>

          {project.details?.length ? (
            <div className="mt-8 grid gap-4 rounded-3xl border border-neutral-200/60 bg-white/80 p-4 text-left dark:border-slate-700 dark:bg-slate-900/60 sm:grid-cols-2">
              {project.details.map((section) => (
                <div
                  key={section.title}
                  className="flex flex-col gap-3 rounded-2xl border border-white/60 bg-white/70 p-4 dark:border-white/10 dark:bg-slate-950/40"
                >
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-brand-600 dark:text-brand-200">
                    {section.title}
                  </h3>
                  <ul className="space-y-2 text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">
                    {section.items.map((item) => (
                      <li key={item} className="flex gap-2">
                        <span className="mt-1 inline-block h-1.5 w-1.5 flex-shrink-0 rounded-full bg-brand-500" />
                        <span className="flex-1">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          ) : null}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: 'easeOut', delay: 0.1 }}
          className="overflow-hidden rounded-4xl border border-neutral-200/80 bg-white/90 p-4 shadow-lg dark:border-slate-700 dark:bg-slate-900/80 sm:p-6"
        >
          <ProjectGallery
            key={project.key}
            items={project.screenshots ?? []}
            projectTitle={project.title}
            copy={projectCopy}
          />
        </motion.div>

        {project.link && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut', delay: 0.15 }}
            className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-brand-100/70 bg-white/90 px-6 py-4 shadow-lg dark:border-brand-500/20 dark:bg-slate-900/80"
          >
            <div className="max-w-xl text-sm text-neutral-600 dark:text-neutral-300">
              {projectCopy.repositoryDescription}
            </div>
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-2xl bg-brand-600 px-5 py-2 text-sm font-semibold text-white shadow-brand transition hover:-translate-y-0.5 hover:bg-brand-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-200"
            >
              {projectCopy.repositoryButton}
              <span aria-hidden="true">{'->'}</span>
            </a>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default ProjectPage;
