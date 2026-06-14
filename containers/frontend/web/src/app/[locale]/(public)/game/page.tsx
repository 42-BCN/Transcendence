import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { Game } from '@/features/game';
import { createRouteMetadata } from '@/lib/metadata/metadata.config';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const t = await getTranslations('pages.game.metadata');
  const { locale } = await params;

  return createRouteMetadata({
    title: t('title'),
    description: t('description'),
    canonical: `/${locale}/game`,
    index: false,
  });
}

export default function GamePage() {
  return <Game />;
}
