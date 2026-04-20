export type InteractiveControlVariant = 'primary' | 'secondary' | 'ghost' | 'cta';

export type InteractiveControlSize = 'sm' | 'md' | 'lg' | 'icon';

export type InteractiveControlW = 'auto' | 'full';

export type InteractiveControlStyleProps = {
  variant?: InteractiveControlVariant;
  size?: InteractiveControlSize;
  w?: InteractiveControlW;
  className?: string;
};
