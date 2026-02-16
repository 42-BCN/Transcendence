function required(value: string | undefined, name: string): string {
	if (!value) throw new Error(`Missing env var: ${name}`);
	return value;
  }
  
  export const envPublic = {
	appUrl: required(process.env.NEXT_PUBLIC_APP_URL, 'NEXT_PUBLIC_APP_URL'),
	apiBaseUrl: required(process.env.NEXT_PUBLIC_API_BASE_URL, 'NEXT_PUBLIC_API_BASE_URL'),
	localeCookieName: required(process.env.NEXT_PUBLIC_LOCALE_COOKIE_NAME, 'NEXT_PUBLIC_LOCALE_COOKIE_NAME'),
	localeCookieEnabled: required(process.env.NEXT_PUBLIC_LOCALE_COOKIE_ENABLED, 'NEXT_PUBLIC_LOCALE_COOKIE_ENABLED'),
  } as const;