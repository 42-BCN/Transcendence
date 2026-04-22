'use client';

import { Button } from '@components/controls/button';
import { TooltipTrigger } from '@components/composites/tooltip-trigger';
import { Icon, type IconName } from '@components/primitives/icon';

export type IconButtonProps = {
  label: string;
  placement?: 'top' | 'bottom' | 'left' | 'right';
  onPress?: () => void;
  icon: IconName;
  className?: string;
};

export function IconButton(props: IconButtonProps) {
  const { label, placement = 'top', onPress, icon, className } = props;
  return (
    <TooltipTrigger label={label} placement={placement}>
      <Button
        w="auto"
        size="icon"
        variant="secondary"
        icon={<Icon name={icon} />}
        aria-label={label}
        className={className}
        onPress={onPress}
      />
    </TooltipTrigger>
  );
}
