import { useEffect, useState, lazy, Suspense } from 'react';
import Router from './router/Router.jsx';
import SubFooter from './components/SubFooter.jsx';
import { useLanguage } from './context/LanguageContext.jsx';
import ParallaxBackground from './components/ParallaxBackground/ParallaxBackground';

const NavBar = lazy(() => import('./components/Navbar'));
const Footer = lazy(() => import('./components/Footer'));

const THEME_STORAGE_KEY = 'portfolio-theme';
const PARALLAX_ASSET_PATHS = [
  '/assets/parallax/bg-base.png',
  '/assets/parallax/bg-hud.png',
  '/assets/parallax/bg-glass-shapes.png',
  '/assets/parallax/bg-timeline-nodes.png',
  '/assets/parallax/bg-cta-glow.png',
  '/assets/parallax/bg-starfield.png',
  '/assets/parallax/bg-nebula-bokeh.png',
  '/assets/parallax/bg-data-streaks.png',
  '/assets/parallax/bg-wave-mesh.png',
  '/assets/parallax/bg-glass-panels.png',
  '/assets/parallax/bg-starfield-soft.png',
  '/assets/parallax/bg-orb-gradients.png',
  '/assets/parallax/bg-circuit-lines.png',
  '/assets/parallax/bg-wireframe-horizon.png',
  '/assets/parallax/bg-glass-soft-panels.png',
];

const preloadImage = (src) =>
  new Promise((resolve) => {
    const image = new Image();
    image.onload = () => resolve(src);
    image.onerror = () => resolve(src);
    image.src = src;
  });

const App = () => {
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window === 'undefined') return true;
    const storedPreference = window.localStorage.getItem(THEME_STORAGE_KEY);
    if (storedPreference) {
      return storedPreference === 'dark';
    }

    const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches;
    return prefersDark ?? true;
  });
  const [isBootLoading, setIsBootLoading] = useState(true);
  const { language, locales } = useLanguage();

  useEffect(() => {
    if (typeof document === 'undefined') return;

    const root = document.documentElement;
    root.classList.toggle('dark', darkMode);
    root.setAttribute('data-theme', darkMode ? 'dark' : 'light');
    root.style.colorScheme = darkMode ? 'dark' : 'light';

    if (typeof window !== 'undefined') {
      window.localStorage.setItem(THEME_STORAGE_KEY, darkMode ? 'dark' : 'light');
    }
  }, [darkMode]);

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;

    let cancelled = false;
    let loadHandler;

    const onWindowLoaded = new Promise((resolve) => {
      if (document.readyState === 'complete') {
        resolve(true);
        return;
      }

      loadHandler = () => resolve(true);
      window.addEventListener('load', loadHandler, { once: true });
    });

    const assetsLoaded = Promise.all(PARALLAX_ASSET_PATHS.map((asset) => preloadImage(asset)));
    const minDisplay = new Promise((resolve) => window.setTimeout(resolve, 350));
    const safetyTimeout = window.setTimeout(() => {
      if (!cancelled) setIsBootLoading(false);
    }, 18000);

    Promise.all([onWindowLoaded, assetsLoaded, minDisplay]).then(() => {
      if (!cancelled) setIsBootLoading(false);
    });

    return () => {
      cancelled = true;
      window.clearTimeout(safetyTimeout);
      if (loadHandler) {
        window.removeEventListener('load', loadHandler);
      }
    };
  }, []);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    document.body.style.overflow = isBootLoading ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isBootLoading]);

  const toggleTheme = () => setDarkMode((prev) => !prev);
  const loadingCopy = locales[language].common.loading;

  return (
    <div className={`${darkMode ? 'dark bg-neutral-950' : 'bg-transparent'} text-neutral-900 dark:text-neutral-100`} aria-busy={isBootLoading}>
      <ParallaxBackground
        className="relative flex min-h-screen flex-col"
        variant="default"
        intensity="medium"
        mediaParallax
        mutationSections={[
          { id: 'home', variant: 'home' },
          { id: 'projects', variant: 'projects' },
          { id: 'about', variant: 'about' },
          { id: 'global-cta', variant: 'cta' },
          { id: 'site-footer', variant: 'default' },
        ]}
      >
        <Suspense fallback={<div className="flex h-20 items-center justify-center text-sm text-neutral-500 dark:text-neutral-300">{loadingCopy}</div>}>
          <NavBar darkMode={darkMode} onToggleTheme={toggleTheme} />
        </Suspense>

        <main className="w-full flex-1 pt-28 md:pt-32">
          <Router />
        </main>

        <SubFooter />

        <Suspense fallback={null}>
          <Footer />
        </Suspense>
      </ParallaxBackground>

      {isBootLoading && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-neutral-950/88 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-4">
            <div className="h-12 w-12 animate-spin rounded-full border-2 border-brand-300/35 border-t-brand-300" />
            <p className="text-sm font-medium tracking-wide text-neutral-200">{loadingCopy}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
