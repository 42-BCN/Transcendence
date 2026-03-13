'use client';

import { FieldError, TextField as AriaTextField } from 'react-aria-components';
import type { TextFieldProps as AriaTextFieldProps } from 'react-aria-components';

import { TextArea } from '@components/controls/text-area';
import type { TextAreaProps } from '@components/controls/text-area';

import { textAreaFieldStyles } from './text-area-field.styles';
import { useTranslations } from 'next-intl';

type I18nKey = string;

export type TextAreaFieldProps = Omit<AriaTextFieldProps, 'children' | 'classname'> &
  TextAreaProps & { errorKey?: I18nKey };

export function TextAreaField(props: TextAreaFieldProps) {
  const { errorKey } = props;
  const t = useTranslations();
  return (
    <AriaTextField {...props} className={textAreaFieldStyles.root()}>
      <TextArea />
      {errorKey && <FieldError className={textAreaFieldStyles.error()}>{t(errorKey)}</FieldError>}
    </AriaTextField>
  );
}
