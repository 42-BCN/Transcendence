// import type { ReactNode } from 'react';
import './globals.css';

// export const metadata = {
//   title: 'untitled',
//   icons: {
//     icon: [
//       { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
//       { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
//       { url: '/favicon.ico' },
//     ],
//     apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
//   },
// };

// export default async function RootLayout({ children }: { children: ReactNode }) {
//   // const locale = await getLocale();
//   // console.log(locale);
//   return (
//     // eslint-disable-next-line jsx-a11y/html-has-lang
//     <html>
//       <body>{children}</body>
//     </html>
//   );
// }

// import { ReactNode } from 'react';

// type Props = {
//   children: ReactNode;
// };

// // Root Layout just passes the children
// export default function RootLayout({ children }: Props) {
//   return <>{children}</>;
// }

import { ReactNode } from 'react';

type Props = {
  children: ReactNode;
};

// Since we have a `not-found.tsx` page on the root, a layout file
// is required, even if it's just passing children through.
export default function RootLayout({ children }: Props) {
  return children;
}
