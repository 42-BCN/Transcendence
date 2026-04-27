const logSocketEvent = (
  level: 'info' | 'warn' | 'error',
  event: string,
  details: Record<string, unknown>,
): void => {
  const payload = {
    area: 'socket',
    event,
    timestamp: new Date().toISOString(),
    ...details,
  };

  if (level === 'warn') {
    console.warn(payload);
    return;
  }

  if (level === 'error') {
    console.error(payload);
    return;
  }

  console.info(payload);
};

const info = (details: Record<string, unknown>): void => logSocketEvent('info', 'info', details);
const warn = (details: Record<string, unknown>): void => logSocketEvent('warn', 'warn', details);
const error = (details: Record<string, unknown>): void => logSocketEvent('error', 'error', details);

export const logEvents = {
  info,
  warn,
  error,
};
