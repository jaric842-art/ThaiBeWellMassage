import { createExpressMiddleware } from "@trpc/server/adapters/express";
import express from "express";
import type { Plugin } from "vite";
import { createServer } from "vite";
import { appRouter } from "../routers";
import { createContext } from "./context";

const trpcApi: Plugin = {
  name: "be-well-trpc-api",
  configureServer(server) {
    const apiApp = express();
    apiApp.use(express.json());
    apiApp.use(
      "/api/trpc",
      createExpressMiddleware({
        router: appRouter,
        createContext,
      }),
    );
    server.middlewares.use(
      apiApp as unknown as (
        request: import("node:http").IncomingMessage,
        response: import("node:http").ServerResponse,
        next: (error?: unknown) => void,
      ) => void,
    );
    server.middlewares.use((request, response, next) => {
      const pathname = new URL(request.url ?? "/", "http://localhost").pathname;
      const isDocumentRequest = request.method === "GET" || request.method === "HEAD";
      const filename = pathname.slice(pathname.lastIndexOf("/") + 1);
      const hasFileExtension = /\.[a-zA-Z0-9]{1,10}$/.test(filename);
      const isViteInternal =
        pathname.startsWith("/@") ||
        pathname.startsWith("/src/") ||
        pathname.startsWith("/node_modules/") ||
        pathname.startsWith("/__");
      const isApiRequest = pathname === "/api" || pathname.startsWith("/api/");

      const isUnknownPage =
        isDocumentRequest && pathname !== "/" && !hasFileExtension && !isViteInternal && !isApiRequest;

      if (isUnknownPage) {
        const originalWriteHead = response.writeHead.bind(response);
        response.writeHead = ((...args: Parameters<typeof response.writeHead>) => {
          if (args[0] === 200) args[0] = 404;
          return originalWriteHead(...args);
        }) as typeof response.writeHead;

        const originalEnd = response.end.bind(response);
        response.end = ((...args: Parameters<typeof response.end>) => {
          if (response.statusCode === 200) response.statusCode = 404;
          return originalEnd(...args);
        }) as typeof response.end;
      }

      next();
    });
  },
};

async function startPreview() {
  const host = "127.0.0.1";
  const port = Number(process.env.PORT ?? "5173");
  if (!Number.isInteger(port) || port < 1024 || port > 65535) {
    throw new Error(`Invalid Preview port: ${process.env.PORT ?? ""}`);
  }

  console.info(`Preparing Be Well Thai Massage Preview on ${host}:${port}...`);
  const vite = await createServer({
    server: {
      host,
      port,
      strictPort: true,
    },
    plugins: [trpcApi],
  });

  console.info("Vite is ready; opening the Preview listener...");
  await vite.listen();
  console.info(`Be Well Thai Massage Preview ready at http://${host}:${port}`);
  process.once("SIGINT", () => void vite.close());
  process.once("SIGTERM", () => void vite.close());
}

void startPreview().catch((error: unknown) => {
  console.error("Be Well Thai Massage Preview failed to start:", error);
  process.exitCode = 1;
});
