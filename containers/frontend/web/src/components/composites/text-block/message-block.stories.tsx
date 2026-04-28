import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Stack } from '@components/primitives/stack';

import { MessageBlock } from './text-block';

const meta = {
  title: 'Components/Composites/MessageBlock',
  component: MessageBlock,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Message block for form-like pages. It renders a title using FormTitle and a list of body messages below it.',
      },
    },
  },
  argTypes: {
    title: {
      control: 'text',
      description: 'Title rendered through FormTitle.',
      table: {
        category: 'Content',
        type: {
          summary: 'string',
        },
      },
    },
    messages: {
      control: 'object',
      description: 'List of messages rendered as body paragraphs.',
      table: {
        category: 'Content',
        type: {
          summary: 'ReactNode[]',
        },
      },
    },
  },
  args: {
    title: 'Check your email',
    messages: [
      'We sent you a verification link.',
      'Open the email and follow the instructions to continue.',
    ],
  },
} satisfies Meta<typeof MessageBlock>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <Stack gap="sm" className="max-w-md">
      <MessageBlock {...args} />
    </Stack>
  ),
};
