import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { RecoverFeature } from '@/features/auth/recover';
import { createRouteMetadata } from '@/lib/metadata/metadata.config';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const t = await getTranslations('features.auth.recover.metadata');
  const { locale } = await params;

  return createRouteMetadata({
    title: t('title'),
    description: t('description'),
    canonical: `/${locale}/recover`,
    index: false,
  });
}

export default function RecoverPage() {
  return <RecoverFeature />;
}
