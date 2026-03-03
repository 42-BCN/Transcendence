'use client';
export async function logoutAction() {await fetch('/api/auth/logout', {
  method: 'POST',
  credentials: 'include',
});}
