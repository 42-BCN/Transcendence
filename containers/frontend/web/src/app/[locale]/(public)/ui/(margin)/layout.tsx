import type { ReactNode } from 'react';

export default function marginPage({ children }: { ReactNode }) {
  return <main className="p-4 md:ps-10 w-full">{children}</main>;
}
