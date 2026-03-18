import { cn } from '@/lib/styles/cn';

const messageBubbleBase = 'p-3 rounded-xl gap-2 flex flex-col md:max-w-[80%]';

const messageVariant = {
  default: 'rounded-br-none bg-slate-300 ms-auto',
  reverse: 'rounded-bl-none bg-slate-100',
};

export type messageVariantType = keyof typeof messageVariant;
type messageBubbleStylesProps = {
  variant?: messageVariantType;
};
export function messageBubbleStyles(args?: messageBubbleStylesProps) {
  const { variant = 'default' } = args ?? {};

  return cn(messageBubbleBase, messageVariant[variant]);
}
