import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: false,
  },
  reactStrictMode: true,
  webpack: (config, { dev }) => {
    if (dev) {
      // Enable proper file watching for development
      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300,
      };
    }
    return config;
  },
  eslint: {
    // Don't ignore ESLint errors during builds
    ignoreDuringBuilds: false,
  },
};

export default nextConfig;
