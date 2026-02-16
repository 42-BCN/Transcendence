import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const nextConfig: NextConfig = {};

const withNextIntl = createNextIntlPlugin({
  requestConfig: './src/i18n/request.tsx',
  experimental: {
    createMessagesDeclaration: ['./src/i18n/messages/en.json'],
  },
});

export default withNextIntl(nextConfig);

