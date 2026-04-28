import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { TextAreaField } from './text-area-field';
import type { TextAreaFieldProps } from './text-area-field';

type TextAreaFieldStoryProps = Omit<TextAreaFieldProps, 'onChange'> & {
  onChange?: TextAreaFieldProps['onChange'];
};

function TextAreaFieldStory(props: TextAreaFieldStoryProps) {
  const { onChange, value: initialValue, ...restProps } = props;
  const [value, setValue] = useState(initialValue ?? '');

  const handleChange = (nextValue: string) => {
    setValue(nextValue);
    onChange?.(nextValue);
  };

  return <TextAreaField {...restProps} value={value} onChange={handleChange} />;
}

const meta = {
  title: 'Components/Composites/TextAreaField',
  component: TextAreaFieldStory,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Accessible controlled textarea field built on React Aria Components. It supports validation errors, character counting, and translated accessibility labels.',
      },
    },
  },
  argTypes: {
    'aria-label': {
      control: 'text',
      description: 'Accessible label for the textarea field.',
      table: {
        category: 'Accessibility',
        type: { summary: 'string' },
      },
    },
    value: {
      control: 'text',
      description: 'Controlled textarea value.',
      table: {
        category: 'State',
        type: { summary: 'string' },
      },
    },
    onChange: {
      action: 'changed',
      description: 'Callback fired when the textarea value changes.',
      table: {
        category: 'Events',
        type: { summary: '(value: string) => void' },
      },
    },
    maxLength: {
      control: {
        type: 'number',
        min: 10,
        max: 500,
        step: 10,
      },
      description: 'Maximum allowed number of characters. Also enables the character counter.',
      table: {
        category: 'Validation',
        type: { summary: 'number' },
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
    name: {
      control: 'text',
      description:
        'Field name used for form submission. Also used as a stable id when id is not provided.',
      table: {
        category: 'Form',
        type: { summary: 'string' },
      },
    },
    id: {
      control: 'text',
      description: 'Optional explicit id for the textarea field.',
      table: {
        category: 'Form',
        type: { summary: 'string' },
      },
    },
    textAreaProps: {
      control: 'object',
      description: 'Props forwarded to the inner TextArea component.',
      table: {
        category: 'Textarea',
        type: { summary: 'TextAreaProps' },
      },
    },
    className: {
      control: false,
      description: 'Optional className passed to the inner TextArea styling function.',
      table: {
        category: 'Styling',
        type: { summary: 'string' },
        disable: true,
      },
    },
  },
  args: {
    'aria-label': 'Message',
    name: 'message',
    value: '',
    maxLength: 160,
    textAreaProps: {
      placeholder: 'Write your message...',
    },
  },
} satisfies Meta<typeof TextAreaFieldStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithCharacterCounter: Story = {
  args: {
    value: 'Hello there!',
    maxLength: 160,
  },
};

export const WithError: Story = {
  args: {
    value: 'This message has an error.',
    errorKey: 'validation.required',
    maxLength: 160,
  },
};
