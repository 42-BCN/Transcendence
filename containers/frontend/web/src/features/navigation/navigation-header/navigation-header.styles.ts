import { cn } from '@/lib/styles/cn';

const headerIconBase = 'transition-opacity';
const headerApp = 'opacity-100 group-data-[hovered]:opacity-0';
const headerExpand = 'absolute opacity-0 group-data-[hovered]:opacity-100';

export const headerStyles = {
  wrapper: 'relative flex size-5 shrink-0 items-center justify-center',
  app: cn(headerIconBase, headerApp),
  expand: cn(headerIconBase, headerExpand),
};
