/* eslint-disable local/no-literal-ui-strings */
import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { MessageBubble } from './message-bubble';

const meta = {
  title: 'Components/Composites/MessageBubble',
  component: MessageBubble,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Message bubble component for chat-like UI. It renders message content with a visual variant for different message ownership or states.',
      },
    },
  },
  argTypes: {
    children: {
      control: 'text',
      description: 'Message content rendered inside the bubble.',
      table: {
        category: 'Content',
        type: {
          summary: 'ReactNode',
        },
      },
    },
    variant: {
      control: 'select',
      options: ['error', 'user', 'me', 'system'],
      description: 'Visual style variant of the message bubble.',
      table: {
        category: 'Appearance',
        type: {
          summary: 'messageVariantType',
        },
      },
    },
  },
  args: {
    children: 'Hey! Want to play a match?',
    variant: 'user',
  },
} satisfies Meta<typeof MessageBubble>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Sent: Story = {
  args: {
    variant: 'me',
    children: 'Hey! Want to play a match?',
  },
};

export const Received: Story = {
  args: {
    variant: 'user',
    children: 'Sure, give me two minutes.',
  },
};

export const Conversation: Story = {
  parameters: {
    docs: {
      source: {
        code: `<div className="grid w-full max-w-sm gap-3">
  <div className="justify-self-start">
    <MessageBubble variant="user">
      Sure, give me two minutes.
    </MessageBubble>
  </div>

  <div className="justify-self-end">
    <MessageBubble variant="me">
      Perfect, I will create the room.
    </MessageBubble>
  </div>
</div>`,
      },
    },
  },
  render: () => (
    <div className="grid w-full max-w-sm gap-3">
      <div className="justify-self-start">
        <MessageBubble variant="user">Sure, give me two minutes.</MessageBubble>
      </div>

      <div className="justify-self-end">
        <MessageBubble variant="me">Perfect, I will create the room.</MessageBubble>
      </div>

      <div className="justify-self-start">
        <MessageBubble variant="user">Nice, send me the invite.</MessageBubble>
      </div>
    </div>
  ),
};

export const LongMessage: Story = {
  args: {
    variant: 'error',
    children:
      'This is a longer message to check wrapping behavior inside the message bubble and make sure the layout stays readable.',
  },
  render: (args) => (
    <div className="w-full max-w-sm">
      <MessageBubble {...args} />
    </div>
  ),
};
