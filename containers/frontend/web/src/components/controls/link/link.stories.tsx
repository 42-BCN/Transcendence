/* eslint-disable local/no-literal-ui-strings */
import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Icon } from '@components/primitives/icon';

import { ExternalLink, InternalLink } from './link';

const meta = {
  title: 'Components/Controls/Link',
  component: InternalLink,
  tags: ['autodocs'],
  parameters: {
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: '/',
      },
    },
    docs: {
      description: {
        component:
          'Internal and external link controls. InternalLink uses the localized app navigation Link, while ExternalLink renders a React Aria Link and defaults to opening in a new tab.',
      },
    },
  },
  argTypes: {
    href: {
      control: 'text',
      description: 'Destination URL or route.',
      table: {
        category: 'Navigation',
        type: {
          summary: 'string',
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
    as: {
      control: 'select',
      options: ['link', 'button'],
      description: 'Controls whether the link is styled as text link or button.',
      table: {
        category: 'Appearance',
        type: {
          summary: "'link' | 'button'",
        },
      },
    },
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'cta'],
      description: 'Visual variant used when the link is styled as a button.',
      table: {
        category: 'Appearance',
        type: {
          summary: 'InteractiveControlVariant',
        },
        defaultValue: {
          summary: 'secondary',
        },
      },
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Size used when the link is styled as a button.',
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
      options: ['full', 'auto'],
      description: 'Width behavior used when the link is styled as a button.',
      table: {
        category: 'Layout',
        type: {
          summary: 'InteractiveControlWidth',
        },
        defaultValue: {
          summary: 'full',
        },
      },
    },
    icon: {
      control: false,
      description: 'Optional icon rendered before the link content.',
      table: {
        category: 'Content',
        type: {
          summary: 'ReactNode',
        },
      },
    },
    className: {
      control: false,
      description: 'Optional className merged into the link styles.',
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
    href: '/me',
    children: 'Profile',
    as: 'link',
    variant: 'secondary',
    size: 'md',
    w: 'auto',
  },
} satisfies Meta<typeof InternalLink>;

export default meta;

type Story = StoryObj<typeof meta>;

export const InternalTextLink: Story = {};

export const InternalButtonLink: Story = {
  args: {
    href: '/create-account',
    children: 'Create account',
    as: 'button',
    variant: 'cta',
    w: 'auto',
  },
  parameters: {
    docs: {
      source: {
        code: `<InternalLink href="/signup" as="button" variant="cta" w="auto">
  Create account
</InternalLink>`,
      },
    },
  },
};

export const InternalWithIcon: Story = {
  args: {
    href: '/me',
    children: 'Settings',
    as: 'button',
    variant: 'secondary',
    w: 'auto',
    icon: <Icon name="settings" size={18} />,
  },
  parameters: {
    docs: {
      source: {
        code: `<InternalLink
  href="/settings"
  as="button"
  variant="secondary"
  w="auto"
  icon={<Icon name="settings" size={18} />}
>
  Settings
</InternalLink>`,
      },
    },
  },
};

export const ExternalTextLink: Story = {
  render: () => (
    <ExternalLink href="https://example.com" as="link">
      External website
    </ExternalLink>
  ),
  parameters: {
    docs: {
      source: {
        code: `<ExternalLink href="https://example.com" as="link">
  External website
</ExternalLink>`,
      },
    },
  },
};

export const ExternalButtonLink: Story = {
  render: () => (
    <ExternalLink href="https://example.com" as="button" variant="secondary" w="auto">
      Open external link
    </ExternalLink>
  ),
  parameters: {
    docs: {
      source: {
        code: `<ExternalLink
  href="https://example.com"
  as="button"
  variant="secondary"
  w="auto"
>
  Open external link
</ExternalLink>`,
      },
    },
  },
};

export const ExternalWithIcon: Story = {
  render: () => (
    <ExternalLink
      href="https://example.com"
      as="button"
      variant="secondary"
      w="auto"
      icon={<Icon name="logOut" size={18} />}
    >
      Open external link
    </ExternalLink>
  ),
  parameters: {
    docs: {
      source: {
        code: `<ExternalLink
  href="https://example.com"
  as="button"
  variant="secondary"
  w="auto"
  icon={<Icon name="logOut" size={18} />}
>
  Open external link
</ExternalLink>`,
      },
    },
  },
};

export const States: Story = {
  parameters: {
    docs: {
      source: {
        code: `<div className="grid w-full max-w-xs gap-4">
  <InternalLink href="/profile">Text link</InternalLink>

  <InternalLink href="/signup" as="button" variant="cta" w="auto">
    Button link
  </InternalLink>

  <ExternalLink href="https://example.com" as="link">
    External text link
  </ExternalLink>

  <ExternalLink href="https://example.com" as="button" w="auto">
    External button link
  </ExternalLink>
</div>`,
      },
    },
  },
  render: () => (
    <div className="grid w-full max-w-xs gap-4">
      <InternalLink href="/me">Text link</InternalLink>

      <InternalLink href="/login" as="button" variant="cta" w="auto">
        Button link
      </InternalLink>

      <ExternalLink href="https://example.com" as="link">
        External text link
      </ExternalLink>

      <ExternalLink href="https://example.com" as="button" w="auto">
        External button link
      </ExternalLink>
    </div>
  ),
};
