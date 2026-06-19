import type { ReactNode } from 'react';

import { createAppMetadata } from '@/lib/metadata/metadata.config';
import { routing } from '@/i18n/routing';
import './globals.css';

export const metadata = createAppMetadata({
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon.ico' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
  },
});

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  interactiveWidget: 'resize-content',
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang={routing.defaultLocale} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const theme = localStorage.getItem('theme');
                const support = window.matchMedia('(prefers-color-scheme: dark)').matches;
                if (theme === 'dark' || (theme !== 'light' && support)) {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }
              } catch (_) {}
            `,
          }}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap"
          rel="stylesheet"
        />
      </head>

      <body className="min-h-[100dvh] flex text-text-primary bg-bg-primary transition-colors duration-300">
        <div
          id="tahatahere"
          className="fixed inset-0 -z-10 bg-[linear-gradient(var(--color-grid-line)_1px,transparent_1px),linear-gradient(90deg,var(--color-grid-line)_1px,transparent_1px)] bg-[size:30px_30px]"
          aria-hidden="true"
        />
        {children}
      </body>
    </html>
  );
}
