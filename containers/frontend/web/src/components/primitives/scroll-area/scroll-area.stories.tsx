/* eslint-disable local/no-literal-ui-strings */
import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Text } from '@components/primitives/text';

import { ScrollArea } from './scroll-area';

const meta = {
  title: 'Components/Primitives/ScrollArea',
  component: ScrollArea,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Scrollable container primitive. It applies the project scroll area styles to a div and forwards native div attributes.',
      },
    },
  },
  argTypes: {
    children: {
      control: false,
      description: 'Scrollable content rendered inside the container.',
      table: {
        category: 'Content',
        type: {
          summary: 'ReactNode',
        },
      },
    },
  },
} satisfies Meta<typeof ScrollArea>;

export default meta;

type Story = StoryObj<typeof meta>;

const items = Array.from({ length: 24 }, (_, index) => `Item ${index + 1}`);

export const Default: Story = {
  parameters: {
    docs: {
      source: {
        code: `<ScrollArea style={{ maxHeight: 240 }}>
  {items.map((item) => (
    <Text key={item} as="p" variant="body-sm">
      {item}
    </Text>
  ))}
</ScrollArea>`,
      },
    },
  },
  render: () => (
    <div className="w-full max-w-xs rounded-md border border-border-primary">
      <ScrollArea style={{ maxHeight: 240 }}>
        <div className="grid gap-2 p-4">
          {items.map((item) => (
            <Text key={item} as="p" variant="body-sm">
              {item}
            </Text>
          ))}
        </div>
      </ScrollArea>
    </div>
  ),
};

export const ChatMessages: Story = {
  parameters: {
    docs: {
      source: {
        code: `<ScrollArea style={{ maxHeight: 320 }}>
  <div className="grid gap-3 p-4">
    {messages.map((message) => (
      <div key={message} className="rounded-md border border-border-primary p-3">
        {message}
      </div>
    ))}
  </div>
</ScrollArea>`,
      },
    },
  },
  render: () => (
    <div className="w-full max-w-sm rounded-md border border-border-primary">
      <ScrollArea style={{ maxHeight: 320 }}>
        <div className="grid gap-3 p-4">
          {items.map((item) => (
            <div key={item} className="rounded-md border border-border-primary p-3">
              <Text as="p" variant="body-sm">
                Message content for {item.toLowerCase()}.
              </Text>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  ),
};

export const HorizontalContent: Story = {
  parameters: {
    docs: {
      source: {
        code: `<ScrollArea>
  <div className="flex w-max gap-3 p-4">
    {items.map((item) => (
      <div key={item} className="w-32 rounded-md border border-border-primary p-3">
        {item}
      </div>
    ))}
  </div>
</ScrollArea>`,
      },
    },
  },
  render: () => (
    <div className="w-full max-w-sm rounded-md border border-border-primary">
      <ScrollArea>
        <div className="flex w-max gap-3 p-4">
          {items.slice(0, 10).map((item) => (
            <div key={item} className="w-32 rounded-md border border-border-primary p-3">
              <Text as="p" variant="body-sm">
                {item}
              </Text>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  ),
};
