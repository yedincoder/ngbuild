import { createServer, type ServerResponse } from 'node:http';
import { readFile, realpath, stat, watch } from 'node:fs/promises';
import {
  resolve,
  relative,
  sep,
  extname,
  isAbsolute,
  dirname
} from 'node:path';
import { build, type Loader } from 'esbuild';
import { transformAsync } from '@babel/core';
import { createRequire } from 'node:module';
import { PluginManager } from './plugins/loader.js';
import { ModuleGraph } from './hmr/graph.js';
import { HMR_RUNTIME } from './hmr/runtime.js';
import { VERSION } from './version.js';

const require = createRequire(import.meta.url);

async function createReactRefreshRuntime(): Promise<string> {
  const result = await build({
    stdin: {
      contents: `import RefreshRuntime from 'react-refresh/runtime';
export default RefreshRuntime;`,
      resolveDir: dirname(require.resolve('react-refresh/package.json')),
      sourcefile: 'ngbuild-refresh-runtime.js',
      loader: 'js'
    },
    bundle: true,
    write: false,
    format: 'esm',
    platform: 'browser',
    target: 'es2022',
    logLevel: 'silent'
  });
  return result.outputFiles![0].text;
}

async function createReactVendors(): Promise<Map<string, string>> {
  const resolveDir = dirname(require.resolve('react/package.json'));
  const entries: Record<string, string> = {
'react.js': `
import React from 'react';

export default React;

export const {
  Children,
  Component,
  Fragment,
  PureComponent,
  StrictMode,
  Suspense,
  cloneElement,
  createContext,
  createElement,
  createRef,
  forwardRef,
  isValidElement,
  lazy,
  memo,
  startTransition,
  useCallback,
  useContext,
  useDebugValue,
  useDeferredValue,
  useEffect,
  useId,
  useImperativeHandle,
  useInsertionEffect,
  useLayoutEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
  useSyncExternalStore,
  useTransition
} = React;
`,
    'react-dom-client.js': `import { createRoot as originalCreateRoot } from 'react-dom/client';
export * from 'react-dom/client';
const roots = window.__ngbuild_react_roots || (window.__ngbuild_react_roots = new WeakMap());
export function createRoot(container, options) {
  let root = roots.get(container);
  if (!root) {
    root = originalCreateRoot(container, options);
    roots.set(container, root);
  }
  return root;
}`,
    'jsx-runtime.js': `
import jsxRuntime from 'react/jsx-runtime';

export const jsx = jsxRuntime.jsx;
export const jsxs = jsxRuntime.jsxs;
export const Fragment = jsxRuntime.Fragment;
`
  };

  const result = await build({
    entryPoints: Object.keys(entries).map(name => ({
      in: 'ngbuild-vendor:' + name,
      out: name.replace(/\.js$/, '')
    })),
    // Virtual source files are supplied by the plugin below.
    plugins: [{
      name: 'ngbuild-react-vendor',
      setup(buildContext) {
        buildContext.onResolve({ filter: /^ngbuild-vendor:/ }, args => ({
          path: args.path,
          namespace: 'ngbuild-vendor'
        }));
        buildContext.onLoad({ filter: /.*/, namespace: 'ngbuild-vendor' }, args => ({
          contents: entries[args.path.slice('ngbuild-vendor:'.length)],
          loader: 'js',
          resolveDir
        }));
      }
    }],
    bundle: true,
    splitting: true,
    write: false,
    format: 'esm',
    platform: 'browser',
    target: 'es2022',
    outdir: '/ngbuild-vendor',
    entryNames: '[name]',
    chunkNames: 'chunks/[name]-[hash]',
    logLevel: 'silent'
  });

  const files = new Map<string, string>();
  for (const file of result.outputFiles ?? []) {
    files.set(file.path.replace(/\\/g, '/').split('/ngbuild-vendor/')[1], file.text);
  }
  return files;
}

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
  if (html.includes('<head>')) {
    return html.replace(
      '<head>',
      `<head>${HMR_RUNTIME}`
    );
  }

  return HMR_RUNTIME + html;
}
function injectHotContext(
  code: string,
  browserPath: string,
  updateVersion?: string
): string {
  let transformed = code;

  if (updateVersion) {
    const importPattern =
      /(\b(?:import|export)\s+(?:[^'"]*?\s+from\s*)?['"])(\.[^'"]+)(['"])/g;

    transformed = transformed.replace(
      importPattern,
      (_match, prefix: string, specifier: string, suffix: string) => {
        const separator = specifier.includes('?') ? '&' : '?';

        return (
          prefix +
          specifier +
          separator +
          'ngbuild=' +
          encodeURIComponent(updateVersion) +
          suffix
        );
      }
    );
  }

  const prefix = `
import.meta.hot = window.__ngbuild_hot?.createContext(
  ${JSON.stringify(browserPath)}
);
`;

  return prefix + transformed;
}

function getDependencies(
  code: string,
  filePath: string,
  projectRoot: string
): string[] {
  const dependencies = new Set<string>();

  const pattern =
    /\b(?:import|export)\s+(?:[^'"]*?\s+from\s*)?['"]([^'"]+)['"]/g;

  for (const match of code.matchAll(pattern)) {
    const specifier = match[1];

    if (!specifier.startsWith('.')) {
      continue;
    }

    const dependency = resolve(
      dirname(filePath),
      specifier.split(/[?#]/)[0]
    );

    if (isWithin(projectRoot, dependency)) {
      dependencies.add(dependency);
    }
  }

  return [...dependencies];
}

async function transformModule(
  filePath: string,
  projectRoot: string,
  plugins: PluginManager
): Promise<string> {
  const result = await build({
    entryPoints: [filePath],
    absWorkingDir: projectRoot,
    outdir: 'out',
    bundle: true,
    external: ['react', 'react-dom/client', 'react/jsx-runtime', 'react/jsx-dev-runtime'],
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
    },
    plugins: [
      plugins.createEsbuildPlugin()
    ]
  });

  const output = result.outputFiles?.find(
    file => file.path.endsWith('.js')
  );

  if (!output) {
    throw new Error('NgBuild: JavaScript output not found.');
  }

  const extension = extname(filePath).toLowerCase();
  if (extension !== '.tsx' && extension !== '.jsx') {
    return output.text;
  }

  const refreshed = await transformAsync(output.text, {
    babelrc: false,
    configFile: false,
    filename: filePath + '.js',
    plugins: [[require.resolve('react-refresh/babel'), { skipEnvCheck: true }]]
  });

  const browserPath = '/' + relative(projectRoot, filePath).replace(/\\/g, '/');
  return `
const __ngbuildRefresh = window.__ngbuild_refresh;
window.$RefreshReg$ = (type, id) => {
  __ngbuildRefresh.register(type, ${JSON.stringify(browserPath)} + ' ' + id);
};
${refreshed?.code ?? output.text}
window.$RefreshReg$ = () => {};
`;
}

export async function startServer(
  root: string,
  port = 4178
): Promise<void> {
  const projectRoot = await realpath(root);
  const clients = new Set<ServerResponse>();
  const graph = new ModuleGraph(projectRoot);
  const refreshRuntime = await createReactRefreshRuntime();
  const reactVendors = await createReactVendors();

  const plugins = new PluginManager(
    projectRoot,
    'development'
  );

  await plugins.load();
  await plugins.buildStart();

  function broadcast(event: string, data: string): void {
    for (const client of clients) {
      client.write(`event: ${event}\ndata: ${data}\n\n`);
    }
  }

  function broadcastReload(): void {
    broadcast('reload', 'update');
  }

  function broadcastCssUpdate(filename: string): void {
    broadcast(
      'css-update',
      filename.replace(/\\/g, '/')
    );
  }

  function broadcastJsUpdate(filename: string): void {
    broadcast(
      'js-update',
      graph.toBrowserPath(filename)
    );
  }

  function broadcastReactUpdate(filename: string): void {
    broadcast('react-update', graph.toBrowserPath(filename));
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

      if (pathname === '/__ngbuild/react-refresh') {
        res.writeHead(200, {
          'Content-Type': 'text/javascript; charset=utf-8',
          'Cache-Control': 'no-cache'
        });
        res.end(req.method === 'HEAD' ? undefined : refreshRuntime);
        return;
      }

      if (pathname.startsWith('/__ngbuild/vendor/')) {
        const vendorName = pathname.slice('/__ngbuild/vendor/'.length);
        const vendorCode = reactVendors.get(vendorName);
        if (vendorCode === undefined) {
          res.writeHead(404);
          res.end('Not Found');
          return;
        }
        res.writeHead(200, {
          'Content-Type': 'text/javascript; charset=utf-8',
          'Cache-Control': 'no-cache'
        });
        res.end(req.method === 'HEAD' ? undefined : vendorCode);
        return;
      }

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
        content = await transformModule(
          actualPath,
          projectRoot,
          plugins
        );

        contentType = 'text/javascript; charset=utf-8';

        console.log(
          `[NgBuild] Transformed: ${relative(projectRoot, actualPath)}`
        );
      } else if (
        extension === '.js' ||
        extension === '.mjs'
      ) {
        const code = await readFile(actualPath, 'utf-8');
        const browserPath = graph.toBrowserPath(actualPath);

        const transformed = await plugins.transform(
          code,
          actualPath
        );

        const selfAccepting =
          /\bimport\.meta\.hot\s*\??\.\s*accept\s*\(/.test(
            transformed
          );

        graph.updateModule(
          actualPath,
          getDependencies(
            transformed,
            actualPath,
            projectRoot
          ),
          selfAccepting
        );

        const updateVersion = new URL(
          req.url ?? '/',
          'http://localhost'
        ).searchParams.get('ngbuild');

        content = injectHotContext(
          transformed,
          browserPath,
          updateVersion ?? undefined
        );

        contentType = 'text/javascript; charset=utf-8';
      } else {
        content = await readFile(actualPath);

        contentType =
          MIME_TYPES[extension] ??
          'application/octet-stream';

        if (extension === '.html') {
          const importMap = `<script type="importmap">{"imports":{
"react":"/__ngbuild/vendor/react.js",
"react-dom/client":"/__ngbuild/vendor/react-dom-client.js",
"react/jsx-runtime":"/__ngbuild/vendor/jsx-runtime.js"
}}</script>`;
          content = injectClient(content.toString('utf-8').includes('<head>')
            ? content.toString('utf-8').replace('<head>', '<head>' + importMap)
            : importMap + content.toString('utf-8'));
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
  JavaScript HMR: Enabled
  Module Graph:  Enabled
  ES Modules:    Native
  TypeScript:    Enabled
  JSX / TSX:     Enabled
  React:         Supported
  React Refresh: Enabled
  Plugin System: Enabled (${plugins.count} loaded)

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
    graph.clear();
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
          segments.includes('.git') ||
          segments.includes('dist')
        ) {
          continue;
        }

        console.log(
          `[NgBuild] File changed: ${filename || 'unknown'}`
        );

        if (!filename) {
          broadcastReload();
          continue;
        }

        const extension = extname(filename).toLowerCase();
        const changedPath = resolve(projectRoot, filename);

        if (extension === '.css') {
          broadcastCssUpdate(filename);
          continue;
        }

        if (extension === '.tsx' || extension === '.jsx') {
          broadcastReactUpdate(changedPath);
          continue;
        }

        if (
          extension === '.js' ||
          extension === '.mjs'
        ) {
          const propagation = graph.getHmrPropagation(
            changedPath
          );

          if (propagation.accepted) {
            for (const boundary of propagation.boundaries) {
              broadcastJsUpdate(boundary);

              console.log(
                '[NgBuild] HMR propagated:',
                graph.toBrowserPath(changedPath),
                '->',
                graph.toBrowserPath(boundary)
              );
            }
          } else {
            broadcastReload();
          }

          continue;
        }

        broadcastReload();
      }

    } catch (error) {
      const err = error as Error;
      console.error('[NgBuild] Watcher error:', err.message);
    }
  }

  void startWatcher();
}