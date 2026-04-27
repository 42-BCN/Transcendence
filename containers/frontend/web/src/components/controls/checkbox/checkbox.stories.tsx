/* eslint-disable local/no-literal-ui-strings */
import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Checkbox } from './checkbox';

const meta = {
  title: 'Components/Controls/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Accessible checkbox control built on React Aria Components. It supports selected, indeterminate, invalid, disabled, read-only, and required states.',
      },
    },
  },
  argTypes: {
    children: {
      control: 'text',
      description: 'Optional visible label rendered next to the checkbox.',
      table: {
        category: 'Content',
        type: {
          summary: 'ReactNode',
        },
      },
    },
    isSelected: {
      control: 'boolean',
      description: 'Controls whether the checkbox is selected.',
      table: {
        category: 'State',
        type: {
          summary: 'boolean',
        },
      },
    },
    defaultSelected: {
      control: 'boolean',
      description: 'Initial selected state when the checkbox is uncontrolled.',
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
    isIndeterminate: {
      control: 'boolean',
      description: 'Displays the checkbox in an indeterminate mixed state.',
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
    isInvalid: {
      control: 'boolean',
      description: 'Marks the checkbox as invalid for validation styling.',
      table: {
        category: 'Validation',
        type: {
          summary: 'boolean',
        },
        defaultValue: {
          summary: 'false',
        },
      },
    },
    isDisabled: {
      control: 'boolean',
      description: 'Disables the checkbox and prevents user interaction.',
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
    isReadOnly: {
      control: 'boolean',
      description: 'Makes the checkbox read-only while keeping it focusable.',
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
    isRequired: {
      control: 'boolean',
      description: 'Marks the checkbox as required for form validation.',
      table: {
        category: 'Validation',
        type: {
          summary: 'boolean',
        },
        defaultValue: {
          summary: 'false',
        },
      },
    },
    onChange: {
      action: 'changed',
      description: 'Callback fired when the selected state changes.',
      table: {
        category: 'Events',
        type: {
          summary: '(isSelected: boolean) => void',
        },
      },
    },
    name: {
      control: 'text',
      description: 'Name used when submitting the checkbox in a form.',
      table: {
        category: 'Form',
        type: {
          summary: 'string',
        },
      },
    },
    value: {
      control: 'text',
      description: 'Value submitted when the checkbox is selected.',
      table: {
        category: 'Form',
        type: {
          summary: 'string',
        },
      },
    },
    className: {
      control: false,
      description: 'Optional className merged into the checkbox root styles.',
      table: {
        category: 'Styling',
        type: {
          summary: 'string | ((values) => string)',
        },
        disable: true,
      },
    },
  },
  args: {
    children: 'Accept terms',
    name: 'terms',
    value: 'accepted',
    defaultSelected: false,
    isDisabled: false,
    isReadOnly: false,
    isRequired: false,
    isInvalid: false,
    isIndeterminate: false,
  },
} satisfies Meta<typeof Checkbox>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Selected: Story = {
  args: {
    defaultSelected: true,
  },
};

export const Indeterminate: Story = {
  args: {
    isIndeterminate: true,
    children: 'Partially selected',
  },
};

export const Invalid: Story = {
  args: {
    isInvalid: true,
    children: 'Invalid checkbox',
  },
};

export const Disabled: Story = {
  args: {
    isDisabled: true,
    children: 'Disabled checkbox',
  },
};

export const WithoutLabel: Story = {
  args: {
    children: undefined,
    'aria-label': 'Accept terms',
  },
  parameters: {
    docs: {
      source: {
        code: `<Checkbox aria-label="Accept terms" />`,
      },
    },
  },
};

export const States: Story = {
  parameters: {
    docs: {
      source: {
        code: `<div className="grid gap-4">
  <Checkbox>Default</Checkbox>
  <Checkbox defaultSelected>Selected</Checkbox>
  <Checkbox isIndeterminate>Indeterminate</Checkbox>
  <Checkbox isInvalid>Invalid</Checkbox>
  <Checkbox isDisabled>Disabled</Checkbox>
</div>`,
      },
    },
  },
  render: () => (
    <div className="grid gap-4">
      <Checkbox>Default</Checkbox>
      <Checkbox defaultSelected>Selected</Checkbox>
      <Checkbox isIndeterminate>Indeterminate</Checkbox>
      <Checkbox isInvalid>Invalid</Checkbox>
      <Checkbox isDisabled>Disabled</Checkbox>
    </div>
  ),
};
