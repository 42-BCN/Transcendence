/* eslint-disable local/no-literal-ui-strings */
import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { TextArea } from './text-area';

const meta = {
  title: 'Components/Controls/TextArea',
  component: TextArea,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Accessible textarea control built on React Aria Components. It auto-resizes on input by updating the textarea height based on scrollHeight.',
      },
    },
  },
  argTypes: {
    placeholder: {
      control: 'text',
      description: 'Placeholder text shown when the textarea is empty.',
      table: {
        category: 'Content',
        type: {
          summary: 'string',
        },
      },
    },
    value: {
      control: 'text',
      description: 'Controlled textarea value.',
      table: {
        category: 'State',
        type: {
          summary: 'string',
        },
      },
    },
    defaultValue: {
      control: 'text',
      description: 'Initial textarea value when uncontrolled.',
      table: {
        category: 'State',
        type: {
          summary: 'string',
        },
      },
    },
    name: {
      control: 'text',
      description: 'Textarea name used during form submission.',
      table: {
        category: 'Form',
        type: {
          summary: 'string',
        },
      },
    },
    rows: {
      control: {
        type: 'number',
        min: 1,
        max: 12,
        step: 1,
      },
      description: 'Initial visible row count.',
      table: {
        category: 'Layout',
        type: {
          summary: 'number',
        },
      },
    },
    maxLength: {
      control: {
        type: 'number',
        min: 10,
        max: 1000,
        step: 10,
      },
      description: 'Maximum number of characters allowed.',
      table: {
        category: 'Validation',
        type: {
          summary: 'number',
        },
      },
    },
    onChange: {
      action: 'changed',
      description: 'Callback fired when the textarea value changes.',
      table: {
        category: 'Events',
        type: {
          summary: '(value: string) => void',
        },
      },
    },
    className: {
      control: false,
      description: 'Optional className merged into the textarea styles.',
      table: {
        category: 'Styling',
        type: {
          summary: 'string',
        },
        disable: true,
      },
    },
  },
  args: {
    placeholder: 'Write something...',
    name: 'message',
    rows: 3,
  },
} satisfies Meta<typeof TextArea>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithDefaultValue: Story = {
  args: {
    defaultValue:
      'This textarea has an initial value. Try typing more text to see it resize automatically.',
  },
};

export const AutoResize: Story = {
  args: {
    placeholder: 'Type multiple lines to test auto-resize...',
    rows: 2,
  },
  parameters: {
    docs: {
      source: {
        code: `<TextArea
  rows={2}
  placeholder="Type multiple lines to test auto-resize..."
/>`,
      },
    },
  },
};

export const States: Story = {
  parameters: {
    docs: {
      source: {
        code: `<div className="grid w-full max-w-md gap-4">
  <TextArea placeholder="Default textarea" />
  <TextArea defaultValue="Textarea with value" />
</div>`,
      },
    },
  },
  render: () => (
    <div className="grid w-full max-w-md gap-4">
      <TextArea placeholder="Default textarea" />
      <TextArea defaultValue="Textarea with value" />
    </div>
  ),
};
