import { LocaleSwitcher } from '@/features/locale-switcher';
import { Icon } from '@components/primitives/icon';

export function NavigationFooter() {
  return (
    <div className="flex flex-col gap-2 items-center">
      <Icon name="settings" size="20" />
      <LocaleSwitcher />
    </div>
  );
}
