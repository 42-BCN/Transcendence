import { getTranslations } from 'next-intl/server';
import { InternalLink, Stack, Text } from '@components';

export default async function PrivateNotFound() {
  const t = await getTranslations('pages.notFound');

  return (
    <Stack align="center" justify="center" className="min-h-screen">
      <Stack gap="lg" align="center">
        <h1 className="text-4xl font-bold">{t('title')}</h1>
        <p className="text-text-secondary">{t('description')}</p>
        <InternalLink href="/">{t('backToHome', { defaultValue: 'Back to Home' })}</InternalLink>
      </Stack>
    </Stack>
  );
}
