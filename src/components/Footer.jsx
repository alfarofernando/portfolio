import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';

const Footer = () => {
  const { language, locales } = useLanguage();
  const year = new Date().getFullYear();

  const cvUrl = language === 'es'
    ? '/portfolio-v.2/cv-AlfaroFernando-Esp.pdf'
    : '/portfolio-v.2/cv-AlfaroFernando-Eng.pdf';

  const contactLinks = [
    { label: 'Curriculum', href: cvUrl },
    { label: 'GitHub', href: 'https://github.com/alfarofernando' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/fernando-alfaro-132973246/' },
    { label: 'WhatsApp', href: 'https://wa.me/5491152606455?text=Hola%21%20Quisiera%20conectar.' },
  ];

  const highlights = [
    locales[language].home2,
    'React | TypeScript | Next.js',
    'UX-first mindset',
  ];

  const legalCopy = language === 'es'
    ? `Copyright (c) ${year} Fernando Alfaro. Todos los derechos reservados.`
    : `Copyright (c) ${year} Fernando Alfaro. All rights reserved.`;

  const tagline = language === 'es'
    ? 'Construido con pasion y atencion en cada detalle.'
    : 'Crafted with care and attention to detail.';

  return (
    <footer className="relative mt-10 border-t border-brand-100/60 bg-white/90 text-neutral-600 shadow-lg backdrop-blur dark:border-slate-700 dark:bg-slate-900/90 dark:text-neutral-300">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-300/60 to-transparent" />

      <div className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-6 py-12 md:flex-row md:justify-between">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="max-w-md"
        >
          <div className="inline-flex items-center gap-2 rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700 dark:bg-brand-500/10 dark:text-brand-200">
            {language === 'es' ? 'Disponible para proyectos' : 'Open to opportunities'}
          </div>
          <h2 className="mt-4 text-2xl font-semibold text-neutral-900 dark:text-white">
            Fernando Alfaro
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">
            {locales[language].home1} Fernando. {locales[language].home2}. {locales[language].projectTitle}.
          </p>
          <ul className="mt-6 flex flex-wrap gap-2">
            {highlights.map((item) => (
              <li key={item} className="rounded-full border border-brand-100 px-3 py-1 text-xs font-semibold text-brand-700 dark:border-brand-500/30 dark:text-brand-200">
                {item}
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="flex-1"
        >
          <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">
            {language === 'es' ? 'Contacto directo' : 'Direct contact'}
          </h3>
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
        </motion.div>
      </div>

      <div className="border-t border-white/60 bg-white/70 px-6 py-4 text-xs text-neutral-500 backdrop-blur dark:border-slate-700 dark:bg-slate-900/80 dark:text-neutral-400">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-2 text-center sm:flex-row sm:text-left">
          <span>{legalCopy}</span>
          <span>{tagline}</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;