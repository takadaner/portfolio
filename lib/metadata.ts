import type { Metadata } from "next";
import { languageAlternates, normalizeLang, withLanguage } from "@/lib/i18n";

type MetadataCopy = {
  title: string;
  description: string;
};

export function createPageMetadata(
  path: string,
  requestedLanguage: string | string[] | undefined,
  copy: { ro: MetadataCopy; en: MetadataCopy },
): Metadata {
  const languageValue = Array.isArray(requestedLanguage)
    ? requestedLanguage[0]
    : requestedLanguage;
  const lang = normalizeLang(languageValue) ?? "ro";
  const content = copy[lang];
  const localizedPath = withLanguage(path, lang);

  return {
    title: content.title,
    description: content.description,
    alternates: {
      canonical: localizedPath,
      languages: languageAlternates(path),
    },
    openGraph: {
      title: content.title,
      description: content.description,
      url: localizedPath,
      locale: lang === "ro" ? "ro_RO" : "en_US",
      alternateLocale: [lang === "ro" ? "en_US" : "ro_RO"],
    },
  };
}
