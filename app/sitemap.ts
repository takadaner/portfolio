import { MetadataRoute } from "next";
import { languageAlternates } from "@/lib/i18n";
import { siteUrl as baseUrl } from "@/lib/site";

const routes = [
  { path: "/", changeFrequency: "daily", priority: 1 },
  { path: "/services", changeFrequency: "weekly", priority: 0.9 },
  { path: "/projects", changeFrequency: "weekly", priority: 0.9 },
  { path: "/about", changeFrequency: "monthly", priority: 0.8 },
  { path: "/contact", changeFrequency: "monthly", priority: 0.8 },
  { path: "/projects/hotel-saas-suite", changeFrequency: "monthly", priority: 0.8 },
  { path: "/projects/night-concierge", changeFrequency: "monthly", priority: 0.7 },
  { path: "/projects/darkroom", changeFrequency: "monthly", priority: 0.8 },
  { path: "/projects/villa-visualizations", changeFrequency: "monthly", priority: 0.8 },
  { path: "/mcp", changeFrequency: "monthly", priority: 0.7 },
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.flatMap(({ path, changeFrequency, priority }) => {
    const languages = languageAlternates(path);
    return (["ro-RO", "en-US"] as const).map((locale) => ({
      url: `${baseUrl}${languages[locale]}`,
      changeFrequency,
      priority,
      alternates: {
        languages: Object.fromEntries(
          Object.entries(languages).map(([language, href]) => [
            language,
            `${baseUrl}${href}`,
          ]),
        ),
      },
    }));
  });
}
