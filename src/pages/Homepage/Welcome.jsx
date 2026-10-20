import { useLanguage } from '../../context/LanguageContext.jsx';
import profileImage from '../../assets/profile.webp';
import profile from '../../../content/profile.json';
import { getWhatsAppUrl } from '../../utils/contact.js';
import ParallaxScene from '../../components/motion/ParallaxScene.jsx';
import Reveal from '../../components/motion/Reveal.jsx';

const heroLayers = [
  {
    id: 'hero-grid',
    distance: 8,
    mobileDistance: 0,
    content: (
      <div
        className="absolute inset-0 opacity-35"
        style={{
          backgroundImage: 'radial-gradient(rgba(129, 140, 248, .58) .8px, transparent .8px)',
          backgroundSize: '34px 34px',
          maskImage: 'linear-gradient(to bottom, black, transparent 82%)',
        }}
      />
    ),
  },
  {
    id: 'hero-orbit',
    distance: 16,
    mobileDistance: 4,
    content: (
      <div className="absolute -left-24 top-4 h-64 w-64 rounded-full border border-brand-400/20 bg-brand-400/10 blur-[90px] sm:left-8 sm:top-16 sm:h-80 sm:w-80" />
    ),
  },
  {
    id: 'hero-glow',
    distance: 28,
    mobileDistance: 8,
    content: (
      <div className="absolute -right-24 top-28 h-64 w-64 rounded-full border border-cyan-300/20 bg-cyan-300/10 blur-[100px] sm:right-12 sm:top-20 sm:h-96 sm:w-96" />
    ),
  },
];

const Welcome = () => {
  const { language, locales } = useLanguage();
  const { hero, documents, brand } = locales[language];
  const profileCopy = profile.copy[language];

  return (
    <section className="relative isolate px-4 py-8 sm:px-6 sm:py-10 lg:px-12 lg:py-2">
        <ParallaxScene layers={heroLayers} className="pointer-events-none absolute inset-0 -z-10 overflow-hidden" />

        {/* Contenedor principal responsive */}
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-8 lg:grid lg:grid-cols-[minmax(0,1.1fr),minmax(0,0.9fr)] lg:gap-6 xl:max-w-7xl">
          {/* --- COLUMNA TEXTO --- */}
          <Reveal
            className="w-full space-y-5 text-center lg:space-y-4 lg:text-left"
          >
              <div className="space-y-3 lg:space-y-2">
                <span className="inline-flex items-center gap-2 rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-brand-700 dark:bg-brand-500/10 dark:text-brand-200">
                  {hero.badge}
                </span>

                <h1 id="home-title" className="text-3xl font-semibold tracking-tight text-neutral-900 dark:text-white sm:text-4xl md:text-5xl">
                  {hero.heading}
                </h1>

                <p className="text-base font-medium text-brand-700 dark:text-brand-200 sm:text-lg">
                  {hero.subheading}
                </p>

                <p className="text-base leading-relaxed text-neutral-600 dark:text-neutral-300 sm:text-lg">
                  {profileCopy.summary}
                </p>
              </div>

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
                href={getWhatsAppUrl(profile.links.whatsapp, language)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-2xl border border-brand-200 px-6 py-3 text-sm font-semibold text-brand-700 transition hover:-translate-y-0.5 hover:bg-brand-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-200 dark:border-brand-400/30 dark:text-brand-200"
              >
                {hero.actions.secondary}
              </a>
            </div>
          </Reveal>

          {/* --- COLUMNA DE PERFIL --- */}
          <Reveal
            delay={0.08}
            className="relative flex w-full flex-col gap-4 lg:gap-3"
          >
            {/* Perfil */}
            <div className="relative overflow-hidden rounded-3xl bg-white/80 p-4 shadow-2xl backdrop-blur dark:bg-slate-900/70 sm:p-6 lg:p-4">
              <div className="absolute -left-10 top-10 h-32 w-32 rounded-full bg-brand-400/20 blur-3xl" />
              <div className="absolute -right-6 bottom-10 h-28 w-28 rounded-full bg-accent-300/20 blur-3xl" />

              <div className="relative flex flex-col items-center gap-4 sm:flex-col md:flex-row lg:flex-col">
                <div>
                  <img
                    src={profileImage}
                    alt={hero.profileAlt}
                    className="h-28 w-28 rounded-3xl border border-white/80 object-cover shadow-lg sm:h-32 sm:w-32 md:h-36 md:w-36"
                  />
                </div>

                <div className="text-center sm:text-center md:text-left lg:text-center">
                  <p className="text-sm font-semibold text-neutral-900 dark:text-white">{brand.name}</p>
                </div>
              </div>
            </div>

          </Reveal>
        </div>
    </section>
  );
};

export default Welcome;
