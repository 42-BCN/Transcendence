import app from "./app";

const PORT = Number(process.env.PORT ?? 4000);

async function start() {
  await new Promise<void>((resolve, reject) => {
    const server = app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      resolve();
    });
    server.on("error", reject);
  });
}

start().catch((err) => {
  console.error("Startup failed:", err);
  //   process.exit(1);
});
