'use client';

import {
  type CheckboxProps as AriaCheckboxProps,
  CheckboxGroup,
  FieldError,
} from 'react-aria-components';
import { useTranslations } from 'next-intl';
import { InternalLink } from '@components/controls/link';
import { checkboxFieldStyles } from './checkbox-field.styles';

import type { ClassValue } from 'clsx';
import { Checkbox } from '@components/controls/checkbox';

type I18nKey = string;

export type CheckboxFieldProps = Omit<AriaCheckboxProps, 'className' | 'children'> & {
  labelKey: I18nKey;
  errorKey?: I18nKey;
  linkHref?: string;
  className?: ClassValue;
};

export function CheckboxField({
  labelKey,
  errorKey,
  linkHref,
  className,
  ...props
}: CheckboxFieldProps) {
  const t = useTranslations();
  const isInvalid = props.isInvalid ?? Boolean(errorKey);

  return (
    <CheckboxGroup isInvalid={isInvalid} className={checkboxFieldStyles.root(className)}>
      <Checkbox {...props}>
        {linkHref
          ? t.rich(labelKey, {
              link: (chunks) => <InternalLink href={linkHref}>{chunks}</InternalLink>,
            })
          : t(labelKey)}
      </Checkbox>
      {errorKey && <FieldError className={checkboxFieldStyles.error()}>{t(errorKey)}</FieldError>}
    </CheckboxGroup>
  );
}
