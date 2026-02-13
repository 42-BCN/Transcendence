'use client';

import { usePathname, useRouter } from '@/i18n/navigation';
import { useParams } from 'next/navigation';
import { useLocale } from 'next-intl';

export function LocaleSwitcher() {
  const router = useRouter();
  const pathname = usePathname(); // ✅ should be '/' when on '/es'
  const params = useParams();
  const locale = useLocale();

  return (
    <nav aria-label="Language selector">
      <button
        type="button"
        onClick={() => router.replace({ pathname, params } as any, { locale: 'en' })}
        aria-current={locale === 'en' ? 'true' : undefined}
      >
        English
      </button>

      {' · '}

      <button
        type="button"
        onClick={() => router.replace({ pathname, params } as any, { locale: 'es' })}
        aria-current={locale === 'es' ? 'true' : undefined}
      >
        Español
      </button>
    </nav>
  );
}
