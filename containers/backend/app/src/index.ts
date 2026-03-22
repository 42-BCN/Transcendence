import app from "./app";

const PORT = Number(process.env.PORT ?? 4000);

async function start() {
  await app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

start().catch((err) => {
  console.error("Startup failed:", err);
  //   process.exit(1);
});
