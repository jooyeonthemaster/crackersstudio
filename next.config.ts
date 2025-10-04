import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  experimental: {
    typedRoutes: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.imweb.me',
        pathname: '/**',
      },
    ],
    unoptimized: true,
  },
};

export default nextConfig;
