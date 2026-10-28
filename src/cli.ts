import { resolve } from 'node:path';
import { startServer } from './server.js';

const args = process.argv.slice(2);
const command = args[0] ?? 'dev';
const root = resolve(process.cwd(), args[1] ?? '.');

switch (command) {
  case 'dev':
    await startServer(root);
    break;
  case '--version':
  case '-v':
    console.log('NgBuild v0.1.0');
    break;
  case '--help':
  case '-h':
    console.log(`NgBuild v0.1.0\n\nUsage:\n  ngbuild dev [root]\n  ngbuild --version\n  ngbuild --help`);
    break;
  default:
    console.error(`Unknown command: ${command}`);
    process.exitCode = 1;
}
