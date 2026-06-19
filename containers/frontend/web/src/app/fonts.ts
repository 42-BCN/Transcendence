import { Montserrat } from 'next/font/google';

export const primary = Montserrat({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-montserrat',
  display: 'swap',
  preload: false,
});
