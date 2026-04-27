/* eslint-disable local/no-literal-ui-strings */
import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { IconButton } from './icon-button';
import { icons, type IconName } from '@components/primitives/icon/icons';

const iconNames = Object.keys(icons) as IconName[];

const meta = {
  title: 'Components/Composites/IconButton',
  component: IconButton,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Accessible icon-only button composed from Button, Icon, and TooltipTrigger. The visible tooltip and aria-label both come from the required label prop.',
      },
    },
  },
  argTypes: {
    label: {
      control: 'text',
      description: 'Accessible label for the icon button. Also used as the tooltip content.',
      table: {
        category: 'Accessibility',
        type: {
          summary: 'string',
        },
      },
    },
    icon: {
      control: 'select',
      options: iconNames,
      description: 'Name of the icon rendered inside the button.',
      table: {
        category: 'Content',
        type: {
          summary: 'IconName',
        },
      },
    },
    placement: {
      control: 'select',
      options: ['top', 'bottom', 'left', 'right'],
      description: 'Tooltip placement relative to the button.',
      table: {
        category: 'Tooltip',
        type: {
          summary: "'top' | 'bottom' | 'left' | 'right'",
        },
        defaultValue: {
          summary: 'top',
        },
      },
    },
    variant: {
      control: 'select',
      options: ['primary', 'secondary'],
      description: 'Visual style passed to the underlying Button.',
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
    isDisabled: {
      control: 'boolean',
      description: 'Disables the icon button and prevents user interaction.',
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
    onPress: {
      action: 'pressed',
      description:
        'Callback fired when the button is pressed through mouse, touch, keyboard, or assistive technology.',
      table: {
        category: 'Events',
        type: {
          summary: '(event) => void',
        },
      },
    },
    type: {
      control: 'select',
      options: ['button', 'submit', 'reset'],
      description: 'Native button type passed to the underlying Button.',
      table: {
        category: 'Form',
        type: {
          summary: "'button' | 'submit' | 'reset'",
        },
      },
    },
    id: {
      control: 'text',
      description: 'Optional id passed to the underlying Button.',
      table: {
        category: 'DOM',
        type: {
          summary: 'string',
        },
      },
    },
    className: {
      control: false,
      description:
        'Optional className passed to the underlying Button. Hidden from controls to keep the component API constrained.',
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
    label: 'Open chat',
    icon: iconNames[0],
    placement: 'top',
    variant: 'secondary',
    isDisabled: false,
    type: 'button',
  },
} satisfies Meta<typeof IconButton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Disabled: Story = {
  args: {
    label: 'Disabled action',
    isDisabled: true,
  },
};

export const Placements: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Shows the available tooltip placements.',
      },
      source: {
        code: `<div className="flex items-center gap-4">
  <IconButton label="Tooltip top" icon="messages" placement="top" />
  <IconButton label="Tooltip bottom" icon="messages" placement="bottom" />
  <IconButton label="Tooltip left" icon="messages" placement="left" />
  <IconButton label="Tooltip right" icon="messages" placement="right" />
</div>`,
      },
    },
  },
  render: () => (
    <div className="flex items-center gap-4">
      <IconButton label="Tooltip top" icon={iconNames[0]} placement="top" />
      <IconButton label="Tooltip bottom" icon={iconNames[0]} placement="bottom" />
      <IconButton label="Tooltip left" icon={iconNames[0]} placement="left" />
      <IconButton label="Tooltip right" icon={iconNames[0]} placement="right" />
    </div>
  ),
};

export const Variants: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Shows the supported visual variants.',
      },
      source: {
        code: `<div className="flex items-center gap-4">
  <IconButton label="Primary action" icon="check" variant="primary" />
  <IconButton label="Secondary action" icon="messages" variant="secondary" />
</div>`,
      },
    },
  },
  render: () => (
    <div className="flex items-center gap-4">
      <IconButton label="Primary action" icon={iconNames[0]} variant="primary" />
      <IconButton label="Secondary action" icon={iconNames[0]} variant="secondary" />
    </div>
  ),
};

export const CommonActions: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Example icon buttons for common UI actions.',
      },
      source: {
        code: `<div className="flex items-center gap-4">
  <IconButton label="Accept" icon="check" />
  <IconButton label="Reject" icon="close" />
  <IconButton label="Open chat" icon="messages" />
</div>`,
      },
    },
  },
  render: () => (
    <div className="flex items-center gap-4">
      <IconButton label="Accept" icon={iconNames[0]} />
      <IconButton label="Reject" icon={iconNames[0]} />
      <IconButton label="Open chat" icon={iconNames[0]} />
    </div>
  ),
};
