'use client';

import { Text } from '@components/primitives/text';
import { SegmentedControlGroup } from '@components/composites/segmented-control-group';
import { LocaleSwitcher } from '@/features/locale-switcher';
import { Footer } from '../footer';
import { Icon } from '@components/primitives/icon';
import { useTranslations } from 'next-intl';

import { Stack } from '@components/primitives/stack';
import { settingsStyles } from './settings.styles';
import { useTheme } from '@/providers/theme-provider';

export function Settings() {
  const { theme, setTheme } = useTheme();
  const t = useTranslations('features.settings');
  const options = [
    {
      id: 'dark',
      label: <Icon name="darkMode" size={17} />,
      ariaLabel: t('dark'),
      tooltipLabel: t('dark'),
      tooltipPlacement: 'top' as const,
    },
    {
      id: 'light',
      label: <Icon name="lightMode" size={17} />,
      ariaLabel: t('light'),
      tooltipLabel: t('light'),
      tooltipPlacement: 'top' as const,
    },
  ] as const;

  return (
    <Stack align="start" className={settingsStyles.wrapper} gap="md">
      <Stack gap="sm">
        <Text as="p" variant="caption">
          {t('theme')}
        </Text>
        <SegmentedControlGroup
          aria-label={'theme switcher'}
          selectedKey={theme}
          onSelectionChange={(key) => {
            if (key === 'light' || key === 'dark') setTheme(key);
          }}
          options={options}
        />
      </Stack>
      <Stack gap="sm">
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
