import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Configures Next.js to build a standalone Node.js server bundle for Plesk
  output: 'standalone',

  allowedDevOrigins: [
    '172.26.48.1', 
    'localhost:3000',
    '*.ngrok-free.dev'
  ],

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
};

export default nextConfig;