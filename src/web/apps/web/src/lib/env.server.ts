import 'server-only';

function required(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing server env var: ${name}`);
  return value;
}

export const envServer = {
  apiBaseUrl: required('API_BASE_URL'),
  nodeEnv: required('NODE_ENV'),
} as const;
