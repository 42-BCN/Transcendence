const SOCKET_SERVICE_URL = process.env.SOCKET_SERVICE_URL ?? 'http://socket:3100';

export async function resolveOnlineStatus(userIds: string[]): Promise<Record<string, boolean>> {
  if (userIds.length === 0) return {};

  try {
    const secret = process.env.SOCKET_INTERNAL_SECRET;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (secret) headers['x-internal-secret'] = secret;

    const res = await fetch(`${SOCKET_SERVICE_URL}/internal/presence`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ userIds }),
    });

    if (!res.ok) {
      console.warn('[friendships.presence] socket presence check failed', res.status);
      return Object.fromEntries(userIds.map((id) => [id, false]));
    }

    const body = (await res.json()) as {
      ok: boolean;
      data?: { status: Record<string, boolean> };
    };

    return body.data?.status ?? {};
  } catch (error) {
    console.error('[friendships.presence] error', error);
    return Object.fromEntries(userIds.map((id) => [id, false]));
  }
}
