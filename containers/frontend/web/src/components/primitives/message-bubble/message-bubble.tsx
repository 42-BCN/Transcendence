import type { ReactNode } from 'react';
import { messageBubbleStyles, type messageVariantType } from './message-bubble.styles';

export type MessageBubbleProps = {
  children?: ReactNode;
  variant?: messageVariantType;
};

export function MessageBubble({ children, variant }: MessageBubbleProps) {
  return <div className={messageBubbleStyles({ variant })}>{children}</div>;
}
