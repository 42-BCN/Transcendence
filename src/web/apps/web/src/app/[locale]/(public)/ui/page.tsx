'use client';
import { Button } from '@components/controls/button';
import { Button as AButton, Input as Ainput } from 'react-aria-components';
import { ComponentViewer } from '@components/primitives/componentViewer';
import { Input } from '@components/controls/input';

export default function UiPage() {
  return (
    <main className="p-5">
      <h1 className="text-2xl font-semibold mb-2">Control components</h1>
      <h2 className="text-l font-semibold">Buttons</h2>
      <div className="grid grid-cols-[150px_150px_150px] gap-[10px] my-2.5">
        <ComponentViewer title="Button primitive">
          <button>Hello</button>
        </ComponentViewer>
        <ComponentViewer title="Aria Button">
          <AButton>Hello</AButton>
        </ComponentViewer>
        <ComponentViewer title="UI button">
          <Button>Hello</Button>
        </ComponentViewer>
      </div>
      <h2 className="text-l font-semibold mt-3">Input</h2>
      <div className="grid grid-cols-[150px_150px_150px] gap-[10px] my-2.5">
        <ComponentViewer title="Input primitive">
          <input type="text" />
        </ComponentViewer>
        <ComponentViewer title="Aria Input">
          <Ainput />
        </ComponentViewer>
        <ComponentViewer title="UI Input">
          <Input />
        </ComponentViewer>
      </div>
    </main>
  );
}
