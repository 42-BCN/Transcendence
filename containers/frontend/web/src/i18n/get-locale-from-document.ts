export type Locale = 'en' | 'es' | 'ca';

export function getLocaleFromDocument(): Locale {
  if (typeof document === 'undefined') return 'en';

  const lang = document.documentElement.lang.toLowerCase();

  return lang === 'es' || lang === 'ca' || lang === 'en' ? lang : 'en';
}
