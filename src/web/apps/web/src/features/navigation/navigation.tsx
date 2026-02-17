'use client';

import { useLocale, useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/navigation';

export function Navigation() {
  const t = useTranslations('LocaleSwitcher');

  const locale = useLocale();
  const otherLocale = locale === 'en' ? 'es' : 'en';

  const pathname = usePathname();

  return (
    <Link href={pathname} locale={otherLocale}>
      {t('switchLocale', { locale: otherLocale })}
    </Link>
  );
}
