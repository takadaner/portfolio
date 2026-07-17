/** @type {import('next').NextConfig} */
const nextConfig = {
  // Compress responses (HTML/JSON/etc.) with gzip.
  compress: true,
  images: {
    // Serve AVIF first (smallest), fall back to WebP.
    formats: ["image/avif", "image/webp"],
    // Cache each optimized variant for a year — sources are static.
    minimumCacheTTL: 60 * 60 * 24 * 365,
  },
};

export default nextConfig;
