import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin({
  requestConfig: './i18n/request.tsx',
  experimental: {
    createMessagesDeclaration: ['./i18n/messages/en.json'],
  },
});

const nextConfig: NextConfig = {
  experimental: {
    // browserDebugInfoInTerminal: true,
  },
  allowedOrigins: ['https://localhost:8443', 'http://localhost:8443'],
};

export default withNextIntl(nextConfig);
