const SOCKET_SERVICE_URL = process.env.SOCKET_SERVICE_URL ?? 'https://socket:3100';

function getHeaders(): Record<string, string> {
  const secret = process.env.SOCKET_INTERNAL_SECRET;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (secret) {
    headers['x-internal-secret'] = secret;
  }

  return headers;
}

export async function disconnectUserSockets(userId: string, sessionId: string): Promise<void> {
  try {
    await fetch(`${SOCKET_SERVICE_URL}/internal/sessions/disconnect-session`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ userId, sessionId }),
    });
  } catch {
    return;
  }
}
