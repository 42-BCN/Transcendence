import { useCallback, useEffect, useMemo, useState } from 'react';

type UseCooldownOptions = {
  duration: number;
};

type UseCooldownReturn = {
  remaining: number;
  isCoolingDown: boolean;
  startCooldown: () => void;
  resetCooldown: () => void;
};

export function useCooldown({ duration }: UseCooldownOptions): UseCooldownReturn {
  const [expiresAt, setExpiresAt] = useState<number | null>(null);
  const [now, setNow] = useState(() => Date.now());

  const startCooldown = useCallback(() => {
    setExpiresAt(Date.now() + duration * 1000);
    setNow(Date.now());
  }, [duration]);

  const resetCooldown = useCallback(() => {
    setExpiresAt(null);
    setNow(Date.now());
  }, []);

  useEffect(() => {
    if (!expiresAt) return;

    const timer = window.setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => window.clearInterval(timer);
  }, [expiresAt]);

  const remaining = useMemo(() => {
    if (!expiresAt) return 0;
    return Math.max(0, Math.ceil((expiresAt - now) / 1000));
  }, [expiresAt, now]);

  useEffect(() => {
    if (expiresAt && remaining === 0) {
      setExpiresAt(null);
    }
  }, [expiresAt, remaining]);

  return {
    remaining,
    isCoolingDown: remaining > 0,
    startCooldown,
    resetCooldown,
  };
}
