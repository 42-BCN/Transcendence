import { bootstrapUsers } from "./users/users.bootstrap";
import {seed} from "./users/users.seed"

export async function bootstrap(): Promise<void> {
  await bootstrapUsers();
  await seed();
}
