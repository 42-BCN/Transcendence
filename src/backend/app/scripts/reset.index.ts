import { reset as resetUser } from "./user/reset";

resetUser().catch((err) => {
  console.error("Database Reset failed: ", err);
});
