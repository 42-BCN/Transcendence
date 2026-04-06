import { Buffer } from 'node:buffer';

type MailAddress = {
  email: string;
  name?: string;
};

export type SendMailInput = {
  to: MailAddress | string;
  subject: string;
  text: string;
  html: string;
  from?: MailAddress | string;
};

export class MailServiceError extends Error {
  code: 'MAIL_NOT_CONFIGURED' | 'MAIL_AUTH_FAILED' | 'MAIL_SEND_FAILED';

  constructor(
    code: 'MAIL_NOT_CONFIGURED' | 'MAIL_AUTH_FAILED' | 'MAIL_SEND_FAILED',
    message: string,
  ) {
    super(message);
    this.code = code;
    Object.setPrototypeOf(this, MailServiceError.prototype);
  }
}

type GmailConfig = {
  clientId: string;
  clientSecret: string;
  refreshToken: string;
  senderEmail: string;
  senderName?: string;
};

type AccessTokenCache = {
  token: string;
  expiresAt: number;
};

let tokenCache: AccessTokenCache | null = null;

function toMailAddress(value: MailAddress | string): MailAddress {
  return typeof value === 'string' ? { email: value } : value;
}

function encodeHeaderValue(value: string): string {
  return value.replace(/\r/g, '').replace(/\n/g, ' ').trim();
}

function formatAddress(address: MailAddress): string {
  const email = encodeHeaderValue(address.email);
  const name = address.name?.trim();
  return name ? `${encodeHeaderValue(name)} <${email}>` : email;
}

function toBase64Url(value: string): string {
  return Buffer.from(value, 'utf8')
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/g, '');
}

function resolveGmailConfig(): GmailConfig {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const refreshToken = process.env.GMAIL_REFRESH_TOKEN;
  const senderEmail = process.env.GMAIL_SENDER_EMAIL;
  const senderName = process.env.GMAIL_SENDER_NAME;

  if (!clientId || !clientSecret || !refreshToken || !senderEmail) {
    throw new MailServiceError('MAIL_NOT_CONFIGURED', 'Gmail mail service is not fully configured');
  }

  return {
    clientId,
    clientSecret,
    refreshToken,
    senderEmail,
    senderName,
  };
}

export function isMailServiceConfigured(): boolean {
  return Boolean(
    process.env.GOOGLE_CLIENT_ID &&
    process.env.GOOGLE_CLIENT_SECRET &&
    process.env.GMAIL_REFRESH_TOKEN &&
    process.env.GMAIL_SENDER_EMAIL,
  );
}

async function fetchAccessToken(config: GmailConfig): Promise<string> {
  const now = Date.now();
  if (tokenCache && tokenCache.expiresAt > now + 30_000) return tokenCache.token;

  const body = new URLSearchParams({
    client_id: config.clientId,
    client_secret: config.clientSecret,
    refresh_token: config.refreshToken,
    grant_type: 'refresh_token',
  });

  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body,
  });

  if (!response.ok) {
    const raw = await response.text();
    throw new MailServiceError(
      'MAIL_AUTH_FAILED',
      `Failed to obtain Gmail access token (${response.status}): ${raw}`,
    );
  }

  const data = (await response.json()) as {
    access_token?: string;
    expires_in?: number;
  };

  if (!data.access_token || !data.expires_in) {
    throw new MailServiceError('MAIL_AUTH_FAILED', 'Gmail token response is missing access token');
  }

  tokenCache = {
    token: data.access_token,
    expiresAt: now + data.expires_in * 1000,
  };

  return data.access_token;
}

function buildMimeMessage(input: SendMailInput, config: GmailConfig): string {
  const boundary = `mail_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
  const to = toMailAddress(input.to);
  const from = input.from
    ? toMailAddress(input.from)
    : {
        email: config.senderEmail,
        name: config.senderName,
      };

  return [
    `From: ${formatAddress(from)}`,
    `To: ${formatAddress(to)}`,
    `Subject: ${encodeHeaderValue(input.subject)}`,
    'MIME-Version: 1.0',
    `Content-Type: multipart/alternative; boundary=\"${boundary}\"`,
    '',
    `--${boundary}`,
    'Content-Type: text/plain; charset="UTF-8"',
    'Content-Transfer-Encoding: 7bit',
    '',
    input.text,
    '',
    `--${boundary}`,
    'Content-Type: text/html; charset="UTF-8"',
    'Content-Transfer-Encoding: 7bit',
    '',
    input.html,
    '',
    `--${boundary}--`,
    '',
  ].join('\r\n');
}

export async function sendMail(input: SendMailInput): Promise<{ id: string }> {
  const config = resolveGmailConfig();
  const accessToken = await fetchAccessToken(config);
  const raw = toBase64Url(buildMimeMessage(input, config));

  const response = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ raw }),
  });

  if (!response.ok) {
    const rawError = await response.text();
    throw new MailServiceError(
      'MAIL_SEND_FAILED',
      `Gmail send failed (${response.status}): ${rawError}`,
    );
  }

  const data = (await response.json()) as { id?: string };
  if (!data.id) {
    throw new MailServiceError(
      'MAIL_SEND_FAILED',
      'Gmail send response did not include message id',
    );
  }
  console.log('mail sent', data);
  return { id: data.id };
}
