import { routing } from './i18n/routing';
import createMiddleware from 'next-intl/middleware';
import { type NextRequest, NextResponse } from 'next/server';

export default function middleware(request: NextRequest) {
  const handleI18nRouting = createMiddleware(routing);
  let response = handleI18nRouting(request);

  const url = request.nextUrl;
  const [_, maybeLocale, ...rest] = url.pathname.split('/');
  if (maybeLocale === routing.defaultLocale) {
    const target = new URL(`/${rest.join('/')}`, request.url);
    return NextResponse.redirect(target, 308);
  }

  return response;
}

export const config = {
  matcher: [
    // Skip all paths that should not be internationalized
    '/((?!_next|.*/opengraph-image|.*\\..*).*)',

    // Necessary for base path to work
    '/src/',
  ],
};
