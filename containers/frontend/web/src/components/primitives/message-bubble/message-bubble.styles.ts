import { cn } from '@/lib/styles/cn';

const messageBubbleBase =
  'p-3 rounded-xl gap-2 flex flex-col max-w-[90%] md:max-w-[80%] break-words';

const messageVariant = {
  me: 'rounded-br-none bg-bg-secondary ms-auto',
  user: 'rounded-bl-none bg-bg-primary border border-border-primary',
  system:
    'max-w-full rounded-md bg-transparent px-2 py-1 text-center text-foreground-secondary shadow-none',
  error:
    'max-w-full rounded-md bg-transparent px-2 py-1 text-center text-status-danger shadow-none',
  'game-event': 'bg-green-400 text-white',
};

export type messageVariantType = keyof typeof messageVariant;
type messageBubbleStylesProps = {
  variant?: messageVariantType;
};
export function messageBubbleStyles(args?: messageBubbleStylesProps) {
  const { variant = 'user' } = args ?? {};

  return cn(messageBubbleBase, messageVariant[variant]);
}
