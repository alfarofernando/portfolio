import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext.jsx';
import { projectCatalog } from '../../data/projectModel.js';
import { getWhatsAppUrl } from '../../utils/contact.js';
import services from '../../../content/services.json';
import profile from '../../../content/profile.json';
import ParallaxScene from '../../components/motion/ParallaxScene.jsx';
import Reveal from '../../components/motion/Reveal.jsx';
import ecosystemArtwork from '../../assets/images/solutions/software-ecosystem.svg';
import websiteArtwork from '../../assets/images/solutions/website.svg';
import systemsArtwork from '../../assets/images/solutions/systems.svg';
import integrationsArtwork from '../../assets/images/solutions/integrations.svg';

const serviceArtwork = {
  websites: websiteArtwork,
  'custom-systems': systemsArtwork,
  'apis-integrations': integrationsArtwork,
  'process-automation': integrationsArtwork,
  'maintenance-improvements': systemsArtwork,
};

const heroLayers = [
  {
    id: 'solution-grid',
    distance: 7,
    mobileDistance: 0,
    content: (
      <div
        className="absolute inset-0 opacity-35"
        style={{
          backgroundImage: 'radial-gradient(rgba(129, 140, 248, .6) .8px, transparent .8px)',
          backgroundSize: '36px 36px',
          maskImage: 'linear-gradient(to bottom, black, transparent 88%)',
        }}
      />
    ),
  },
  {
    id: 'solution-orbits',
    distance: 17,
    mobileDistance: 4,
    content: (
      <div className="absolute right-[4%] top-14 h-72 w-72 rounded-full border border-brand-300/20 bg-brand-400/10 blur-[90px] sm:right-[8%] sm:h-96 sm:w-96" />
    ),
  },
  {
    id: 'solution-ecosystem',
    distance: 28,
    mobileDistance: 8,
    className: 'pointer-events-none absolute inset-y-0 right-[-10%] flex w-[105%] items-center justify-center opacity-20 sm:right-[-4%] sm:w-[78%] sm:opacity-35 lg:right-[1%] lg:w-[59%] lg:opacity-100',
    content: <img src={ecosystemArtwork} alt="" className="h-auto w-full max-w-3xl" />,
  },
];

const closingLayers = [
  {
    id: 'closing-glow',
    distance: 10,
    mobileDistance: 3,
    content: (
      <div className="absolute -right-8 top-0 h-48 w-48 rounded-full bg-cyan-300/20 blur-3xl sm:right-20 sm:h-64 sm:w-64" />
    ),
  },
  {
    id: 'closing-orbit',
    distance: 18,
    mobileDistance: 5,
    content: (
      <div className="absolute -bottom-28 left-[12%] h-52 w-52 rounded-full border border-brand-300/20 bg-brand-500/10 blur-3xl" />
    ),
  },
];

const Solutions = () => {
  const { language, locales } = useLanguage();
  const copy = locales[language].solutionsPage;
  const projectById = new Map(projectCatalog.map((project) => [project.id, project]));
  const whatsappLink = getWhatsAppUrl(profile.links.whatsapp, language);

  return (
    <div className="pb-12">
      <ParallaxScene layers={heroLayers} className="overflow-hidden px-4 sm:px-6 lg:px-12">
        <div className="mx-auto grid min-h-[33rem] w-full max-w-7xl items-center py-16 sm:min-h-[39rem] sm:py-20 lg:grid-cols-[minmax(0,.92fr),minmax(0,1.08fr)] lg:py-24">
          <div className="relative z-10 max-w-2xl">
            <p className="inline-flex items-center gap-2 rounded-full border border-brand-200/70 bg-white/75 px-4 py-2 text-xs font-semibold uppercase tracking-[.14em] text-brand-700 shadow-sm backdrop-blur dark:border-brand-300/20 dark:bg-slate-900/70 dark:text-brand-200">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              {copy.kicker}
            </p>
            <h1 className="mt-6 text-4xl font-semibold leading-[1.1] tracking-tight text-neutral-950 dark:text-white sm:text-5xl lg:text-[3.65rem]">
              {copy.title}
            </h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-neutral-600 dark:text-neutral-300 sm:text-lg">
              {copy.description}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-brand-600 px-6 py-3 text-sm font-semibold text-white shadow-brand transition duration-200 hover:-translate-y-0.5 hover:bg-brand-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-300"
              >
                {copy.primaryAction}
                <span aria-hidden="true">↗</span>
              </a>
              <Link
                to="/portfolio/Projects/all"
                className="inline-flex min-h-12 items-center justify-center rounded-2xl border border-neutral-300/80 bg-white/75 px-6 py-3 text-sm font-semibold text-neutral-800 backdrop-blur transition duration-200 hover:-translate-y-0.5 hover:border-brand-300 hover:text-brand-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-300 dark:border-slate-600 dark:bg-slate-900/65 dark:text-neutral-100 dark:hover:text-brand-200"
              >
                {copy.secondaryAction}
              </Link>
            </div>
            <div className="mt-8 flex flex-wrap gap-x-5 gap-y-2 text-xs font-medium text-neutral-500 dark:text-neutral-400 sm:text-sm">
              <span>Java · Spring</span><span>Angular · TypeScript</span><span>APIs · SQL</span>
            </div>
          </div>
          <div aria-hidden="true" className="hidden lg:block" />
        </div>
      </ParallaxScene>

      <section className="px-4 pt-8 sm:px-6 lg:px-12" aria-labelledby="solutions-services-heading">
        <div className="mx-auto max-w-7xl">
          <Reveal className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[.18em] text-brand-600 dark:text-brand-200">{copy.kicker}</p>
            <h2 id="solutions-services-heading" className="mt-3 text-3xl font-semibold tracking-tight text-neutral-900 dark:text-white sm:text-4xl">{copy.servicesTitle}</h2>
            <p className="mt-4 text-sm leading-relaxed text-neutral-600 dark:text-neutral-300 sm:text-base">{copy.servicesDescription}</p>
          </Reveal>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {services.map((service, index) => {
              const serviceCopy = service.copy[language] ?? service.copy.es;
              const relatedProjects = service.evidenceProjectIds
                .map((id) => projectById.get(id))
                .filter(Boolean)
                .slice(0, 2);

              return (
                <Reveal
                  key={service.id}
                  delay={index * 0.035}
                  className="group flex h-full flex-col rounded-3xl border border-neutral-200/80 bg-white/85 p-6 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-brand-200 hover:shadow-brand dark:border-slate-700/80 dark:bg-slate-900/75 dark:hover:border-brand-400/40 sm:p-7"
                >
                  <img src={serviceArtwork[service.id]} alt="" className="h-16 w-16 transition duration-300 group-hover:scale-105" loading="lazy" />
                  <h3 className="mt-5 text-xl font-semibold text-neutral-900 dark:text-white">{serviceCopy.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">{serviceCopy.description}</p>
                  <p className="mt-4 border-l-2 border-brand-400 pl-3 text-sm font-medium leading-relaxed text-neutral-700 dark:text-neutral-200">{serviceCopy.benefit}</p>

                  <div className="mt-auto pt-6">
                    <p className="text-[11px] font-semibold uppercase tracking-[.13em] text-neutral-500 dark:text-neutral-400">{copy.evidenceLabel}</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {relatedProjects.map((project) => {
                        const title = project.copy[language]?.title ?? project.copy.es.title;
                        return (
                          <Link
                            key={project.id}
                            to={`/portfolio/Projects/${project.slug}`}
                            className="rounded-full border border-neutral-200 bg-white/80 px-3 py-1.5 text-xs font-semibold text-brand-700 transition hover:border-brand-300 hover:bg-brand-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-300 dark:border-slate-700 dark:bg-slate-800/70 dark:text-brand-200"
                          >
                            {title}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      <section className="px-4 pt-20 sm:px-6 lg:px-12" aria-labelledby="solutions-process-heading">
        <div className="mx-auto max-w-7xl">
          <ParallaxScene layers={closingLayers} className="overflow-hidden rounded-[2rem] border border-brand-200/40 bg-gradient-to-br from-brand-50/90 via-white/90 to-cyan-50/80 px-6 py-10 dark:border-brand-400/15 dark:from-slate-900/90 dark:via-slate-900/80 dark:to-indigo-950/70 sm:px-10 sm:py-12">
            <Reveal>
              <div className="max-w-3xl">
                <p className="text-xs font-semibold uppercase tracking-[.18em] text-brand-600 dark:text-brand-200">{copy.kicker}</p>
                <h2 id="solutions-process-heading" className="mt-3 text-2xl font-semibold tracking-tight text-neutral-900 dark:text-white sm:text-3xl">{copy.processTitle}</h2>
              </div>
            </Reveal>
            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {copy.process.map((step, index) => (
                <Reveal key={step.title} delay={index * 0.06} className="rounded-2xl border border-white/80 bg-white/75 p-5 backdrop-blur dark:border-slate-700/70 dark:bg-slate-950/45">
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600 text-sm font-semibold text-white">0{index + 1}</span>
                  <h3 className="mt-4 text-lg font-semibold text-neutral-900 dark:text-white">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">{step.description}</p>
                </Reveal>
              ))}
            </div>
          </ParallaxScene>
        </div>
      </section>

      <Reveal className="mx-auto mt-14 flex max-w-7xl flex-col gap-5 px-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-12">
        <div className="max-w-2xl">
          <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">{copy.closingTitle}</h2>
          <p className="mt-2 text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">{copy.closingDescription}</p>
        </div>
        <Link to="/portfolio/Projects/all" className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-2xl border border-brand-300 px-5 py-3 text-sm font-semibold text-brand-700 transition hover:bg-brand-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-300 dark:border-brand-400/40 dark:text-brand-200 dark:hover:bg-brand-500/10">
          {copy.closingAction}
        </Link>
      </Reveal>
    </div>
  );
};

export default Solutions;
