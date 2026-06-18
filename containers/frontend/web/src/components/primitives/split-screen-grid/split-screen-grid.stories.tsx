import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { SplitScreenGrid } from './split-screen-grid';

function Panel({ label, className }: { label: string; className?: string }) {
  return (
    <div className={`flex items-center justify-center rounded-md border border-dashed border-gray-400 p-6 ${className ?? ''}`}>
      {label}
    </div>
  );
}

const meta = {
  title: 'Components/Primitives/SplitScreenGrid',
  component: SplitScreenGrid,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Responsive split-screen layout used for dashboard and game views. Supports stacked and overlay mobile modes.',
      },
    },
    layout: 'fullscreen',
  },
  argTypes: {
    mobileStackMode: {
      control: 'select',
      options: ['full', 'split'],
      description: 'How the panels stack on mobile viewports.',
      table: {
        category: 'Layout',
        type: { summary: "'full' | 'split'" },
        defaultValue: { summary: 'full' },
      },
    },
    mobileSideLayout: {
      control: 'select',
      options: ['stack', 'overlay'],
      description: 'Whether the side panel overlays or stacks below the full panel on mobile.',
      table: {
        category: 'Layout',
        type: { summary: "'stack' | 'overlay'" },
        defaultValue: { summary: 'stack' },
      },
    },
    mobileSideInteractive: {
      control: 'boolean',
      description: 'Enables pointer events on the mobile side panel.',
      table: {
        category: 'Interaction',
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
  },
  args: {
    full: <Panel label="Full (main content)" className="h-60 bg-blue-50" />,
    side: <Panel label="Side panel" className="h-40 bg-amber-50" />,
    mobileStackMode: 'split',
    mobileSideLayout: 'stack',
    mobileSideInteractive: false,
  },
} satisfies Meta<typeof SplitScreenGrid>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Split: Story = {
  args: {
    mobileStackMode: 'split',
  },
};

export const Full: Story = {
  args: {
    mobileStackMode: 'full',
  },
};

export const Overlay: Story = {
  args: {
    mobileStackMode: 'full',
    mobileSideLayout: 'overlay',
    mobileSideInteractive: true,
  },
};
