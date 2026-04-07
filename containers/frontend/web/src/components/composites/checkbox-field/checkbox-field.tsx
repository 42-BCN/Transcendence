'use client';

import { Checkbox, type CheckboxProps } from '@components/controls/checkbox/checkbox';
import { useTranslations } from 'next-intl';
import { InternalLink } from '@components/controls/link/link';
import { checkboxFieldStyles } from './checkbox-field.styles';

import type { ClassValue } from 'clsx';

type I18nKey = string;

export type CheckboxFieldProps = Omit<CheckboxProps, 'className'> & {
  labelKey: I18nKey;
  errorKey?: I18nKey;
  className?: ClassValue;
};

export function CheckboxField({
  labelKey,
  errorKey,
  children,
  className,
  ...props
}: CheckboxFieldProps) {
  const t = useTranslations();
  const isInvalid = props.isInvalid ?? Boolean(errorKey);

  return (
    <div className={checkboxFieldStyles.root(className)}>
      <Checkbox {...props} isInvalid={isInvalid}>
        {t.rich(labelKey, {
          link: (chunks) => <InternalLink href="/privacy">{chunks}</InternalLink>,
        })}
        {children}
      </Checkbox>
      {errorKey && <span className={checkboxFieldStyles.error()}>{t(errorKey)}</span>}
    </div>
  );
}
