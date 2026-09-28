"use client";

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import ro from "@/locales/ro.json";
import en from "@/locales/en.json";
import { normalizeLang, withLanguage, type Lang } from "@/lib/i18n";

export type { Lang } from "@/lib/i18n";
export type Dictionary = typeof ro;

const dictionaries: Record<Lang, Dictionary> = { ro, en };

type LanguageContextValue = {
  lang: Lang;
  setLang: (lang: Lang) => void;
  dict: Dictionary;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({
  children,
  initialLang = "ro",
}: {
  children: ReactNode;
  initialLang?: Lang;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [lang, setLanguageState] = useState<Lang>(initialLang);
  const [initialized, setInitialized] = useState(false);

  const persistLanguage = useCallback((nextLang: Lang) => {
    setLanguageState(nextLang);
    document.documentElement.lang = nextLang;
    window.localStorage.setItem("daner-language", nextLang);
    document.cookie = `daner-language=${nextLang}; Path=/; Max-Age=31536000; SameSite=Lax; Secure`;
  }, []);

  const setLang = useCallback(
    (nextLang: Lang) => {
      persistLanguage(nextLang);
      router.replace(
        withLanguage(`${window.location.pathname}${window.location.search}${window.location.hash}`, nextLang),
        { scroll: false },
      );
    },
    [persistLanguage, router],
  );

  useEffect(() => {
    const queryLanguage = normalizeLang(new URLSearchParams(window.location.search).get("lang"));
    const storedLanguage = normalizeLang(window.localStorage.getItem("daner-language"));
    const preferredLanguage = queryLanguage ?? storedLanguage ?? initialLang;
    persistLanguage(preferredLanguage);
    setInitialized(true);
  }, [initialLang, persistLanguage]);

  useEffect(() => {
    if (!initialized) return;
    const currentLanguage = normalizeLang(new URLSearchParams(window.location.search).get("lang"));
    if (currentLanguage !== lang) {
      router.replace(
        withLanguage(`${window.location.pathname}${window.location.search}${window.location.hash}`, lang),
        { scroll: false },
      );
    }
  }, [initialized, lang, pathname, router]);

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
