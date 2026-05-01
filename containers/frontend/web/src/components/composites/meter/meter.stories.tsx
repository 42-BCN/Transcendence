/* eslint-disable local/no-literal-ui-strings */
import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Meter } from './meter';

const meta = {
  title: 'Components/Composites/Meter',
  component: Meter,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Accessible meter component built on React Aria Components. It displays a labeled progress value, value text, and a visual bar.',
      },
    },
  },
  argTypes: {
    label: {
      control: 'text',
      description: 'Optional visible label for the meter.',
      table: {
        category: 'Content',
        type: {
          summary: 'string',
        },
      },
    },
    value: {
      control: {
        type: 'number',
        min: 0,
        max: 100,
        step: 1,
      },
      description: 'Current meter value.',
      table: {
        category: 'State',
        type: {
          summary: 'number',
        },
      },
    },
    minValue: {
      control: {
        type: 'number',
        min: 0,
        max: 100,
        step: 1,
      },
      description: 'Minimum meter value.',
      table: {
        category: 'State',
        type: {
          summary: 'number',
        },
        defaultValue: {
          summary: '0',
        },
      },
    },
    maxValue: {
      control: {
        type: 'number',
        min: 1,
        max: 100,
        step: 1,
      },
      description: 'Maximum value used by React Aria to calculate the percentage.',
      table: {
        category: 'State',
        type: {
          summary: 'number',
        },
      },
    },
    max: {
      control: {
        type: 'number',
        min: 1,
        max: 100,
        step: 1,
      },
      description:
        'Maximum value displayed in the visible value text. This should usually match maxValue.',
      table: {
        category: 'Content',
        type: {
          summary: 'number',
        },
      },
    },
    valueLabel: {
      control: 'text',
      description:
        'Accessible value label passed to React Aria. When omitted, React Aria generates valueText.',
      table: {
        category: 'Accessibility',
        type: {
          summary: 'string',
        },
      },
    },
    className: {
      control: false,
      description: 'Optional className passed to the meter root.',
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
    label: 'Profile completion',
    value: 60,
    minValue: 0,
    maxValue: 100,
    max: 100,
  },
} satisfies Meta<typeof Meter>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const LowValue: Story = {
  args: {
    label: 'Storage used',
    value: 20,
    maxValue: 100,
    max: 100,
  },
};

export const MediumValue: Story = {
  args: {
    label: 'Storage used',
    value: 50,
    maxValue: 100,
    max: 100,
  },
};

export const HighValue: Story = {
  args: {
    label: 'Storage used',
    value: 85,
    maxValue: 100,
    max: 100,
  },
};

export const Complete: Story = {
  args: {
    label: 'Upload progress',
    value: 100,
    maxValue: 100,
    max: 100,
  },
};

export const CustomMaximum: Story = {
  args: {
    label: 'Players ready',
    value: 3,
    minValue: 0,
    maxValue: 4,
    max: 4,
  },
  parameters: {
    docs: {
      source: {
        code: `<Meter
  label="Players ready"
  value={3}
  minValue={0}
  maxValue={4}
  max={4}
/>`,
      },
    },
  },
};

export const States: Story = {
  parameters: {
    docs: {
      source: {
        code: `<div className="grid w-full max-w-md gap-4">
  <Meter label="Low" value={20} maxValue={100} max={100} />
  <Meter label="Medium" value={50} maxValue={100} max={100} />
  <Meter label="High" value={85} maxValue={100} max={100} />
  <Meter label="Complete" value={100} maxValue={100} max={100} />
</div>`,
      },
    },
  },
  render: () => (
    <div className="grid w-full max-w-md gap-4">
      <Meter label="Low" value={20} maxValue={100} max={100} />
      <Meter label="Medium" value={50} maxValue={100} max={100} />
      <Meter label="High" value={85} maxValue={100} max={100} />
      <Meter label="Complete" value={100} maxValue={100} max={100} />
    </div>
  ),
};
