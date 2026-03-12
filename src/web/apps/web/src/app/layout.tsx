import type { ReactNode } from 'react';
import { Quicksand } from 'next/font/google';
import { JetBrains_Mono } from 'next/font/google';
import { getLocale } from 'next-intl/server';
import './globals.css';

const mono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
});

export const quicksand = Quicksand({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-primary',
  display: 'swap',
});

export const metadata = {
  title: 'untitled',
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon.ico' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
  },
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  const locale = await getLocale();

  return (
    <html lang={locale} className={`${quicksand.variable} ${mono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
