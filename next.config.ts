import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "**.squarespace-cdn.com",
      },
    ],
    unoptimized: false,
  },
  // Allow large video file uploads via API routes
  experimental: {
    serverActions: {
      bodySizeLimit: "250mb",
    },
  },
};

export default nextConfig;
