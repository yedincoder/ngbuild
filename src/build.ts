import {
  cp,
  mkdir,
  readFile,
  readdir,
  realpath,
  rm,
  stat,
  writeFile
} from 'node:fs/promises';

import {
  dirname,
  extname,
  isAbsolute,
  join,
  relative,
  resolve,
  sep
} from 'node:path';

import { build, transform } from 'esbuild';

const VERSION = '0.5.0';

const SCRIPT_EXTENSIONS = new Set([
  '.js',
  '.mjs',
  '.ts',
  '.tsx',
  '.jsx'
]);

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

async function getFiles(
  directory: string,
  excluded = new Set<string>()
): Promise<string[]> {
  const files: string[] = [];

  const entries = await readdir(directory, {
    withFileTypes: true
  });

  for (const entry of entries) {
    if (excluded.has(entry.name)) {
      continue;
    }

    const entryPath = join(directory, entry.name);

    if (entry.isDirectory()) {
      files.push(
        ...await getFiles(entryPath, excluded)
      );
    } else if (entry.isFile()) {
      files.push(entryPath);
    }
  }

  return files;
}

async function buildScript(
  sourceFile: string,
  outputFile: string,
  projectRoot: string,
  outputRoot: string
): Promise<void> {
  await mkdir(dirname(outputFile), {
    recursive: true
  });

  await build({
    entryPoints: [sourceFile],
    absWorkingDir: projectRoot,
    outfile: outputFile,
    bundle: true,
    minify: true,
    write: true,
    platform: 'browser',
    format: 'esm',
    target: 'es2022',
    jsx: 'automatic',
    sourcemap: false,
    logLevel: 'silent',
    loader: {
      '.js': 'js',
      '.mjs': 'js',
      '.ts': 'ts',
      '.tsx': 'tsx',
      '.jsx': 'jsx',
      '.png': 'file',
      '.jpg': 'file',
      '.jpeg': 'file',
      '.webp': 'file',
      '.svg': 'file',
      '.gif': 'file'
    },
    assetNames: 'assets/[name]-[hash]',
    outbase: projectRoot,
    publicPath: '/',
    metafile: false
  });

  console.log(
    `[NgBuild] Bundled: ${relative(outputRoot, outputFile)}`
  );
}

async function optimizeCss(
  filePath: string,
  outputRoot: string
): Promise<void> {
  const source = await readFile(filePath, 'utf-8');

  const result = await transform(source, {
    loader: 'css',
    minify: true,
    target: 'es2022',
    logLevel: 'silent'
  });

  await writeFile(filePath, result.code, 'utf-8');

  console.log(
    `[NgBuild] CSS optimized: ${relative(outputRoot, filePath)}`
  );
}

async function processHtml(
  sourceHtml: string,
  projectRoot: string,
  outputRoot: string,
  builtScripts: Set<string>
): Promise<void> {
  const relativeHtml = relative(projectRoot, sourceHtml);

  const outputHtml = join(outputRoot, relativeHtml);

  let html = await readFile(sourceHtml, 'utf-8');

  const scriptPattern =
    /<script\b([^>]*\btype=["']module["'][^>]*)><\/script>/gi;

  const replacements: Array<{
    original: string;
    replacement: string;
  }> = [];

  for (const match of html.matchAll(scriptPattern)) {
    const original = match[0];
    const attributes = match[1];

    const srcMatch = attributes.match(
      /\bsrc=["']([^"']+)["']/i
    );

    if (!srcMatch) {
      continue;
    }

    const scriptUrl = srcMatch[1];

    if (
      scriptUrl.startsWith('http://') ||
      scriptUrl.startsWith('https://') ||
      scriptUrl.startsWith('//') ||
      scriptUrl.startsWith('data:')
    ) {
      continue;
    }

    const cleanUrl = scriptUrl.split(/[?#]/)[0];

    const sourceScript = cleanUrl.startsWith('/')
      ? resolve(projectRoot, `.${cleanUrl}`)
      : resolve(dirname(sourceHtml), cleanUrl);

    if (!isWithin(projectRoot, sourceScript)) {
      throw new Error(
        `Script outside project root: ${scriptUrl}`
      );
    }

    const actualScript = await realpath(sourceScript);

    if (!isWithin(projectRoot, actualScript)) {
      throw new Error(
        `Script outside project root: ${scriptUrl}`
      );
    }

    const extension = extname(actualScript).toLowerCase();

    if (!SCRIPT_EXTENSIONS.has(extension)) {
      continue;
    }

    const scriptRelative = relative(
      projectRoot,
      actualScript
    );

    const outputRelative = scriptRelative.replace(
      /\.(js|mjs|ts|tsx|jsx)$/i,
      '.js'
    );

    const outputScript = join(
      outputRoot,
      outputRelative
    );

    if (!builtScripts.has(outputScript)) {
      await buildScript(
        actualScript,
        outputScript,
        projectRoot,
        outputRoot
      );

      builtScripts.add(outputScript);
    }

    const outputUrl = cleanUrl.startsWith('/')
      ? `/${outputRelative.replace(/\\/g, '/')}`
      : relative(
          dirname(outputHtml),
          outputScript
        ).replace(/\\/g, '/');

    const replacement = original.replace(
      srcMatch[0],
      `src="${outputUrl}"`
    );

    replacements.push({
      original,
      replacement
    });
  }

  for (const item of replacements) {
    html = html.replace(
      item.original,
      item.replacement
    );
  }

  await mkdir(dirname(outputHtml), {
    recursive: true
  });

  await writeFile(outputHtml, html, 'utf-8');

  console.log(
    `[NgBuild] HTML processed: ${relative(outputRoot, outputHtml)}`
  );
}

export async function buildProject(
  root: string
): Promise<void> {
  const projectRoot = await realpath(root);

  const info = await stat(projectRoot);

  if (!info.isDirectory()) {
    throw new Error('Project root must be a directory.');
  }

  const outputRoot = join(projectRoot, 'dist');

  console.log(`
  NgBuild v${VERSION}

  Mode: Production
  Root: ${projectRoot}
  Out:  ${outputRoot}
`);

  const excluded = new Set([
    'node_modules',
    '.git',
    'dist'
  ]);

  const sourceFiles = await getFiles(
    projectRoot,
    excluded
  );

  const htmlFiles = sourceFiles.filter(
    file => extname(file).toLowerCase() === '.html'
  );

  if (htmlFiles.length === 0) {
    throw new Error(
      'No HTML entry found in project root.'
    );
  }

  await rm(outputRoot, {
    recursive: true,
    force: true
  });

  await mkdir(outputRoot, {
    recursive: true
  });

  const entries = await readdir(projectRoot, {
    withFileTypes: true
  });

  for (const entry of entries) {
    if (excluded.has(entry.name)) {
      continue;
    }

    await cp(
      join(projectRoot, entry.name),
      join(outputRoot, entry.name),
      {
        recursive: true
      }
    );
  }

  const builtScripts = new Set<string>();

  for (const htmlFile of htmlFiles) {
    await processHtml(
      htmlFile,
      projectRoot,
      outputRoot,
      builtScripts
    );
  }

  const outputFiles = await getFiles(outputRoot);

  for (const file of outputFiles) {
    if (extname(file).toLowerCase() === '.css') {
      await optimizeCss(file, outputRoot);
    }
  }

  console.log(`
  Production build completed.

  Output: ${outputRoot}
`);
}