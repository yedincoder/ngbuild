import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const packagePath = fileURLToPath(
  new URL('../package.json', import.meta.url)
);

const packageJson = JSON.parse(
  readFileSync(packagePath, 'utf-8')
);

export const VERSION: string = packageJson.version;