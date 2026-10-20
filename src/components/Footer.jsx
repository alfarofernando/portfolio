import { useLanguage } from '../context/LanguageContext';
import profile from '../../content/profile.json';
import { getWhatsAppUrl } from '../utils/contact.js';
import Reveal from './motion/Reveal.jsx';

const Footer = () => {
  const { language, locales } = useLanguage();
  const year = new Date().getFullYear();
  const footerCopy = locales[language].footer;
  const documents = locales[language].documents;
  const links = locales[language].links;

  const contactLinks = [
    { label: footerCopy.links.cv, href: documents.cv },
    { label: 'Email', href: `mailto:${profile.email}` },
    { label: footerCopy.links.github, href: links.github },
    { label: footerCopy.links.linkedin, href: links.linkedin },
    { label: footerCopy.links.whatsapp, href: getWhatsAppUrl(profile.links.whatsapp, language) },
  ];

  const legalCopy = footerCopy.legal.replace('{year}', year);

  return (
    <footer id="site-footer" className="relative mt-6 border-t border-brand-100/60 bg-white/90 text-neutral-600 shadow-lg backdrop-blur dark:border-slate-700 dark:bg-slate-900/90 dark:text-neutral-300 lg:mt-0">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-300/60 to-transparent" />

      <div className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-6 py-12 md:flex-row md:justify-between">
        <Reveal
          className="max-w-md"
        >
          <div className="inline-flex items-center gap-2 rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700 dark:bg-brand-500/10 dark:text-brand-200">
            {footerCopy.availability}
          </div>
          <h2 className="mt-4 text-2xl font-semibold text-neutral-900 dark:text-white">{locales[language].brand.name}</h2>
          <p className="mt-3 text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">{footerCopy.summary}</p>
          <ul className="mt-6 flex flex-wrap gap-2">
            {footerCopy.highlights.map((item) => (
              <li key={item} className="rounded-full border border-brand-100 px-3 py-1 text-xs font-semibold text-brand-700 dark:border-brand-500/30 dark:text-brand-200">
                {item}
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal
          delay={0.06}
          className="flex-1"
        >
          <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">{footerCopy.contactTitle}</h3>
          <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {contactLinks.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-between rounded-2xl border border-neutral-200 bg-white/80 px-4 py-3 text-sm font-semibold text-neutral-700 shadow-sm transition hover:border-brand-200 hover:text-brand-700 hover:shadow-brand dark:border-slate-700 dark:bg-slate-800/80 dark:text-neutral-200"
                >
                  <span>{link.label}</span>
                  <span className="text-brand-600 transition group-hover:translate-x-1">{'->'}</span>
                </a>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>

      <div className="border-t border-white/60 bg-white/70 px-6 py-4 text-xs text-neutral-500 backdrop-blur dark:border-slate-700 dark:bg-slate-900/80 dark:text-neutral-400">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-2 text-center sm:flex-row sm:text-left">
          <span>{legalCopy}</span>
          <span>{footerCopy.tagline}</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
