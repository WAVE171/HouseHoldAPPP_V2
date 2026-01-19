import { createContext, useContext, useState, useCallback, useMemo, useEffect, type ReactNode } from 'react';
import { en, ptPT, type TranslationKeys } from './translations';

export type Language = 'en' | 'pt-PT';

export interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: TranslationKeys;
}

const translations: Record<Language, TranslationKeys> = {
  'en': en,
  'pt-PT': ptPT,
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
  children: ReactNode;
  defaultLanguage?: Language;
}

export function LanguageProvider({ children, defaultLanguage = 'pt-PT' }: LanguageProviderProps) {
  const [language, setLanguageState] = useState<Language>(() => {
    // Try to get from localStorage, default to pt-PT for Angola
    const stored = localStorage.getItem('app-language') as Language;
    if (stored && translations[stored]) {
      return stored;
    }
    return defaultLanguage;
  });

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('app-language', lang);
  }, []);

  useEffect(() => {
    // Update document lang attribute
    document.documentElement.lang = language === 'pt-PT' ? 'pt' : language;
  }, [language]);

  const value = useMemo(() => ({
    language,
    setLanguage,
    t: translations[language],
  }), [language, setLanguage]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextType {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

// Available languages for settings dropdown
export const availableLanguages = [
  { value: 'pt-PT' as Language, label: 'Português (Portugal)' },
  { value: 'en' as Language, label: 'English' },
];
