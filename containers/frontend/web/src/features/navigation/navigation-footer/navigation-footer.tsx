import { LocaleSwitcher } from '@/features/locale-switcher';
import { Footer } from '@components/controls/footer';
import { useNavigationContext } from '@/features/navigation/navigation.context';
import { Stack } from '@components/primitives/stack';
import { RenderNavLinkContent } from '../navigation-main/navigation-main';
import { navLinkStyles } from '@components/controls/nav-link/nav-link.styles';
import { Text } from '@components/primitives/text';
import { SegmentedControlGroup } from '@components/composites/segmented-control-group';
import { Button, DialogTrigger, Popover } from 'react-aria-components';
import { GlassCard } from '@components/primitives/glass-card';

export function NavigationFooter() {
  const { isExpanded } = useNavigationContext();
  const options = [
    { id: 'dark', label: 'd' },
    { id: 'light', label: 'l' },
  ] as const;
  // TODO marta change theme function
  return (
    <>
      <DialogTrigger>
        <Button className={navLinkStyles()}>
          <RenderNavLinkContent icon="settings" label="Settings" isExpanded={isExpanded} />
        </Button>

        {/* This should be moved to its own component of settings/footer */}
        <Popover placement="end">
          <GlassCard className="border p-3 rounded-lg" intensity="medium" blur="xl">
            <Stack align="start" className="px-2 pe-3" gap="md">
              <Stack gap="sm">
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
              <Stack gap="sm">
                <Text as="p" variant="caption">
                  Language
                </Text>
                <LocaleSwitcher />
              </Stack>
              <Footer />
            </Stack>
          </GlassCard>
        </Popover>
      </DialogTrigger>
    </>
  );
}
