import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { LoginFeature } from '@/features/auth/login';
import { createRouteMetadata } from '@/lib/metadata/metadata.config';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const t = await getTranslations('features.auth.login.metadata');
  const { locale } = await params;

  return createRouteMetadata({
    title: t('title'),
    description: t('description'),
    canonical: `/${locale}/login`,
    index: false,
  });
}

export default function LoginPage() {
  return <LoginFeature />;
}
