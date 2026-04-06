import { defineRouting } from 'next-intl/routing';
import { envPublic } from '@/lib/config/env.public';

import { LOCALE_COOKIE_MAX_AGE } from './constants';

const localeCookie = {
  name: envPublic.localeCookieName,
  maxAge: LOCALE_COOKIE_MAX_AGE,
};

export const routing = defineRouting({
  locales: ['en', 'es', 'ca'],
  defaultLocale: 'en',
  localePrefix: 'as-needed',

  pathnames: {
    '/': '/',
    '/create-account': {
      en: '/create-account',
      es: '/registro',
      ca: '/crear-compte',
    },
    '/login': {
      en: '/login',
      es: '/iniciar-sesion',
      ca: '/iniciar-sessio',
    },
    '/recover': {
      en: '/recover',
      es: '/recuperar-cuenta',
      ca: '/recuperar-compte',
    },
    '/create-account/success': {
      en: '/create-account/success',
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
    '/privacy': {
      en: '/privacy',
      es: '/privacidad',
      ca: '/privacitat',
    },
    '/terms': {
      en: '/terms',
      es: '/terminos',
      ca: '/termes',
    },
  },
  localeCookie,
});
