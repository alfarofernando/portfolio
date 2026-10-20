import { useEffect, useState, lazy, Suspense } from 'react';
import Router from './router/Router.jsx';
import SubFooter from './components/SubFooter.jsx';
import ParallaxBackground from './components/ParallaxBackground/ParallaxBackground';
import WhatsAppButton from './components/WhatsAppButton.jsx';
import ScreenPanel from './components/ScreenPanel.jsx';
import { ScreenScrollProvider } from './context/ScreenScrollContext.jsx';

const NavBar = lazy(() => import('./components/Navbar'));
const Footer = lazy(() => import('./components/Footer'));

const THEME_STORAGE_KEY = 'portfolio-theme';

const App = () => {
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window === 'undefined') return true;
    const storedPreference = window.localStorage.getItem(THEME_STORAGE_KEY);
    if (storedPreference) return storedPreference === 'dark';

    const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches;
    return prefersDark ?? true;
  });
  useEffect(() => {
    if (typeof document === 'undefined') return;

    const root = document.documentElement;
    root.classList.toggle('dark', darkMode);
    root.setAttribute('data-theme', darkMode ? 'dark' : 'light');
    root.style.colorScheme = darkMode ? 'dark' : 'light';
    window.localStorage.setItem(THEME_STORAGE_KEY, darkMode ? 'dark' : 'light');
  }, [darkMode]);

  return (
    <ScreenScrollProvider>
      <div className={`${darkMode ? 'dark bg-neutral-950' : 'bg-transparent'} text-neutral-900 dark:text-neutral-100`}>
        <ParallaxBackground className="relative flex min-h-screen flex-col">
          <Suspense fallback={<div aria-hidden="true" className="shrink-0" style={{ height: 'var(--site-header-height)' }} />}>
            <NavBar darkMode={darkMode} onToggleTheme={() => setDarkMode((previous) => !previous)} />
          </Suspense>

          <main id="main-content" tabIndex={-1} className="w-full flex-1">
            <Router />
          </main>

          <ScreenPanel id="contact" titleId="contact-heading" className="screen-panel--contact">
            <SubFooter />
            <Suspense fallback={null}>
              <Footer />
            </Suspense>
          </ScreenPanel>
        </ParallaxBackground>
        <WhatsAppButton />
      </div>
    </ScreenScrollProvider>
  );
};

export default App;
