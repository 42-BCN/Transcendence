/* eslint-disable local/no-literal-ui-strings */
import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Input } from './input';

const meta = {
  title: 'Components/Controls/Input',
  component: Input,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Accessible input control built on React Aria Components. It provides project styling through controlled variant and size props.',
      },
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['default'],
      description: 'Visual style variant of the input.',
      table: {
        category: 'Appearance',
        type: {
          summary: 'InputVariant',
        },
        defaultValue: {
          summary: 'default',
        },
      },
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Input size, usually controlling height, padding, and text size.',
      table: {
        category: 'Appearance',
        type: {
          summary: 'InputSize',
        },
        defaultValue: {
          summary: 'md',
        },
      },
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text shown when the input is empty.',
      table: {
        category: 'Content',
        type: {
          summary: 'string',
        },
      },
    },
    value: {
      control: 'text',
      description: 'Controlled input value.',
      table: {
        category: 'State',
        type: {
          summary: 'string',
        },
      },
    },
    defaultValue: {
      control: 'text',
      description: 'Initial input value when uncontrolled.',
      table: {
        category: 'State',
        type: {
          summary: 'string',
        },
      },
    },
    type: {
      control: 'select',
      options: ['text', 'email', 'password', 'search', 'url', 'tel', 'number'],
      description: 'Native input type.',
      table: {
        category: 'Behavior',
        type: {
          summary: 'HTML input type',
        },
        defaultValue: {
          summary: 'text',
        },
      },
    },
    name: {
      control: 'text',
      description: 'Input name used during form submission.',
      table: {
        category: 'Form',
        type: {
          summary: 'string',
        },
      },
    },
    onChange: {
      action: 'changed',
      description: 'Callback fired when the input value changes.',
      table: {
        category: 'Events',
        type: {
          summary: '(value: string) => void',
        },
      },
    },
    ref: {
      control: false,
      description: 'Forwarded ref to the underlying HTML input element.',
      table: {
        category: 'Refs',
        type: {
          summary: 'Ref<HTMLInputElement>',
        },
        disable: true,
      },
    },
  },
  args: {
    variant: 'default',
    size: 'md',
    type: 'text',
    placeholder: 'Type something...',
    name: 'example',
  },
} satisfies Meta<typeof Input>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Email: Story = {
  args: {
    type: 'email',
    placeholder: 'email@example.com',
    name: 'email',
  },
};

export const Password: Story = {
  args: {
    type: 'password',
    placeholder: 'Password',
    name: 'password',
  },
};

export const Invalid: Story = {
  args: {
    placeholder: 'Invalid value',
  },
};

export const Disabled: Story = {
  args: {
    placeholder: 'Disabled input',
  },
};

export const ReadOnly: Story = {
  args: {
    defaultValue: 'Read-only value',
  },
};

export const Sizes: Story = {
  parameters: {
    docs: {
      source: {
        code: `<div className="grid w-full max-w-xs gap-4">
  <Input size="sm" placeholder="Small input" />
  <Input size="md" placeholder="Medium input" />
  <Input size="lg" placeholder="Large input" />
</div>`,
      },
    },
  },
  render: () => (
    <div className="grid w-full max-w-xs gap-4">
      <Input size="sm" placeholder="Small input" />
      <Input size="md" placeholder="Medium input" />
      <Input size="lg" placeholder="Large input" />
    </div>
  ),
};

export const States: Story = {
  parameters: {
    docs: {
      source: {
        code: `<div className="grid w-full max-w-xs gap-4">
  <Input placeholder="Default input" />
  <Input defaultValue="Filled input" />
  <Input isInvalid placeholder="Invalid input" />
  <Input isDisabled placeholder="Disabled input" />
  <Input isReadOnly defaultValue="Read-only input" />
</div>`,
      },
    },
  },
  render: () => (
    <div className="grid w-full max-w-xs gap-4">
      <Input placeholder="Default input" />
      <Input defaultValue="Filled input" />
    </div>
  ),
};
