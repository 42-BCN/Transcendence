'use client';

import { useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { InternalLink, MessageBlock, Stack } from '@components';
import { envPublic } from '@/lib/config/env.public';

interface ErrorProps {
  error: Error & { digest?: string };
}

export default function PrivateError({ error }: ErrorProps) {
  const tGlobalError = useTranslations('common.globalError');
  const tNotFound = useTranslations('pages.notFound');

  useEffect(() => {
    envPublic.processEnv === 'development' && console.error(error);
  }, [error]);

  return (
    <Stack align="center" className="min-h-[60vh] text-center" justify="center" gap="sm">
      <MessageBlock title={tGlobalError('title')} messages={[tGlobalError('unexpectedMessage')]} />
      <InternalLink href="/">{tNotFound('backToHome')}</InternalLink>
    </Stack>
  );
}
