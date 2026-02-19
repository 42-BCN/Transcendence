'use client';

import type { ReactNode } from 'react';

import { FieldError, Label, Text, TextField as AriaTextField } from 'react-aria-components';
import type { TextFieldProps as AriaTextFieldProps } from 'react-aria-components';

import { Input } from '@components/controls/input';
import type { InputProps } from '@components/controls/input';

import {
  textFieldDescriptionClass,
  textFieldErrorClass,
  textFieldLabelClass,
  textFieldRootClass,
} from './text-field.styles';

type Validation = unknown; // keep simple; you can swap to @react-types/shared ValidationResult if you want

export type TextFieldProps = Omit<AriaTextFieldProps, 'children' | 'className'> & {
  label: ReactNode;
  description?: ReactNode;
  fieldError?: ReactNode | ((validation: Validation) => ReactNode);
  inputProps?: InputProps;
};

export function TextField({
  label,
  description,
  fieldError,
  inputProps,
  ...props
}: TextFieldProps) {
  const isInvalid = props.isInvalid ?? Boolean(fieldError);
  return (
    <AriaTextField {...props} className={textFieldRootClass()} isInvalid={isInvalid}>
      <Label className={textFieldLabelClass()}>{label}</Label>
      <Input {...inputProps} />
      {description ? (
        <Text slot="description" className={textFieldDescriptionClass()}>
          {description}
        </Text>
      ) : null}
      <FieldError className={textFieldErrorClass()}>{fieldError}</FieldError>
    </AriaTextField>
  );
}
