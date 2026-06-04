import { faker } from '@faker-js/faker';
import { usernameSchema } from '@contracts/auth/auth.validation';

export function generateUsername(): string {
  const MAX_RETRIES = 10;

  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    const adjective = faker.word.adjective();
    const noun = faker.word.noun();
    const number = faker.number.int({ min: 10, max: 99 });

    // Combine components and remove any non-alphanumeric characters (like hyphens or spaces)
    const raw = `${adjective}${noun}${number}`.replace(/[^a-zA-Z0-9]/g, '');

    // Max length is 15
    const username = raw.slice(0, 15).toLowerCase();

    // Verify it actually passes the strict contract rules
    if (usernameSchema.safeParse(username).success) {
      return username;
    }
  }

  // Fallback if all attempts fail
  const randomSuffix = Math.floor(10000000 + Math.random() * 90000000);
  return `user${randomSuffix}`;
}
