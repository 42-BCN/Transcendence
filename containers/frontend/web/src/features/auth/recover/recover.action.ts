'use server';

import { fetchServer } from '@/lib/http/fetcher.server';
import { RecoverReqSchema, type RecoverRes } from '@/contracts/auth/auth.recover.caro';

function parseInput(formData: FormData) {
  const result = RecoverReqSchema.safeParse({
    identifier: formData.get('identifier'),
  });

  if (!result.success) {
    return {
      ok: false,
      errors: result.error.flatten(),
    };
  }

  return { ok: true, data: result.data };
}

// TODO Endpoint WIP
export async function recoverAction(formData: FormData) {
  const result = parseInput(formData);
  if (!result.ok) return;

  await fetchServer<RecoverRes>('/auth/recover', 'POST', result.data);

  return;
}
