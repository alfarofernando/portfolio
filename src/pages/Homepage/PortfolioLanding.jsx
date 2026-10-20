import Welcome from './Welcome';
import Projects from '../Projects/Projects';
import ScreenPanel from '../../components/ScreenPanel.jsx';
import TechnologyCards from './components/TechnologyCards.jsx';
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
        <section className="mx-auto w-full max-w-7xl px-4 py-5 sm:px-6 lg:px-12 lg:py-2">
          <Reveal className="mx-auto max-w-3xl text-center">
            <h2 id="technologies-title" className="text-2xl font-semibold text-neutral-900 dark:text-white sm:text-3xl">{technologyCopy.title}</h2>
            <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-300">{technologyCopy.description}</p>
          </Reveal>
          <div className="mt-4">
            <TechnologyCards />
          </div>
        </section>
      </ScreenPanel>
      <Projects />
    </div>
  );
};

export default PortfolioLanding;
