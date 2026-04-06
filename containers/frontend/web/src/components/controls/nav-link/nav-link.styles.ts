import { interactiveNavLinkStyles } from '@components/primitives/interactive-control/interactive-control.styles';
import type {
  InteractiveControlSize,
  InteractiveControlW,
} from '@components/primitives/interactive-control/interactive-control.types';

type NavLinkStyleProps = {
  size?: InteractiveControlSize;
  w?: InteractiveControlW;
  className?: string;
};

export function navLinkStyles(args?: NavLinkStyleProps) {
  const { size = 'md', w = 'auto', className } = args ?? {};
  return interactiveNavLinkStyles({ size, w, className });
}
