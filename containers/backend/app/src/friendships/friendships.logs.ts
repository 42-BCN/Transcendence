const logFriendshipEvent = (
  level: 'info' | 'warn' | 'error',
  event: string,
  details: Record<string, unknown>,
): void => {
  const payload = {
    area: 'friendships',
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

const info = (details: Record<string, unknown>): void => logFriendshipEvent('info', 'info', details);
const warn = (details: Record<string, unknown>): void => logFriendshipEvent('warn', 'warn', details);
const error = (details: Record<string, unknown>): void =>
  logFriendshipEvent('error', 'error', details);

export const logEvents = {
  info,
  warn,
  error,
};
