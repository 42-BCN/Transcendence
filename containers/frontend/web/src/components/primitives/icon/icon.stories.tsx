import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Icon } from './icon';
import { icons, type IconName } from './icons';

const iconNames = Object.keys(icons) as IconName[];

const meta = {
  title: 'Components/Primitives/Icon',
  component: Icon,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Decorative icon component. Icons are hidden from assistive technologies with aria-hidden, so meaningful labels must be provided by the parent component when needed.',
      },
    },
  },
  argTypes: {
    name: {
      control: 'select',
      options: iconNames,
      description: 'Name of the icon to render.',
      table: {
        category: 'Content',
        type: {
          summary: 'IconName',
        },
      },
    },
    size: {
      control: {
        type: 'number',
        min: 12,
        max: 64,
        step: 4,
      },
      description: 'Icon size in pixels.',
      table: {
        category: 'Appearance',
        type: {
          summary: 'number',
        },
        defaultValue: {
          summary: '20',
        },
      },
    },
    className: {
      control: false,
      description:
        'Optional className for internal styling overrides. Prefer design-token-based usage from parent components.',
      table: {
        category: 'Styling',
        type: {
          summary: 'string',
        },
      },
    },
  },
  args: {
    name: iconNames[0],
    size: 20,
  },
} satisfies Meta<typeof Icon>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Sizes: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Shows the same icon rendered at different supported sizes.',
      },
    },
  },
  render: () => (
    <div className="flex items-center gap-4 text-text-primary">
      <Icon name={iconNames[0]} size={16} />
      <Icon name={iconNames[0]} size={20} />
      <Icon name={iconNames[0]} size={24} />
      <Icon name={iconNames[0]} size={32} />
    </div>
  ),
};

export const AllIcons: Story = {
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        story: 'Displays every available icon from the project icon registry.',
      },
    },
  },
  render: () => (
    <div className="grid grid-cols-2 gap-4 text-text-primary sm:grid-cols-4 md:grid-cols-6">
      {iconNames.map((name) => (
        <div
          key={name}
          className="flex flex-col items-center gap-2 rounded-md border border-border-primary bg-bg-primary p-4"
        >
          <Icon name={name} size={24} />
          <span className="text-xs">{name}</span>
        </div>
      ))}
    </div>
  ),
};
