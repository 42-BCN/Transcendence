'use server';

export async function signupAction(formData: FormData) {
  const data = Object.fromEntries(formData.entries());
  console.log('Form data:', data);

  await new Promise((resolve) => setTimeout(resolve, 500));
}
