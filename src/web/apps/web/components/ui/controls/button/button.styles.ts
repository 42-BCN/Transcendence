import { cn } from '@/lib/styles/cn';

const buttonBase =
  'border inline-flex items-center justify-center font-medium transition text-gray-900 rounded';

const buttonPropsStyles = {
  variant: {
    primary: 'border-gray-900 hover:bg-slate-100',
    secondary: 'border-gray-400 hover:bg-slate-100',
    ghost: 'hover:bg-slate-100',
    danger: 'border-red-600 hover:bg-red-700',
  },
  size: {
    sm: 'h-8 px-3 text-sm',
    md: 'h-10 px-4 text-sm',
    lg: 'h-12 px-6 text-base',
  },
};

export type ButtonVariant = keyof typeof buttonPropsStyles.variant;
export type ButtonSize = keyof typeof buttonPropsStyles.size;

export type ButtonRacState = {
  isPressed: boolean;
  isFocusVisible: boolean;
  isDisabled: boolean;
};

function buttonState(state: ButtonRacState) {
  return cn(
    state.isPressed && 'translate-y-px',
    state.isDisabled && 'opacity-50 cursor-not-allowed pointer-events-none',
    state.isFocusVisible && 'ring ring-offset ring-black-500 rounded-none',
  );
}

export function buttonClass(args: {
  variant?: ButtonVariant;
  size?: ButtonSize;
  state: ButtonRacState;
}) {
  const { variant = 'primary', size = 'md', state } = args;
  return cn(
    buttonBase,
    buttonPropsStyles.variant[variant],
    buttonPropsStyles.size[size],
    buttonState(state),
  );
}
