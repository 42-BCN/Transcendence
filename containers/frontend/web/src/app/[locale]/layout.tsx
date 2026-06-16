import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { NextIntlClientProvider } from 'next-intl';
import { getFormatter, getNow, getTimeZone, getTranslations } from 'next-intl/server';
import { HtmlLangSync } from '@/i18n/html-lang-sync';
import { createAppMetadata, getMetadataBase, titleTemplate } from '@/lib/metadata/metadata.config';
import { Providers } from '@/app/providers';
import { NavigationServer } from '@/features/navigation';
import { SocialProvider } from '@/providers/social-provider';
import { initializeSocialData } from '@/providers/social-initializer';
import { SocialSocketBridge } from '@/features/social/store/social-store.bridge';
import { Rooms } from '@/features/rooms';
import {
  RoomsProvider,
} from '@/features/rooms/rooms-provider';
import { GameInvitationsProvider } from '@/features/game-invitations/store/game-invitations.provider';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  const [t, formatter, now, timeZone] = await Promise.all([
    getTranslations({ locale, namespace: 'layouts.locale.metadata' }),
    getFormatter({ locale }),
    getNow({ locale }),
    getTimeZone({ locale }),
  ]);

  return createAppMetadata({
    metadataBase: getMetadataBase(),
    title: {
      default: t('title'),
      template: titleTemplate,
    },
    description: t('description'),
    alternates: {
      canonical: `/${locale}`,
      languages: {
        ca: '/ca',
        en: '/en',
        es: '/es',
      },
    },
    openGraph: {
      locale,
      type: 'website',
      title: t('title'),
      description: t('description'),
      url: `/${locale}`,
      siteName: 'Transcendence',
    },
    twitter: {
      card: 'summary_large_image',
      title: t('title'),
      description: t('description'),
    },
    other: {
      currentYear: formatter.dateTime(now, { year: 'numeric' }),
      timeZone,
    },
  });
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
        <GameInvitationsProvider>
          <RoomsProvider >
            <Rooms />
            <SocialProvider initialData={socialInitialData}>
              <SocialSocketBridge />
              <HtmlLangSync />

              <NavigationServer locale={locale} />

              {children}
            </SocialProvider>
          </RoomsProvider>
        </GameInvitationsProvider>
      </Providers>
    </NextIntlClientProvider>
  );
}
