/* eslint-disable local/no-literal-ui-strings */
import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Divider } from './divider';

const meta = {
  title: 'Components/Composites/Divider',
  component: Divider,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Simple text divider used to separate related UI sections, commonly between alternative actions such as email sign-in and OAuth sign-in.',
      },
    },
  },
  argTypes: {
    label: {
      control: 'text',
      description: 'Text displayed inside the divider.',
      table: {
        category: 'Content',
        type: {
          summary: 'string',
        },
      },
    },
  },
  args: {
    label: 'or',
  },
} satisfies Meta<typeof Divider>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const AuthDivider: Story = {
  args: {
    label: 'or continue with',
  },
  parameters: {
    docs: {
      source: {
        code: `<Divider label="or continue with" />`,
      },
    },
  },
};

export const InContext: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Example of the divider between two authentication sections.',
      },
      source: {
        code: `<div className="grid w-full max-w-sm gap-4">
  <button type="button">Continue with email</button>
  <Divider label="or" />
  <button type="button">Continue with Google</button>
</div>`,
      },
    },
  },
  render: () => (
    <div className="grid w-full max-w-sm gap-4">
      <button
        type="button"
        className="rounded-md border border-border-primary px-4 py-2 text-text-primary"
      >
        Continue with email
      </button>

      <Divider label="or" />

      <button
        type="button"
        className="rounded-md border border-border-primary px-4 py-2 text-text-primary"
      >
        Continue with Google
      </button>
    </div>
  ),
};
