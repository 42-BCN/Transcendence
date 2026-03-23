import { LocaleSwitcher } from '@/features/locale-switcher';
import { Icon } from '@components/primitives/icon';
import { Footer } from '@/components/primitives/footer';
import { useNavigationContext } from '@/features/main-nav/navigation.context';

export function NavigationFooter() {
  const { isExpanded } = useNavigationContext();

  return (
    <>
      <div className="flex flex-col gap-2 items-center">
        <Icon name="settings" size={20} />
        <LocaleSwitcher />
      </div>
      {isExpanded && (
        <div className="absolute bottom-4 left-0 right-0 z-10">
          <Footer />
        </div>
      )}
    </>
  );
}
