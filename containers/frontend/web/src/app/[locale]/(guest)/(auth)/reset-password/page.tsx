import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { ResetPasswordFeature } from '@/features/auth/recover';
import { createRouteMetadata } from '@/lib/metadata/metadata.config';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const t = await getTranslations('features.auth.reset.metadata');
  const { locale } = await params;

  return createRouteMetadata({
    title: t('title'),
    description: t('description'),
    canonical: `/${locale}/reset-password`,
    index: false,
  });
}

export default function ResetPasswordPage() {
  return <ResetPasswordFeature />;
}
