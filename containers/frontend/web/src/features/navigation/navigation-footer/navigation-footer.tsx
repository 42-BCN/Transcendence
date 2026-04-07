'use client';

import { useNavigationContext } from '@/features/navigation/navigation.context';
import { RenderNavLinkContent } from '../navigation-main/navigation-main';
import { navLinkStyles } from '@components/controls/nav-link/nav-link.styles';

import { Button, DialogTrigger, Popover } from 'react-aria-components';
import { GlassCard } from '@components';
import { Settings } from '@/features/settings';
import { useTranslations } from 'next-intl';

export function NavigationFooter() {
  const { isExpanded } = useNavigationContext();
  const t = useTranslations('features.navigation');
  const navLinkClassName = isExpanded
    ? 'w-full h-6 min-h-6 justify-start py-0 ps-2 pe-0'
    : 'size-6 p-0 justify-center';

  const settingsButton = (
    <Button
      className={navLinkStyles({ w: isExpanded ? 'full' : 'auto', className: navLinkClassName })}
      aria-label={t('settings')}
      title={!isExpanded ? t('settings') : undefined}
    >
      <RenderNavLinkContent icon="settings" label={t('settings')} isExpanded={isExpanded} />
    </Button>
  );

  return (
    <div className={isExpanded ? 'w-full' : undefined}>
      <DialogTrigger>
        {settingsButton}

        {/* This should be moved to its own component of settings/footer */}
        <Popover placement="end" offset={24}>
          <GlassCard className="border px-5 py-4 rounded-lg" intensity="medium" blur="xl">
            <Settings />
          </GlassCard>
        </Popover>
      </DialogTrigger>
    </div>
  );
}
