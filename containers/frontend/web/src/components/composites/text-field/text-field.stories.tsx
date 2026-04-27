import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { TextField } from './text-field';

const meta = {
  title: 'Components/Composites/TextField',
  component: TextField,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Accessible text field built on React Aria Components. Labels, descriptions, and errors are resolved through next-intl translation keys.',
      },
    },
  },
  argTypes: {
    labelKey: {
      control: 'text',
      description: 'Translation key used for the field label.',
      table: {
        category: 'Content',
        type: {
          summary: 'string',
        },
      },
    },
    descriptionKey: {
      control: 'text',
      description: 'Optional translation key used for helper text below the input.',
      table: {
        category: 'Content',
        type: {
          summary: 'string',
        },
      },
    },
    errorKey: {
      control: 'text',
      description:
        'Optional translation key used for the validation error. When provided, the field is automatically marked as invalid.',
      table: {
        category: 'Validation',
        type: {
          summary: 'string',
        },
      },
    },
    isInvalid: {
      control: 'boolean',
      description:
        'Marks the field as invalid. This is also inferred automatically when errorKey is provided.',
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
      description: 'Disables the field and prevents user interaction.',
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
      description: 'Makes the field read-only while keeping it focusable.',
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
      description: 'Marks the field as required for form validation.',
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
    name: {
      control: 'text',
      description:
        'Field name used for form submission. Also used as a stable id when id is not provided.',
      table: {
        category: 'Form',
        type: {
          summary: 'string',
        },
      },
    },
    id: {
      control: 'text',
      description: 'Optional explicit id for the text field.',
      table: {
        category: 'Form',
        type: {
          summary: 'string',
        },
      },
    },
    inputProps: {
      control: 'object',
      description: 'Props forwarded to the inner Input component.',
      table: {
        category: 'Input',
        type: {
          summary: 'InputProps',
        },
      },
    },
    inputRef: {
      control: false,
      description: 'Optional ref forwarded to the inner input element.',
      table: {
        category: 'Refs',
        type: {
          summary: 'Ref<HTMLInputElement>',
        },
        disable: true,
      },
    },
  },
  args: {
    name: 'username',
    labelKey: 'features.auth.fields.username.label',
    descriptionKey: 'features.auth.fields.username.description',
    inputProps: {
      placeholder: 'username',
    },
    isDisabled: false,
    isReadOnly: false,
    isRequired: false,
  },
} satisfies Meta<typeof TextField>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithDescription: Story = {
  args: {
    name: 'email',
    labelKey: 'features.auth.fields.email.label',
    descriptionKey: 'features.auth.fields.email.description',
    inputProps: {
      placeholder: 'email@example.com',
      type: 'email',
    },
  },
};

export const WithError: Story = {
  args: {
    name: 'password',
    labelKey: 'features.auth.fields.password.label',
    errorKey: 'validation.required',
    inputProps: {
      placeholder: 'Password',
      type: 'password',
    },
  },
};

export const Disabled: Story = {
  args: {
    name: 'disabled-field',
    labelKey: 'features.auth.fields.username.label',
    inputProps: {
      placeholder: 'Disabled field',
    },
    isDisabled: true,
  },
};

export const ReadOnly: Story = {
  args: {
    name: 'readonly-field',
    labelKey: 'features.auth.fields.username.label',
    inputProps: {
      value: 'Readonly value',
      readOnly: true,
    },
    isReadOnly: true,
  },
};

export const States: Story = {
  parameters: {
    docs: {
      source: {
        code: `<div className="grid w-full max-w-md gap-6">
  <TextField
    name="username"
    labelKey="features.auth.fields.username.label"
    descriptionKey="features.auth.fields.username.description"
    inputProps={{ placeholder: 'username' }}
  />

  <TextField
    name="password"
    labelKey="features.auth.fields.password.label"
    errorKey="validation.required"
    inputProps={{ placeholder: 'Password', type: 'password' }}
  />

  <TextField
    name="disabled"
    labelKey="features.auth.fields.username.label"
    inputProps={{ placeholder: 'Disabled field' }}
    isDisabled
  />
</div>`,
      },
    },
  },
  render: () => (
    <div className="grid w-full max-w-md gap-6">
      <TextField
        name="username"
        labelKey="features.auth.fields.username.label"
        descriptionKey="features.auth.fields.username.description"
        inputProps={{ placeholder: 'username' }}
      />

      <TextField
        name="password"
        labelKey="features.auth.fields.password.label"
        errorKey="validation.required"
        inputProps={{ placeholder: 'Password', type: 'password' }}
      />

      <TextField
        name="disabled"
        labelKey="features.auth.fields.username.label"
        inputProps={{ placeholder: 'Disabled field' }}
        isDisabled
      />
    </div>
  ),
};
