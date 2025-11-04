import { motion } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';
import AnimatedContent from '../Homepage/components/AnimatedContent';

const AboutMe = () => {
  const { language, locales } = useLanguage();
  const timeline = locales[language].timeline;
  const aboutCopy = locales[language].about;

  return (
    <section id="AboutMe" className="px-4 pb-24 pt-16 sm:px-6 sm:pt-20 lg:px-12">
      <div className="mx-auto w-full max-w-5xl">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center justify-center rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-brand-700 dark:bg-brand-500/10 dark:text-brand-200">
            {aboutCopy.badge}
          </span>
          <h2 className="mt-4 text-3xl font-semibold text-neutral-900 dark:text-white sm:text-4xl">
            <AnimatedContent keyProp={`about-title-${language}`}>
              {locales[language].sections.aboutMeTitle}
            </AnimatedContent>
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-neutral-600 dark:text-neutral-300 sm:text-base">
            {aboutCopy.description}
          </p>
        </div>

        <div className="relative mt-14">
          <div className="absolute left-6 top-0 h-full w-px bg-gradient-to-b from-brand-300 via-brand-200 to-transparent md:left-1/2" />

          <div className="space-y-10">
            {timeline.map((item, index) => {
              const isRight = index % 2 === 1;
              return (
                <motion.article
                  key={`${item.title}-${index}`}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.45, ease: 'easeOut', delay: index * 0.05 }}
                  className={`relative flex flex-col gap-4 rounded-3xl border border-neutral-200 bg-white/90 p-6 shadow-lg backdrop-blur dark:border-slate-700 dark:bg-slate-900/80 md:w-[calc(50%-2rem)] ${isRight ? 'md:ml-auto md:pl-10' : 'md:pr-10'}`}
                >
                  <span className="absolute left-4 top-6 h-3 w-3 rounded-full bg-brand-500 shadow-lg shadow-brand-500/40 md:left-[-30px]" />
                  <div className="space-y-2">
                    <p className="text-xs font-semibold uppercase tracking-wide text-brand-600 dark:text-brand-200">{item.date}</p>
                    <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">{item.title}</h3>
                    <p className="text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">{item.description}</p>
                  </div>
                </motion.article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutMe;
