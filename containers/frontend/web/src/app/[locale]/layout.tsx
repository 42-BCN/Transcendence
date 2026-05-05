import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { NextIntlClientProvider } from 'next-intl';
import { getFormatter, getNow, getTimeZone, getTranslations } from 'next-intl/server';
import { HtmlLangSync } from '@/i18n/html-lang-sync';
import { envPublic } from '@/lib/config/env.public';
import { Providers } from '@/app/providers';
import { NavigationServer } from '@/features/navigation';
import { SocialProvider } from '@/providers/social-provider';
import { initializeSocialData } from '@/providers/social-initializer';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  const [t, formatter, now, timeZone] = await Promise.all([
    getTranslations({ locale, namespace: 'layouts.locale' }),
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
  const socialInitialData = await initializeSocialData();

  return (
    <NextIntlClientProvider locale={locale}>
      <Providers locale={locale}>
        <SocialProvider initialData={socialInitialData}>
          <HtmlLangSync />

          <NavigationServer locale={locale} />

          {children}
        </SocialProvider>
      </Providers>
    </NextIntlClientProvider>
  );
}
