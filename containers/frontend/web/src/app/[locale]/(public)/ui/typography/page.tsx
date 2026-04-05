import { Text } from '@components/primitives/text';
import { getTranslations } from 'next-intl/server';

export default async function TypographyPage() {
  const t = await getTranslations('pages.ui.typography');

  return (
    <div className="flex flex-col gap-8 py-8 max-w-[65ch]">
      <Text as="p" variant="caption">
        {t('caption')}
      </Text>

      <Text as="p" variant="body-xs">
        {t('bodyXs')}
      </Text>

      <Text as="p" variant="body-sm">
        {t('bodySm')}
      </Text>

      <Text as="p" variant="body">{t('body')}</Text>

      <Text as="p" variant="body-lg">
        {t('bodyLg')}
      </Text>

      <Text as="p" variant="heading-sm">
        {t('headingSm')}
      </Text>

      <Text as="p" variant="heading-md">
        {t('headingMd')}
      </Text>

      <Text as="p" variant="heading-lg">
        {t('headingLg')}
      </Text>

      <Text as="p" variant="heading-xl">
        {t('headingXl')}
      </Text>

      <Text as="p" variant="code">
        {t('code')}
      </Text>
    </div>
  );
}
