import { defineRouting } from 'next-intl/routing';
import { envPublic } from '@/lib/env.public';


const localeCookie =
  envPublic.localeCookieEnabled === 'false'
    ? false
    : {
        name: envPublic.localeCookieName,
        maxAge: 200 * 24 * 60 * 60,
      };

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
  localeCookie,
});
