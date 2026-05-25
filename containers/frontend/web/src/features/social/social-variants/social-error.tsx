import { useTranslations } from 'next-intl';
import { Stack } from '@/components/primitives/stack';
import { Text } from '@/components/primitives/text';
import type { SocialErrorCode } from '../store/social-store.types';

interface SocialErrorProps {
  error: SocialErrorCode;
}

export function SocialError({ error }: SocialErrorProps) {
  const tErrors = useTranslations('errors');
  const errorMessage = tErrors.has(error) ? tErrors(error) : error;

  return (
    <Stack align="center" justify="center" className="py-3 px-3 text-center">
      <Text variant="caption" color="danger">
        {errorMessage}
      </Text>
    </Stack>
  );
}
