import { bootstrap } from "./bootstrap.ts";

bootstrap().catch((err) => {
  console.error("Bootstrap Database failed:", err);
  //   process.exit(1);
});
