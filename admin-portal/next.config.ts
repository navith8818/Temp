import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  async rewrites() {
    return [
      {
        source: '/admin',
        destination: '/dashboard',
      },
      {
        source: '/admin/:path*',
        destination: '/:path*',
      },
    ];
  },
};

export default nextConfig;
