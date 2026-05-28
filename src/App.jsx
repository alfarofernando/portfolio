import { useEffect, useState, lazy, Suspense } from 'react';
import Router from './router/Router.jsx';
import SubFooter from './components/SubFooter.jsx';
import { useLanguage } from './context/LanguageContext.jsx';
import ParallaxBackground from './components/ParallaxBackground/ParallaxBackground';

const NavBar = lazy(() => import('./components/Navbar'));
const Footer = lazy(() => import('./components/Footer'));

const THEME_STORAGE_KEY = 'portfolio-theme';
const BOOT_EXTRA_DELAY_MS = 500;
const BOOT_SAFETY_TIMEOUT_MS = 28000;

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
    let loadHandler = null;

    const wait = (ms) =>
      new Promise((resolve) => {
        window.setTimeout(resolve, ms);
      });

    const onWindowLoaded = new Promise((resolve) => {
      if (document.readyState === 'complete') {
        resolve(true);
        return;
      }

      loadHandler = () => resolve(true);
      window.addEventListener('load', loadHandler, { once: true });
    });

    const onFontsReady = document.fonts?.ready
      ? document.fonts.ready.catch(() => undefined)
      : Promise.resolve();

    const waitForImage = (img) =>
      new Promise((resolve) => {
        const done = () => resolve(true);

        if (img.complete) {
          if (typeof img.decode === 'function') {
            img.decode().catch(() => undefined).finally(done);
            return;
          }
          done();
          return;
        }

        const onDone = () => {
          img.removeEventListener('load', onDone);
          img.removeEventListener('error', onDone);
          done();
        };

        img.addEventListener('load', onDone, { once: true });
        img.addEventListener('error', onDone, { once: true });

        window.setTimeout(onDone, 7000);
      });

    const onVisibleImagesReady = Promise.all(
      Array.from(document.images)
        .filter((img) => img.loading !== 'lazy')
        .map((img) => waitForImage(img)),
    );

    const safetyTimeout = window.setTimeout(() => {
      if (!cancelled) setIsBootLoading(false);
    }, BOOT_SAFETY_TIMEOUT_MS);

    Promise.all([onWindowLoaded, onFontsReady, onVisibleImagesReady])
      .then(() => wait(BOOT_EXTRA_DELAY_MS))
      .then(() => {
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
        intensity="low"
        mediaParallax
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
