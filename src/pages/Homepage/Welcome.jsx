import { motion } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext.jsx';
import AnimatedContent from './components/AnimatedContent.jsx';
import TechCarousel from './components/TechCarousel.jsx';

const Welcome = () => {
  const { language, locales } = useLanguage();
  const { hero, documents, links, brand } = locales[language];

  return (
    <section className="relative isolate px-4 pb-20 pt-10 sm:px-6 sm:pt-14 md:pb-24 lg:px-12">
      {/* Fondos decorativos */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/4 top-0 h-48 w-48 rounded-full bg-brand-400/20 blur-[100px] sm:h-64 sm:w-64 lg:blur-[150px]" />
        <div className="absolute right-0 top-1/3 h-56 w-56 rounded-full bg-accent-300/20 blur-[120px] sm:h-80 sm:w-80 lg:blur-[170px]" />
        <div className="absolute bottom-0 left-1/4 h-52 w-52 rounded-full bg-brand-700/10 blur-[100px] sm:h-72 sm:w-72 lg:blur-[160px]" />
      </div>

      {/* Contenedor principal responsive */}
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-12 lg:grid lg:grid-cols-[minmax(0,1.1fr),minmax(0,0.9fr)] xl:max-w-7xl">
        {/* --- COLUMNA TEXTO --- */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="w-full space-y-7 text-center lg:text-left"
        >
          <AnimatedContent keyProp={`hero-${language}`}>
            <div className="space-y-4">
              <span className="inline-flex items-center gap-2 rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-brand-700 dark:bg-brand-500/10 dark:text-brand-200">
                {hero.badge}
              </span>

              <h1 className="text-3xl font-semibold tracking-tight text-neutral-900 dark:text-white sm:text-4xl md:text-5xl">
                {hero.heading}
              </h1>

              <p className="text-base font-medium text-brand-700 dark:text-brand-200 sm:text-lg">
                {hero.subheading}
              </p>

              <p className="text-base leading-relaxed text-neutral-600 dark:text-neutral-300 sm:text-lg">
                {hero.description}
              </p>
            </div>
          </AnimatedContent>

          {/* Highlights */}
          <div className="flex flex-wrap justify-center gap-2 lg:justify-start">
            {hero.highlights.map((item) => (
              <span
                key={item}
                className="rounded-full border border-brand-100/70 bg-white/80 px-3 py-1 text-xs font-semibold text-brand-700 shadow-sm dark:border-brand-400/20 dark:bg-slate-900/60 dark:text-brand-200"
              >
                {item}
              </span>
            ))}
          </div>

          {/* Botones */}
          <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start">
            <a
              href={documents.cv}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-2xl bg-brand-600 px-6 py-3 text-sm font-semibold text-white shadow-brand transition hover:-translate-y-0.5 hover:bg-brand-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-200"
            >
              {hero.actions.primary}
            </a>
            <a
              href={links.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-2xl border border-brand-200 px-6 py-3 text-sm font-semibold text-brand-700 transition hover:-translate-y-0.5 hover:bg-brand-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-200 dark:border-brand-400/30 dark:text-brand-200"
            >
              {hero.actions.secondary}
            </a>
          </div>
        </motion.div>

        {/* --- COLUMNA PERFIL + TECNOLOGÍAS --- */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut', delay: 0.1 }}
          className="relative w-full flex flex-col gap-6"
        >
          {/* Perfil */}
          <div className="relative overflow-hidden rounded-3xl bg-white/80 p-6 shadow-2xl backdrop-blur dark:bg-slate-900/70">
            <div className="absolute -left-10 top-10 h-32 w-32 rounded-full bg-brand-400/20 blur-3xl" />
            <div className="absolute -right-6 bottom-10 h-28 w-28 rounded-full bg-accent-300/20 blur-3xl" />

            <div className="relative flex flex-col items-center gap-4 sm:flex-col md:flex-row lg:flex-col">
              <img
                src="./android-chrome-192x192.png"
                alt={hero.profileAlt}
                className="h-28 w-28 rounded-3xl border border-white/80 object-cover shadow-lg sm:h-32 sm:w-32 md:h-36 md:w-36"
              />

              <div className="text-center sm:text-center md:text-left lg:text-center">
                <p className="text-sm font-semibold text-neutral-900 dark:text-white">{brand.name}</p>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">{brand.profileSubtitle}</p>
              </div>
            </div>

            {/* Stats */}
            <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
              {hero.stats.map((item) => (
                <div
                  key={item.label}
                  className="rounded-2xl border border-neutral-200 bg-white/70 px-3 py-3 text-center text-sm text-neutral-600 shadow-sm dark:border-slate-700 dark:bg-slate-800/70 dark:text-neutral-200"
                >
                  <p className="text-lg font-semibold text-brand-700 dark:text-brand-200">{item.value}</p>
                  <p className="text-xs font-medium">{item.label}</p>
                  <p className="mt-1 text-[11px] text-neutral-500 dark:text-neutral-400">{item.detail}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Carrusel de tecnologías */}
          <div className="rounded-3xl border border-brand-100/60 bg-white/85 p-4 shadow-lg backdrop-blur dark:border-brand-500/20 dark:bg-slate-900/70">
            <TechCarousel />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Welcome;
