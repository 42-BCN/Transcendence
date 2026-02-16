import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { type Locale, NextIntlClientProvider } from 'next-intl';
import { getFormatter, getNow, getTimeZone, getTranslations } from 'next-intl/server';
import { Navigation } from '@components/features/navigation/navigation';

type Props = {
  children: ReactNode;
  params: { locale: string };
};

export async function generateMetadata({ params }: Omit<Props, 'children'>): Promise<Metadata> {
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

export default function LocaleLayout({ children }: { children: ReactNode }) {
  return (
    <NextIntlClientProvider>
      <Navigation />
      {children}
    </NextIntlClientProvider>
  );
}
