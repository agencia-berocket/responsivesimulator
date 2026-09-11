import React, { createContext, useContext, useState, useEffect } from 'react';
import { Lang, TranslationKey, translations } from './translations';

export function detectBrowserLanguage(): Lang {
  const navLangs = navigator.languages
    ? Array.from(navigator.languages)
    : [navigator.language || ''];
  for (const lang of navLangs) {
    if (!lang) continue;
    const lower = lang.toLowerCase();
    if (lower.startsWith('pt')) return 'pt';
    if (lower.startsWith('en')) return 'en';
    if (lower.startsWith('es')) return 'es';
    if (lower.startsWith('fr')) return 'fr';
  }
  return 'en';
}

interface LanguageContextType {
  lang: Lang;
  setLang: (lang: Lang) => void;
  isAuto: boolean;
  setAutoLanguage: () => void;
  t: (key: TranslationKey, params?: Record<string, string | number>) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [langState, setLangState] = useState<Lang>(() => {
    const saved = localStorage.getItem('app_lang');
    if (saved && ['pt', 'en', 'es', 'fr'].includes(saved)) {
      return saved as Lang;
    }
    return detectBrowserLanguage();
  });

  const [isAuto, setIsAuto] = useState<boolean>(() => {
    return !localStorage.getItem('app_lang');
  });

  useEffect(() => {
    const handleLanguageChange = () => {
      if (!localStorage.getItem('app_lang')) {
        setLangState(detectBrowserLanguage());
      }
    };
    window.addEventListener('languagechange', handleLanguageChange);
    return () => window.removeEventListener('languagechange', handleLanguageChange);
  }, []);

  const setLang = (newLang: Lang) => {
    localStorage.setItem('app_lang', newLang);
    setIsAuto(false);
    setLangState(newLang);
  };

  const setAutoLanguage = () => {
    localStorage.removeItem('app_lang');
    setIsAuto(true);
    setLangState(detectBrowserLanguage());
  };

  const t = (key: TranslationKey, params?: Record<string, string | number>): string => {
    let text = translations[langState]?.[key] || translations['en']?.[key] || key;
    if (params) {
      Object.entries(params).forEach(([paramKey, val]) => {
        text = text.replace(new RegExp(`\\{${paramKey}\\}`, 'g'), String(val));
      });
    }
    return text;
  };

  return (
    <LanguageContext.Provider value={{ lang: langState, setLang, isAuto, setAutoLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
