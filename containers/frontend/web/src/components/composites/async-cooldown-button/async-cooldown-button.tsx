'use client';

import { useEffect, useState } from 'react';

import { Button } from '@components';
import { useCooldown } from '@/hooks';

type AsyncCooldownButtonProps = {
  onPress: () => void | Promise<void>;
  cooldownSeconds?: number;
  startOnMount?: boolean;
  idleLabel: string;
  pendingLabel: string;
  formatCooldownLabel?: (remaining: number) => string;
};

export function AsyncCooldownButton({
  onPress,
  cooldownSeconds = 30,
  startOnMount = false,
  idleLabel,
  pendingLabel,
  formatCooldownLabel,
}: AsyncCooldownButtonProps) {
  const [isPending, setIsPending] = useState(false);
  const { remaining, isCoolingDown, startCooldown } = useCooldown({
    duration: cooldownSeconds,
  });

  useEffect(() => {
    if (!startOnMount) return;
    startCooldown();
  }, [startOnMount, startCooldown]);

  const disabled = isPending || isCoolingDown;

  const handlePress = async () => {
    if (disabled) return;

    setIsPending(true);
    startCooldown();

    try {
      await onPress();
    } finally {
      setIsPending(false);
    }
  };

  const pending = isPending && pendingLabel;
  const coolDown =
    isCoolingDown &&
    (formatCooldownLabel ? formatCooldownLabel(remaining) : `${idleLabel} (${remaining}s)`);

  return (
    <Button onPress={handlePress} isDisabled={disabled} variant="cta">
      <span className="fancy-btn__label">{pending || coolDown || idleLabel}</span>
    </Button>
  );
}
