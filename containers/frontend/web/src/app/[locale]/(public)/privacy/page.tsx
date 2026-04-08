import { getTranslations } from 'next-intl/server';
import { Stack, Text, ContentSection } from '@components';

export default async function PrivacyPolicyPage() {
  const t = await getTranslations('pages.privacy');

  return (
    <main className="w-full max-w-3xl mx-auto px-6 py-12">
      <article>
        <Stack gap="lg">
          <header>
            <Stack gap="xs">
              <Text as="h1" variant="heading-lg">
                {t('title')}
              </Text>
              <Text as="p" variant="body-sm" color="tertiary">
                {t('lastUpdated')}
              </Text>
            </Stack>
          </header>

          <ContentSection description={t('intro')} />

          <ContentSection
            title={t('dataCollected.title')}
            description={t('dataCollected.description')}
            items={[
              t('dataCollected.items.email'),
              t('dataCollected.items.username'),
              t('dataCollected.items.usage'),
              t('dataCollected.items.technical'),
            ]}
          />

          <ContentSection
            title={t('dataUsage.title')}
            description={t('dataUsage.description')}
            items={[
              t('dataUsage.items.account'),
              t('dataUsage.items.gameplay'),
              t('dataUsage.items.improvement'),
              t('dataUsage.items.communication'),
            ]}
          />

          <ContentSection title={t('storage.title')} description={t('storage.description')} />

          <ContentSection
            title={t('rights.title')}
            description={t('rights.description')}
            items={[
              t('rights.items.access'),
              t('rights.items.rectification'),
              t('rights.items.deletion'),
              t('rights.items.portability'),
            ]}
          />

          <ContentSection title={t('contact.title')} description={t('contact.description')} />
        </Stack>
      </article>
    </main>
  );
}
