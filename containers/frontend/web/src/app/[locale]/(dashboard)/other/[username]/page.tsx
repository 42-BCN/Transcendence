import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { PublicProfile } from '@/features/profile/public-profile';
import { createRouteMetadata } from '@/lib/metadata/metadata.config';

interface OtherUserPageProps {
  params: Promise<{ locale: string; username: string }>;
}

export async function generateMetadata({ params }: OtherUserPageProps): Promise<Metadata> {
  const { locale, username } = await params;
  const t = await getTranslations('features.profile.metadata');

  return createRouteMetadata({
    title: username,
    description: t('publicDescription', { username }),
    canonical: `/${locale}/other/${username}`,
  });
}

export default async function OtherUserPage({ params }: OtherUserPageProps) {
  const { username } = await params;

  return <PublicProfile username={username} />;
}
