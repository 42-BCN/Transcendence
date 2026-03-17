import { faker } from "@faker-js/faker";

export function generateUsername(): string {
  const adjective = faker.word.adjective();
  const color = faker.color.human();
  const noun = faker.word.noun();
  const number = faker.number.int({ min: 100, max: 999 });

  return `${adjective}-${color}-${noun}-${number}`.toLowerCase();
}
