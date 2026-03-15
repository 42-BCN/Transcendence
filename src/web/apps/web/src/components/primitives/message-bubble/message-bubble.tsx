import type { ReactNode } from 'react';
import { messageBubbleStyles } from './message-bubble.styles';

export type MessageBubbleProps = {
  children?: ReactNode;
};

export function MessageBubble({ children }: MessageBubbleProps) {
  return <div className={messageBubbleStyles}>{children}</div>;
}
