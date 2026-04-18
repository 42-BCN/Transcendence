'use client';

import { useTranslations } from 'next-intl';
import {
  Tabs,
  TabList,
  Tab,
  TabPanel,
  Disclosure,
  DisclosureTrigger,
  DisclosurePanel,
  Stack,
  Text,
} from '@components';

export default function TabsDisclosureDemoPage() {
  const t = useTranslations('pages.ui.tabsDisclosure');

  return (
    <Stack gap="lg" className="max-w-md">
      <Stack gap="xs">
        <Text as="h1" variant="heading-md">
          {t('title')}
        </Text>
        <Text color="secondary">{t('description')}</Text>
      </Stack>

      <Tabs defaultSelectedKey="friends">
        <TabList aria-label={t('tabs.sectionsLabel')}>
          <Tab id="friends">{t('tabs.friends')}</Tab>
          <Tab id="requests">{t('tabs.requests')}</Tab>
        </TabList>

        <TabPanel id="friends">
          <Stack gap="md">
            <Disclosure defaultExpanded>
              {({ isExpanded }) => (
                <>
                  <DisclosureTrigger
                    title={t('disclosure.friendsOnline')}
                    isExpanded={isExpanded}
                  />
                  <DisclosurePanel>
                    <Stack gap="sm" className="py-2">
                      <Text variant="body-sm" color="tertiary">
                        {t('disclosure.friendsListHint')} (Online)
                      </Text>
                    </Stack>
                  </DisclosurePanel>
                </>
              )}
            </Disclosure>

            <Disclosure>
              {({ isExpanded }) => (
                <>
                  <DisclosureTrigger
                    title={t('disclosure.friendsOffline')}
                    isExpanded={isExpanded}
                  />
                  <DisclosurePanel>
                    <Stack gap="sm" className="py-2">
                      <Text variant="body-sm" color="tertiary">
                        {t('disclosure.friendsListHint')} (Offline)
                      </Text>
                    </Stack>
                  </DisclosurePanel>
                </>
              )}
            </Disclosure>
          </Stack>
        </TabPanel>

        <TabPanel id="requests">
          <Stack gap="md">
            <Disclosure defaultExpanded>
              {({ isExpanded }) => (
                <>
                  <DisclosureTrigger title={t('disclosure.received')} isExpanded={isExpanded} />
                  <DisclosurePanel>
                    <Stack gap="sm" className="py-2">
                      <Text variant="body-sm" color="tertiary">
                        {t('disclosure.receivedHint')}
                      </Text>
                    </Stack>
                  </DisclosurePanel>
                </>
              )}
            </Disclosure>

            <Disclosure>
              {({ isExpanded }) => (
                <>
                  <DisclosureTrigger title={t('disclosure.sent')} isExpanded={isExpanded} />
                  <DisclosurePanel>
                    <Stack gap="sm" className="py-2">
                      <Text variant="body-sm" color="tertiary">
                        {t('disclosure.sentHint')}
                      </Text>
                    </Stack>
                  </DisclosurePanel>
                </>
              )}
            </Disclosure>
          </Stack>
        </TabPanel>
      </Tabs>
    </Stack>
  );
}
