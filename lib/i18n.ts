export const SUPPORTED_LANGUAGES = ["ro", "en"] as const;
export type Lang = (typeof SUPPORTED_LANGUAGES)[number];

export function normalizeLang(value: string | null | undefined): Lang | null {
  const normalized = value?.toLowerCase();
  return normalized === "ro" || normalized === "en" ? normalized : null;
}

export function withLanguage(path: string, lang: Lang): string {
  const url = new URL(path, "https://local.invalid");
  url.searchParams.set("lang", lang);
  return `${url.pathname}${url.search}${url.hash}`;
}

export function languageAlternates(path: string) {
  return {
    "ro-RO": withLanguage(path, "ro"),
    "en-US": withLanguage(path, "en"),
    "x-default": withLanguage(path, "ro"),
  };
}
