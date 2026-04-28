import { JetBrains_Mono, Montserrat } from 'next/font/google';

export const mono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
});

export const primary = Montserrat({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-primary',
  display: 'swap',
});
