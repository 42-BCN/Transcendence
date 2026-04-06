export type InteractiveControlVariant = 'primary' | 'secondary' | 'ghost';

export type InteractiveControlSize = 'sm' | 'md' | 'lg';

export type InteractiveControlW = 'auto' | 'full';

export type InteractiveControlStyleProps = {
  variant?: InteractiveControlVariant;
  size?: InteractiveControlSize;
  w?: InteractiveControlW;
  className?: string;
};
