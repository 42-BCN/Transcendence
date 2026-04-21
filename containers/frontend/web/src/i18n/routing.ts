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
    '/recover/success': {
      en: '/recover/success',
      es: '/recuperar-cuenta/exito',
      ca: '/recuperar-compte/exit',
    },
    '/create-account/success': {
      en: '/create-account/success',
      es: '/registro/exito',
      ca: '/crear-comte/exit',
    },
    '/verify-email': {
      en: '/verify-email',
      es: '/verify-email',
      ca: '/verify-email',
    },
    '/reset-password': {
      en: '/reset-password',
      es: '/reset-password',
      ca: '/reset-password',
    },
    '/ui': '/ui',
    '/ui/chat': '/ui/chat',
    '/ui/glass-card': '/ui/glass-card',
    '/ui/glass-card-animated': '/ui/glass-card-animated',
    '/ui/glass-card-animated-v2': '/ui/glass-card-animated-v2',
    '/ui/glass-card-animated-v3': '/ui/glass-card-animated-v3',
    '/ui/message-bubble': '/ui/message-bubble',
    '/ui/meter': '/ui/meter',
    '/ui/scroll-area': '/ui/scroll-area',
    '/ui/text-area': '/ui/text-area',
    '/ui/tabs-disclosure': '/ui/tabs-disclosure',
    '/ui/theme-test': '/ui/theme-test',
    '/ui/typography': '/ui/typography',
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
    '/game': {
      en: '/game',
      es: '/juego',
      ca: '/joc',
    },
  },
  localeCookie,
});
