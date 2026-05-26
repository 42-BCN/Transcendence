import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { VerifyEmailFeature } from '@/features/auth/create-account';
import { createRouteMetadata } from '@/lib/metadata/metadata.config';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const t = await getTranslations('features.auth.verification.metadata');
  const { locale } = await params;

  return createRouteMetadata({
    title: t('title'),
    description: t('description'),
    canonical: `/${locale}/verify-email`,
    index: false,
  });
}

export default function VerifyEmailPage() {
  return <VerifyEmailFeature />;
}
