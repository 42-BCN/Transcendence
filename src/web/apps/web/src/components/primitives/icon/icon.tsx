import { icons, type IconName } from './icons';
import { iconStyles } from './icon.styles';

type IconProps = {
  name: IconName;
  className?: string;
  size?: number;
};

export function Icon({ name, size = 16, className }: IconProps) {
  const IconComponent = icons[name];
  return <IconComponent size={size} className={iconStyles.icon(className)} aria-hidden="true" />;
}
