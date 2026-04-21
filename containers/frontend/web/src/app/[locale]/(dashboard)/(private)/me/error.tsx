'use client';

import { useEffect } from 'react';
import { InternalLink, Stack, Text } from '@components';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function PrivateError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <Stack gap="lg" align="center" className="min-h-[60vh] justify-center">
      <div>
        <h2 className="text-2xl font-bold mb-2">Something went wrong</h2>
        <p className="text-text-secondary mb-4">
          {error.message || 'An unexpected error occurred'}
        </p>
        <Stack direction="horizontal" gap="sm">
          <button
            onClick={reset}
            className="px-4 py-2 bg-bg-secondary rounded-md hover:bg-bg-tertiary"
          >
            Try again
          </button>
          <InternalLink href="/">Back to Home</InternalLink>
        </Stack>
      </div>
    </Stack>
  );
}
