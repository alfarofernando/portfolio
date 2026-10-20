import { createContext, useCallback, useContext, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';

/* eslint-disable react/prop-types -- Provider children come from React composition. */
const ScreenScrollContext = createContext(null);
const savedPanels = new Map();
const MIN_DESKTOP_WIDTH = 1024;
const MIN_DESKTOP_HEIGHT = 700;
const WHEEL_THRESHOLD = 48;
const GESTURE_IDLE_MS = 180;
const TRANSITION_LOCK_MS = 620;

const getPanels = () => Array.from(document.querySelectorAll('[data-screen-panel]'));
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
  const activePanelRef = useRef(null);
  const previousLocationRef = useRef(null);
  const wheelTotalRef = useRef(0);
  const wheelDirectionRef = useRef(0);
  const lastWheelAtRef = useRef(0);
  const lockedUntilRef = useRef(0);
  const idleTimerRef = useRef(0);

  const setActive = useCallback((id) => {
    activePanelRef.current = id;
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
    const top = window.scrollY + panel.getBoundingClientRect().top;
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

  const movePanel = useCallback((direction, options = {}) => {
    const panels = refreshPanels();
    const currentIndex = Math.max(0, panels.findIndex((panel) => panel.id === activePanelRef.current));
    const target = panels[currentIndex + Math.sign(direction)];
    const moved = scrollToPanel(target, options);
    if (moved) replacePanelHash(target.id);
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
    const previous = previousLocationRef.current;
    if (previous?.key && activePanelRef.current) savedPanels.set(previous.key, activePanelRef.current);
    previousLocationRef.current = { key: locationKey };

    const panels = refreshPanels();
    const hashId = decodeURIComponent(hash.slice(1));
    const destination = navigationType === 'POP'
      ? panels.find((panel) => panel.id === savedPanels.get(locationKey))
      : null;
    const panel = destination ?? panels.find((item) => item.id === hashId) ?? panels[0];
    if (panel) {
      setActive(panel.id);
      window.requestAnimationFrame(() => {
        if (panel === panels[0]) window.scrollTo({ top: 0, behavior: 'auto' });
        else scrollToPanel(panel, { behavior: 'auto' });
      });
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

  useEffect(() => {
    const isDesktop = () => window.innerWidth >= MIN_DESKTOP_WIDTH && window.innerHeight >= MIN_DESKTOP_HEIGHT;
    const clearGesture = () => {
      window.clearTimeout(idleTimerRef.current);
      wheelTotalRef.current = 0;
      wheelDirectionRef.current = 0;
    };

    const handleWheel = (event) => {
      if (!isDesktop() || event.ctrlKey || Math.abs(event.deltaX) > Math.abs(event.deltaY)) return;
      if (event.target instanceof Element && event.target.closest('input, textarea, select, button, [contenteditable="true"], [data-native-wheel]')) return;

      const panels = panelsRef.current;
      const currentIndex = panels.findIndex((panel) => panel.id === activePanelRef.current);
      if (currentIndex < 0) return;
      const unit = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? window.innerHeight : 1;
      const delta = event.deltaY * unit;
      const next = panels[currentIndex + Math.sign(delta)];
      if (!next) return;

      event.preventDefault();
      const now = performance.now();
      if (now < lockedUntilRef.current) {
        lastWheelAtRef.current = now;
        lockedUntilRef.current = Math.max(lockedUntilRef.current, now + GESTURE_IDLE_MS);
        return;
      }
      if (now - lastWheelAtRef.current > GESTURE_IDLE_MS || wheelDirectionRef.current !== Math.sign(delta)) {
        wheelTotalRef.current = 0;
      }
      wheelDirectionRef.current = Math.sign(delta);
      wheelTotalRef.current += delta;
      lastWheelAtRef.current = now;
      window.clearTimeout(idleTimerRef.current);
      idleTimerRef.current = window.setTimeout(clearGesture, GESTURE_IDLE_MS);

      if (Math.abs(wheelTotalRef.current) < WHEEL_THRESHOLD) return;
      const direction = Math.sign(wheelTotalRef.current);
      if (!panels[currentIndex + direction]) {
        clearGesture();
        return;
      }
      wheelTotalRef.current = 0;
      lockedUntilRef.current = now + TRANSITION_LOCK_MS;
      movePanel(direction);
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.clearTimeout(idleTimerRef.current);
    };
  }, [movePanel]);

  const value = useMemo(() => ({ goToPanel, movePanel, activePanelId, panelIds }), [goToPanel, movePanel, activePanelId, panelIds]);
  return <ScreenScrollContext.Provider value={value}>{children}</ScreenScrollContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components -- The hook shares the provider's context.
export const useScreenScroll = () => {
  const context = useContext(ScreenScrollContext);
  if (!context) throw new Error('useScreenScroll must be used within ScreenScrollProvider');
  return context;
};
