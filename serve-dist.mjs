import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join, normalize } from "node:path";

const root = join(process.cwd(), "dist");
const port = Number(process.env.PORT || 4173);
const types = {
  ".html": "text/html",
  ".js": "text/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".svg": "image/svg+xml",
};

createServer(async (request, response) => {
  try {
    const urlPath = decodeURIComponent(request.url?.split("?")[0] || "/");
    const cleanPath = normalize(urlPath).replace(/^(\.\.[/\\])+/, "");
    const filePath = join(root, cleanPath === "/" ? "index.html" : cleanPath);
    const data = await readFile(filePath);
    response.writeHead(200, { "Content-Type": types[extname(filePath)] || "application/octet-stream" });
    response.end(data);
  } catch {
    const data = await readFile(join(root, "index.html"));
    response.writeHead(200, { "Content-Type": "text/html" });
    response.end(data);
  }
}).listen(port, "127.0.0.1", () => {
  console.log(`Serving dist on http://127.0.0.1:${port}`);
});
