import { bootstrapUsers } from "./users.bootstrap";
import { seed } from "./users.seed";

export async function bootstrap(): Promise<void> {
  await bootstrapUsers();
  await seed();
}
