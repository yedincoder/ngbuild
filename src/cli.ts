
import { resolve } from 'node:path';
import { startServer } from './server.js';

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

  case '--version':
  case '-v':
    console.log('NgBuild v0.2.0');
    break;

  case '--help':
  case '-h':
    console.log(`
NgBuild v0.2.0

Usage:
  ngbuild dev [root]
  ngbuild dev [root] --port 4178
  ngbuild --version
  ngbuild --help
`);
    break;

  default:
    console.error(`Unknown command: ${command}`);
    process.exitCode = 1;
}
