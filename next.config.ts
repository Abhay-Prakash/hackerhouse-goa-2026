import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow cross-origin images
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
    ],
    dangerouslyAllowSVG: true,
  },
  // Empty turbopack config to satisfy Next.js 16 requirement
  turbopack: {},
};

export default nextConfig;
