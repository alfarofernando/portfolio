import barloventoLogo from '../assets/images/companies/barlovento-official.png';
import netegiaLogo from '../assets/images/companies/netegia-official.png';
import wiseLogo from '../assets/images/companies/wise-capital-official.png';
import guardiaPhoto from '../assets/images/companies/guardia-urbana-official.webp';
import fonobusCampaign from '../assets/images/companies/fonobus-official.webp';
import cvgenioCover from '../assets/images/CVGenio/cvgenio-cover.svg';
import alfateamLogo from '../assets/images/AlfaTeam/alfaTeamLogo.webp';
import storepcLogo from '../assets/images/StorePC/storepcLogo.webp';
import portfolioV1Logo from '../assets/images/PortfolioOld/PortfolioOldLogo.webp';
import noteitLogo from '../assets/images/NoteIt/noteItLogo.webp';
import sguLogo from '../assets/images/PortalSGU/sgulogo.png';
import alfateamGallery from '../assets/images/AlfaTeam/1.webp';
import alfateam2 from '../assets/images/AlfaTeam/2.webp';
import alfateam3 from '../assets/images/AlfaTeam/3.webp';
import alfateam4 from '../assets/images/AlfaTeam/4.webp';
import alfateam5 from '../assets/images/AlfaTeam/5.webp';
import alfateam6 from '../assets/images/AlfaTeam/6.webp';
import alfateam7 from '../assets/images/AlfaTeam/7.webp';
import alfateam8 from '../assets/images/AlfaTeam/8.webp';
import alfateam9 from '../assets/images/AlfaTeam/9.webp';
import alfateam10 from '../assets/images/AlfaTeam/10.webp';
import alfateam11 from '../assets/images/AlfaTeam/11.webp';
import alfateam12 from '../assets/images/AlfaTeam/12.webp';
import storepcGallery from '../assets/images/StorePC/1.webp';
import storepc2 from '../assets/images/StorePC/2.webp';
import storepc3 from '../assets/images/StorePC/3.webp';
import storepc4 from '../assets/images/StorePC/4.webp';
import storepc5 from '../assets/images/StorePC/5.webp';
import storepc6 from '../assets/images/StorePC/6.webp';
import storepc7 from '../assets/images/StorePC/7.webp';
import storepc8 from '../assets/images/StorePC/8.webp';
import storepc9 from '../assets/images/StorePC/9.webp';
import storepc10 from '../assets/images/StorePC/10.webp';
import storepc11 from '../assets/images/StorePC/11.webp';
import storepc12 from '../assets/images/StorePC/12.webp';
import storepc13 from '../assets/images/StorePC/13.webp';
import storepc14 from '../assets/images/StorePC/14.webp';
import storepc15 from '../assets/images/StorePC/15.webp';
import storepc16 from '../assets/images/StorePC/16.webp';
import storepc17 from '../assets/images/StorePC/17.webp';
import noteitGallery from '../assets/images/NoteIt/1.webp';
import noteit2 from '../assets/images/NoteIt/2.webp';
import noteit3 from '../assets/images/NoteIt/3.webp';
import noteit4 from '../assets/images/NoteIt/4.webp';
import noteit5 from '../assets/images/NoteIt/5.webp';
import noteit6 from '../assets/images/NoteIt/6.webp';
import noteit7 from '../assets/images/NoteIt/7.webp';
import noteit8 from '../assets/images/NoteIt/8.webp';
import noteit9 from '../assets/images/NoteIt/9.webp';
import noteit10 from '../assets/images/NoteIt/10.webp';
import portfolioV1Screen from '../assets/images/PortfolioOld/PortfolioOld.webp';
import sgu1 from '../assets/images/PortalSGU/sgu1.png';
import sgu2 from '../assets/images/PortalSGU/sgu2.png';
import sgu3 from '../assets/images/PortalSGU/sgu3.png';
import sgu4 from '../assets/images/PortalSGU/sgu4.png';
import sgu5 from '../assets/images/PortalSGU/sgu5.png';
import sgu6 from '../assets/images/PortalSGU/sgu6.png';
import sgu7 from '../assets/images/PortalSGU/sgu7.png';

const slides = (images) => images.map((image) => ({ original: image, thumbnail: image }));

export const mediaAssets = {
  'barlovento-logo': { src: barloventoLogo, kind: 'logo', fit: 'contain', alt: { es: 'Logotipo oficial de BarloventoTech', en: 'Official BarloventoTech logo' }, caption: { es: 'Identificación del contexto de empresa; no es una captura del producto.', en: 'Company context; this is not a product screenshot.' } },
  'netegia-logo': { src: netegiaLogo, kind: 'logo', fit: 'contain', alt: { es: 'Logotipo de Netegia', en: 'Netegia logo' }, caption: { es: 'Marca oficial de Netegia.', en: 'Official Netegia branding.' } },
  'wise-logo': { src: wiseLogo, kind: 'logo', fit: 'contain', alt: { es: 'Logotipo de Wise Capital Asset Management', en: 'Wise Capital Asset Management logo' }, caption: { es: 'Marca oficial; no es una captura del desarrollo realizado.', en: 'Official brand asset; not a screenshot of the development work.' } },
  'guardia-urbana-photo': { src: guardiaPhoto, kind: 'marketing', fit: 'cover', alt: { es: 'Imagen institucional de la Guardia Urbana de La Matanza', en: 'Official image of La Matanza Urban Guard' }, caption: { es: 'Imagen institucional del Municipio de La Matanza. Las pantallas del sistema se muestran en la galería.', en: 'Official image from La Matanza Municipality. System screens appear in the gallery.' } },
  'fonobus-marketing': { src: fonobusCampaign, kind: 'marketing', fit: 'contain', alt: { es: 'Pieza promocional de la app Fonobus', en: 'Fonobus app promotional graphic' }, caption: { es: 'Pieza publicada por Fonobus; material institucional, no captura de desarrollo.', en: 'Promotional material published by Fonobus; not a development screenshot.' } },
  'cvgenio-cover': { src: cvgenioCover, kind: 'screenshot', fit: 'contain', alt: { es: 'Portada del producto CVGenio', en: 'CVGenio product cover' }, caption: { es: 'Recurso visual propio del producto.', en: 'Product-owned visual asset.' } },
  'alfateam-logo': { src: alfateamLogo, kind: 'logo', fit: 'contain', alt: { es: 'Marca del proyecto AlfaTeam', en: 'AlfaTeam project logo' }, caption: { es: 'Recurso propio del proyecto.', en: 'Project-owned asset.' } },
  'storepc-logo': { src: storepcLogo, kind: 'logo', fit: 'contain', alt: { es: 'Marca del proyecto StorePC', en: 'StorePC project logo' }, caption: { es: 'Recurso propio del proyecto.', en: 'Project-owned asset.' } },
  'portfolio-v1-logo': { src: portfolioV1Logo, kind: 'logo', fit: 'contain', alt: { es: 'Marca del Portafolio V1', en: 'Portfolio V1 logo' }, caption: { es: 'Recurso propio del proyecto.', en: 'Project-owned asset.' } },
  'noteit-logo': { src: noteitLogo, kind: 'logo', fit: 'contain', alt: { es: 'Marca del proyecto NoteIt', en: 'NoteIt project logo' }, caption: { es: 'Recurso propio del proyecto.', en: 'Project-owned asset.' } },
  'sgu-logo': { src: sguLogo, kind: 'logo', fit: 'contain', alt: { es: 'Marca del Portal SGU', en: 'Portal SGU logo' }, caption: { es: 'Recurso propio del proyecto.', en: 'Project-owned asset.' } },
  'portfolio-v1-screen': { src: portfolioV1Screen, kind: 'screenshot', fit: 'cover', alt: { es: 'Captura del Portafolio V1', en: 'Portfolio V1 screenshot' }, caption: { es: 'Captura propia del portafolio anterior.', en: 'Screenshot from the earlier portfolio.' } },
  'alfateam-gallery': { kind: 'gallery', items: slides([alfateamGallery, alfateam2, alfateam3, alfateam4, alfateam5, alfateam6, alfateam7, alfateam8, alfateam9, alfateam10, alfateam11, alfateam12]) },
  'storepc-gallery': { kind: 'gallery', items: slides([storepcGallery, storepc2, storepc3, storepc4, storepc5, storepc6, storepc7, storepc8, storepc9, storepc10, storepc11, storepc12, storepc13, storepc14, storepc15, storepc16, storepc17]) },
  'noteit-gallery': { kind: 'gallery', items: slides([noteitGallery, noteit2, noteit3, noteit4, noteit5, noteit6, noteit7, noteit8, noteit9, noteit10]) },
  'sgu-screenshots': { kind: 'gallery', items: slides([sgu1, sgu2, sgu3, sgu4, sgu5, sgu6, sgu7]) },
};

export function resolveProjectMedia(mediaIds = []) {
  const resolved = mediaIds.map((id) => mediaAssets[id]).filter(Boolean);
  const hero = resolved.find((media) => media.kind !== 'gallery') ?? null;
  const gallery = resolved.find((media) => media.kind === 'gallery')?.items ?? [];
  return { hero, gallery };
}
