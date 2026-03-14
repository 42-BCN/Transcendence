import app from "./app";

const PORT = Number(process.env.PORT ?? 4000);

function start() {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

start();
