import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['en', 'es'],
  defaultLocale: 'en',
  // localePrefix: 'never',

  pathnames: {
    '/': '/',
  },
  localeCookie: 'locale-cookie-false'
    ? false
    : {
        // 200 days
        maxAge: 200 * 24 * 60 * 60,
      },
});
