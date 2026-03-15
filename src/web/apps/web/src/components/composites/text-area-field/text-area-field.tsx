'use client';

import { FieldError, Text, TextField as AriaTextField } from 'react-aria-components';
import type { TextFieldProps as AriaTextFieldProps } from 'react-aria-components';
import { useTranslations } from 'next-intl';
import { TextArea, type TextAreaProps } from '@components/controls/text-area';
import { textAreaFieldStyles } from './text-area-field.styles';

type I18nKey = string;

export type TextAreaFieldProps = Omit<
  AriaTextFieldProps,
  'children' | 'className' | 'value' | 'defaultValue' | 'onChange'
> & {
  'aria-label': string;
  errorKey?: I18nKey;
  onChange: (value: string) => void;
  textAreaProps?: Omit<TextAreaProps, 'value' | 'defaultValue' | 'onChange' | 'maxLength'>;
  value: string;
};

export function TextAreaField(props: TextAreaFieldProps) {
  const {
    'aria-label': ariaLabel,
    errorKey,
    onChange,
    textAreaProps,
    value,
    maxLength,
    ...textFieldProps
  } = props;

  const t = useTranslations();
  const isInvalid = props.isInvalid ?? Boolean(errorKey);

  return (
    <AriaTextField
      {...textFieldProps}
      aria-label={ariaLabel}
      value={value}
      onChange={onChange}
      maxLength={maxLength}
      isInvalid={isInvalid}
      className={textAreaFieldStyles.root()}
    >
      <TextArea {...textAreaProps} />

      {maxLength !== undefined && (
        <Text slot="description" className={textAreaFieldStyles.counter()}>
          {value.length}/{maxLength}
        </Text>
      )}

      {errorKey && <FieldError className={textAreaFieldStyles.error()}>{t(errorKey)}</FieldError>}
    </AriaTextField>
  );
}
