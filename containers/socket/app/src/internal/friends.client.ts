const BACKEND_URL = process.env.BACKEND_URL ?? 'https://backend:4000';

export async function fetchAcceptedFriendIds(userId: string): Promise<string[]> {
  try {
    const secret = process.env.SOCKET_INTERNAL_SECRET;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (secret) headers['x-internal-secret'] = secret;

    const res = await fetch(`${BACKEND_URL}/internal/friends`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ userId }),
    });

    if (!res.ok) {
      console.warn('[friends.client] backend /internal/friends failed', res.status);
      return [];
    }

    const body = (await res.json()) as {
      ok: boolean;
      data?: { friendIds: string[] };
    };

    return body.data?.friendIds ?? [];
  } catch (error) {
    console.error('[friends.client] error fetching friend ids', error);
    return [];
  }
}
