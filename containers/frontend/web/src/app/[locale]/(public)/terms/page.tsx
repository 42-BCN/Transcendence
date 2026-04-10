import { getTranslations } from 'next-intl/server';
import { Stack, Text, ContentSection, ExternalLink } from '@components';

export default async function TermsOfServicePage() {
  const t = await getTranslations('pages.terms');

  return (
    <main className="w-full max-w-3xl mx-auto px-6 py-12">
      <Stack as="article" gap="lg">
        <Stack as="header" gap="xs">
          <Text as="h1" variant="heading-lg">
            {t('title')}
          </Text>
          <Text as="p" variant="body-sm" color="tertiary">
            {t('lastUpdated')}
          </Text>
        </Stack>

        <ContentSection description={t('intro')} />

        <ContentSection title={t('acceptance.title')} description={t('acceptance.description')} />

        <ContentSection
          title={t('registration.title')}
          description={t('registration.description')}
          items={[t('registration.items.security'), t('registration.items.accuracy')]}
        />

        <ContentSection
          title={t('conduct.title')}
          description={t('conduct.description')}
          items={[
            t('conduct.items.cheating'),
            t('conduct.items.harassment'),
            t('conduct.items.disruption'),
          ]}
        />

        <ContentSection title={t('ip.title')} description={t('ip.description')} />

        <ContentSection title={t('disclaimer.title')} description={t('disclaimer.description')} />

        <ContentSection title={t('termination.title')} description={t('termination.description')} />

        <ContentSection title={t('law.title')} description={t('law.description')} />

        <ContentSection
          title={t('contact.title')}
          description={t.rich('contact.description', {
            link: (chunks) => (
              <ExternalLink
                as="link"
                className="font-body"
                href="https://github.com/42-BCN/Transcendence"
              >
                {chunks}
              </ExternalLink>
            ),
          })}
        />
      </Stack>
    </main>
  );
}
