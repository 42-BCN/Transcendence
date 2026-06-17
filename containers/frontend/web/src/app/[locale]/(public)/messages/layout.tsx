import type { ReactNode } from 'react';

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  interactiveWidget: 'resizes-content',
};

export default function MessagesRouteLayout({ children }: { children: ReactNode }) {
  return (
    <div className="h-dvh w-full overflow-hidden lg:h-auto lg:overflow-visible">
      {children}
    </div>
  );
}
