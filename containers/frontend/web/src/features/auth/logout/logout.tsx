'use client';

import { envPublic } from '@/lib/config/env.public';
import { Button, Icon } from '@components';
import { navLinkStyles } from '@components/controls/nav-link/nav-link.styles';
import { logoutAction } from './logout.action';
import { useRouter } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { Button as AriaButton } from 'react-aria-components';

type LogoutProps = {
  onPress?: () => void;
  label?: string;
  isExpanded?: boolean;
  presentation?: 'default' | 'navigation';
};

const navigationIconWrapperClassName = 'relative flex size-5 shrink-0 items-center justify-center';

export function Logout({
  onPress,
  label,
  isExpanded = false,
  presentation = 'default',
}: LogoutProps) {
  const router = useRouter();
  const t = useTranslations('features.auth.actions');
  const logoutHandler = async () => {
    const data = await logoutAction();
    if (!data.ok) {
      // TODO handle error
      envPublic.processEnv === 'development' && console.error('Failed to log out');
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

  if (presentation === 'navigation') {
    return (
      <AriaButton
        onPress={logoutHandler}
        className={navLinkStyles({
          w: isExpanded ? 'full' : 'auto',
          className,
        })}
        aria-label={visibleLabel}
      >
        <div className={navigationIconWrapperClassName}>
          <Icon name="logOut" size={20} />
        </div>
        {isExpanded ? (
          <span className="whitespace-nowrap pe-3 leading-none">{visibleLabel}</span>
        ) : null}
      </AriaButton>
    );
  }

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
