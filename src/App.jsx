import { useEffect, useState, lazy, Suspense } from 'react';
import Router from './router/Router.jsx';
import SubFooter from './components/SubFooter.jsx';
import { useLanguage } from './context/LanguageContext.jsx';

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
      <div className="relative flex min-h-screen flex-col overflow-hidden">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 rounded-full bg-brand-400/25 blur-[130px]" />
          <div className="absolute right-[-6rem] top-1/3 h-80 w-80 rounded-full bg-accent-300/30 blur-[150px]" />
          <div className="absolute bottom-[-12rem] left-[-6rem] h-96 w-96 rounded-full bg-brand-700/20 blur-[160px]" />
        </div>

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
      </div>
    </div>
  );
};

export default App;
