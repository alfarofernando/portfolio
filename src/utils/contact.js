const messages = {
  es: 'Hola Fernando, me gustaría conversar sobre una solución tecnológica para mi negocio.',
  en: "Hi Fernando, I'd like to discuss a technology solution for my business.",
};

export const getWhatsAppUrl = (whatsappUrl, language = 'es') => {
  const url = new URL(whatsappUrl);
  url.searchParams.set('text', messages[language] ?? messages.es);
  return url.toString();
};
