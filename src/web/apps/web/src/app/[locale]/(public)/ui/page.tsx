'use client';
import { Button } from '@components/controls/button';
import { Button as AButton, Input as Ainput } from 'react-aria-components';
import { ComponentViewer } from '@components/primitives/componentViewer';
import { Input } from '@components/controls/input';
import { Text } from '@components/primitives/text/text';

// eslint-disable-next-line max-lines-per-function
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

      <div className="flex flex-col gap-8 py-8 max-w-[65ch]">
        <Text as="p" variant="caption">
          Caption text used for small supporting information or metadata.
        </Text>

        <Text as="p" variant="body-xs">
          Extra small body text useful for dense UI areas where space is limited.
        </Text>

        <Text as="p" variant="body-sm">
          Small body text often appears in secondary descriptions, hints, or helper content.
        </Text>

        <Text as="p" variant="body">
          This paragraph demonstrates the default body style. It is intentionally longer so you can
          evaluate the readability, rhythm, and line length of the typography system. When text
          stretches too wide across the screen, reading becomes harder, so limiting the measure
          helps maintain comfortable scanning and improves the overall reading experience.
        </Text>

        <Text as="p" variant="body-lg">
          Larger body text works well for introductory paragraphs or highlighted descriptions that
          need a little more visual emphasis without becoming a heading.
        </Text>

        <Text as="p" variant="heading-sm">
          Small heading style rendered as a paragraph for visual testing.
        </Text>

        <Text as="p" variant="heading-md">
          Medium heading style rendered as a paragraph for inspection.
        </Text>

        <Text as="p" variant="heading-lg">
          Large heading style rendered as a paragraph.
        </Text>

        <Text as="p" variant="heading-xl">
          Extra large heading style rendered as paragraph content.
        </Text>

        <Text as="p" variant="code">
          const message = "Code styled text rendered in a paragraph.";
        </Text>
      </div>
    </main>
  );
}
