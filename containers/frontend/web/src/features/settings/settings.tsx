import { Text } from '@components/primitives/text';
import { SegmentedControlGroup } from '@components/composites/segmented-control-group';
import { LocaleSwitcher } from '@/features/locale-switcher';
import { Footer } from '@/features/footer';
import { Icon } from '@components/primitives/icon';

import { Stack } from '@components/primitives/stack';

export function Settings() {
  // TODO marta change theme function
  const options = [
    { id: 'dark', label: <Icon name="darkMode" size={16} /> },
    { id: 'light', label: <Icon name="lightMode" size={16} /> },
  ] as const;
  return (
    <Stack align="start" className="px-2 pe-3" gap="md">
      <Stack gap="xs">
        <Text as="p" variant="caption">
          Theme
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
          Language
        </Text>
        <LocaleSwitcher />
      </Stack>
      <hr className="border-t border-black w-full min-w-[180px]" />
      <Footer />
    </Stack>
  );
}
