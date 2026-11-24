import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { AppLanguage, UI_TRANSLATIONS, UIStrings } from './uiTranslations';

const LANG_STORAGE_KEY = 'elec_lang_v1';

interface LanguageContextValue {
  lang: AppLanguage;
  setLang: (next: AppLanguage) => void;
  isRtl: boolean;
  t: UIStrings;
  pick: (ar: string, fr: string, en: string) => string;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<AppLanguage>(() => {
    try {
      const saved = localStorage.getItem(LANG_STORAGE_KEY);
      if (saved === 'ar' || saved === 'fr' || saved === 'en') {
        return saved;
      }
    } catch {
      // Ignore storage errors
    }
    return 'ar';
  });

  useEffect(() => {
    const root = document.documentElement;
    root.lang = lang;
    root.dir = lang === 'ar' ? 'rtl' : 'ltr';
    try {
      localStorage.setItem(LANG_STORAGE_KEY, lang);
    } catch {
      // Ignore storage errors
    }
  }, [lang]);

  const value = useMemo<LanguageContextValue>(
    () => ({
      lang,
      setLang: setLangState,
      isRtl: lang === 'ar',
      t: UI_TRANSLATIONS[lang],
      pick: (ar: string, fr: string, en: string) => {
        if (lang === 'fr') return fr;
        if (lang === 'en') return en;
        return ar;
      },
    }),
    [lang]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return ctx;
}
