import { useLocale, useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';

export function Navigation() {
  const t = useTranslations('LocaleSwitcher');

  const locale = useLocale();
  console.log(locale);
  const otherLocale = locale === 'en' ? 'es' : 'en';

  return (
    <Link href="/" locale={otherLocale}>
      {t('switchLocale', { locale: otherLocale })}
    </Link>
  );
}
