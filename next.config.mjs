const isDev = process.env.NODE_ENV !== "production";

// Content-Security-Policy. Notes on the necessary relaxations:
//  - script-src 'unsafe-inline': Next.js injects inline hydration/streaming
//    bootstrap scripts and we don't run a per-request nonce middleware.
//  - script-src 'unsafe-eval': dev only — Next's HMR/source maps use eval;
//    production drops it, so the deployed policy is meaningfully stricter.
//  - style-src 'unsafe-inline': framer-motion animates inline styles and
//    Tailwind / next-font inject inline <style>.
//  - va.vercel-scripts.com / vitals.vercel-insights.com: Vercel Speed
//    Insights (<SpeedInsights /> in the layout) loads its script and posts
//    beacons to these; omitting them silently breaks analytics.
// Everything else is locked to 'self'; framing, plugins and <base> are off.
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""} https://va.vercel-scripts.com`,
  "style-src 'self' 'unsafe-inline'",
  // images.unsplash.com: testimonial avatars in About are hotlinked via a
  // raw <img> (not next/image), so they load direct from Unsplash. Localize
  // them into /public later to tighten this back to just 'self'.
  "img-src 'self' data: blob: https://images.unsplash.com",
  "font-src 'self' data:",
  "connect-src 'self' https://vitals.vercel-insights.com",
  "media-src 'self'",
  "worker-src 'self' blob:",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "upgrade-insecure-requests",
].join("; ");

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable React Strict Mode to catch side-effect bugs early
  reactStrictMode: true,
  // Compress responses (HTML/JSON/etc.) with gzip.
  compress: true,
  // Strip console.log output in production builds (keep warnings/errors)
  compiler: {
    removeConsole:
      process.env.NODE_ENV === "production"
        ? { exclude: ["error", "warn"] }
        : false,
  },
  // Automatically tree-shake modular imports for heavy libraries
  experimental: {
    optimizePackageImports: ["lucide-react", "framer-motion"],
  },
  images: {
    // Serve AVIF first (smallest), fall back to WebP.
    formats: ["image/avif", "image/webp"],
    // Cache each optimized variant for a year — sources are static.
    minimumCacheTTL: 60 * 60 * 24 * 365,
  },
  async headers() {
    return [
      {
        // Enforce strict security headers across all application routes.
        source: "/:path*",
        headers: [
          {
            key: "Content-Security-Policy",
            value: csp,
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
        ],
      },
      {
        // Raw static assets served from /public (video posters, mp4 clips,
        // MPC wav samples, images used outside next/image). Without this they
        // ship with max-age=0 and re-download on every visit. 30 days + SWR
        // rather than immutable, since files here get replaced under the same
        // name during manual updates.
        source:
          "/:all*(avif|webp|png|jpg|jpeg|gif|svg|ico|mp4|webm|wav|mp3|woff2)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=2592000, stale-while-revalidate=604800",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
