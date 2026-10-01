import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root = fileURLToPath(new URL('../out/', import.meta.url));
const port = Number(process.env.PORT || 3000);
const mime = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript',
  '.mjs': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.geojson': 'application/geo+json',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
  '.txt': 'text/plain',
  '.png': 'image/png',
};
if (!fs.existsSync(root)) throw new Error('Build the application first with npm run build.');
http
  .createServer((req, res) => {
    let pathname;
    try {
      pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    } catch {
      res.writeHead(400).end();
      return;
    }
    let file = path.resolve(root, '.' + pathname);
    if (!file.startsWith(path.resolve(root) + path.sep) && file !== path.resolve(root)) {
      res.writeHead(403).end();
      return;
    }
    try {
      if (fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');
    } catch {
      file = path.join(root, '404.html');
      res.statusCode = 404;
    }
    const stream = fs.createReadStream(file);
    stream.on('error', () => res.writeHead(404).end('Not found'));
    res.setHeader('Content-Type', mime[path.extname(file)] || 'application/octet-stream');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    stream.pipe(res);
  })
  .listen(port, '127.0.0.1', () =>
    console.log(`TerraCascade production preview: http://127.0.0.1:${port}`),
  );
