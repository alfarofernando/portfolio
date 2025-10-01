import { useEffect, useState, lazy, Suspense } from 'react';
import Router from './router/Router.jsx';
import SubFooter from './components/SubFooter.jsx';

const NavBar = lazy(() => import('./components/Navbar'));
const Footer = lazy(() => import('./components/Footer'));

const App = () => {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  const toggleTheme = () => setDarkMode((prev) => !prev);

  return (
    <div className={`${darkMode ? 'dark bg-neutral-950' : 'bg-transparent'} text-neutral-900 dark:text-neutral-100`}>
      <div className="relative flex min-h-screen flex-col overflow-hidden">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 rounded-full bg-brand-400/25 blur-[130px]" />
          <div className="absolute right-[-6rem] top-1/3 h-80 w-80 rounded-full bg-accent-300/30 blur-[150px]" />
          <div className="absolute bottom-[-12rem] left-[-6rem] h-96 w-96 rounded-full bg-brand-700/20 blur-[160px]" />
        </div>

        <Suspense fallback={<div className="flex h-20 items-center justify-center text-sm text-neutral-500">Cargando...</div>}>
          <NavBar darkMode={darkMode} onToggleTheme={toggleTheme} />
        </Suspense>

        <main className="flex-1 pt-28 md:pt-32">
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