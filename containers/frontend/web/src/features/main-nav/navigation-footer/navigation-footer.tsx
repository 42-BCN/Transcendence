import { LocaleSwitcher } from '@/features/locale-switcher';
import { Icon } from '@components/primitives/icon';
import { Footer } from '@/components/primitives/footer';
import { useNavigationContext } from '@/features/main-nav/navigation.context';
import { Stack } from '@components/primitives/stack';

export function NavigationFooter() {
  const { isExpanded } = useNavigationContext();

  return (
    <Stack>
      <Icon name="settings" size={20} />
      <LocaleSwitcher />
      {isExpanded && <Footer />}
    </Stack>
  );
}
