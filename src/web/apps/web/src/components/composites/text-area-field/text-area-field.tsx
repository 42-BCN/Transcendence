'use client';

import { useState } from 'react';
import { FieldError, TextField as AriaTextField } from 'react-aria-components';
import type { TextFieldProps as AriaTextFieldProps } from 'react-aria-components';

import { TextArea } from '@components/controls/text-area';
import type { TextAreaProps } from '@components/controls/text-area';

import { textAreaFieldStyles } from './text-area-field.styles';
import { useTranslations } from 'next-intl';

type I18nKey = string;

export type TextAreaFieldProps = Omit<AriaTextFieldProps, 'children' | 'className'> &
  Omit<TextAreaProps, 'value' | 'defaultValue' | 'onChange'> & {
    errorKey?: I18nKey;
    maxLength?: number;
    value?: string;
    defaultValue?: string;
    onChange?: (value: string) => void;
  };

export function TextAreaField(props: TextAreaFieldProps) {
  const { errorKey, maxLength, value, defaultValue = '', onChange, ...rest } = props;
  const t = useTranslations();

  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = useState(defaultValue);

  const currentValue = isControlled ? value : internalValue;

  const handleChange = (nextValue: string) => {
    if (!isControlled) setInternalValue(nextValue);
    onChange?.(nextValue);
  };

  return (
    <AriaTextField
      {...rest}
      value={currentValue}
      onChange={handleChange}
      className={textAreaFieldStyles.root()}
    >
      <TextArea maxLength={maxLength} />

      {maxLength !== undefined && (
        <div className={textAreaFieldStyles.counter()}>
          {currentValue.length}/{maxLength}
        </div>
      )}

      {errorKey && <FieldError className={textAreaFieldStyles.error()}>{t(errorKey)}</FieldError>}
    </AriaTextField>
  );
}
