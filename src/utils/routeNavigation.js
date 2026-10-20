export const normalizePathname = (pathname) => {
  const normalizedPath = String(pathname ?? '').replace(/\/+$/, '').toLowerCase();
  return normalizedPath || '/';
};

const resolveLandingAlias = (pathname) => {
  const normalizedPath = normalizePathname(pathname);
  if (normalizedPath.endsWith('/portfolio/projects')) return 'projects';
  if (normalizedPath.endsWith('/portfolio/aboutme')) return 'home';
  return null;
};

export const resolveNavigationTarget = ({
  navigationType = 'PUSH',
  pathname = '',
  hash = '',
  savedPosition,
} = {}) => {
  if (navigationType === 'POP' && Number.isFinite(savedPosition)) {
    return { kind: 'restore', top: Math.max(0, savedPosition) };
  }

  const sectionId = String(hash).replace(/^#/, '').trim();
  if (sectionId) return { kind: 'hash', sectionId };

  const alias = resolveLandingAlias(pathname);
  return alias ? { kind: 'section', sectionId: alias } : { kind: 'top' };
};
