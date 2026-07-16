import { createServer } from "node:http";
import { parse } from "node:url";
import next from "next";
import { attachSocketServer } from "./lib/socket/server";

const hostname = process.env.HOSTNAME ?? "localhost";
const port = Number(process.env.PORT ?? 3000);
const dev = process.env.NODE_ENV !== "production";

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url ?? "", true);
      await handle(req, res, parsedUrl);
    } catch (error) {
      console.error("Error handling request", error);
      res.statusCode = 500;
      res.end("internal server error");
    }
  });

  attachSocketServer(httpServer);

  httpServer.listen(port, () => {
    console.log(`> Ready on http://${hostname}:${port} (Next.js + Socket.IO)`);
  });
});
