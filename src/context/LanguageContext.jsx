import { createContext, useState, useContext, useEffect } from 'react';
import { locales } from '../locales/locales.js';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('es');

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const changeLanguage = (lng) => {
    setLanguage(lng);
  };

  return (
    <LanguageContext.Provider value={{ language, changeLanguage, locales }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);