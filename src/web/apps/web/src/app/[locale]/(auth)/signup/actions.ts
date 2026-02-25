'use server';

export async function signupAction(formData: FormData) {
  const data = Object.fromEntries(formData.entries());

  await new Promise((resolve) => setTimeout(resolve, 500));
}
