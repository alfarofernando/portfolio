import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import profile from '../../../content/profile.json';

const AboutMe = () => {
  const { language, locales } = useLanguage();
  const aboutCopy = locales[language].about;
  const profileCopy = profile.copy[language];

  return (
    <section id="AboutMe" className="px-4 pb-24 pt-16 sm:px-6 sm:pt-20 lg:px-12">
        <div data-parallax-media="0.1" className="mx-auto w-full max-w-5xl">
          <div data-parallax-media="0.14" className="mx-auto max-w-2xl text-center">
            <span className="inline-flex items-center justify-center rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-brand-700 dark:bg-brand-500/10 dark:text-brand-200">
              {aboutCopy.badge}
            </span>
            <h2 className="mt-4 text-3xl font-semibold text-neutral-900 dark:text-white sm:text-4xl">{locales[language].sections.aboutMeTitle}</h2>
            <p className="mt-4 text-sm leading-relaxed text-neutral-600 dark:text-neutral-300 sm:text-base">
              {aboutCopy.description}
            </p>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {profileCopy.education.map((item) => (
              <article key={item.institution} className="rounded-3xl border border-neutral-200 bg-white/90 p-6 shadow-md dark:border-slate-700 dark:bg-slate-900/80">
                <p className="text-xs font-semibold uppercase tracking-wide text-brand-600 dark:text-brand-200">{item.period}</p>
                <h3 className="mt-2 text-lg font-semibold text-neutral-900 dark:text-white">{item.qualification}</h3>
                <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-300">{item.institution}</p>
              </article>
            ))}
          </div>
          <div className="mt-6 text-center"><Link to="/portfolio/Experience" className="inline-flex rounded-xl bg-brand-600 px-5 py-3 text-sm font-semibold text-white hover:bg-brand-700">{locales[language].nav.experience} →</Link></div>
        </div>
    </section>
  );
};

export default AboutMe;
