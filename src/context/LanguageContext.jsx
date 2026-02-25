import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { getTranslation } from '../translations';

const LanguageContext = createContext(null);

const STORAGE_KEY = 'devtip-lang';

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => {
    if (typeof window === 'undefined') return 'uz';
    return localStorage.getItem(STORAGE_KEY) || 'uz';
  });

  const t = useCallback((key) => getTranslation(lang, key), [lang]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, lang);
    document.documentElement.setAttribute('lang', lang);
  }, [lang]);

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
}
