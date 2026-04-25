'use client';

import React, { type Ref } from 'react';
import { cn } from '@/lib/styles/cn';
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
  icon?: React.ReactNode;
};

export function TextField({
  labelKey,
  descriptionKey,
  errorKey,
  inputProps,
  inputRef,
  icon,
  ...props
}: TextFieldProps) {
  const isInvalid = props.isInvalid ?? Boolean(errorKey);
  const stableId = props.id ?? (typeof props.name === 'string' ? props.name : undefined);
  const t = useTranslations();
  return (
    <AriaTextField
      {...props}
      id={stableId}
      className={textFieldStyles.root()}
      isInvalid={isInvalid}
    >
      <Label className={textFieldStyles.label()}>{t(labelKey)}</Label>
      <div className="relative flex items-center">
        {icon && (
          <div className="pointer-events-none absolute left-2 text-text-disabled">{icon}</div>
        )}
        <Input
          {...inputProps}
          ref={inputRef}
          className={(props) =>
            cn(
              textFieldStyles.input({ hasIcon: Boolean(icon) }),
              typeof inputProps?.className === 'function'
                ? inputProps.className(props)
                : inputProps?.className,
            )
          }
        />
      </div>
      {descriptionKey && (
        <Text slot="description" className={textFieldStyles.description()}>
          {t(descriptionKey)}
        </Text>
      )}
      {errorKey && <FieldError className={textFieldStyles.error()}>{t(errorKey)}</FieldError>}
    </AriaTextField>
  );
}
