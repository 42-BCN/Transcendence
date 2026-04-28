/* eslint-disable local/no-literal-ui-strings */
import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Avatar } from './avatar';

const meta = {
  title: 'Components/Primitives/Avatar',
  component: Avatar,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Avatar primitive that renders a user image when src is provided, and a user icon fallback when src is missing.',
      },
    },
  },
  argTypes: {
    src: {
      control: 'text',
      description: 'Optional image URL for the avatar.',
      table: {
        category: 'Content',
        type: {
          summary: 'string | null',
        },
      },
    },
    alt: {
      control: 'text',
      description: 'Accessible label and image alt text.',
      table: {
        category: 'Accessibility',
        type: {
          summary: 'string',
        },
        defaultValue: {
          summary: 'Avatar',
        },
      },
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Avatar size.',
      table: {
        category: 'Appearance',
        type: {
          summary: 'AvatarSize',
        },
        defaultValue: {
          summary: 'md',
        },
      },
    },
    className: {
      control: false,
      description: 'Optional className merged into the avatar root styles.',
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
    src: null,
    alt: 'User avatar',
    size: 'md',
  },
} satisfies Meta<typeof Avatar>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Fallback: Story = {};

export const WithImage: Story = {
  args: {
    src: 'https://i.pravatar.cc/120?img=5',
    alt: 'Player avatar',
  },
  parameters: {
    docs: {
      source: {
        code: `<Avatar
  src="https://i.pravatar.cc/120?img=5"
  alt="Player avatar"
/>`,
      },
    },
  },
};

export const Sizes: Story = {
  parameters: {
    docs: {
      source: {
        code: `<div className="flex items-center gap-4">
  <Avatar size="sm" />
  <Avatar size="md" />
  <Avatar size="lg" />
</div>`,
      },
    },
  },
  render: () => (
    <div className="flex items-center gap-4">
      <Avatar size="sm" alt="Small avatar" />
      <Avatar size="md" alt="Medium avatar" />
      <Avatar size="lg" alt="Large avatar" />
    </div>
  ),
};

export const ImageSizes: Story = {
  parameters: {
    docs: {
      source: {
        code: `<div className="flex items-center gap-4">
  <Avatar size="sm" src="https://i.pravatar.cc/120?img=1" alt="Small avatar" />
  <Avatar size="md" src="https://i.pravatar.cc/120?img=2" alt="Medium avatar" />
  <Avatar size="lg" src="https://i.pravatar.cc/120?img=3" alt="Large avatar" />
</div>`,
      },
    },
  },
  render: () => (
    <div className="flex items-center gap-4">
      <Avatar size="sm" src="https://i.pravatar.cc/120?img=1" alt="Small avatar" />
      <Avatar size="md" src="https://i.pravatar.cc/120?img=2" alt="Medium avatar" />
      <Avatar size="lg" src="https://i.pravatar.cc/120?img=3" alt="Large avatar" />
    </div>
  ),
};

export const States: Story = {
  parameters: {
    docs: {
      source: {
        code: `<div className="grid gap-4">
  <Avatar alt="Fallback avatar" />
  <Avatar src="https://i.pravatar.cc/120?img=5" alt="Image avatar" />
</div>`,
      },
    },
  },
  render: () => (
    <div className="grid gap-4">
      <Avatar alt="Fallback avatar" />
      <Avatar src="https://i.pravatar.cc/120?img=5" alt="Image avatar" />
    </div>
  ),
};
