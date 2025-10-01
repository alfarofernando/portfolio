import { motion } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';
import AnimatedContent from '../Homepage/components/AnimatedContent';
import { getProjects } from './components/Data';
import { slugify } from '../../utils/slugify';
import { useNavigate } from 'react-router-dom';

const Projects = () => {
  const { language, locales } = useLanguage();
  const navigate = useNavigate();
  const projects = getProjects(locales, language);

  return (
    <section id="Projects" className="px-4 pb-24 pt-10">
      <div className="mx-auto w-full max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="mx-auto text-center"
        >
          <span className="inline-flex items-center justify-center rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-brand-700 dark:bg-brand-500/10 dark:text-brand-200">
            {language === 'es' ? 'Portfolio' : 'Portfolio'}
          </span>
          <h2 className="mt-4 text-3xl font-semibold text-neutral-900 dark:text-white md:text-4xl">
            <AnimatedContent keyProp={`projects-title-${language}`}>
              {locales[language].projectTitle}
            </AnimatedContent>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">
            {language === 'es'
              ? 'Seleccion de soluciones que construi para empresas y proyectos personales, priorizando metricas claras, escalabilidad y una experiencia de usuario cuidada.'
              : 'A selection of products I delivered for companies and personal initiatives, with a constant focus on measurable outcomes, scalability and refined user experiences.'}
          </p>
        </motion.div>

        <div className="mt-12 grid gap-8 lg:grid-cols-2">
          {projects.map((project, index) => (
            <motion.article
              key={project.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.45, delay: index * 0.05 }}
              className="group relative overflow-hidden rounded-4xl border border-brand-100/70 bg-white/90 p-6 shadow-lg backdrop-blur dark:border-brand-500/20 dark:bg-slate-900/80"
            >
              <div className="relative overflow-hidden rounded-3xl">
                <img
                  src={project.image}
                  alt={project.title}
                  className="h-48 w-full rounded-3xl object-cover transition duration-500 group-hover:scale-105"
                />
                <div className="pointer-events-none absolute inset-0 rounded-3xl bg-gradient-to-tr from-brand-950/70 via-brand-700/0 to-transparent opacity-0 transition duration-500 group-hover:opacity-100" />
                <div className="pointer-events-none absolute bottom-4 left-4 right-4 flex items-center justify-between text-white opacity-0 transition duration-500 group-hover:opacity-100">
                  <span className="text-lg font-semibold">{project.title}</span>
                  <span className="text-xs uppercase tracking-wide text-white/80">{language === 'es' ? 'Detalle' : 'Details'}</span>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-xl font-semibold text-neutral-900 dark:text-white">{project.title}</h3>
                  <span className="rounded-full bg-accent-500/10 px-3 py-1 text-xs font-semibold text-accent-600 dark:text-accent-300">
                    {index + 1 < 10 ? `0${index + 1}` : index + 1}
                  </span>
                </div>
                <p className="text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">{project.description}</p>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.slice(0, 6).map((tech) => (
                    <span
                      key={tech}
                      className="rounded-full border border-neutral-200 bg-white/80 px-3 py-1 text-xs font-semibold text-neutral-600 dark:border-slate-700 dark:bg-slate-800/70 dark:text-neutral-200"
                    >
                      {tech}
                    </span>
                  ))}
                  {project.technologies.length > 6 && (
                    <span className="rounded-full border border-neutral-200 bg-white/80 px-3 py-1 text-xs font-semibold text-neutral-500 dark:border-slate-700 dark:bg-slate-800/70 dark:text-neutral-300">
                      +{project.technologies.length - 6}
                    </span>
                  )}
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => {
                    navigate(`/portfolio-v.2/projects/${slugify(project.title)}`, {
                      state: { project },
                    });
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="inline-flex items-center gap-2 rounded-2xl bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white shadow-brand transition hover:-translate-y-0.5 hover:bg-brand-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-200"
                >
                  {locales[language].viewDetails}
                  <span aria-hidden="true">{'->'}</span>
                </button>
                {project.link && (
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-2xl border border-brand-200 px-5 py-2.5 text-sm font-semibold text-brand-700 transition hover:-translate-y-0.5 hover:bg-brand-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-200 dark:border-brand-500/30 dark:text-brand-200"
                  >
                    {language === 'es' ? 'Repositorio' : 'Repository'}
                    <span aria-hidden="true">{'->'}</span>
                  </a>
                )}
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;