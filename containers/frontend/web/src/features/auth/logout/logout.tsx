'use client';

import { Button, Icon } from '@components';
import { logoutAction } from './logout.action';
import { useRouter } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';

type LogoutProps = {
  onPress?: () => void;
  label?: string;
  isExpanded?: boolean;
};

export function Logout({ onPress, label, isExpanded = false }: LogoutProps) {
  const router = useRouter();
  const t = useTranslations('features.auth.actions');
  const logoutHandler = async () => {
    const { data } = await logoutAction();
    if (!data.ok) {
      // TODO handle error
      console.error('Failed to log out');
    }

    router.push('/login');
    router.refresh();
    onPress?.();
  };
  const logoutIcon = <Icon name="logOut" />;
  const visibleLabel = label ?? t('logoutAriaLabel');
  const className = isExpanded
    ? 'w-full h-6 min-h-6 justify-start py-0 ps-2 pe-0'
    : 'size-6 p-0 justify-center';

  return (
    <Button
      w={isExpanded ? 'full' : 'auto'}
      onPress={logoutHandler}
      icon={logoutIcon}
      variant="ghost"
      className={className}
      aria-label={visibleLabel}
    >
      {isExpanded ? (
        <span className="whitespace-nowrap pe-3 leading-none">{visibleLabel}</span>
      ) : null}
    </Button>
  );
}
