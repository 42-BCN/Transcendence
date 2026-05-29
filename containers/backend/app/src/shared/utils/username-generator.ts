import { faker } from '@faker-js/faker';
import { usernameSchema } from '@contracts/auth/auth.validation';

export function generateUsername(): string {
  let isValid = false;
  let username = '';

  while (!isValid) {
    const adjective = faker.word.adjective();
    const noun = faker.word.noun();
    const number = faker.number.int({ min: 10, max: 99 });

    // Combine components and remove any non-alphanumeric characters (like hyphens or spaces)
    const raw = `${adjective}${noun}${number}`.replace(/[^a-zA-Z0-9]/g, '');

    // Max length is 15
    username = raw.slice(0, 15).toLowerCase();

    // Verify it actually passes the strict contract rules
    if (usernameSchema.safeParse(username).success) {
      isValid = true;
    }
  }

  return username;
}
