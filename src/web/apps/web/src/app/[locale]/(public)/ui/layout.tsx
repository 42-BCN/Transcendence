'use client';
import { useState, type ReactNode } from 'react';
import { SegmentedControlGroup } from '@components/composites/segmented-control-group';
import { Columns12Overlay, Grid4Overlay, Grid8Overlay } from '@components/primitives/base-grid';

type OptionsIdType = 'visible' | 'non-visible';

export default function UiLayout({ children }: { children: ReactNode }) {
  const [gridsVisibility, setGridsVisibility] = useState<OptionsIdType>('non-visible');

  const options = [
    { id: 'visible', label: 'Show grid' },
    { id: 'non-visible', label: 'Hide grid' },
  ] satisfies Array<{ id: OptionsIdType; label: string }>;

  const handleGridsVisibility = (key: OptionsIdType) => {
    if (key === gridsVisibility) return;
    setGridsVisibility(key);
  };

  return (
    <>
      <div>
        <SegmentedControlGroup
          aria-label="Toggle baseline grids"
          selectedKey={gridsVisibility}
          onSelectionChange={(key) => handleGridsVisibility(key as OptionsIdType)}
          options={options}
        />
      </div>

      {gridsVisibility === 'visible' && (
        <>
          <Grid4Overlay />
          <Grid8Overlay />
          <Columns12Overlay />
        </>
      )}

      {children}
    </>
  );
}
