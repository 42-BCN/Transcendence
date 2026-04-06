import { Text } from '@components/primitives/text';
import { Stack } from '@components/primitives/stack';
import { getTranslations } from 'next-intl/server';

export default async function ThemeTestPage() {
  const t = await getTranslations('pages.ui.themeTest');

  return (
    <div className="min-h-screen p-8 text-text-primary">
      <Stack gap="lg">
        <Stack gap="md">
          <Text as="h1" variant="heading-xl">
            {t('title')}
          </Text>
          <Text as="p" variant="body">
            {t('description')}
          </Text>
        </Stack>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <section className="p-6 rounded-lg border border-text-tertiary bg-bg-secondary">
            <Text as="h2" variant="heading-md">
              {t('secondaryBackground')}
            </Text>
            <Text as="p" variant="body-sm" className="mt-4">
              {t('secondaryBackgroundDescription')}
            </Text>
          </section>

          <section className="p-6 rounded-lg border border-text-tertiary">
            <Text as="h2" variant="heading-md">
              {t('textVariants')}
            </Text>
            <Stack gap="xs" className="mt-4">
              <Text as="p" variant="body" className="text-text-primary">
                {t('primaryText')}
              </Text>
              <Text as="p" variant="body" className="text-text-secondary">
                {t('secondaryText')}
              </Text>
              <Text as="p" variant="body" className="text-text-tertiary">
                {t('tertiaryText')}
              </Text>
              <Text as="p" variant="body" className="text-text-disabled">
                {t('disabledText')}
              </Text>
            </Stack>
          </section>
        </div>
      </Stack>
    </div>
  );
}
