import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { CountBadge } from './count-badge';

const meta = {
  title: 'Components/Primitives/CountBadge',
  component: CountBadge,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Numeric badge used for notification counts in navigation and social sections. Renders nothing when count is 0 or undefined.',
      },
    },
  },
  argTypes: {
    count: {
      control: { type: 'number', min: 0, max: 200 },
      description: 'The count value to display. Badge is hidden when count <= 0.',
      table: {
        category: 'Content',
        type: { summary: 'number' },
      },
    },
    max: {
      control: { type: 'number', min: 1, max: 999 },
      description: 'Maximum displayable count. Values above this show as "max+".',
      table: {
        category: 'Content',
        type: { summary: 'number' },
        defaultValue: { summary: '99' },
      },
    },
    tone: {
      control: 'select',
      options: ['danger'],
      description: 'Visual tone/color scheme.',
      table: {
        category: 'Appearance',
        type: { summary: "'danger'" },
        defaultValue: { summary: 'danger' },
      },
    },
    placement: {
      control: 'select',
      options: ['inline', 'overlay'],
      description: 'Positioning mode: inline within text flow or overlaid on a parent element.',
      table: {
        category: 'Layout',
        type: { summary: "'inline' | 'overlay'" },
        defaultValue: { summary: 'inline' },
      },
    },
  },
  args: {
    count: 5,
    max: 99,
    tone: 'danger',
    placement: 'inline',
  },
} satisfies Meta<typeof CountBadge>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Zero: Story = {
  args: {
    count: 0,
  },
};

export const HighCount: Story = {
  args: {
    count: 150,
    max: 99,
  },
};

export const OverlayPlacement: Story = {
  args: {
    count: 3,
    placement: 'overlay',
  },
  render: (args) => (
    <div className="relative inline-block rounded-md border border-gray-300 p-4">
      <span>Inbox</span>
      <CountBadge {...args} />
    </div>
  ),
};
