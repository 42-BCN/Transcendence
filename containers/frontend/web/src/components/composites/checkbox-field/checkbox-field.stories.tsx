import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { CheckboxField } from './checkbox-field';

const meta = {
  title: 'Components/Composites/CheckboxField',
  component: CheckboxField,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Accessible checkbox field composed from CheckboxGroup, Checkbox, FieldError, and optional rich translated link content.',
      },
    },
  },
  argTypes: {
    labelKey: {
      control: 'text',
      description:
        'Translation key used for the checkbox label. Can be a rich-text message when linkHref is provided.',
      table: {
        category: 'Content',
        type: { summary: 'string' },
      },
    },
    errorKey: {
      control: 'text',
      description:
        'Optional translation key for the validation error. When provided, the field is marked as invalid.',
      table: {
        category: 'Validation',
        type: { summary: 'string' },
      },
    },
    linkHref: {
      control: 'text',
      description:
        'Optional internal link href used to render a rich link inside the translated label.',
      table: {
        category: 'Content',
        type: { summary: 'string' },
      },
    },
    defaultSelected: {
      control: 'boolean',
      description: 'Initial selected state when the checkbox is uncontrolled.',
      table: {
        category: 'State',
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    isSelected: {
      control: 'boolean',
      description: 'Controls whether the checkbox is selected.',
      table: {
        category: 'State',
        type: { summary: 'boolean' },
      },
    },
    isDisabled: {
      control: 'boolean',
      description: 'Disables the checkbox and prevents user interaction.',
      table: {
        category: 'State',
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    isReadOnly: {
      control: 'boolean',
      description: 'Makes the checkbox read-only while keeping it focusable.',
      table: {
        category: 'State',
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    isRequired: {
      control: 'boolean',
      description: 'Marks the checkbox as required for validation.',
      table: {
        category: 'Validation',
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    isInvalid: {
      control: 'boolean',
      description:
        'Marks the checkbox field as invalid. This is also inferred automatically when errorKey is provided.',
      table: {
        category: 'Validation',
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    onChange: {
      action: 'changed',
      description: 'Callback fired when the selected state changes.',
      table: {
        category: 'Events',
        type: { summary: '(isSelected: boolean) => void' },
      },
    },
    name: {
      control: 'text',
      description: 'Form field name used for submission.',
      table: {
        category: 'Form',
        type: { summary: 'string' },
      },
    },
    value: {
      control: 'text',
      description: 'Submitted value for the checkbox.',
      table: {
        category: 'Form',
        type: { summary: 'string' },
      },
    },
    className: {
      control: false,
      description: 'Optional className passed to the field wrapper.',
      table: {
        category: 'Styling',
        type: { summary: 'ClassValue' },
        disable: true,
      },
    },
  },
  args: {
    labelKey: 'features.auth.signup.acceptTerms',
    name: 'terms',
    value: 'accepted',
    defaultSelected: false,
    isDisabled: false,
    isReadOnly: false,
    isRequired: false,
  },
} satisfies Meta<typeof CheckboxField>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Checked: Story = {
  args: {
    defaultSelected: true,
  },
};

export const WithError: Story = {
  args: {
    errorKey: 'validation.required',
  },
  parameters: {
    docs: {
      source: {
        code: `<CheckboxField
  name="terms"
  value="accepted"
  labelKey="features.auth.signup.acceptTerms"
  errorKey="validation.required"
/>`,
      },
    },
  },
};

export const WithLink: Story = {
  args: {
    labelKey: 'features.auth.signup.acceptTermsWithLink',
    linkHref: '/privacy',
  },
  parameters: {
    docs: {
      source: {
        code: `<CheckboxField
  name="terms"
  value="accepted"
  labelKey="features.auth.signup.acceptTermsWithLink"
  linkHref="/privacy-policy"
/>`,
      },
    },
  },
};

export const Disabled: Story = {
  args: {
    isDisabled: true,
  },
};

export const States: Story = {
  parameters: {
    docs: {
      source: {
        code: `<div className="grid gap-4">
  <CheckboxField
    name="terms"
    value="accepted"
    labelKey="features.auth.signup.acceptTerms"
  />

  <CheckboxField
    name="terms-checked"
    value="accepted"
    labelKey="features.auth.signup.acceptTerms"
    defaultSelected
  />

  <CheckboxField
    name="terms-error"
    value="accepted"
    labelKey="features.auth.signup.acceptTerms"
    errorKey="validation.required"
  />

  <CheckboxField
    name="terms-link"
    value="accepted"
    labelKey="features.auth.signup.acceptTermsWithLink"
    linkHref="/privacy-policy"
  />

  <CheckboxField
    name="terms-disabled"
    value="accepted"
    labelKey="features.auth.signup.acceptTerms"
    isDisabled
  />
</div>`,
      },
    },
  },
  render: () => (
    <div className="grid gap-4">
      <CheckboxField name="terms" value="accepted" labelKey="features.auth.signup.acceptTerms" />

      <CheckboxField
        name="terms-checked"
        value="accepted"
        labelKey="features.auth.signup.acceptTerms"
        defaultSelected
      />

      <CheckboxField
        name="terms-error"
        value="accepted"
        labelKey="features.auth.signup.acceptTerms"
        errorKey="validation.required"
      />

      <CheckboxField
        name="terms-link"
        value="accepted"
        labelKey="features.auth.signup.acceptTermsWithLink"
        linkHref="/privacy"
      />

      <CheckboxField
        name="terms-disabled"
        value="accepted"
        labelKey="features.auth.signup.acceptTerms"
      />
    </div>
  ),
};
