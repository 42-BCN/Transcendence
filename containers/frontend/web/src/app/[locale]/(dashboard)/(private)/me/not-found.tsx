import { getTranslations } from 'next-intl/server';
import { InternalLink, MessageBlock, Stack } from '@components';

export default async function PrivateNotFound() {
  const t = await getTranslations('pages.notFound');

  return (
    <Stack align="center" className="min-h-[60vh] text-center" justify="center" gap="sm">
      <MessageBlock
        title={t('title', { defaultValue: 'Page Not Found' })}
        messages={[
          t('description', { defaultValue: 'The page you are looking for does not exist.' }),
        ]}
      />
      <InternalLink href="/">{t('backToHome', { defaultValue: 'Back to Home' })}</InternalLink>
    </Stack>
  );
}
