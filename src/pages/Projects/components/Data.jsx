import { getLocalizedProjects, resolveProjectKey } from '../../../data/projectModel.js';
import { resolveProjectMedia } from '../../../data/media.js';

export { resolveProjectKey };

export const getProjects = (locales, language) => {
  const ui = locales[language].projectPage;
  return getLocalizedProjects(language, ui).map((project) => {
    const { hero, gallery } = resolveProjectMedia(project.mediaIds);
    return {
      ...project,
      heroMedia: hero,
      image: hero?.src,
      heroImageAlt: hero?.alt?.[language],
      screenshots: gallery,
      link: project.links.find((item) => item.type === 'repository')?.url ?? null,
    };
  });
};
