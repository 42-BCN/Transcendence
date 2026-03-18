'use client';

import { AlertTriangle } from 'lucide-react';
import { Meter as AriaMeter, type MeterProps as AriaMeterProps } from 'react-aria-components';
import { Label } from 'react-aria-components';
import { meterStyles } from './meter.styles';

export interface MeterProps extends AriaMeterProps {
  label?: string;
  className: string;
}

export function Meter({ label, ...props }: MeterProps) {
  return (
    <AriaMeter {...props} className={meterStyles.main(props.className)}>
      {({ percentage, valueText }) => (
        <>
          <div className={meterStyles.header}>
            <Label className={meterStyles.label}>{label}</Label>
            <span className={meterStyles.progressText(percentage)}>
              {percentage >= 80 && (
                <AlertTriangle aria-label="Alert" className={meterStyles.triangle} />
              )}
              {` ${valueText}`}
            </span>
          </div>
          <div className={meterStyles.bar}>
            <div
              className={meterStyles.barPercent(percentage)}
              // eslint-disable-next-line no-restricted-syntax
              style={{ width: `${percentage}%` }}
            />
          </div>
        </>
      )}
    </AriaMeter>
  );
}
