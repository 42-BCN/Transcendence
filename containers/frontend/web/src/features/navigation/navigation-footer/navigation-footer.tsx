'use client';

import { useTranslations } from 'next-intl';
import { Button, DialogTrigger, Popover } from 'react-aria-components';

import { GlassCard } from '@components';
import { navLinkStyles } from '@components/controls/nav-link/nav-link.styles';
import { useNavigationContext } from '@/features/navigation/navigation.context';
import { Settings } from '@/features/settings';

import { RenderNavLinkContent } from '../navigation-main/navigation-main';

export function NavigationFooter() {
  const { isExpanded } = useNavigationContext();
  const t = useTranslations('features.navigation');

  const settingsLabel = t('settings');

  const navLinkClassName = isExpanded
    ? 'w-full h-6 min-h-6 justify-start py-0 ps-2 pe-0'
    : 'size-6 p-0 justify-center';

  return (
    <div className={isExpanded ? 'w-full' : undefined}>
      <DialogTrigger>
        <Button
          className={navLinkStyles({
            w: isExpanded ? 'full' : 'auto',
            className: navLinkClassName,
          })}
          aria-label={settingsLabel}
          title={!isExpanded ? settingsLabel : undefined}
        >
          <RenderNavLinkContent icon="settings" label={settingsLabel} isExpanded={isExpanded} />
        </Button>

        <Popover placement="end" offset={24}>
          <GlassCard className="rounded-lg border px-5 py-4" intensity="medium" blur="xl">
            <Settings />
          </GlassCard>
        </Popover>
      </DialogTrigger>
    </div>
  );
}
