import { bootstrap as bootstrapUser } from "./user/bootstrap";

bootstrapUser().catch((err) => {
  console.error("Database Bootstrap failed: ", err);
  process.exitCode = 1;
});
