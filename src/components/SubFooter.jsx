import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const SubFooter = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();

  const ctaCopy = language === 'es'
    ? {
        title: 'Planificamos el proximo proyecto?',
        description: 'Trabajo cada iteracion con foco en UX, performance y resultados medibles. Revisa mis proyectos o escribime y pongamos tu idea en marcha.',
        primary: 'Ver proyectos',
        secondary: 'Contactar ahora',
        badge: 'Colaboracion guiada por datos',
      }
    : {
        title: 'Ready to ship your next project?',
        description: "Every iteration is crafted with UX, performance and measurable outcomes in mind. Explore my work or say hello and let's build together.",
        primary: 'See projects',
        secondary: 'Get in touch',
        badge: 'Data-informed collaboration',
      };

  return (
    <section className="px-4">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="relative mx-auto mt-20 w-full max-w-6xl overflow-hidden rounded-4xl bg-gradient-to-r from-brand-600 via-brand-600 to-brand-700 text-white shadow-brand"
      >
        <div className="pointer-events-none absolute -right-24 bottom-0 h-64 w-64 rounded-full bg-accent-400/50 blur-3xl" />
        <div className="pointer-events-none absolute -left-24 top-0 h-80 w-80 rounded-full bg-white/20 blur-3xl" />

        <div className="relative flex flex-col gap-6 px-8 py-10 md:flex-row md:items-center md:justify-between md:px-12 md:py-12">
          <div className="max-w-2xl space-y-3">
            <p className="inline-flex items-center rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white/80">
              {ctaCopy.badge}
            </p>
            <h2 className="text-3xl font-semibold md:text-4xl">{ctaCopy.title}</h2>
            <p className="text-sm text-white/80 md:text-base">{ctaCopy.description}</p>
          </div>

          <div className="flex flex-col gap-3 md:flex-row md:items-center">
            <button
              type="button"
              onClick={() => navigate('/portfolio-v.2/Projects')}
              className="inline-flex items-center justify-center rounded-2xl bg-white px-6 py-3 text-sm font-semibold text-brand-700 transition hover:-translate-y-0.5 hover:bg-brand-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
            >
              {ctaCopy.primary}
            </button>
            <a
              href="https://wa.me/5491152606455?text=Hola%21%20Quisiera%20conectar."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-2xl border border-white/50 px-6 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
            >
              {ctaCopy.secondary}
            </a>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default SubFooter;