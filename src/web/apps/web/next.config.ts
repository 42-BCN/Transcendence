import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {
    // browserDebugInfoInTerminal: true,
  },
  allowedOrigins: ['https://localhost:8443', 'http://localhost:8443'],
};

export default nextConfig;
