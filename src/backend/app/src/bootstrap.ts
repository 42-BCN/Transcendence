import { bootstrapUsers } from "./users/users.bootstrap";

export async function bootstrap(): Promise<void> {
  await bootstrapUsers();
}
