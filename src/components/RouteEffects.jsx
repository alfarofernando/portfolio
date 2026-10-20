import { useLayoutEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext.jsx';

const focusWithoutScrolling = (target) => {
  if (!target) return;
  if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
  target.classList.add('route-focus-target');
  target.focus({ preventScroll: true });
};

const RouteEffects = () => {
  const location = useLocation();
  const previousKey = useRef(null);
  const { language, locales } = useLanguage();

  useLayoutEffect(() => {
    if (previousKey.current !== location.key) {
      previousKey.current = location.key;
      const main = document.getElementById('main-content');
      focusWithoutScrolling(main?.querySelector('h1') ?? main);
    }
  }, [location.key]);

  useLayoutEffect(() => {
    const { seo, brand } = locales[language];
    const main = document.getElementById('main-content');
    const title = main?.querySelector('h1')?.textContent?.trim();
    const normalizedPath = location.pathname.replace(/\/+$/, '').toLowerCase();
    const pageKey = normalizedPath.endsWith('/solutions')
      ? 'solutions'
      : normalizedPath.endsWith('/experience')
        ? 'experience'
        : normalizedPath.endsWith('/projects/all')
          ? 'catalog'
          : /\/projects\/[^/]+$/.test(normalizedPath)
            ? 'project'
            : ['/portfolio', '/portfolio/home', '/portfolio/projects', '/portfolio/aboutme'].includes(normalizedPath)
              ? 'home'
              : 'notFound';
    const pageSeo = seo.pages[pageKey];
    document.title = pageKey === 'home'
      ? seo.title
      : `${title || pageSeo.title} · ${brand.name} | Software Engineer`;

    const description = document.querySelector('meta[name="description"]');
    const openGraphTitle = document.querySelector('meta[property="og:title"]');
    const openGraphDescription = document.querySelector('meta[property="og:description"]');
    if (description) description.setAttribute('content', pageSeo.description);
    if (openGraphTitle) openGraphTitle.setAttribute('content', document.title);
    if (openGraphDescription) openGraphDescription.setAttribute('content', pageSeo.description);
  }, [language, locales, location.pathname]);

  return null;
};

export default RouteEffects;
