"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import ro from "@/locales/ro.json";
import en from "@/locales/en.json";

export type Lang = "ro" | "en";
export type Dictionary = typeof ro;

const dictionaries: Record<Lang, Dictionary> = { ro, en };

type LanguageContextValue = {
  lang: Lang;
  setLang: (lang: Lang) => void;
  dict: Dictionary;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("ro");

  return (
    <LanguageContext.Provider value={{ lang, setLang, dict: dictionaries[lang] }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}
