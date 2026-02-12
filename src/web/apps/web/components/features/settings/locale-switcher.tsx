'use client';

import { Link, usePathname } from '@/i18n/navigation';
import { useLocale } from 'next-intl';

export function LocaleSwitcher() {
  const pathname = usePathname();
  const currentLocale = useLocale();

  return (
    <nav aria-label="Language selector">
      <Link
        href={{ pathname }}
        locale="en"
        aria-current={currentLocale === 'en' ? 'true' : undefined}
      >
        English
      </Link>

      {' · '}

      <Link
        href={{ pathname }}
        locale="es"
        aria-current={currentLocale === 'es' ? 'true' : undefined}
      >
        Español
      </Link>
    </nav>
  );
}
