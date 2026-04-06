'use client';

import { FormEvent, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';

import { InternalLink, Stack, Text } from '@components';

type ResetState = 'idle' | 'submitting' | 'success' | 'error';

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const token = useMemo(() => searchParams.get('token')?.trim() ?? '', [searchParams]);

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [state, setState] = useState<ResetState>('idle');
  const [message, setMessage] = useState('');

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!token) {
      setState('error');
      setMessage('Reset token is missing.');
      return;
    }

    if (password.length < 8) {
      setState('error');
      setMessage('Password must be at least 8 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setState('error');
      setMessage('Passwords do not match.');
      return;
    }

    setState('submitting');
    setMessage('Updating password...');

    const res = await fetch('/api/auth/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, password }),
    });

    if (res.ok) {
      setState('success');
      setMessage('Password updated successfully.');
      return;
    }

    setState('error');
    setMessage('Reset link is invalid or expired.');
  }

  return (
    <main className="mx-auto max-w-[520px] p-6">
      <Stack>
        <Text as="h1" variant="heading-md">
          Reset password
        </Text>
        <Text as="p" variant="body-sm">
          Enter your new password.
        </Text>
        <form className="flex flex-col gap-3" onSubmit={onSubmit}>
          <label className="flex flex-col gap-1">
            <Text as="span" variant="caption">
              New password
            </Text>
            <input
              className="rounded-md border border-border-primary px-3 py-2"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
              required
            />
          </label>
          <label className="flex flex-col gap-1">
            <Text as="span" variant="caption">
              Confirm password
            </Text>
            <input
              className="rounded-md border border-border-primary px-3 py-2"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              autoComplete="new-password"
              required
            />
          </label>
          <button
            className="mt-2 rounded-md bg-foreground px-4 py-2 text-background disabled:opacity-60"
            disabled={state === 'submitting'}
            type="submit"
          >
            {state === 'submitting' ? 'Saving...' : 'Save new password'}
          </button>
        </form>
        {message && (
          <Text as="p" variant="body-sm">
            {message}
          </Text>
        )}
        <InternalLink href="/login" as="link">
          Back to login
        </InternalLink>
      </Stack>
    </main>
  );
}
