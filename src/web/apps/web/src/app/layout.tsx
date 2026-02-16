import type { ReactNode } from 'react';
import './globals.css';

export const metadata = {
  title: 'untitled',
  icons: {
    icon: [
      { url: '/icons/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/icons/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/icons/favicon.ico' },
    ],
    apple: [{ url: '/icons/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
  },
};

export default function RootLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: { locale?: string };
}) {
  const locale = params?.locale ?? 'en';

  return (
    <html lang={locale}>
      <body>{children}</body>
    </html>
  );
}
