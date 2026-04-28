import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { ApiFeedback } from './api-feedback';

const meta = {
  title: 'Components/Composites/ApiFeedback',
  component: ApiFeedback,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Small API result feedback component. It renders nothing when result is null, a success message when ok is true, and a translated error message from the errors namespace when ok is false.',
      },
    },
  },
  argTypes: {
    result: {
      control: 'object',
      description:
        'API result object. When null, no feedback is rendered. When ok is false, error.code is resolved through the errors translation namespace.',
      table: {
        category: 'State',
        type: {
          summary: '{ ok: true } | { ok: false; error: { code: string } } | null',
        },
      },
    },
    successMessage: {
      control: 'text',
      description: 'Message rendered when the API result is successful.',
      table: {
        category: 'Content',
        type: {
          summary: 'string',
        },
      },
    },
  },
  args: {
    result: {
      ok: true,
    },
    successMessage: 'Changes saved successfully.',
  },
} satisfies Meta<typeof ApiFeedback>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Success: Story = {
  args: {
    result: {
      ok: true,
    },
    successMessage: 'Changes saved successfully.',
  },
};

export const Error: Story = {
  args: {
    result: {
      ok: false,
      error: {
        code: 'generic',
      },
    },
    successMessage: 'Changes saved successfully.',
  },
  parameters: {
    docs: {
      source: {
        code: `<ApiFeedback
  result={{
    ok: false,
    error: {
      code: 'generic',
    },
  }}
  successMessage="Changes saved successfully."
/>`,
      },
    },
  },
};

export const Empty: Story = {
  args: {
    result: null,
    successMessage: 'Changes saved successfully.',
  },
  parameters: {
    docs: {
      description: {
        story: 'When result is null, the component renders nothing.',
      },
      source: {
        code: `<ApiFeedback result={null} successMessage="Changes saved successfully." />`,
      },
    },
  },
};

export const States: Story = {
  parameters: {
    docs: {
      source: {
        code: `<div className="grid gap-3">
  <ApiFeedback
    result={{ ok: true }}
    successMessage="Changes saved successfully."
  />

  <ApiFeedback
    result={{
      ok: false,
      error: {
        code: 'generic',
      },
    }}
    successMessage="Changes saved successfully."
  />

  <ApiFeedback result={null} successMessage="Changes saved successfully." />
</div>`,
      },
    },
  },
  render: () => (
    <div className="grid gap-3">
      <ApiFeedback result={{ ok: true }} successMessage="Changes saved successfully." />

      <ApiFeedback
        result={{
          ok: false,
          error: {
            code: 'generic',
          },
        }}
        successMessage="Changes saved successfully."
      />

      <ApiFeedback result={null} successMessage="Changes saved successfully." />
    </div>
  ),
};
