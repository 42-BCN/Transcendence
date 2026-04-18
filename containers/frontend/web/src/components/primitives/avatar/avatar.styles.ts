import { cn } from '@/lib/styles/cn';

const avatarBase = 'rounded-lg bg-bg-secondary overflow-hidden shrink-0';

const avatarFallbackClasses = 'flex items-center justify-center text-text-tertiary';

const avatarSize = {
  sm: 'h-5 w-5', // 32px (matching --space-5)
  md: 'h-7 w-7', // 48px (matching --space-7 / xl)
  lg: 'h-9 w-9', // 64px (matching --space-9)
};

export type AvatarSize = keyof typeof avatarSize;

type AvatarStylesProps = {
  size?: AvatarSize;
  className?: string;
  isFallback?: boolean;
};

export function avatarStyles({ size = 'md', className, isFallback }: AvatarStylesProps = {}) {
  return cn(isFallback ? avatarFallbackClasses : avatarBase, avatarSize[size], className);
}
