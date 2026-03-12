import { cn } from '@/lib/styles/cn';

const headerBase = 'group relative flex items-center justify-center size-6';
const headerIconBase = 'absolute transition-opacity';
const headerApp = 'opacity-100 group-hover:opacity-0';
const headerExpand = 'opacity-0 group-hover:opacity-100';

export const headerStyles = {
  wrapper: cn(headerBase),
  app: cn(headerIconBase, headerApp),
  expand: cn(headerIconBase, headerExpand),
};
