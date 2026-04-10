import { Meter, Stack, Text } from '@components';
import { getTranslations } from 'next-intl/server';

export default async function MeterPage() {
  const t = await getTranslations('pages.ui.meter');

  return (
    <Stack>
      <Text as="h1" variant="heading-md">
        {t('title')}
      </Text>
      <Meter label={t('label')} value={25} max={100} />
    </Stack>
  );
}
