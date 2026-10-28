import { resolve } from 'node:path';
import { startServer } from './server.js';
import { buildProject } from './build.js';

const VERSION = '0.5.0';

const args = process.argv.slice(2);

const command = args[0] ?? 'dev';

const portIndex = args.indexOf('--port');

const portValue = portIndex !== -1
  ? args[portIndex + 1]
  : undefined;

if (portIndex !== -1 && (
  !portValue || portValue.startsWith('--')
)) {
  console.error('NgBuild: --port requires a number.');
  process.exit(1);
}

const port = portValue === undefined
  ? 4178
  : Number(portValue);

if (
  !Number.isInteger(port) ||
  port < 1 ||
  port > 65535
) {
  console.error('NgBuild: Invalid port (1-65535).');
  process.exit(1);
}

const positional = args.slice(1).filter((arg, index, all) => {
  if (arg === '--port') return false;
  if (index > 0 && all[index - 1] === '--port') return false;
  return true;
});

const root = resolve(
  process.cwd(),
  positional[0] ?? '.'
);

switch (command) {
  case 'dev':
    await startServer(root, port);
    break;

  case 'build':
    if (portIndex !== -1) {
      console.error('NgBuild: --port is only supported by dev.');
      process.exitCode = 1;
      break;
    }

    try {
      await buildProject(root);
    } catch (error) {
      const err = error as Error;
      console.error('[NgBuild] Build failed:', err.message);
      process.exitCode = 1;
    }
    break;

  case '--version':
  case '-v':
    console.log(`NgBuild v${VERSION}`);
    break;

  case '--help':
  case '-h':
    console.log(`
NgBuild v${VERSION}

Usage:
  ngbuild dev [root]
  ngbuild dev [root] --port 4178
  ngbuild build [root]
  ngbuild --version
  ngbuild --help

Commands:
  dev      Start development server
  build    Create optimized production output

Options:
  --port   Development server port (default: 4178)
  --version, -v
  --help, -h
`);
    break;

  default:
    console.error(`Unknown command: ${command}`);
    process.exitCode = 1;
}