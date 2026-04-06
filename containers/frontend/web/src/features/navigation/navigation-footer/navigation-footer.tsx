import { useNavigationContext } from '@/features/navigation/navigation.context';
import { RenderNavLinkContent } from '../navigation-main/navigation-main';
import { navLinkStyles } from '@components/controls/nav-link/nav-link.styles';

import { Button, DialogTrigger, Popover } from 'react-aria-components';
import { GlassCard } from '@components/primitives/glass-card';
import { Settings } from '@/features/settings';
import { useTranslations } from 'next-intl';
import { TooltipTrigger } from '@components/composites/tooltip-trigger';

export function NavigationFooter() {
  const { isExpanded } = useNavigationContext();
  const t = useTranslations('features.navigation');
  const navLinkClassName = isExpanded ? 'w-full justify-start py-0 ps-2 pe-0' : 'size-6 p-0';

  const settingsButton = (
    <Button
      className={navLinkStyles({ w: isExpanded ? 'full' : 'auto', className: navLinkClassName })}
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
          <TooltipTrigger label={t('settings')} offset={28}>
            {settingsButton}
          </TooltipTrigger>
        )}

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
