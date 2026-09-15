/**
 * Public origin of the site. Canonical and hreflang links, Open Graph URLs,
 * robots.txt, the sitemap and JSON-LD all build on this, so it must be the
 * domain the site is actually served from.
 */
export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://daner.app";
