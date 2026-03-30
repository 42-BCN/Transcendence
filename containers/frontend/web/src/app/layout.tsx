import type { ReactNode } from 'react';
import { Montserrat, JetBrains_Mono } from 'next/font/google';
import { getLocale } from 'next-intl/server';
import './globals.css';

const mono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
});

export const primary = Montserrat({
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
    <html lang={locale} className={`${primary.variable} ${mono.variable}`}>
      <body
        className="min-h-screen flex 
        text-black dark:text-white
absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:30px_30px] dark:bg-slate-900 bg-slate-100"
      >
        {children}
      </body>
    </html>
  );
}
