import { getTranslations } from 'next-intl/server';
import { Text } from '@components/primitives/text';
import { Stack } from '@components/primitives/stack';

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

          <section>
            <Stack gap="sm">
              <Text as="p" variant="body" color="secondary">
                {t('intro')}
              </Text>
            </Stack>
          </section>

          <section>
            <Stack gap="sm">
              <Text as="h2" variant="heading-sm">
                {t('dataCollected.title')}
              </Text>
              <Text as="p" variant="body" color="secondary">
                {t('dataCollected.description')}
              </Text>
              <ul className="list-disc pl-6 space-y-1">
                <li>
                  <Text as="span" variant="body" color="secondary">
                    {t('dataCollected.items.email')}
                  </Text>
                </li>
                <li>
                  <Text as="span" variant="body" color="secondary">
                    {t('dataCollected.items.username')}
                  </Text>
                </li>
                <li>
                  <Text as="span" variant="body" color="secondary">
                    {t('dataCollected.items.usage')}
                  </Text>
                </li>
                <li>
                  <Text as="span" variant="body" color="secondary">
                    {t('dataCollected.items.technical')}
                  </Text>
                </li>
              </ul>
            </Stack>
          </section>

          <section>
            <Stack gap="sm">
              <Text as="h2" variant="heading-sm">
                {t('dataUsage.title')}
              </Text>
              <Text as="p" variant="body" color="secondary">
                {t('dataUsage.description')}
              </Text>
              <ul className="list-disc pl-6 space-y-1">
                <li>
                  <Text as="span" variant="body" color="secondary">
                    {t('dataUsage.items.account')}
                  </Text>
                </li>
                <li>
                  <Text as="span" variant="body" color="secondary">
                    {t('dataUsage.items.gameplay')}
                  </Text>
                </li>
                <li>
                  <Text as="span" variant="body" color="secondary">
                    {t('dataUsage.items.improvement')}
                  </Text>
                </li>
                <li>
                  <Text as="span" variant="body" color="secondary">
                    {t('dataUsage.items.communication')}
                  </Text>
                </li>
              </ul>
            </Stack>
          </section>

          <section>
            <Stack gap="sm">
              <Text as="h2" variant="heading-sm">
                {t('storage.title')}
              </Text>
              <Text as="p" variant="body" color="secondary">
                {t('storage.description')}
              </Text>
            </Stack>
          </section>

          <section>
            <Stack gap="sm">
              <Text as="h2" variant="heading-sm">
                {t('rights.title')}
              </Text>
              <Text as="p" variant="body" color="secondary">
                {t('rights.description')}
              </Text>
              <ul className="list-disc pl-6 space-y-1">
                <li>
                  <Text as="span" variant="body" color="secondary">
                    {t('rights.items.access')}
                  </Text>
                </li>
                <li>
                  <Text as="span" variant="body" color="secondary">
                    {t('rights.items.rectification')}
                  </Text>
                </li>
                <li>
                  <Text as="span" variant="body" color="secondary">
                    {t('rights.items.deletion')}
                  </Text>
                </li>
                <li>
                  <Text as="span" variant="body" color="secondary">
                    {t('rights.items.portability')}
                  </Text>
                </li>
              </ul>
            </Stack>
          </section>

          <section>
            <Stack gap="sm">
              <Text as="h2" variant="heading-sm">
                {t('contact.title')}
              </Text>
              <Text as="p" variant="body" color="secondary">
                {t('contact.description')}
              </Text>
            </Stack>
          </section>
        </Stack>
      </article>
    </main>
  );
}
