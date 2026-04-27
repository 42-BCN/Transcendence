/* eslint-disable local/no-literal-ui-strings */
import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Button } from '@components/controls/button';
import { TextField } from '@components/composites/text-field';

import { Form } from './form';

const meta = {
  title: 'Components/Composites/Form',
  component: Form,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Base form wrapper that applies project form styles and supports native form actions, server actions, and GET/POST methods.',
      },
    },
  },
  argTypes: {
    action: {
      control: false,
      description:
        'Native form action URL or server action function. Usually provided by feature-level forms.',
      table: {
        category: 'Behavior',
        type: {
          summary: 'string | (formData: FormData) => void | Promise<void>',
        },
      },
    },
    method: {
      control: 'select',
      options: ['GET', 'POST'],
      description: 'Native form method. Defaults to browser behavior when omitted.',
      table: {
        category: 'Behavior',
        type: {
          summary: "'GET' | 'POST'",
        },
      },
    },
    className: {
      control: false,
      description: 'Optional className merged with the base form styles.',
      table: {
        category: 'Styling',
        type: {
          summary: 'string',
        },
        disable: true,
      },
    },
    children: {
      control: false,
      description: 'Form content, usually fields, feedback, and submit controls.',
      table: {
        category: 'Content',
        type: {
          summary: 'ReactNode',
        },
      },
    },
    onSubmit: {
      action: 'submitted',
      description:
        'Optional submit handler. Feature forms can use this for client-side validation before calling a server action.',
      table: {
        category: 'Events',
        type: {
          summary: 'FormEventHandler<HTMLFormElement>',
        },
      },
    },
  },
} satisfies Meta<typeof Form>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    docs: {
      source: {
        code: `<Form>
  <TextField
    name="email"
    labelKey="features.auth.fields.email.label"
    inputProps={{ placeholder: 'email@example.com', type: 'email' }}
  />

  <Button type="submit" variant="cta">
    Submit
  </Button>
</Form>`,
      },
    },
  },
  render: () => (
    <div className="w-full max-w-md">
      <Form
        onSubmit={(event) => {
          event.preventDefault();
        }}
      >
        <TextField
          name="email"
          labelKey="features.auth.fields.email.label"
          inputProps={{ placeholder: 'email@example.com', type: 'email' }}
        />

        <Button type="submit" variant="cta">
          Submit
        </Button>
      </Form>
    </div>
  ),
};

export const WithMultipleFields: Story = {
  parameters: {
    docs: {
      source: {
        code: `<Form>
  <TextField
    name="email"
    labelKey="features.auth.fields.email.label"
    inputProps={{ placeholder: 'email@example.com', type: 'email' }}
  />

  <TextField
    name="password"
    labelKey="features.auth.fields.password.label"
    inputProps={{ placeholder: 'Password', type: 'password' }}
  />

  <Button type="submit" variant="cta">
    Create account
  </Button>
</Form>`,
      },
    },
  },
  render: () => (
    <div className="w-full max-w-md">
      <Form
        onSubmit={(event) => {
          event.preventDefault();
        }}
      >
        <TextField
          name="email"
          labelKey="features.auth.fields.email.label"
          inputProps={{ placeholder: 'email@example.com', type: 'email' }}
        />

        <TextField
          name="password"
          labelKey="features.auth.fields.password.label"
          inputProps={{ placeholder: 'Password', type: 'password' }}
        />

        <Button type="submit" variant="cta">
          Create account
        </Button>
      </Form>
    </div>
  ),
};
