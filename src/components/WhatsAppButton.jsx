import { useLanguage } from '../context/LanguageContext.jsx';
import profile from '../../content/profile.json';
import { getWhatsAppUrl } from '../utils/contact.js';

const WhatsAppButton = () => {
  const { language, locales } = useLanguage();
  const { whatsappLabel } = locales[language].cta;

  return (
    <a
      href={getWhatsAppUrl(profile.links.whatsapp, language)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={whatsappLabel}
      title={whatsappLabel}
      className="group fixed bottom-[calc(1rem+env(safe-area-inset-bottom))] right-[calc(1rem+env(safe-area-inset-right))] z-[60] inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_10px_30px_rgba(37,211,102,.34)] transition duration-200 hover:-translate-y-1 hover:bg-[#1fbd5b] focus:outline-none focus-visible:ring-4 focus-visible:ring-emerald-300/70 sm:bottom-[calc(1.5rem+env(safe-area-inset-bottom))] sm:right-[calc(1.5rem+env(safe-area-inset-right))]"
    >
      <svg aria-hidden="true" viewBox="0 0 32 32" className="h-7 w-7 fill-current">
        <path d="M16.03 3.2A12.7 12.7 0 0 0 5.1 22.38l-1.67 6.1 6.25-1.64A12.7 12.7 0 1 0 16.03 3.2Zm0 23.1c-1.91 0-3.78-.51-5.42-1.48l-.39-.23-3.71.97.99-3.61-.26-.41a10.35 10.35 0 1 1 8.79 4.76Zm5.68-7.75c-.31-.16-1.84-.91-2.13-1.02-.28-.1-.49-.16-.7.16-.2.31-.8 1.02-.98 1.23-.18.2-.36.23-.67.08-.31-.16-1.3-.48-2.47-1.52-.91-.81-1.53-1.82-1.71-2.13-.18-.31-.02-.48.14-.64.14-.14.31-.36.46-.54.16-.18.21-.31.31-.52.1-.21.05-.39-.03-.54-.08-.16-.7-1.69-.96-2.32-.25-.61-.51-.53-.7-.54h-.6c-.2 0-.54.08-.82.39-.28.31-1.08 1.05-1.08 2.57s1.1 2.98 1.26 3.18c.15.21 2.16 3.29 5.23 4.61.73.32 1.3.51 1.75.65.74.24 1.41.2 1.94.12.59-.09 1.84-.75 2.1-1.48.25-.72.25-1.33.18-1.46-.08-.13-.28-.21-.59-.37Z" />
      </svg>
      <span className="pointer-events-none absolute right-full mr-3 hidden whitespace-nowrap rounded-lg bg-neutral-950 px-3 py-2 text-xs font-semibold text-white shadow-lg group-hover:block group-focus-visible:block">
        WhatsApp
      </span>
    </a>
  );
};

export default WhatsAppButton;
