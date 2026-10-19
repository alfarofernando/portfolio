import { useEffect, useLayoutEffect, useRef } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext.jsx';
import { resolveNavigationTarget } from '../utils/routeNavigation.js';

const savedScrollPositions = new Map();
const MAX_SAVED_POSITIONS = 50;

const saveScrollPosition = (key, top) => {
  if (!key || !Number.isFinite(top)) return;
  savedScrollPositions.set(key, top);
  if (savedScrollPositions.size > MAX_SAVED_POSITIONS) {
    savedScrollPositions.delete(savedScrollPositions.keys().next().value);
  }
};

const focusWithoutScrolling = (target) => {
  if (!target) return;
  if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
  target.classList.add('route-focus-target');
  target.focus({ preventScroll: true });
};

const focusMainHeading = () => {
  const main = document.getElementById('main-content');
  focusWithoutScrolling(main?.querySelector('h1') ?? main);
};

const RouteEffects = () => {
  const location = useLocation();
  const navigationType = useNavigationType();
  const previousLocation = useRef(null);
  const { language, locales } = useLanguage();

  useLayoutEffect(() => {
    const previousRestoration = window.history.scrollRestoration;
    window.history.scrollRestoration = 'manual';
    return () => {
      window.history.scrollRestoration = previousRestoration;
    };
  }, []);

  useEffect(() => {
    const saveBeforeLeavingPage = () => {
      const active = previousLocation.current;
      if (active) saveScrollPosition(active.key, window.scrollY);
    };

    window.addEventListener('pagehide', saveBeforeLeavingPage);
    return () => window.removeEventListener('pagehide', saveBeforeLeavingPage);
  }, []);

  useLayoutEffect(() => {
    if (previousLocation.current?.key !== location.key) {
      saveScrollPosition(previousLocation.current?.key, window.scrollY);
    }
    previousLocation.current = location;

    const target = resolveNavigationTarget({
      navigationType,
      pathname: location.pathname,
      hash: location.hash,
      savedPosition: savedScrollPositions.get(location.key),
    });

    if (target.kind === 'restore') {
      window.scrollTo({ top: target.top, behavior: 'auto' });
      return;
    }

    if (target.kind === 'hash' || target.kind === 'section') {
      const section = document.getElementById(target.sectionId);
      if (section) {
        section.scrollIntoView({ block: 'start', behavior: 'auto' });
        focusWithoutScrolling(section.querySelector('h1, h2, h3') ?? section);
        return;
      }
    }

    window.scrollTo({ top: 0, behavior: 'auto' });
    focusMainHeading();
  }, [location, navigationType]);

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
