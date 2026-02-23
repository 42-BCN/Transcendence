'use client';

import { FieldError, Label, Text, TextField as AriaTextField } from 'react-aria-components';
import type { TextFieldProps as AriaTextFieldProps } from 'react-aria-components';

import { Input } from '@components/controls/input';
import type { InputProps } from '@components/controls/input';

import { textFieldStyles } from './text-field.styles';
import { useTranslations } from 'next-intl';

type I18nKey = string;

export type TextFieldProps = Omit<AriaTextFieldProps, 'children' | 'className'> & {
  labelKey: I18nKey;
  descriptionKey?: I18nKey;
  errorKey?: I18nKey;
  inputProps?: InputProps;
};

export function TextField({
  labelKey,
  descriptionKey,
  errorKey,
  inputProps,
  ...props
}: TextFieldProps) {
  const isInvalid = props.isInvalid ?? Boolean(errorKey);
  const t = useTranslations();
  return (
    <AriaTextField {...props} className={textFieldStyles.root()} isInvalid={isInvalid}>
      <Label className={textFieldStyles.label()}> {t(labelKey)}</Label>
      <Input {...inputProps} />
      {descriptionKey && (
        <Text slot="description" className={textFieldStyles.description()}>
          {t(descriptionKey)}
        </Text>
      )}
      {errorKey && <FieldError className={textFieldStyles.error()}>{t(errorKey)}</FieldError>}
    </AriaTextField>
  );
}
