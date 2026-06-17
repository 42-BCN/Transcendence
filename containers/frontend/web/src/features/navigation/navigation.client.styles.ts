import { cn } from '@/lib/styles/cn';

export type NavigationPosition = 'fixed' | 'absolute';

const navigationPositionClassNames = {
  fixed: {
    desktop: 'fixed h-screen',
    mobileTrigger: 'fixed',
    mobileDrawer: 'h-[100dvh]',
  },
  absolute: {
    desktop: 'absolute h-full',
    mobileTrigger: 'absolute',
    mobileDrawer: 'h-full',
  },
} as const;

export const navigationClientStyles = {
  mobileDrawer: (position: NavigationPosition) =>
    cn(
      'group z-10 flex w-full overflow-y-auto overscroll-contain rounded-s-none rounded-e-md px-2 py-4',
      navigationPositionClassNames[position].mobileDrawer,
    ),
  mobileTrigger: (position: NavigationPosition, forceVisibleTrigger = false) =>
    cn(
      forceVisibleTrigger ? '' : 'lg:hidden',
      navigationPositionClassNames[position].mobileTrigger,
      'pointer-events-auto right-4 top-3 z-[110]',
    ),
  desktop: (position: NavigationPosition, isExpanded: boolean) =>
    cn(
      'group top-0 z-10 overflow-y-auto rounded-s-none rounded-e-md px-2 py-4',
      navigationPositionClassNames[position].desktop,
      isExpanded ? 'w-44' : 'w-min',
    ),
};
