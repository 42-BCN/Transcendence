'use client';

import { useState } from 'react';
import { FieldError, TextField as AriaTextField } from 'react-aria-components';
import type { TextFieldProps as AriaTextFieldProps } from 'react-aria-components';

import { TextArea } from '@components/controls/text-area';
import type { TextAreaProps } from '@components/controls/text-area';

import { textAreaFieldStyles } from './text-area-field.styles';
import { useTranslations } from 'next-intl';

type I18nKey = string;

export type TextAreaFieldProps = Omit<AriaTextFieldProps, 'children' | 'className'> & {
  textAreaProps?: Omit<TextAreaProps, 'value' | 'defaultValue' | 'onChange' | 'maxLength'>;
  errorKey?: I18nKey;
  value?: string;
  defaultValue?: string;
  ariaLabel: string;
  onChange?: (value: string) => void;
};

export function TextAreaField(props: TextAreaFieldProps) {
  const {
    errorKey,
    value,
    defaultValue = '',
    onChange,
    textAreaProps,
    labelKey,
    ariaLabel
    ...textFieldProps
  } = props;
  const t = useTranslations();

  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = useState(defaultValue);
  const isInvalid = props.isInvalid ?? Boolean(errorKey);

  const currentValue = isControlled ? value : internalValue;

  const handleChange = (nextValue: string) => {
    if (!isControlled) setInternalValue(nextValue);
    onChange?.(nextValue);
  };

  return (
    <AriaTextField
      {...textFieldProps}
      value={currentValue}
      onChange={handleChange}
      className={textAreaFieldStyles.root()}
      isInvalid={isInvalid}
      ariaLabel={ariaLabel}
    >
      <TextArea {...textAreaProps} />

      {maxLength !== undefined && (
        <div className={textAreaFieldStyles.counter()}>
          {currentValue.length}/{maxLength}
        </div>
      )}

      {errorKey && <FieldError className={textAreaFieldStyles.error()}>{t(errorKey)}</FieldError>}
    </AriaTextField>
  );
}
