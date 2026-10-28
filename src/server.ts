import { createServer, type ServerResponse } from 'node:http';
import { readFile, realpath, stat, watch } from 'node:fs/promises';
import { resolve, relative, sep, extname, isAbsolute } from 'node:path';
import { build, type Loader } from 'esbuild';

const VERSION = '0.4.0';

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

const TRANSFORM_LOADERS: Record<string, Loader> = {
  '.ts': 'ts',
  '.tsx': 'tsx',
  '.jsx': 'jsx'
};

const HMR_CLIENT = `
<script type="module">
  const events = new EventSource('/__ngbuild/events');

  events.addEventListener('css-update', (event) => {
    const changedFile = event.data.replaceAll('\\\\', '/');

    const stylesheets = document.querySelectorAll(
      'link[rel="stylesheet"]'
    );

    for (const link of stylesheets) {
      const url = new URL(link.href);

      if (
        url.pathname === '/' + changedFile ||
        url.pathname.endsWith('/' + changedFile)
      ) {
        url.searchParams.set('ngbuild', Date.now().toString());
        link.href = url.toString();

        console.info('[NgBuild] CSS updated:', changedFile);
      }
    }
  });

  events.addEventListener('reload', () => {
    console.info('[NgBuild] Reloading...');
    window.location.reload();
  });

  events.addEventListener('open', () => {
    console.info('[NgBuild] HMR connected');
  });
</script>
`;

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

function injectClient(html: string): string {
  if (html.includes('</body>')) {
    return html.replace('</body>', `${HMR_CLIENT}</body>`);
  }

  return html + HMR_CLIENT;
}

async function transformModule(
  filePath: string,
  projectRoot: string
): Promise<string> {
  const result = await build({
    entryPoints: [filePath],
    absWorkingDir: projectRoot,
    outdir: 'out',
    bundle: true,
    write: false,
    platform: 'browser',
    format: 'esm',
    target: 'es2022',
    jsx: 'automatic',
    sourcemap: 'inline',
    logLevel: 'silent',
    loader: {
      '.ts': 'ts',
      '.tsx': 'tsx',
      '.jsx': 'jsx',
      '.js': 'js'
    }
  });

  const output = result.outputFiles?.find(
    file => file.path.endsWith('.js')
  );

  if (!output) {
    throw new Error('NgBuild: JavaScript output not found.');
  }

  return output.text;
}

export async function startServer(
  root: string,
  port = 4178
): Promise<void> {
  const projectRoot = await realpath(root);
  const clients = new Set<ServerResponse>();

  function broadcastReload(): void {
    for (const client of clients) {
      client.write('event: reload\ndata: update\n\n');
    }
  }

  function broadcastCssUpdate(filename: string): void {
    const normalized = filename.replace(/\\/g, '/');

    for (const client of clients) {
      client.write(`event: css-update\ndata: ${normalized}\n\n`);
    }
  }

  const server = createServer(async (req, res) => {
    try {
      if (req.method !== 'GET' && req.method !== 'HEAD') {
        res.writeHead(405);
        res.end('Method Not Allowed');
        return;
      }

      const pathname = new URL(
        req.url ?? '/',
        'http://localhost'
      ).pathname;

      if (pathname === '/__ngbuild/events') {
        res.writeHead(200, {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache, no-transform',
          'Connection': 'keep-alive'
        });

        if (req.method === 'HEAD') {
          res.end();
          return;
        }

        res.write(': connected\n\n');
        clients.add(res);

        res.on('close', () => {
          clients.delete(res);
        });

        return;
      }

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

      const extension = extname(actualPath).toLowerCase();

      let content: string | Buffer;
      let contentType: string;

      if (TRANSFORM_LOADERS[extension]) {
        content = await transformModule(actualPath, projectRoot);
        contentType = 'text/javascript; charset=utf-8';

        console.log(
          `[NgBuild] Transformed: ${relative(projectRoot, actualPath)}`
        );
      } else {
        content = await readFile(actualPath);

        contentType =
          MIME_TYPES[extension] ??
          'application/octet-stream';

        if (extension === '.html') {
          content = injectClient(content.toString('utf-8'));
        }
      }

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

      console.error('[NgBuild] Request error:', err.message);

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
  NgBuild v${VERSION}

  Local: http://localhost:${port}/
  Root:  ${projectRoot}

  File Watcher: Active
  Auto Reload:  Active
  CSS Hot Update: Enabled
  ES Modules:   Native
  TypeScript:   Enabled
  JSX / TSX:    Enabled
  React:        Supported

  Press Ctrl+C to stop.
`);
  });

  const heartbeat = setInterval(() => {
    for (const client of clients) {
      client.write(': heartbeat\n\n');
    }
  }, 15000);

  server.on('close', () => {
    clearInterval(heartbeat);

    for (const client of clients) {
      client.end();
    }

    clients.clear();
  });

  async function startWatcher(): Promise<void> {
    try {
      const watcher = watch(projectRoot, {
        recursive: true
      });

      server.on('close', () => {
        void watcher.return?.();
      });

      for await (const event of watcher) {
        const filename = event.filename?.toString() ?? '';

        const segments = filename.split(/[\\/]/);

        if (
          segments.includes('node_modules') ||
          segments.includes('.git')
        ) {
          continue;
        }

        console.log(
          `[NgBuild] File changed: ${filename || 'unknown'}`
        );

        if (filename && extname(filename).toLowerCase() === '.css') {
          broadcastCssUpdate(filename);
        } else {
          broadcastReload();
        }
      }

    } catch (error) {
      const err = error as Error;
      console.error('[NgBuild] Watcher error:', err.message);
    }
  }

  void startWatcher();
}