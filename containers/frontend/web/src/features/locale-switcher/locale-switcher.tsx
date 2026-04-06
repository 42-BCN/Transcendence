'use client';

import { useLocale, useTranslations } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/navigation';
import { SegmentedControlGroup } from '@/components/composites/segmented-control-group';
import type { Key } from 'react-aria-components';

import { envPublic } from '@/lib/config/env.public';
import { LOCALE_COOKIE_MAX_AGE } from '@/i18n/constants';

type LocaleKey = 'en' | 'es' | 'ca';

type FlagProps = {
  className?: string;
};

function EnFlag({ className }: FlagProps) {
  return (
    <svg viewBox="0 0 14 10" className={className} aria-hidden="true">
      <rect width="14" height="10" fill="#012169" />
      <path d="M0 0 L14 10 M14 0 L0 10" stroke="#ffffff" strokeWidth="2" />
      <path d="M0 0 L14 10 M14 0 L0 10" stroke="#c8102e" strokeWidth="1" />
      <path d="M7 0 V10 M0 5 H14" stroke="#ffffff" strokeWidth="3" />
      <path d="M7 0 V10 M0 5 H14" stroke="#c8102e" strokeWidth="2" />
    </svg>
  );
}

function EsFlag({ className }: FlagProps) {
  return (
    <svg viewBox="0 0 14 10" className={className} aria-hidden="true">
      <rect width="14" height="10" fill="#aa151b" />
      <rect y="2.5" width="14" height="5" fill="#f1bf00" />
    </svg>
  );
}

function CaFlag({ className }: FlagProps) {
  return (
    <svg viewBox="0 0 14 10" className={className} aria-hidden="true">
      <rect width="14" height="10" fill="#fdd835" />
      <rect y="1" width="14" height="1" fill="#c62828" />
      <rect y="3" width="14" height="1" fill="#c62828" />
      <rect y="5" width="14" height="1" fill="#c62828" />
      <rect y="7" width="14" height="1" fill="#c62828" />
      <rect y="9" width="14" height="1" fill="#c62828" />
    </svg>
  );
}

export function LocaleSwitcher() {
  const locale = useLocale() as LocaleKey;
  const t = useTranslations('components.localeSwitcher');
  const router = useRouter();
  const pathname = usePathname();

  const changeLocaleHandler = (key: Key) => {
    const next = String(key) as LocaleKey;
    if (next === locale) return;
    if (next !== 'en' && next !== 'es' && next !== 'ca') return;
    document.cookie = `${envPublic.localeCookieName}=${next};path=/;max-age=${LOCALE_COOKIE_MAX_AGE}`;
    router.replace(pathname, { locale: next });
  };

  const options = [
    {
      id: 'en',
      label: <EnFlag className="h-3 w-[17px] rounded-[2px]" />,
      ariaLabel: t('en'),
      tooltipLabel: 'EN',
      tooltipPlacement: 'bottom',
    },
    {
      id: 'es',
      label: <EsFlag className="h-3 w-[17px] rounded-[2px]" />,
      ariaLabel: t('es'),
      tooltipLabel: 'ES',
      tooltipPlacement: 'bottom',
    },
    {
      id: 'ca',
      label: <CaFlag className="h-3 w-[17px] rounded-[2px]" />,
      ariaLabel: t('ca'),
      tooltipLabel: 'CAT',
      tooltipPlacement: 'bottom',
    },
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
