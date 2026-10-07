import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext.jsx';
import profile from '../../../content/profile.json';
import { getProjects } from '../Projects/components/Data.jsx';

const Experience = () => {
  const { language, locales } = useLanguage();
  const copy = locales[language].experiencePage;
  const profileCopy = profile.copy[language];
  const projects = getProjects(locales, language).filter((project) => project.category === 'professional' && project.featured);

  return (
    <section className="px-4 pb-24 pt-8 sm:px-6 lg:px-12">
      <div className="mx-auto max-w-5xl space-y-8">
        <header className="rounded-3xl border border-brand-100 bg-white/90 p-6 shadow-lg dark:border-brand-500/20 dark:bg-slate-900/80 sm:p-9">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-600 dark:text-brand-200">{profileCopy.employment.period}</p>
          <h1 className="mt-3 text-3xl font-semibold text-neutral-900 dark:text-white sm:text-4xl">{copy.title}</h1>
          <h2 className="mt-4 text-xl font-semibold text-brand-700 dark:text-brand-200">{profileCopy.employment.company}</h2>
          <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-300">{profileCopy.employment.role}</p>
          <p className="mt-5 leading-relaxed text-neutral-700 dark:text-neutral-200">{profileCopy.summary}</p>
        </header>

        <section className="rounded-3xl border border-neutral-200 bg-white/90 p-6 shadow-md dark:border-slate-700 dark:bg-slate-900/75 sm:p-8">
          <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">{copy.responsibilities}</h2>
          <ul className="mt-5 space-y-3">
            {profileCopy.employment.responsibilities.map((item) => <li key={item} className="flex gap-3 text-sm leading-relaxed text-neutral-700 dark:text-neutral-200"><span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-brand-500" />{item}</li>)}
          </ul>
        </section>

        <section>
          <div className="flex items-end justify-between gap-4">
            <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">{copy.cases}</h2>
            <Link to="/portfolio/Projects/all" className="text-sm font-semibold text-brand-700 hover:underline dark:text-brand-200">{locales[language].projectsSection.catalogLink} →</Link>
          </div>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {projects.map((project) => (
              <Link key={project.id} to={`/portfolio/Projects/${project.slug}`} className="rounded-2xl border border-neutral-200 bg-white/90 p-5 transition hover:-translate-y-0.5 hover:border-brand-300 dark:border-slate-700 dark:bg-slate-900/75">
                <h3 className="font-semibold text-neutral-900 dark:text-white">{project.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">{project.description}</p>
                <span className="mt-4 inline-block text-sm font-semibold text-brand-700 dark:text-brand-200">{copy.viewCase} →</span>
              </Link>
            ))}
          </div>
        </section>

        <div className="grid gap-5 md:grid-cols-2">
          <section className="rounded-3xl border border-neutral-200 bg-white/90 p-6 dark:border-slate-700 dark:bg-slate-900/75">
            <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">{copy.education}</h2>
            <ul className="mt-4 space-y-4">{profileCopy.education.map((item) => <li key={item.institution}><p className="font-medium text-neutral-800 dark:text-neutral-100">{item.qualification}</p><p className="text-sm text-neutral-600 dark:text-neutral-300">{item.institution} · {item.period}</p></li>)}</ul>
          </section>
          <section className="rounded-3xl border border-neutral-200 bg-white/90 p-6 dark:border-slate-700 dark:bg-slate-900/75">
            <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">{copy.english}</h2>
            <p className="mt-4 text-sm leading-relaxed text-neutral-700 dark:text-neutral-200">{profileCopy.english}</p>
          </section>
        </div>
      </div>
    </section>
  );
};

export default Experience;
