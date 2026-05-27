import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Welcome from './Welcome';
import Projects from '../Projects/Projects';
import AboutMe from '../AboutMe/AboutMe';
import ParallaxBackground from '../../components/ParallaxBackground/ParallaxBackground';

const SECTION_SCROLL_OFFSET = 120;

const resolveSectionFromLocation = (pathname, hash) => {
  const normalizedHash = hash?.replace('#', '').trim().toLowerCase();
  if (normalizedHash) return normalizedHash;

  if (pathname.endsWith('/portfolio/projects')) return 'projects';
  if (pathname.endsWith('/portfolio/aboutme')) return 'about';
  return 'home';
};

const scrollToSection = (sectionId) => {
  const section = document.getElementById(sectionId);
  if (!section) return false;

  const sectionTop = section.getBoundingClientRect().top + window.scrollY;
  window.scrollTo({
    top: Math.max(sectionTop - SECTION_SCROLL_OFFSET, 0),
    behavior: 'smooth',
  });
  return true;
};

const PortfolioLanding = () => {
  const location = useLocation();

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const sectionId = resolveSectionFromLocation(location.pathname.toLowerCase(), location.hash);
    const shouldAnimate = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    window.requestAnimationFrame(() => {
      const didScroll = scrollToSection(sectionId);
      if (!didScroll && sectionId !== 'home') {
        scrollToSection('home');
      }

      if (!shouldAnimate) {
        const element = document.getElementById(sectionId) ?? document.getElementById('home');
        if (!element) return;
        const top = element.getBoundingClientRect().top + window.scrollY - SECTION_SCROLL_OFFSET;
        window.scrollTo(0, Math.max(top, 0));
      }
    });
  }, [location.hash, location.pathname]);

  return (
    <ParallaxBackground
      variant="home"
      intensity="high"
      mediaParallax
      mutationSections={[
        { id: 'home', variant: 'home' },
        { id: 'projects', variant: 'projects' },
        { id: 'about', variant: 'about' },
      ]}
    >
      <div className="relative">
        <div id="home" className="scroll-mt-32">
          <Welcome />
        </div>

        <div
          aria-hidden="true"
          className="pointer-events-none mx-auto h-px w-[min(92%,72rem)] bg-gradient-to-r from-transparent via-brand-400/40 to-transparent"
        />

        <div id="projects" className="scroll-mt-32">
          <Projects />
        </div>

        <div
          aria-hidden="true"
          className="pointer-events-none mx-auto h-px w-[min(92%,68rem)] bg-gradient-to-r from-transparent via-brand-300/30 to-transparent"
        />

        <div id="about" className="scroll-mt-32">
          <AboutMe />
        </div>
      </div>
    </ParallaxBackground>
  );
};

export default PortfolioLanding;
