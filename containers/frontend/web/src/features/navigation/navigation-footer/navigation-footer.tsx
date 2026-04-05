import { useNavigationContext } from '@/features/navigation/navigation.context';
import { RenderNavLinkContent } from '../navigation-main/navigation-main';
import { navLinkStyles } from '@components/controls/nav-link/nav-link.styles';

import { Button, DialogTrigger, Popover } from 'react-aria-components';
import { GlassCard } from '@components/primitives/glass-card';
import { Settings } from '@/features/settings';
import { useTranslations } from 'next-intl';

export function NavigationFooter() {
  const { isExpanded } = useNavigationContext();
  const t = useTranslations('features.navigation');

  return (
    <>
      <DialogTrigger>
        <Button className={navLinkStyles()}>
          <RenderNavLinkContent icon="settings" label={t('settings')} isExpanded={isExpanded} />
        </Button>

        {/* This should be moved to its own component of settings/footer */}
        <Popover placement="end">
          <GlassCard className="border px-5 py-4 rounded-lg" intensity="medium" blur="xl">
            <Settings />
          </GlassCard>
        </Popover>
      </DialogTrigger>
    </>
  );
}
