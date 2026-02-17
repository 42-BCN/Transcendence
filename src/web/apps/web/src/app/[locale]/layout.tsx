import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { NextIntlClientProvider } from 'next-intl';
import { getFormatter, getNow, getTimeZone, getTranslations } from 'next-intl/server';
import { Navigation } from '@components/features/navigation/navigation';
import { HtmlLangSync } from '@/i18n/html-lang-sync';
import { envPublic } from '@/lib/env.public';

export async function generateMetadata({
  _children,
  params,
}: {
  _children: ReactNode;
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  const t = await getTranslations({ locale, namespace: 'LocaleLayout' });
  const formatter = await getFormatter({ locale });
  const now = await getNow({ locale });
  const timeZone = await getTimeZone({ locale });

  const base = new URL(envPublic.appUrl);
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

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}): Promise<ReactNode> {
  const { locale } = await params;

  return (
    <NextIntlClientProvider locale={locale}>
      <HtmlLangSync />
      <Navigation />
      {children}
    </NextIntlClientProvider>
  );
}