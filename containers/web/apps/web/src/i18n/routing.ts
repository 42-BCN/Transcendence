import { defineRouting } from 'next-intl/routing';
import { envPublic } from '@/lib/config/env.public';

const localeCookie =
  envPublic.localeCookieEnabled === false
    ? false
    : {
        name: envPublic.localeCookieName,
        maxAge: 200 * 24 * 60 * 60,
      };

export const routing = defineRouting({
  locales: ['en', 'es', 'ca'],
  defaultLocale: 'en',
  localePrefix: 'as-needed',

  pathnames: {
    '/': '/',
    '/signup': {
      en: '/signup',
      es: '/registro',
      ca: '/crear-compte',
    },
    '/login': {
      en: '/login',
      es: '/iniciar-sesion',
      ca: '/iniciar-sessio',
    },
    '/signup/success': {
      en: '/signup/success',
      es: '/registro/exito',
      ca: '/crear-compte/exit',
    },
    '/ui': '/ui',
    '/robots': '/robots',
    '/profile': {
      en: '/profile',
      es: '/perfil',
      ca: '/perfil',
    },
  },
  localeCookie,
});
