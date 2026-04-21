import { type IconName, Button, TooltipTrigger, Icon } from '@components';

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
