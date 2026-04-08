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
  textAreaProps?: Omit<
    TextAreaProps,
    'value' | 'defaultValue' | 'onChange' | 'maxLength' | 'className'
  >;
  value: string;
  className?: string;
};

export function TextAreaField(props: TextAreaFieldProps) {
  const {
    'aria-label': ariaLabel,
    errorKey,
    onChange,
    textAreaProps,
    className,
    value,
    maxLength,
    ...textFieldProps
  } = props;

  const t = useTranslations();
  const isInvalid = props.isInvalid ?? Boolean(errorKey);
  const stableId =
    textFieldProps.id ??
    (typeof textFieldProps.name === 'string' ? textFieldProps.name : undefined);

  return (
    <AriaTextField
      {...textFieldProps}
      id={stableId}
      aria-label={ariaLabel}
      value={value}
      onChange={onChange}
      maxLength={maxLength}
      isInvalid={isInvalid}
      className={textAreaFieldStyles.root}
    >
      <TextArea {...textAreaProps} className={textAreaFieldStyles.input(className)} />

      {maxLength !== undefined && (
        <Text
          slot="description"
          className={textAreaFieldStyles.counter}
          aria-live="polite"
          aria-label={t('components.textAreaField.characterCount', {
            current: value.length,
            max: maxLength,
          })}
        >
          {`${value.length}/${maxLength}`}
        </Text>
      )}

      {errorKey && <FieldError className={textAreaFieldStyles.error}>{t(errorKey)}</FieldError>}
    </AriaTextField>
  );
}
