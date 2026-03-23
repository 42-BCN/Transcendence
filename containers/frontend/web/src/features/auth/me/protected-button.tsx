'use client';

import { useState, useTransition } from 'react';
import { protectedMeAction } from './protected.action';
import { Button } from '@components/controls/button';

export function ProtectedButton() {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<unknown>(null);

  return (
    <div className="space-y-3">
      <Button
        onPress={() =>
          startTransition(async () => {
            const r = await protectedMeAction();
            setResult(r);
          })
        }
      >
        {isPending ? 'Checking…' : 'Call /api/protected/me'}
      </Button>

      <pre className="rounded-md border p-3 text-xs overflow-auto">
        {result ? JSON.stringify(result, null, 2) : 'No result yet.'}
      </pre>
    </div>
  );
}
