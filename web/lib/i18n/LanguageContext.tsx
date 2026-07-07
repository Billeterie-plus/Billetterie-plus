"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { DEFAULT_LOCALE, Locale, translations } from "./translations";

const STORAGE_KEY = "myticket_locale";

type LanguageContextValue = {
  locale: Locale;
  setLocale: (l: Locale) => void;
};

const LanguageContext = createContext<LanguageContextValue>({
  locale: DEFAULT_LOCALE,
  setLocale: () => {},
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(DEFAULT_LOCALE);

  // Au montage : reprend la langue choisie précédemment (localStorage), sinon
  // tente de deviner depuis la langue du navigateur, sinon reste en français.
  useEffect(() => {
    const stored = typeof window !== "undefined" ? (localStorage.getItem(STORAGE_KEY) as Locale | null) : null;
    if (stored && translations[stored]) {
      setLocaleState(stored);
      return;
    }
    if (typeof navigator !== "undefined") {
      const nav = navigator.language.slice(0, 2).toLowerCase();
      if (nav === "en" || nav === "de") setLocaleState(nav as Locale);
    }
  }, []);

  useEffect(() => {
    if (typeof document !== "undefined") document.documentElement.lang = locale;
  }, [locale]);

  function setLocale(l: Locale) {
    setLocaleState(l);
    if (typeof window !== "undefined") localStorage.setItem(STORAGE_KEY, l);
  }

  const value = useMemo(() => ({ locale, setLocale }), [locale]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  return useContext(LanguageContext);
}

/** Hook de traduction : t("clé", { var: valeur }) avec repli sur le français puis sur la clé elle-même. */
export function useT() {
  const { locale } = useContext(LanguageContext);
  return function t(key: string, vars?: Record<string, string | number>) {
    let str = translations[locale]?.[key] ?? translations[DEFAULT_LOCALE][key] ?? key;
    if (vars) {
      for (const [k, v] of Object.entries(vars)) {
        str = str.replace(new RegExp(`{{${k}}}`, "g"), String(v));
      }
    }
    return str;
  };
}
