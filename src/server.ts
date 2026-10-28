import { createServer } from 'node:http';
import { readFile, realpath, stat } from 'node:fs/promises';
import { resolve, relative, sep, extname, isAbsolute } from 'node:path';

const MIME_TYPES: Record<string, string> = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon'
};

function isWithin(root: string, filePath: string): boolean {
  const rel = relative(root, filePath);

  return (
    rel === '' ||
    (
      rel !== '..' &&
      !rel.startsWith(`..${sep}`) &&
      !isAbsolute(rel)
    )
  );
}

export async function startServer(root: string, port = 4178): Promise<void> {
  const projectRoot = await realpath(root);

  const server = createServer(async (req, res) => {
    try {
      if (req.method !== 'GET' && req.method !== 'HEAD') {
        res.writeHead(405);
        res.end('Method Not Allowed');
        return;
      }

      const pathname = new URL(req.url ?? '/', 'http://localhost').pathname;
      const decoded = decodeURIComponent(pathname);
      const filename = decoded.endsWith('/')
        ? `${decoded}index.html`
        : decoded;

      const filePath = resolve(projectRoot, `.${filename}`);

      if (!isWithin(projectRoot, filePath)) {
        res.writeHead(403);
        res.end('Forbidden');
        return;
      }

      const actualPath = await realpath(filePath);

      if (!isWithin(projectRoot, actualPath)) {
        res.writeHead(403);
        res.end('Forbidden');
        return;
      }

      const info = await stat(actualPath);

      if (!info.isFile()) {
        res.writeHead(404);
        res.end('Not Found');
        return;
      }

      const content = await readFile(actualPath);
      const contentType =
        MIME_TYPES[extname(actualPath)] ??
        'application/octet-stream';

      res.writeHead(200, {
        'Content-Type': contentType,
        'Cache-Control': 'no-cache'
      });

      res.end(req.method === 'HEAD' ? undefined : content);

    } catch (error) {
      const err = error as NodeJS.ErrnoException;

      const status =
        err.code === 'ENOENT' || err.code === 'ENOTDIR'
          ? 404
          : err instanceof URIError
            ? 400
            : 500;

      res.writeHead(status);

      res.end(
        status === 404
          ? 'Not Found'
          : status === 400
            ? 'Bad Request'
            : 'Internal Server Error'
      );
    }
  });

  server.on('error', (err) => {
    console.error('NgBuild server error:', err.message);
  });

  server.listen(port, '127.0.0.1', () => {
    console.log(`
  NgBuild v0.1.0

  Local: http://localhost:${port}/
  Root:  ${projectRoot}

  Press Ctrl+C to stop.
`);
  });
}