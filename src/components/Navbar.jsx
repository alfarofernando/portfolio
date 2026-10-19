import { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import AnimatedContent from '../pages/Homepage/components/AnimatedContent';
import { useReducedMotion } from 'framer-motion';
import { motionTokens } from './motion/motionTokens.js';

/* eslint-disable react/prop-types -- App provides the theme state and callback. */
const NavBar = ({ darkMode, onToggleTheme }) => {
  const location = useLocation();
  const { language, changeLanguage, locales } = useLanguage();
  const { nav, brand, theme, menu } = locales[language];
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const prefersReducedMotion = useReducedMotion();
  const menuButtonRef = useRef(null);

  const navigation = useMemo(
    () => [
      { label: nav.home, sectionId: 'home' },
      { label: nav.projects, sectionId: 'projects' },
      { label: nav.experience, path: '/portfolio/Experience' },
      { label: nav.solutions, path: '/portfolio/Solutions' },
      { label: nav.aboutMe, sectionId: 'about' },
    ],
    [nav]
  );

  const isLandingPath = ['/portfolio/', '/portfolio/home', '/portfolio/projects', '/portfolio/aboutme']
    .includes(location.pathname.toLowerCase());
  const activeSection = location.hash.slice(1)
    || (location.pathname.toLowerCase().endsWith('/projects') ? 'projects'
      : location.pathname.toLowerCase().endsWith('/aboutme') ? 'about'
        : isLandingPath ? 'home' : null);

  const isActive = (item) => item.path
    ? location.pathname.toLowerCase() === item.path.toLowerCase()
    : isLandingPath && activeSection === item.sectionId;
  const destinationFor = (item) => item.path
    ?? { pathname: '/portfolio/', hash: `#${item.sectionId}` };

  useEffect(() => {
    if (!isMenuOpen) return undefined;

    const closeOnEscape = (event) => {
      if (event.key !== 'Escape') return;
      setIsMenuOpen(false);
      window.requestAnimationFrame(() => menuButtonRef.current?.focus({ preventScroll: true }));
    };

    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [isMenuOpen]);

  const toggleLanguage = () => {
    const nextLanguage = language === 'es' ? 'en' : 'es';
    changeLanguage(nextLanguage);
    document.documentElement.lang = nextLanguage;
  };

  return (
    <motion.header
      initial={prefersReducedMotion ? false : { opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: prefersReducedMotion ? 0 : motionTokens.enterDuration, ease: motionTokens.ease }}
      className="fixed inset-x-0 top-4 z-40 flex justify-center px-3 sm:px-4"
    >
      <div className="w-full max-w-6xl xl:max-w-7xl">
        <div className="relative">
          <div className="absolute inset-0 rounded-3xl bg-white/60 blur-sm dark:bg-slate-900/60" />
          <nav className="relative flex items-center justify-between gap-4 rounded-3xl border border-white/50 bg-white/80 px-5 py-3 shadow-brand backdrop-blur-md dark:border-white/10 dark:bg-slate-900/80">
            <Link
              to={{ pathname: '/portfolio/', hash: '#home' }}
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center gap-2 text-left"
            >
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-600 text-lg font-semibold text-white shadow-brand">
                {brand.initials}
              </span>
              <div className="hidden flex-col leading-tight sm:flex">
                <span className="text-sm font-semibold text-neutral-700 dark:text-neutral-200">
                  {brand.name}
                </span>
                <span className="text-xs text-neutral-500 dark:text-neutral-400">{brand.role}</span>
              </div>
            </Link>

            <div className="hidden items-center gap-1 rounded-full bg-white/60 p-1 dark:bg-slate-800/80 md:flex">
              {navigation.map((item) => (
                <Link
                  key={item.path ?? item.sectionId}
                  to={destinationFor(item)}
                  onClick={() => setIsMenuOpen(false)}
                  aria-current={isActive(item) ? (item.path ? 'page' : 'location') : undefined}
                  className={`group relative inline-flex items-center rounded-full px-4 py-2 text-sm font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-200 ${isActive(item) ? 'text-brand-700 dark:text-brand-200' : 'text-neutral-600 hover:text-brand-700 dark:text-neutral-200'}`}
                >
                  <span className={`absolute inset-0 rounded-full bg-brand-50 transition-opacity dark:bg-brand-500/20 ${isActive(item) ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`} />
                  <span className="relative z-10">
                    <AnimatedContent keyProp={`${language}-${item.path ?? item.sectionId}`}>
                      {item.label}
                    </AnimatedContent>
                  </span>
                </Link>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={toggleLanguage}
                className="inline-flex items-center gap-1 rounded-full border border-brand-200 px-3 py-1 text-xs font-semibold text-brand-700 transition hover:bg-brand-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-200 dark:border-brand-400/40 dark:text-brand-200"
              >
                {language === 'es' ? 'ES' : 'EN'}
              </button>

              <button
                type="button"
                onClick={onToggleTheme}
                className="inline-flex items-center gap-2 rounded-full bg-brand-600 px-3 py-1 text-xs font-semibold text-white shadow-brand transition hover:bg-brand-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-200"
                aria-label={theme.ariaLabel}
              >
                <span className="hidden sm:inline">{darkMode ? theme.dark : theme.light}</span>
                <span className="font-mono text-xs">{darkMode ? theme.on : theme.off}</span>
              </button>

              <button
                type="button"
                ref={menuButtonRef}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-neutral-200 text-neutral-700 transition hover:border-brand-200 hover:text-brand-700 dark:border-neutral-700 dark:text-neutral-200 md:hidden"
                onClick={() => setIsMenuOpen((prev) => !prev)}
                aria-label={isMenuOpen ? menu.closeLabel : menu.openLabel}
                aria-expanded={isMenuOpen}
                aria-controls="primary-navigation-menu"
              >
                <span className="text-xs font-semibold uppercase" aria-hidden="true">
                  {isMenuOpen ? menu.close : menu.open}
                </span>
              </button>
            </div>
          </nav>
        </div>

        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={prefersReducedMotion ? false : { opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: -6 }}
              transition={{ duration: prefersReducedMotion ? 0 : motionTokens.microDuration, ease: motionTokens.ease }}
              id="primary-navigation-menu"
              className="mt-3 rounded-3xl border border-white/40 bg-white/90 p-4 shadow-lg backdrop-blur dark:border-white/10 dark:bg-slate-900/90 md:hidden"
            >
              <div className="flex flex-col gap-2">
                {navigation.map((item) => (
                <Link
                  key={item.path ?? item.sectionId}
                  to={destinationFor(item)}
                  onClick={() => setIsMenuOpen(false)}
                  aria-current={isActive(item) ? (item.path ? 'page' : 'location') : undefined}
                  className="rounded-2xl px-4 py-3 text-left text-sm font-semibold text-neutral-700 transition hover:bg-brand-50 hover:text-brand-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-200 dark:text-neutral-200 dark:hover:bg-brand-500/20"
                  >
                    {item.label}
                </Link>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
};

export default NavBar;
