/* eslint-disable local/no-literal-ui-strings */
import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Icon } from '@components/primitives/icon';

import { NavLink } from './nav-link';

const meta = {
  title: 'Components/Controls/NavLink',
  component: NavLink,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Navigation link control built on React Aria Link. It supports current-page state through aria-current and data-current, plus project size and width styles.',
      },
    },
  },
  argTypes: {
    href: {
      control: 'text',
      description: 'Destination URL for the navigation link.',
      table: {
        category: 'Navigation',
        type: {
          summary: 'string',
        },
      },
    },
    isCurrent: {
      control: 'boolean',
      description:
        'Marks the link as the current page. Adds aria-current="page" and data-current="true".',
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
    children: {
      control: 'text',
      description: 'Visible link content.',
      table: {
        category: 'Content',
        type: {
          summary: 'ReactNode',
        },
      },
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Controls the navigation link size.',
      table: {
        category: 'Appearance',
        type: {
          summary: 'InteractiveControlSize',
        },
        defaultValue: {
          summary: 'md',
        },
      },
    },
    w: {
      control: 'select',
      options: ['auto', 'full'],
      description: 'Controls whether the link fits its content or fills the available width.',
      table: {
        category: 'Layout',
        type: {
          summary: 'InteractiveControlW',
        },
        defaultValue: {
          summary: 'auto',
        },
      },
    },
    className: {
      control: false,
      description: 'Optional className merged into the navigation link styles.',
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
    href: '/',
    children: 'Home',
    isCurrent: false,
    size: 'md',
    w: 'auto',
  },
} satisfies Meta<typeof NavLink>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Current: Story = {
  args: {
    href: '/',
    children: 'Home',
    isCurrent: true,
  },
  parameters: {
    docs: {
      source: {
        code: `<NavLink href="/" isCurrent>
  Home
</NavLink>`,
      },
    },
  },
};

export const WithIcon: Story = {
  args: {
    href: '/settings',
    isCurrent: false,
    children: (
      <>
        <Icon name="settings" size={18} />
        Settings
      </>
    ),
  },
  parameters: {
    docs: {
      source: {
        code: `<NavLink href="/settings">
  <Icon name="settings" size={18} />
  Settings
</NavLink>`,
      },
    },
  },
};
