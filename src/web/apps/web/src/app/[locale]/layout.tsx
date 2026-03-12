import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { NextIntlClientProvider } from 'next-intl';
import { getFormatter, getNow, getTimeZone, getTranslations } from 'next-intl/server';
import { HtmlLangSync } from '@/i18n/html-lang-sync';
import { envPublic } from '@/lib/config/env.public';
import { Providers } from '@/app/providers';
import { NavigationServer } from '@/features/main-nav';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  const [t, formatter, now, timeZone] = await Promise.all([
    getTranslations({ locale, namespace: 'LocaleLayout' }),
    getFormatter({ locale }),
    getNow({ locale }),
    getTimeZone({ locale }),
  ]);

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
      <Providers locale={locale}>
        <HtmlLangSync />
        <header className="border-b">
          <NavigationServer locale={locale} />
        </header>
        {children}
      </Providers>
    </NextIntlClientProvider>
  );
}
