/* eslint-disable local/no-literal-ui-strings */
import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Button } from './button';

const meta = {
  title: 'Components/Controls/Button',
  component: Button,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Accessible button built on React Aria Components.',
      },
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary'],
      description: 'Controls the visual style of the button.',
      table: {
        category: 'Appearance',
        type: {
          summary: "'primary' | 'secondary'",
        },
        defaultValue: {
          summary: 'primary',
        },
      },
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Controls the button size, including height, padding, and text size.',
      table: {
        category: 'Appearance',
        type: {
          summary: "'sm' | 'md' | 'lg'",
        },
        defaultValue: {
          summary: 'md',
        },
      },
    },
    w: {
      control: 'select',
      options: ['full', 'auto'],
      description:
        'Controls whether the button fills the available width or only takes the space it needs.',
      table: {
        category: 'Appearance',
        type: {
          summary: "'full' | 'auto'",
        },
        defaultValue: {
          summary: 'auto',
        },
      },
    },
    isDisabled: {
      control: 'boolean',
      description: 'Disables the button and prevents user interaction.',
      table: {
        category: 'State',
        type: {
          summary: 'boolean',
        },
        defaultValue: {
          summary: 'false',
        },
      },
    },
    onPress: {
      action: 'pressed',
      description:
        'Callback fired when the button is pressed through mouse, touch, keyboard, or assistive technology.',
      table: {
        category: 'Events',
        type: {
          summary: '(event) => void',
        },
      },
    },
    className: {
      control: false,
      description:
        'Optional internal styling escape hatch. Hidden from controls to keep the public API constrained.',
      table: {
        category: 'Styling',
        type: {
          summary: 'string',
        },
        disable: true,
      },
    },
    children: {
      control: false,
      description:
        'Button content. Usually plain text, but it can also be composed content when needed.',
      table: {
        category: 'Content',
        type: {
          summary: 'ReactNode',
        },
        disable: true,
      },
    },
  },
  args: {
    w: 'auto',
    variant: 'primary',
    size: 'md',
    children: 'Button',
  },
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

const ArrowRightIcon = () => (
  <svg aria-hidden="true" width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
    <path d="M8.22 3.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 1 1-1.06-1.06L11.19 8.75H3a.75.75 0 0 1 0-1.5h8.19L8.22 4.28a.75.75 0 0 1 0-1.06Z" />
  </svg>
);

export const FullWidth: Story = {
  parameters: {
    layout: 'padded',
  },
  args: {
    w: 'full',
    children: 'Full width',
  },
};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Button size="icon" w="auto" icon={<ArrowRightIcon />} aria-label="Icon" />

      <Button size="sm" w="auto">
        Small
      </Button>
      <Button size="md" w="auto">
        Medium
      </Button>
      <Button size="lg" w="auto">
        Large
      </Button>
    </div>
  ),
};

export const Variants: Story = {
  render: () => (
    <div className="flex w-full items-center gap-4">
      <Button variant="primary" w="auto">
        Primary
      </Button>
      <Button variant="secondary" w="auto">
        Secondary
      </Button>
      <Button variant="cta" w="auto">
        Call to action
      </Button>
      <Button variant="ghost" w="auto">
        Ghost
      </Button>
      <Button w="auto" icon={<ArrowRightIcon />}>
        With icon
      </Button>
    </div>
  ),
};
