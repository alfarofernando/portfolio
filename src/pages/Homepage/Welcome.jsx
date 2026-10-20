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
    <section className="relative isolate px-4 py-8 sm:px-6 sm:py-10 lg:px-12 lg:py-5">
        <ParallaxScene layers={heroLayers} className="pointer-events-none absolute inset-0 -z-10 overflow-hidden" />

        {/* Contenedor principal responsive */}
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-10 lg:grid lg:grid-cols-[minmax(0,1.1fr),minmax(0,0.9fr)] lg:gap-8 xl:max-w-7xl">
          {/* --- COLUMNA TEXTO --- */}
          <Reveal
            className="w-full space-y-6 text-center lg:space-y-5 lg:text-left"
          >
              <div className="space-y-4 lg:space-y-3">
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

            {/* Botones */}
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center lg:justify-start">
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

          {/* --- PERFIL CON CONTEXTO TÉCNICO --- */}
          <Reveal
            delay={0.08}
            className="relative w-full"
          >
            <div className="relative overflow-hidden rounded-3xl border border-brand-100/70 bg-white/80 p-5 shadow-2xl backdrop-blur dark:border-brand-500/20 dark:bg-slate-900/70 sm:p-6">
              <div className="absolute -left-10 top-10 h-32 w-32 rounded-full bg-brand-400/20 blur-3xl" />
              <div className="absolute -right-6 bottom-10 h-28 w-28 rounded-full bg-accent-300/20 blur-3xl" />

              <div className="relative grid items-center gap-6 sm:grid-cols-[minmax(8rem,.72fr),minmax(0,1.28fr)]">
                <div className="flex flex-col items-center gap-4 text-center">
                  <div className="rounded-[1.7rem] border border-brand-200/70 bg-gradient-to-br from-brand-500/20 via-white/70 to-cyan-400/15 p-1.5 shadow-lg dark:border-brand-400/25 dark:from-brand-500/20 dark:via-slate-900/70 dark:to-cyan-400/10">
                    <img
                      src={profileImage}
                      alt={hero.profileAlt}
                      className="h-32 w-32 rounded-[1.35rem] border border-white/80 object-cover shadow-md sm:h-36 sm:w-36 md:h-40 md:w-40"
                    />
                  </div>

                  <div className="space-y-1">
                    <p className="text-base font-semibold text-neutral-900 dark:text-white">{brand.name}</p>
                    <p className="text-sm font-medium text-brand-700 dark:text-brand-200">{brand.role}</p>
                  </div>
                </div>

                <div className="min-w-0">
                  <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-500 dark:text-neutral-400">{hero.profileFocusTitle}</h2>
                  <ul aria-label={hero.profileFocusTitle} className="mt-3 grid gap-3">
                    {hero.highlights.map((technology, index) => (
                      <li key={technology} className="flex items-center gap-3 rounded-2xl border border-brand-100/80 bg-white/70 p-3 text-left shadow-sm dark:border-brand-400/20 dark:bg-slate-950/40">
                        <span aria-hidden="true" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-100/80 text-xs font-bold text-brand-700 dark:bg-brand-500/15 dark:text-brand-200">0{index + 1}</span>
                        <span className="min-w-0">
                          <span className="block text-xs font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400">{hero.profileFocusLabels[index]}</span>
                          <span className="mt-1 block text-sm font-semibold text-neutral-900 dark:text-white">{technology}</span>
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

          </Reveal>
        </div>
    </section>
  );
};

export default Welcome;
