import { createContext, useCallback, useContext, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';
import { resolveNavigationTarget } from '../utils/routeNavigation.js';

/* eslint-disable react/prop-types -- Provider children come from React composition. */
const ScreenScrollContext = createContext(null);

const getPanels = () => Array.from(document.querySelectorAll('[data-screen-panel]'));
const resolveHashPanel = (panels, hashId) => {
  const direct = panels.find((panel) => panel.id === hashId
    || panel.dataset.screenAliases?.split(/\s+/).includes(hashId));
  if (direct) return direct;

  const match = hashId.match(/^(.*-)(\d+)$/);
  if (!match) return null;

  const prefix = match[1];
  const numberedPanels = panels
    .map((panel) => {
      if (!panel.id.startsWith(prefix)) return null;
      const suffix = panel.id.slice(prefix.length);
      if (!/^\d+$/.test(suffix)) return null;
      return { panel, number: Number(suffix) };
    })
    .filter(Boolean)
    .sort((left, right) => left.number - right.number);

  return numberedPanels[numberedPanels.length - 1]?.panel ?? null;
};
const replacePanelHash = (id) => {
  const nextUrl = `${window.location.pathname}${window.location.search}#${id}`;
  window.history.replaceState(window.history.state, '', nextUrl);
};
const getPanelAtViewport = (panels) => {
  if (!panels.length) return null;
  const viewportCenter = window.innerHeight / 2;
  return panels.reduce((closest, panel) => {
    const rect = panel.getBoundingClientRect();
    const distance = viewportCenter < rect.top ? rect.top - viewportCenter
      : viewportCenter > rect.bottom ? viewportCenter - rect.bottom
        : 0;
    return distance < closest.distance ? { panel, distance } : closest;
  }, { panel: panels[0], distance: Number.POSITIVE_INFINITY }).panel;
};

export const ScreenScrollProvider = ({ children }) => {
  const location = useLocation();
  const navigationType = useNavigationType();
  const { key: locationKey, pathname, hash } = location;
  const [panelIds, setPanelIds] = useState([]);
  const [activePanelId, setActivePanelId] = useState(null);
  const panelsRef = useRef([]);
  const previousLocationRef = useRef(null);
  const scrollPositionsRef = useRef(new Map());

  const setActive = useCallback((id) => {
    setActivePanelId(id);
  }, []);

  const refreshPanels = useCallback(() => {
    const panels = getPanels();
    panelsRef.current = panels;
    setPanelIds(panels.map((panel) => panel.id));
    const current = getPanelAtViewport(panels);
    if (current) setActive(current.id);
    return panels;
  }, [setActive]);

  const scrollToPanel = useCallback((panel, { focus = false, behavior } = {}) => {
    if (!panel) return false;
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
    const top = panel.classList.contains('screen-panel--first')
      ? 0
      : window.scrollY + panel.getBoundingClientRect().top;
    window.scrollTo({ top, behavior: behavior ?? (reduced ? 'auto' : 'smooth') });
    setActive(panel.id);
    if (focus) {
      window.requestAnimationFrame(() => {
        const heading = panel.querySelector('h1, h2, h3') ?? panel;
        if (!heading.hasAttribute('tabindex')) heading.setAttribute('tabindex', '-1');
        heading.focus({ preventScroll: true });
      });
    }
    return true;
  }, [setActive]);

  const goToPanel = useCallback((id, options) => {
    const panels = refreshPanels();
    const destination = panels.find((panel) => panel.id === id);
    const moved = scrollToPanel(destination, options);
    if (moved) replacePanelHash(destination.id);
    return moved;
  }, [refreshPanels, scrollToPanel]);

  useLayoutEffect(() => {
    const previousRestoration = window.history.scrollRestoration;
    window.history.scrollRestoration = 'manual';
    return () => {
      window.history.scrollRestoration = previousRestoration;
    };
  }, []);

  useLayoutEffect(() => {
    const previousLocation = previousLocationRef.current;
    if (previousLocation?.key && previousLocation.key !== locationKey) {
      scrollPositionsRef.current.set(previousLocation.key, window.scrollY);
    }
    previousLocationRef.current = { key: locationKey };

    const panels = refreshPanels();
    const target = resolveNavigationTarget({
      navigationType,
      pathname,
      hash,
      savedPosition: scrollPositionsRef.current.get(locationKey),
    });

    if (target.kind === 'restore') {
      window.requestAnimationFrame(() => window.scrollTo({ top: target.top, behavior: 'auto' }));
    } else if (target.kind === 'hash' || target.kind === 'section') {
      const targetId = target.kind === 'hash' ? decodeURIComponent(target.sectionId) : target.sectionId;
      const panel = resolveHashPanel(panels, targetId);
      if (!panel) return;
      setActive(panel.id);
      window.requestAnimationFrame(() => scrollToPanel(panel, { behavior: 'auto', focus: true }));
    } else {
      setActive(panels[0]?.id ?? null);
      window.requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: 'auto' }));
    }
  }, [hash, locationKey, navigationType, pathname, refreshPanels, scrollToPanel, setActive]);

  useEffect(() => {
    const observer = new MutationObserver(() => {
      const previousIds = panelsRef.current.map((panel) => panel.id).join('|');
      const panels = getPanels();
      panelsRef.current = panels;
      const nextIds = panels.map((panel) => panel.id).join('|');
      if (previousIds !== nextIds) setPanelIds(panels.map((panel) => panel.id));
    });
    observer.observe(document.getElementById('main-content') ?? document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    let scrollFrame = 0;
    const updateCurrentPanel = () => {
      cancelAnimationFrame(scrollFrame);
      scrollFrame = requestAnimationFrame(() => {
        const current = getPanelAtViewport(panelsRef.current);
        if (current) setActive(current.id);
      });
    };
    window.addEventListener('scroll', updateCurrentPanel, { passive: true });
    window.addEventListener('resize', updateCurrentPanel, { passive: true });
    return () => {
      cancelAnimationFrame(scrollFrame);
      window.removeEventListener('scroll', updateCurrentPanel);
      window.removeEventListener('resize', updateCurrentPanel);
    };
  }, [setActive]);

  const value = useMemo(() => ({ goToPanel, activePanelId, panelIds }), [goToPanel, activePanelId, panelIds]);
  return <ScreenScrollContext.Provider value={value}>{children}</ScreenScrollContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components -- The hook shares the provider's context.
export const useScreenScroll = () => {
  const context = useContext(ScreenScrollContext);
  if (!context) throw new Error('useScreenScroll must be used within ScreenScrollProvider');
  return context;
};
