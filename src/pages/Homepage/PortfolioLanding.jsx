import Welcome from './Welcome';
import Projects from '../Projects/Projects';
import ExperiencePreview from '../Experience/components/ExperiencePreview.jsx';
import ScreenPanel from '../../components/ScreenPanel.jsx';
import TechCarousel from './components/TechCarousel.jsx';
import Reveal from '../../components/motion/Reveal.jsx';
import { useLanguage } from '../../context/LanguageContext.jsx';

const PortfolioLanding = () => {
  const { language, locales } = useLanguage();
  const technologyCopy = locales[language].technologyPanel;

  return (
    <div className="relative">
      <ScreenPanel id="home" titleId="home-title" first>
        <Welcome />
      </ScreenPanel>
      <ScreenPanel id="technologies" titleId="technologies-title">
        <section className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-12 lg:py-2">
          <Reveal className="rounded-3xl border border-brand-100/60 bg-white/85 p-5 shadow-lg backdrop-blur dark:border-brand-500/20 dark:bg-slate-900/70 sm:p-7">
            <h2 id="technologies-title" className="text-2xl font-semibold text-neutral-900 dark:text-white sm:text-3xl">{technologyCopy.title}</h2>
            <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-300">{technologyCopy.description}</p>
            <div className="mt-5"><TechCarousel /></div>
          </Reveal>
        </section>
      </ScreenPanel>
      <Projects />
      <ScreenPanel id="experience" titleId="experience-preview-heading">
        <ExperiencePreview />
      </ScreenPanel>
    </div>
  );
};

export default PortfolioLanding;
