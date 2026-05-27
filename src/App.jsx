import { useEffect, useState, lazy, Suspense } from 'react';
import Router from './router/Router.jsx';
import SubFooter from './components/SubFooter.jsx';
import { useLanguage } from './context/LanguageContext.jsx';
import ParallaxBackground from './components/ParallaxBackground/ParallaxBackground';

const NavBar = lazy(() => import('./components/Navbar'));
const Footer = lazy(() => import('./components/Footer'));

const THEME_STORAGE_KEY = 'portfolio-theme';

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

  const toggleTheme = () => setDarkMode((prev) => !prev);
  const loadingCopy = locales[language].common.loading;

  return (
    <div className={`${darkMode ? 'dark bg-neutral-950' : 'bg-transparent'} text-neutral-900 dark:text-neutral-100`}>
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
    </div>
  );
};

export default App;
