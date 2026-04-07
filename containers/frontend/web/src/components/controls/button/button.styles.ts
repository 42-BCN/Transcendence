import {
  interactiveControlStyles,
  interactiveIconSlotStyles,
} from '@components/primitives/interactive-control/interactive-control.styles';
import type {
  InteractiveControlSize,
  InteractiveControlStyleProps,
  InteractiveControlVariant,
  InteractiveControlW,
} from '@components/primitives/interactive-control/interactive-control.types';

export type ButtonVariant = InteractiveControlVariant;
export type ButtonSize = InteractiveControlSize;
export type ButtonW = InteractiveControlW;

export function buttonStyles(args?: InteractiveControlStyleProps) {
  return interactiveControlStyles(args);
}

export function iconStyles() {
  return interactiveIconSlotStyles();
}
