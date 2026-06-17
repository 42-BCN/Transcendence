'use client';

import type { Ref } from 'react';
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
  inputRef?: Ref<HTMLInputElement>;
};

export function TextField({
  labelKey,
  descriptionKey,
  errorKey,
  inputProps,
  inputRef,
  ...props
}: TextFieldProps) {
  const isInvalid = props.isInvalid ?? Boolean(errorKey);
  const stableId =
    props.id
    ?? (typeof props.name === 'string' ? props.name : undefined)
    ?? labelKey.replace(/[^a-zA-Z0-9_-]+/g, '-');
  const labelId = `${stableId}-label`;
  const descriptionId = descriptionKey ? `${stableId}-description` : undefined;
  const errorId = errorKey ? `${stableId}-error` : undefined;
  const describedBy = [descriptionId, errorId].filter(Boolean).join(' ') || undefined;
  const t = useTranslations();
  return (
    <AriaTextField
      {...props}
      id={stableId}
      className={textFieldStyles.root()}
      isInvalid={isInvalid}
    >
      <Label id={labelId} className={textFieldStyles.label()}>{t(labelKey)}</Label>
      <Input
        {...inputProps}
        ref={inputRef}
        id={stableId}
        aria-labelledby={labelId}
        aria-describedby={describedBy}
        aria-invalid={isInvalid || undefined}
      />
      {descriptionKey && (
        <Text id={descriptionId} slot="description" className={textFieldStyles.description()}>
          {t(descriptionKey)}
        </Text>
      )}
      {errorKey && (
        <FieldError id={errorId} className={textFieldStyles.error()}>
          {t(errorKey)}
        </FieldError>
      )}
    </AriaTextField>
  );
}
