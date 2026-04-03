export type LoginFailureReason =
  | "unknown_identifier"
  | "missing_password_hash"
  | "blocked_account"
  | "tmp_locked"
  | "invalid_password";

const logAuthEvent = (
  level: "info" | "warn",
  event: string,
  details: Record<string, unknown>,
): void => {
  const payload = {
    area: "auth",
    event,
    timestamp: new Date().toISOString(),
    ...details,
  };

  if (level === "warn") {
    console.warn(payload);
    return;
  }

  console.info(payload);
};

const loginFailure = (
  reason: LoginFailureReason,
  idHash: string,
  userId?: string,
): void =>
  logAuthEvent("warn", "login_failure", {
    reason,
    idHash,
    userId,
  });

const lockoutTriggered = (
  userId: string,
  idHash: string,
  failedAttempts: number,
  lockedUntil?: string,
): void =>
  logAuthEvent("warn", "lockout_triggered", {
    userId,
    idHash,
    failedAttempts,
    lockedUntil,
  });

const loginSuccess = (userId: string, idHash: string): void =>
  logAuthEvent("info", "login_success", {
    userId,
    idHash,
  });

const signupFailure = (reason: string, emailHash: string): void =>
  logAuthEvent("warn", "signup_failure", {
    reason,
    emailHash,
  });

const signupSuccess = (userId: string, emailHash: string): void =>
  logAuthEvent("info", "signup_success", {
    userId,
    emailHash,
  });

const signupAttempt = (emailHash: string): void =>
  logAuthEvent("info", "signup_attempt", {
    emailHash,
  });

const info = (details: Record<string, unknown>): void =>
  logAuthEvent("info", "info", details);

export const logEvents = {
  loginFailure,
  lockoutTriggered,
  loginSuccess,
  signupFailure,
  signupSuccess,
  signupAttempt,
  info,
};
