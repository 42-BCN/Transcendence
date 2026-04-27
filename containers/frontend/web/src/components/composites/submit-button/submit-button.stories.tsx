import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { SubmitButton } from './submit-button';

const meta = {
  title: 'Components/Composites/SubmitButton',
  component: SubmitButton,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Submit button that reads pending state from useFormStatus. It disables itself and swaps the label while the parent form action is pending.',
      },
    },
  },
  argTypes: {
    idleLabel: {
      control: 'text',
      description: 'Text shown when the form is not pending.',
      table: {
        category: 'Content',
        type: {
          summary: 'string',
        },
      },
    },
  },
  args: {
    idleLabel: 'Submit',
  },
} satisfies Meta<typeof SubmitButton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    docs: {
      source: {
        code: `<form action={formAction}>
  <SubmitButton idleLabel="Submit" />
</form>`,
      },
    },
  },
  render: (args) => (
    <form
      action={async () => {
        await new Promise((resolve) => {
          window.setTimeout(resolve, 1500);
        });
      }}
    >
      <SubmitButton {...args} />
    </form>
  ),
};
