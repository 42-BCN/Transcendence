'use client';

import { useLocale, useTranslations } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/navigation';
import { SegmentedControlGroup } from '@/components/composites/segmented-control-group';
import type { Key } from 'react-aria-components';

type LocaleKey = 'en' | 'es' | 'ca';

export function LocaleSwitcher() {
  const locale = useLocale() as LocaleKey;
  const t = useTranslations('LocaleSwitcher');
  const router = useRouter();
  const pathname = usePathname();

  const changeLocaleHandler = (key: Key) => {
    const next = String(key) as LocaleKey;
    if (next === locale) return;
    if (next !== 'en' && next !== 'es' && next !== 'ca') return;
    document.cookie = `locale=${next};path=/;max-age=${200 * 24 * 60 * 60}`;
    router.replace(pathname, { locale: next });
  };

  const options = [
    { id: 'en', label: t('en') },
    { id: 'es', label: t('es') },
    { id: 'ca', label: t('ca') },
  ] as const;
  return (
    <SegmentedControlGroup
      aria-label={t('ariaLabel')}
      selectedKey={locale as Key}
      onSelectionChange={changeLocaleHandler}
      options={options}
    />
  );
}
