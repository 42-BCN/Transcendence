const locales = ['en', 'es', 'ca'] as const;
const defaultLocale: Locale = 'en';
export type Locale = (typeof locales)[number];
function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}
export function getLocaleFromDocument(): Locale {
  if (typeof document === 'undefined') return defaultLocale;
  const lang = document.documentElement.lang.toLowerCase();
  return isLocale(lang) ? lang : defaultLocale;
}
