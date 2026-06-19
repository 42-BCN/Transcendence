import type { ReactNode } from 'react';

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  interactiveWidget: 'resizes-content',
};

export default function MessagesRouteLayout({ children }: { children: ReactNode }) {
  return <div className="flex h-dvh min-h-0 w-full">{children}</div>;
}
