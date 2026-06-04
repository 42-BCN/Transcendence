import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import { Stack, Avatar, Text, Breadcrumb } from '@components';
import { protectedMeProfileAction } from '@/features/profile/profile.action';
import { createRouteMetadata } from '@/lib/metadata/metadata.config';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const t = await getTranslations('pages.me.metadata');
  const { locale } = await params;

  return createRouteMetadata({
    title: t('title'),
    description: t('description'),
    canonical: `/${locale}/me`,
    index: false,
  });
}

export default async function ProtectedLayout({ children }: { children: ReactNode }) {
  const t = await getTranslations('features.profile');
  const data = await protectedMeProfileAction();

  if (!data.ok) {
    return <div>{t('fail')}</div>;
  }

  return (
    <Stack className="p-5 pt-3 h-full" gap="md">
      <Breadcrumb />
      <Stack direction="horizontal" gap="regular" align="center">
        <Avatar src={data.data.avatar} size="lg" alt={data.data.username} />
        <div>
          <Text as="h2">{data.data.username}</Text>
          <Text variant="body-sm" className="text-text-secondary">
            {data.data.email}
          </Text>
        </div>
      </Stack>
      {children}
    </Stack>
  );
}
