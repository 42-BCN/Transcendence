import { cn } from '@/lib/styles/cn';

const inputBase = 'w-full rounded border bg-white px-3 py-2 text-sm outline-none transition';

const inputPropsStyles = {
  variant: {
    default: 'border-gray-300 focus:border-gray-400',
    subtle: 'border-transparent bg-gray-50 focus:bg-white focus:border-gray-300',
    danger: 'border-red-500 focus:border-red-600',
  },
  size: {
    sm: 'h-8',
    md: 'h-10',
    lg: 'h-12 text-base',
  },
};

export type InputVariant = keyof typeof inputPropsStyles.variant;
export type InputSize = keyof typeof inputPropsStyles.size;

export type InputRacState = {
  isDisabled: boolean;
  isInvalid: boolean;
  isFocusVisible: boolean;
};

function inputState(state: InputRacState) {
  return cn(
    state.isDisabled && 'opacity-50 cursor-not-allowed',
    state.isInvalid && 'border-red-500',
    state.isFocusVisible && 'ring-2 ring-offset-2 ring-blue-500',
  );
}

export function inputClass(args: {
  variant?: InputVariant;
  size?: InputSize;
  state: InputRacState;
}) {
  const { variant = 'primary', size = 'md', state } = args;
  return cn(
    inputBase,
    inputPropsStyles.variant[variant],
    inputPropsStyles.size[size],
    inputState(state),
  );
}
