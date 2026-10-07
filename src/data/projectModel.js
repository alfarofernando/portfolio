import catalog from '../../content/projects.json';

export const projectCatalog = catalog;

export function resolveProjectKey(projects, slug) {
  const value = String(slug ?? '').toLowerCase();
  return projects.find((project) =>
    project.slug.toLowerCase() === value ||
    project.aliases.some((alias) => alias.toLowerCase() === value)
  )?.id ?? null;
}

export function localizeProject(project, language, ui = {}) {
  const copy = project.copy[language] ?? project.copy.es;
  return {
    ...project,
    ...copy,
    key: project.id,
    description: copy.summary,
    ui,
  };
}

export const getLocalizedProjects = (language, ui = {}) =>
  projectCatalog.map((project) => localizeProject(project, language, ui));
