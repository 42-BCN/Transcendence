/* eslint-disable local/no-literal-ui-strings */
import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import type { Key } from 'react-aria-components';

import { Icon } from '@components/primitives/icon';

import { SegmentedControlGroup } from './segmented-control-group';

const themeOptions = [
  {
    id: 'light',
    label: <Icon name="lightMode" size={18} />,
    ariaLabel: 'Light mode',
    tooltipLabel: 'Light mode',
  },
  {
    id: 'dark',
    label: <Icon name="darkMode" size={18} />,
    ariaLabel: 'Dark mode',
    tooltipLabel: 'Dark mode',
  },
  {
    id: 'settings',
    label: <Icon name="settings" size={18} />,
    ariaLabel: 'Settings',
    tooltipLabel: 'Settings',
  },
] as const;

const meta = {
  title: 'Components/Composites/SegmentedControlGroup',
  component: SegmentedControlGroup,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Icon-only segmented control built on React Aria ToggleButtonGroup. Each option must provide an ariaLabel because the visible label is decorative icon content.',
      },
    },
  },
  argTypes: {
    'aria-label': {
      control: 'text',
      description: 'Accessible label for the segmented control group.',
      table: {
        category: 'Accessibility',
        type: {
          summary: 'string',
        },
      },
    },
    options: {
      control: false,
      description:
        'Icon-only options. Each option should include ariaLabel and may include tooltipLabel.',
      table: {
        category: 'Content',
        type: {
          summary:
            'readonly { id: Key; label: ReactNode; ariaLabel: string; tooltipLabel?: string }[]',
        },
      },
    },
    defaultSelectedKey: {
      control: 'text',
      description: 'Initial selected option key when uncontrolled.',
      table: {
        category: 'State',
        type: {
          summary: 'Key',
        },
      },
    },
    selectedKey: {
      control: false,
      description: 'Selected option key when controlled.',
      table: {
        category: 'State',
        type: {
          summary: 'Key',
        },
      },
    },
    onSelectionChange: {
      action: 'selection changed',
      description: 'Callback fired when the selected option changes.',
      table: {
        category: 'Events',
        type: {
          summary: '(key: Key) => void',
        },
      },
    },
  },
  args: {
    'aria-label': 'Theme mode',
    options: themeOptions,
    defaultSelectedKey: 'light',
  },
} satisfies Meta<typeof SegmentedControlGroup>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithDisabledIcon: Story = {
  args: {
    'aria-label': 'Theme mode',
    defaultSelectedKey: 'light',
    options: [
      {
        id: 'light',
        label: <Icon name="lightMode" size={18} />,
        ariaLabel: 'Light mode',
        tooltipLabel: 'Light mode',
      },
      {
        id: 'dark',
        label: <Icon name="darkMode" size={18} />,
        ariaLabel: 'Dark mode',
        tooltipLabel: 'Dark mode',
        isDisabled: true,
      },
      {
        id: 'settings',
        label: <Icon name="settings" size={18} />,
        ariaLabel: 'Settings',
        tooltipLabel: 'Settings',
      },
    ],
  },
};

function ControlledIconSegmentedControl() {
  const [selectedKey, setSelectedKey] = useState<Key>('light');

  return (
    <div className="grid gap-4">
      <SegmentedControlGroup
        aria-label="Controlled theme mode"
        options={themeOptions}
        selectedKey={selectedKey}
        onSelectionChange={setSelectedKey}
      />

      <p className="text-sm text-text-secondary">Selected: {String(selectedKey)}</p>
    </div>
  );
}

export const Controlled: Story = {
  parameters: {
    docs: {
      source: {
        code: `const [selectedKey, setSelectedKey] = useState<Key>('light');

return (
  <SegmentedControlGroup
    aria-label="Controlled theme mode"
    options={themeOptions}
    selectedKey={selectedKey}
    onSelectionChange={setSelectedKey}
  />
);`,
      },
    },
  },
  render: () => <ControlledIconSegmentedControl />,
};
