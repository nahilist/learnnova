import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  compress: true,
  poweredByHeader: false,
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
  async rewrites() {
    return [
      {
        source: "/youtube-video-summarizer",
        destination: "/youtube-summarizer",
      },
      {
        source: "/youtube-summaries",
        destination: "/youtube-summarizer",
      },
    ];
  },
};

export default nextConfig;
