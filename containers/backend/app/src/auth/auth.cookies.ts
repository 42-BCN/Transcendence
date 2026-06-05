export type AuthCookieSameSite = 'lax' | 'none';

function getPublicAppUrl(): URL | null {
  const rawUrl = process.env.APP_BASE_URL?.trim();

  if (!rawUrl) return null;

  try {
    return new URL(rawUrl);
  } catch {
    return null;
  }
}

function isLoopbackHostname(hostname: string): boolean {
  return hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '::1';
}

// Public HTTPS hosts need SameSite=None so the browser keeps auth cookies
// attached across the external Google OAuth redirect.
export function getAuthCookieSameSite(): AuthCookieSameSite {
  const configuredValue = process.env.SESSION_COOKIE_SAME_SITE?.trim().toLowerCase();

  if (configuredValue === 'lax' || configuredValue === 'none') {
    return configuredValue;
  }

  const publicAppUrl = getPublicAppUrl();

  if (!publicAppUrl || publicAppUrl.protocol !== 'https:') {
    return 'lax';
  }

  return isLoopbackHostname(publicAppUrl.hostname.toLowerCase()) ? 'lax' : 'none';
}
