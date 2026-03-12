import type { LucideIcon } from 'lucide-react';

import { icons, type IconName } from './icons';
import { iconStyles } from './icon.styles';

type IconProps =
  | {
      name: IconName;
      icon?: never;
    }
  | {
      name?: never;
      icon: LucideIcon;
    };

type Props = IconProps & {
  size?: number;
};

export function Icon({ name, icon, size = 16 }: Props) {
  const IconComponent = icon ?? icons[name!];

  return <IconComponent size={size} className={iconStyles.icon} aria-hidden="true" />;
}
