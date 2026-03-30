import { Text } from '@components/primitives/text';
import { SegmentedControlGroup } from '@components/composites/segmented-control-group';
import { LocaleSwitcher } from '@/features/locale-switcher';
import { Footer } from '../footer';
import { Icon } from '@components/primitives/icon';
import { useTranslations } from 'next-intl';

import { Stack } from '@components/primitives/stack';
import { settingsStyles } from './settings.styles';

export function Settings() {
  // TODO move feature change theme to its own component
  // TODO marta change theme function
  const t = useTranslations('settings');
  const options = [
    { id: 'dark', label: <Icon name="darkMode" size={16} /> },
    { id: 'light', label: <Icon name="lightMode" size={16} /> },
  ] as const;
  return (
    <Stack align="start" className={settingsStyles.wrapper} gap="md">
      <Stack gap="xs">
        <Text as="p" variant="caption">
          {t('theme')}
        </Text>
        <SegmentedControlGroup
          aria-label={'aria-label'}
          selectedKey="dark"
          // onSelectionChange={changeLocaleHandler}
          options={options}
        />
      </Stack>
      <Stack gap="xs">
        <Text as="p" variant="caption">
          {t('language')}
        </Text>
        <LocaleSwitcher />
      </Stack>
      <hr className={settingsStyles.divider} />
      <Footer />
    </Stack>
  );
}
