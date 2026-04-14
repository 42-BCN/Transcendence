'use server';

import { cookies } from 'next/headers';

export async function clearCreateAccountSuccessCookies() {
  const cookieStore = await cookies();
  cookieStore.delete('signup_success');
  cookieStore.delete('pending_verification_email');
}
