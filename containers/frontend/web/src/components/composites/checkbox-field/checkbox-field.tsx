'use client';

import { Checkbox, type CheckboxProps } from '@components/controls/checkbox/checkbox';
import { useTranslations } from 'next-intl';
import { checkboxStyles } from '@components/controls/checkbox/checkbox.styles';
import { InternalLink } from '@components/controls/link/link';

type I18nKey = string;

export type CheckboxFieldProps = CheckboxProps & {
  labelKey: I18nKey;
  errorKey?: I18nKey;
};

export function CheckboxField({ labelKey, errorKey, children, ...props }: CheckboxFieldProps) {
  const t = useTranslations();
  const isInvalid = props.isInvalid ?? Boolean(errorKey);

  return (
    <div className="flex flex-col gap-1.5">
      <Checkbox {...props} isInvalid={isInvalid}>
        {t.rich(labelKey, {
          link: (chunks) => <InternalLink href="/privacy">{chunks}</InternalLink>,
        })}
        {children}
      </Checkbox>
      {errorKey && <span className={checkboxStyles.error()}>{t(errorKey)}</span>}
    </div>
  );
}
