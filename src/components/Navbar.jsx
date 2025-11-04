import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import AnimatedContent from '../pages/Homepage/components/AnimatedContent';

const NavBar = ({ darkMode, onToggleTheme }) => {
  const navigate = useNavigate();
  const { language, changeLanguage, locales } = useLanguage();
  const { nav, brand, theme, menu } = locales[language];
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navigation = useMemo(
    () => [
      { label: nav.home, to: '/portfolio/Home' },
      { label: nav.projects, to: '/portfolio/Projects' },
      { label: nav.aboutMe, to: '/portfolio/AboutMe' },
    ],
    [nav]
  );

  const handleNavigate = (to) => {
    navigate(to);
    setIsMenuOpen(false);
  };

  const toggleLanguage = () => {
    const nextLanguage = language === 'es' ? 'en' : 'es';
    changeLanguage(nextLanguage);
    document.documentElement.lang = nextLanguage;
  };

  return (
    <motion.header
      initial={{ opacity: 0, y: -24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="fixed inset-x-0 top-4 z-40 flex justify-center px-3 sm:px-4"
    >
      <div className="w-full max-w-6xl xl:max-w-7xl">
        <div className="relative">
          <div className="absolute inset-0 rounded-3xl bg-white/60 blur-sm dark:bg-slate-900/60" />
          <nav className="relative flex items-center justify-between gap-4 rounded-3xl border border-white/50 bg-white/80 px-5 py-3 shadow-brand backdrop-blur-md dark:border-white/10 dark:bg-slate-900/80">
            <button
              type="button"
              onClick={() => handleNavigate('/portfolio/Home')}
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
            </button>

            <div className="hidden items-center gap-1 rounded-full bg-white/60 p-1 dark:bg-slate-800/80 md:flex">
              {navigation.map((item) => (
                <button
                  key={item.to}
                  type="button"
                  onClick={() => handleNavigate(item.to)}
                  className="group relative inline-flex items-center rounded-full px-4 py-2 text-sm font-medium text-neutral-600 transition hover:text-brand-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-200 dark:text-neutral-200"
                >
                  <span className="absolute inset-0 rounded-full bg-brand-50 opacity-0 transition-opacity group-hover:opacity-100 dark:bg-brand-500/20" />
                  <span className="relative z-10">
                    <AnimatedContent keyProp={`${language}-${item.to}`}>
                      {item.label}
                    </AnimatedContent>
                  </span>
                </button>
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
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-neutral-200 text-neutral-700 transition hover:border-brand-200 hover:text-brand-700 dark:border-neutral-700 dark:text-neutral-200 md:hidden"
                onClick={() => setIsMenuOpen((prev) => !prev)}
                aria-label={isMenuOpen ? menu.closeLabel : menu.openLabel}
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
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="mt-3 rounded-3xl border border-white/40 bg-white/90 p-4 shadow-lg backdrop-blur dark:border-white/10 dark:bg-slate-900/90 md:hidden"
            >
              <div className="flex flex-col gap-2">
                {navigation.map((item) => (
                  <button
                    key={item.to}
                    type="button"
                    onClick={() => handleNavigate(item.to)}
                    className="rounded-2xl px-4 py-3 text-left text-sm font-semibold text-neutral-700 transition hover:bg-brand-50 hover:text-brand-700 dark:text-neutral-200 dark:hover:bg-brand-500/20"
                  >
                    {item.label}
                  </button>
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
