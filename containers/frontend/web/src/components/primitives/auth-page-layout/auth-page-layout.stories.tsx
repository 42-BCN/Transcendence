import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { AuthPageLayout } from './auth-page-layout';

const meta = {
  title: 'Components/Primitives/AuthPageLayout',
  component: AuthPageLayout,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Page layout wrapper for authentication screens. Provides a centered container with a title heading.',
      },
    },
    layout: 'fullscreen',
  },
  argTypes: {
    title: {
      control: 'text',
      description: 'Page heading displayed at the top of the layout.',
      table: {
        category: 'Content',
        type: { summary: 'string' },
      },
    },
    children: {
      control: false,
      description: 'Page content rendered below the title.',
      table: {
        category: 'Content',
        type: { summary: 'ReactNode' },
      },
    },
  },
  args: {
    title: 'Sign in',
    children: (
      <div className="flex flex-col gap-4 rounded-md border border-dashed border-gray-400 p-6">
        <p>Form content goes here</p>
      </div>
    ),
  },
} satisfies Meta<typeof AuthPageLayout>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
