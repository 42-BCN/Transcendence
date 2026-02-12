import type { ReactNode } from 'react';
import { notFound } from 'next/navigation';
import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';

import { Providers } from '../providers';
import { locales } from '@/i18n/navigation';
import { LocaleSwitcher } from '@/components/features/settings/locale-switcher';

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!hasLocale(locales, locale)) notFound();
  setRequestLocale(locale);

  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      <Providers>
        <header>
          <LocaleSwitcher />
        </header>
        {children}
      </Providers>
    </NextIntlClientProvider>
  );
}
