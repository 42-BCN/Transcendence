import type { ReactNode } from 'react';

// import { Columns12Overlay, Grid4Overlay, Grid8Overlay } from '@components/primitives/base-grid';

export default function UiLayout({ children }: { children: ReactNode }) {
  return (
    <>
      {/* <Grid4Overlay />
      <Grid8Overlay />
      <Columns12Overlay /> */}
      <div className="w-full p-[80px]">{children}</div>
    </>
  );
}
