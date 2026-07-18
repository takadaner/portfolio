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
  async headers() {
    return [
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
