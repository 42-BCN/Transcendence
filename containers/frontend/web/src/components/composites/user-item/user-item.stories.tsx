/* eslint-disable local/no-literal-ui-strings */
import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { IconButton } from '../icon-button/icon-button';

import { UserItem } from './user-item';

const meta = {
  title: 'Components/Composites/UserItem',
  component: UserItem,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Compact user row composed from Avatar, Text, Stack, and optional trailing actions. Useful for friends lists, search results, requests, and chat user lists.',
      },
    },
  },
  argTypes: {
    avatarUrl: {
      control: 'text',
      description: 'Optional avatar image URL. When empty, Avatar fallback behavior is used.',
      table: {
        category: 'Content',
        type: {
          summary: 'string | null',
        },
      },
    },
    username: {
      control: 'text',
      description: 'Primary username displayed in the user row.',
      table: {
        category: 'Content',
        type: {
          summary: 'string',
        },
      },
    },
    subtitle: {
      control: 'text',
      description:
        'Optional secondary text. Currently not rendered because the subtitle block is commented out in the component.',
      table: {
        category: 'Content',
        type: {
          summary: 'string',
        },
      },
    },
    children: {
      control: false,
      description: 'Optional trailing content, usually action buttons.',
      table: {
        category: 'Content',
        type: {
          summary: 'ReactNode',
        },
      },
    },
    className: {
      control: false,
      description: 'Optional className merged into the user item root styles.',
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
    avatarUrl: null,
    username: 'carolina',
  },
} satisfies Meta<typeof UserItem>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithActions: Story = {
  args: {
    username: 'friend-request',
    avatarUrl: 'https://i.pravatar.cc/120?img=12',
    className: 'w-[400px]',
    children: (
      <>
        <IconButton label="Accept" icon="check" />
        <IconButton label="Reject" icon="close" />
      </>
    ),
  },
  parameters: {
    docs: {
      source: {
        code: `<UserItem
  username="friend-request"
  avatarUrl="https://i.pravatar.cc/120?img=12"
>
    <IconButton label="Accept" icon="check" />
    <IconButton label="Reject" icon="close" />
</UserItem>`,
      },
    },
  },
};
