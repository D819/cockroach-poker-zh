import httpServer from "./server";

const PORT = process.env.SERVER_PORT ?? 4000;

httpServer.listen(PORT, undefined, () => {
  console.log(`Server listening on port ${PORT}`);
});
