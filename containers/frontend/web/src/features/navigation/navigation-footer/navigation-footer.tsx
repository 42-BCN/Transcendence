'use client';

import { useTranslations } from 'next-intl';
import { Button, DialogTrigger, Popover } from 'react-aria-components';

import { GlassCard } from '@components';
import { TooltipTrigger } from '@components/composites/tooltip-trigger';
import { navLinkStyles } from '@components/controls/nav-link/nav-link.styles';
import { useNavigationContext } from '@/features/navigation/navigation.context';
import { Settings } from '@/features/settings';

import { RenderNavLinkContent } from '../navigation-main/navigation-main';

export function NavigationFooter() {
  const { isExpanded } = useNavigationContext();
  const t = useTranslations('features.navigation');

  const navLinkClassName = isExpanded
    ? 'w-full h-6 min-h-6 justify-start py-0 ps-2 pe-0'
    : 'size-6 p-0 justify-center';

  const settingsButton = (
    <Button
      className={navLinkStyles({
        w: isExpanded ? 'full' : 'auto',
        className: navLinkClassName,
      })}
      aria-label={t('settings')}
    >
      <RenderNavLinkContent icon="settings" label={t('settings')} isExpanded={isExpanded} />
    </Button>
  );

  return (
    <div className={isExpanded ? 'w-full' : undefined}>
      <DialogTrigger>
        {isExpanded ? (
          settingsButton
        ) : (
          <TooltipTrigger label={t('settings')} placement="right">
            {settingsButton}
          </TooltipTrigger>
        )}

        <Popover placement="end" offset={24}>
          <GlassCard className="rounded-lg border px-5 py-4" intensity="medium" blur="xl">
            <Settings />
          </GlassCard>
        </Popover>
      </DialogTrigger>
    </div>
  );
}
