import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { CreateAccountFeature } from '@/features/auth/create-account';
import { createRouteMetadata } from '@/lib/metadata/metadata.config';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const t = await getTranslations('features.auth.signup.metadata');
  const { locale } = await params;

  return createRouteMetadata({
    title: t('title'),
    description: t('description'),
    canonical: `/${locale}/create-account`,
    index: false,
  });
}

export default function CreateAccountPage() {
  return <CreateAccountFeature />;
}
