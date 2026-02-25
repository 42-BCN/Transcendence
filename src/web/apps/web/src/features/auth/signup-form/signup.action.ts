'use server';

// import { cookies } from 'next/headers';
import { fetchServer } from '@/lib/http/fetcher.server';

export async function signupAction(formData: FormData) {
  const email = String(formData.get('email') ?? '');
  const password = String(formData.get('password') ?? '');

  const res = await fetchServer<{ ok: true }>('/auth/signup', 'POST', {
    email,
    password,
  });

  console.log(res);
  //   const setCookie = headers.get('set-cookie');
  //   if (setCookie) {
  //     const [cookiePair] = setCookie.split(';');
  //     const [name, ...rest] = cookiePair.split('=');
  //     cookies().set(name, rest.join('='));
  //   }
}
