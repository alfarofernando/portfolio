import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext.jsx';
import { useScreenScroll } from '../../context/ScreenScrollContext.jsx';
import ScreenPanel from '../../components/ScreenPanel.jsx';
import profile from '../../../content/profile.json';
import { getProjects } from '../Projects/components/Data.jsx';
import Reveal from '../../components/motion/Reveal.jsx';

const chunk = (items, size) => Array.from({ length: Math.ceil(items.length / size) }, (_, index) => items.slice(index * size, index * size + size));

const Experience = () => {
  const { language, locales } = useLanguage();
  const { goToPanel } = useScreenScroll();
  const copy = locales[language].experiencePage;
  const profileCopy = profile.copy[language];
  const projects = getProjects(locales, language).filter((project) => project.category === 'professional' && project.featured);
  const responsibilities = profileCopy.employment.responsibilities;
  const cases = chunk(projects, 3);

  return (
    <>
      <ScreenPanel id="experience-intro" titleId="experience-title" first>
        <section className="px-4 py-6 sm:px-6 lg:px-12 lg:py-2">
          <Reveal as="article" className="mx-auto max-w-5xl rounded-3xl border border-brand-100 bg-white/90 p-6 shadow-lg dark:border-brand-500/20 dark:bg-slate-900/80 sm:p-9">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-600 dark:text-brand-200">{profileCopy.employment.period}</p>
            <h1 id="experience-title" className="mt-3 text-3xl font-semibold text-neutral-900 dark:text-white sm:text-4xl">{copy.title}</h1>
            <h2 className="mt-4 text-xl font-semibold text-brand-700 dark:text-brand-200">{profileCopy.employment.company}</h2>
            <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-300">{profileCopy.employment.role}</p>
            <p className="mt-5 leading-relaxed text-neutral-700 dark:text-neutral-200">{profileCopy.summary}</p>
          </Reveal>
        </section>
      </ScreenPanel>

      <ScreenPanel id="experience-responsibilities-1" titleId="responsibilities-title-1">
        <section className="px-4 py-4 sm:px-6 lg:px-12 lg:py-2">
          <Reveal as="section" className="mx-auto max-w-5xl rounded-3xl border border-neutral-200 bg-white/90 p-4 shadow-md dark:border-slate-700 dark:bg-slate-900/75 sm:p-5">
            <h2 id="responsibilities-title-1" className="text-xl font-semibold text-neutral-900 dark:text-white">{copy.responsibilities}</h2>
            <ul className="mt-4 space-y-2">
              {responsibilities.map((item) => <li key={item} className="flex gap-3 text-sm leading-relaxed text-neutral-700 dark:text-neutral-200"><span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-brand-500" />{item}</li>)}
            </ul>
          </Reveal>
        </section>
      </ScreenPanel>

      {cases.map((items, index) => (
        <ScreenPanel key={`experience-cases-${index}`} id={`experience-cases-${index + 1}`} titleId={`experience-cases-title-${index + 1}`}>
          <section className="px-4 py-5 sm:px-6 lg:px-12 lg:py-2">
            <div className="mx-auto max-w-6xl">
              <Reveal as="header" className="flex items-end justify-between gap-4">
                <h2 id={`experience-cases-title-${index + 1}`} className="text-xl font-semibold text-neutral-900 dark:text-white">{copy.cases}</h2>
                <Link to="/portfolio/Projects/all" className="text-sm font-semibold text-brand-700 hover:underline dark:text-brand-200">{locales[language].projectsSection.catalogLink} →</Link>
              </Reveal>
              <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((project, cardIndex) => (
                  <Reveal key={project.id} delay={cardIndex * 0.09}>
                    <Link to={`/portfolio/Projects/${project.slug}`} className="block h-full rounded-2xl border border-neutral-200 bg-white/90 p-4 transition duration-200 hover:-translate-y-0.5 hover:border-brand-300 dark:border-slate-700 dark:bg-slate-900/75">
                      <h3 className="font-semibold text-neutral-900 dark:text-white">{project.title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">{project.description}</p>
                      <span className="mt-4 inline-block text-sm font-semibold text-brand-700 dark:text-brand-200">{copy.viewCase} →</span>
                    </Link>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>
        </ScreenPanel>
      ))}

      <ScreenPanel id="experience-education" titleId="education-title">
        <section className="px-4 py-5 sm:px-6 lg:px-12 lg:py-2">
          <div className="mx-auto grid max-w-5xl gap-5 md:grid-cols-2">
            <Reveal as="section" className="rounded-3xl border border-neutral-200 bg-white/90 p-6 dark:border-slate-700 dark:bg-slate-900/75">
              <h2 id="education-title" className="text-lg font-semibold text-neutral-900 dark:text-white">{copy.education}</h2>
              <ul className="mt-4 space-y-4">{profileCopy.education.map((item) => <li key={item.institution}><p className="font-medium text-neutral-800 dark:text-neutral-100">{item.qualification}</p><p className="text-sm text-neutral-600 dark:text-neutral-300">{item.institution} · {item.period}</p></li>)}</ul>
            </Reveal>
            <Reveal as="section" delay={0.09} className="rounded-3xl border border-neutral-200 bg-white/90 p-6 dark:border-slate-700 dark:bg-slate-900/75">
              <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">{copy.english}</h2>
              <p className="mt-4 text-sm leading-relaxed text-neutral-700 dark:text-neutral-200">{profileCopy.english}</p>
              <button type="button" onClick={() => goToPanel('experience-intro')} className="mt-6 rounded-xl border border-brand-300 px-4 py-2 text-sm font-semibold text-brand-700 dark:text-brand-200">{copy.title} ↑</button>
            </Reveal>
          </div>
        </section>
      </ScreenPanel>
    </>
  );
};

export default Experience;
