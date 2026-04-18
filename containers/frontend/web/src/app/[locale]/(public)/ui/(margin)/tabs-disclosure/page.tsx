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
  DisclosureGroup,
} from '@components';

/* Sub-component: Friends tab content */
function FriendsTabContent() {
  const t = useTranslations('pages.ui.tabsDisclosure.disclosure');

  return (
    <Stack gap="md">
      <Disclosure defaultExpanded>
        <DisclosureTrigger title={t('friendsOnline')} />
        <DisclosurePanel>
          <Stack gap="sm" className="py-2">
            <Text variant="body-sm" color="tertiary">
              {t('friendsListHint')} (Online)
            </Text>
          </Stack>
        </DisclosurePanel>
      </Disclosure>

      <Disclosure>
        <DisclosureTrigger title={t('friendsOffline')} />
        <DisclosurePanel>
          <Stack gap="sm" className="py-2">
            <Text variant="body-sm" color="tertiary">
              {t('friendsListHint')} (Offline)
            </Text>
          </Stack>
        </DisclosurePanel>
      </Disclosure>
    </Stack>
  );
}

/* Sub-component: Requests tab content (Single Accordion Mode) */
function RequestsTabContent() {
  const t = useTranslations('pages.ui.tabsDisclosure.disclosure');

  return (
    <DisclosureGroup selectionMode="single" defaultExpandedKeys={['received']}>
      <Stack gap="md">
        <Disclosure id="received">
          <DisclosureTrigger title={t('received')} />
          <DisclosurePanel>
            <Stack gap="sm" className="py-2">
              <Text variant="body-sm" color="tertiary">
                {t('receivedHint')}
              </Text>
            </Stack>
          </DisclosurePanel>
        </Disclosure>

        <Disclosure id="sent">
          <DisclosureTrigger title={t('sent')} />
          <DisclosurePanel>
            <Stack gap="sm" className="py-2">
              <Text variant="body-sm" color="tertiary">
                {t('sentHint')}
              </Text>
            </Stack>
          </DisclosurePanel>
        </Disclosure>
      </Stack>
    </DisclosureGroup>
  );
}

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
          <FriendsTabContent />
        </TabPanel>

        <TabPanel id="requests">
          <RequestsTabContent />
        </TabPanel>
      </Tabs>
    </Stack>
  );
}
