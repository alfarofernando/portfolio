import Welcome from './Welcome';
import Projects from '../Projects/Projects';
import AboutMe from '../AboutMe/AboutMe';
import ExperiencePreview from '../Experience/components/ExperiencePreview.jsx';

const PortfolioLanding = () => {
  return (
    <div className="relative">
      <div id="home" className="scroll-mt-32">
        <Welcome />
      </div>

      <div
        aria-hidden="true"
        className="pointer-events-none mx-auto h-px w-[min(92%,72rem)] bg-gradient-to-r from-transparent via-brand-400/35 to-transparent"
      />

      <div id="projects" className="scroll-mt-32">
        <Projects />
      </div>

      <ExperiencePreview />

      <div
        aria-hidden="true"
        className="pointer-events-none mx-auto h-px w-[min(92%,68rem)] bg-gradient-to-r from-transparent via-brand-300/28 to-transparent"
      />

      <div id="about" className="scroll-mt-32">
        <AboutMe />
      </div>
    </div>
  );
};

export default PortfolioLanding;
