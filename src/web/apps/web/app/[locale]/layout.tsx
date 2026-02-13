// import type { ReactNode } from 'react';
// import { notFound } from 'next/navigation';
// import { NextIntlClientProvider, hasLocale } from 'next-intl';
// import { getMessages, setRequestLocale } from 'next-intl/server';

// import { Providers } from '../providers';
// import { routing, type Locale } from '@/i18n/routing';
// import { LocaleSwitcher } from '@/components/features/settings/locale-switcher';

// export default async function LocaleLayout({
//   children,
//   params,
// }: {
//   children: ReactNode;
//   params: Promise<{ locale: string }>;
// }) {
//   const messages = await getMessages();
//   const { locale } = await params;

//   if (!routing.locales.includes(locale as Locale)) notFound();

//   return (
//     <NextIntlClientProvider messages={messages}>
//       <Providers>
//         <header>
//           <LocaleSwitcher />
//         </header>
//         {children}
//       </Providers>
//     </NextIntlClientProvider>
//   );
// }

// import { NextIntlClientProvider, hasLocale } from 'next-intl';
// import { notFound } from 'next/navigation';
// import { routing } from '@/i18n/routing';

// type Props = {
//   children: React.ReactNode;
//   params: Promise<{ locale: string }>;
// };

// export function generateStaticParams() {
//   return routing.locales.map((locale) => ({ locale }));
// }

// export default async function LocaleLayout({ children, params }: Props) {
//   // Ensure that the incoming `locale` is valid
//   const { locale } = await params;
//   if (!hasLocale(routing.locales, locale)) {
//     notFound();
//   }

//   return (
//     <NextIntlClientProvider messages={messages}>
//       {/* <Providers> */}
//       <header>{/* <LocaleSwitcher /> */}</header>
//       {children}
//       {/* </Providers> */}
//     </NextIntlClientProvider>
//   );
// }

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
// import { notFound } from 'next/navigation';
import { type Locale, NextIntlClientProvider } from 'next-intl';
import { getFormatter, getNow, getTimeZone, getTranslations } from 'next-intl/server';
// import { routing } from '@/i18n/routing';
import { Navigation } from '@/components/features/navigation/navigation';

const inter = Inter({ subsets: ['latin'] });

export async function generateMetadata(
  props: Omit<LayoutProps<'/[locale]'>, 'children'>,
): Promise<Metadata> {
  const params = await props.params;
  const locale = params.locale as Locale;

  const t = await getTranslations({ locale, namespace: 'LocaleLayout' });
  const formatter = await getFormatter({ locale });
  const now = await getNow({ locale });
  const timeZone = await getTimeZone({ locale });

  const base = new URL('https://localhost:8443');
  // if (process.env.NEXT_PUBLIC_USE_CASE === 'base-path') {
  //   base.pathname = '/base/path';
  // }

  return {
    metadataBase: base,
    title: t('title'),
    description: t('description'),
    other: {
      currentYear: formatter.dateTime(now, { year: 'numeric' }),
      timeZone,
    },
  };
}

export default async function LocaleLayout({ children, params }: LayoutProps<'/[locale]'>) {
  const { locale } = await params;

  // Ensure that the incoming `locale` is valid
  // if (!hasLocale(routing.locales, locale)) {
  //   notFound();
  // }

  return (
    <html className={inter.className} lang={locale}>
      <body>
        <div>
          <NextIntlClientProvider>
            <Navigation />
            {children}
          </NextIntlClientProvider>
        </div>
      </body>
    </html>
  );
}
