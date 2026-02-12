import { getRequestConfig } from 'next-intl/server';
import { defaultLocale, locales, type Locale } from './routing';

export default getRequestConfig(async ({ locale }) => {
  const safeLocale: Locale = locales.includes(locale as Locale)
    ? (locale as Locale)
    : defaultLocale;

  return {
    locale: safeLocale,
    messages: {
      ...(await import(`./locales/${safeLocale}/common.json`)).default,
    },
  };
});
