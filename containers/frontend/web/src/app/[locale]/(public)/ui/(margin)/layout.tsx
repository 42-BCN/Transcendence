import type { ReactNode } from 'react';

type LayoutProps = {
  children: ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  return <main className="p-4 md:ps-10 w-full">{children}</main>;
}
