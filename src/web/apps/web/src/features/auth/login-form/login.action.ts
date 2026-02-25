'use server';

// import { cookies } from 'next/headers';
import { fetchServer } from '@/lib/http/fetcher.server';

export async function loginAction(formData: FormData) {
  const identifier = String(formData.get('identifier') ?? '');
  const password = String(formData.get('password') ?? '');

  const res = await fetchServer('/auth/login', 'POST', {
    identifier,
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
