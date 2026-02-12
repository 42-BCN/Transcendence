// src/i18n/navigation.ts
import { createNavigation } from 'next-intl/navigation';

export const locales = ['en', 'es'] as const;
export const defaultLocale = 'en';

export const { Link, usePathname, useRouter, redirect } = createNavigation({ locales });
