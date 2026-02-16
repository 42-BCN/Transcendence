import { defineRouting } from 'next-intl/routing';

const disableLocaleCookie = process.env.NEXT_PUBLIC_LOCALE_COOKIE === 'false';

export const routing = defineRouting({
  locales: ['en', 'es'],
  defaultLocale: 'en',
  localePrefix: 'as-needed',

  pathnames: {
    '/': '/',
    '/signup': {
      en: '/signup',
      es: '/registro',
    },
    '/login': {
      en: '/login',
      es: '/iniciar-sesion', // or keep '/login' if you want
    },
  },

  localeCookie: disableLocaleCookie ? false : { maxAge: 200 * 24 * 60 * 60 },
});
