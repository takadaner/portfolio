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
  const lastModified = new Date();

  return routes.map(({ path, changeFrequency, priority }) => ({
    url: `${baseUrl}${path === "/" ? "" : path}`,
    lastModified,
    changeFrequency,
    priority,
    alternates: {
      languages: Object.fromEntries(
        Object.entries(languageAlternates(path)).map(([lang, href]) => [
          lang,
          `${baseUrl}${href}`,
        ]),
      ),
    },
  }));
}
