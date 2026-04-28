import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { FormTitle } from './form-title';

const meta = {
  title: 'Components/Composites/FormTitle',
  component: FormTitle,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Simple form title component. It renders the provided title as an h1 using the project heading-md text variant.',
      },
    },
  },
  argTypes: {
    title: {
      control: 'text',
      description: 'Text rendered as the form page title.',
      table: {
        category: 'Content',
        type: {
          summary: 'string',
        },
      },
    },
  },
  args: {
    title: 'Create account',
  },
} satisfies Meta<typeof FormTitle>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
