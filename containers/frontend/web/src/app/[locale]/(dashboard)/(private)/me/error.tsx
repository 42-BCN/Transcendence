'use client';

import { useEffect } from 'react';
import { InternalLink, MessageBlock, Stack, Text } from '@components';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function PrivateError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <Stack align="center" className="min-h-[60vh] text-center" justify="center" gap="sm">
      <MessageBlock
        title="Something went wrong"
        messages={[error.message || 'An unexpected error occurred']}
      />
      <InternalLink href="/">Back to Home</InternalLink>
    </Stack>
  );
}
