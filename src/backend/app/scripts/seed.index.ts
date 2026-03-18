import { seed as seedUser } from "./user/seed";

seedUser().catch((err) => {
  console.error("Database Seed failed: ", err);
});
