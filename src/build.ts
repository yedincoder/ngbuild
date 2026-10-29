
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
import { minify } from 'html-minifier-terser';
import { PluginManager } from './plugins/loader.js';
import { VERSION } from './version.js';

const SCRIPT_EXTENSIONS = new Set([
  '.js',
  '.mjs',
  '.ts',
  '.tsx',
  '.jsx'
]);

const SOURCE_EXTENSIONS = new Set([
  '.js',
  '.mjs',
  '.ts',
  '.tsx',
  '.jsx'
]);

const EXCLUDED_FILES = new Set([
  'ngbuild.config.js',
  'ngbuild.config.mjs',
  'ngbuild.config.ts',
  'tsconfig.json',
  'package.json',
  'package-lock.json',
  'npm-shrinkwrap.json'
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
  outputRoot: string,
  plugins: PluginManager
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
    metafile: false,
    plugins: [
      plugins.createEsbuildPlugin()
    ]
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

async function optimizeHtml(
  html: string
): Promise<string> {
  return minify(html, {
    collapseWhitespace: true,
    conservativeCollapse: true,
    removeComments: true,
    removeOptionalTags: false,
    removeAttributeQuotes: false,
    removeEmptyAttributes: false,
    removeEmptyElements: false,
    removeRedundantAttributes: false,
    minifyCSS: false,
    minifyJS: false,
    keepClosingSlash: true
  });
}

async function processHtml(
  sourceHtml: string,
  projectRoot: string,
  outputRoot: string,
  builtScripts: Set<string>,
  plugins: PluginManager
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
        outputRoot,
        plugins
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

  html = await optimizeHtml(html);

  await mkdir(dirname(outputHtml), {
    recursive: true
  });

  await writeFile(outputHtml, html, 'utf-8');

  console.log(
    `[NgBuild] HTML processed: ${relative(outputRoot, outputHtml)}`
  );

  console.log(
    `[NgBuild] HTML optimized: ${relative(outputRoot, outputHtml)}`
  );
}

async function getClassicScripts(
  htmlFiles: string[],
  projectRoot: string
): Promise<Set<string>> {
  const scripts = new Set<string>();

  for (const htmlFile of htmlFiles) {
    const html = await readFile(htmlFile, 'utf-8');

    const pattern = /<script\b([^>]*)>/gi;

    for (const match of html.matchAll(pattern)) {
      const attributes = match[1];

      if (/\btype=["']module["']/i.test(attributes)) {
        continue;
      }

      const srcMatch = attributes.match(
        /\bsrc=["']([^"']+)["']/i
      );

      if (!srcMatch) {
        continue;
      }

      const url = srcMatch[1];

      if (
        /^(https?:)?\/\//i.test(url) ||
        /^(data|blob):/i.test(url)
      ) {
        continue;
      }

      const cleanUrl = url.split(/[?#]/)[0];

      const scriptPath = cleanUrl.startsWith('/')
        ? resolve(projectRoot, `.${cleanUrl}`)
        : resolve(dirname(htmlFile), cleanUrl);

      if (isWithin(projectRoot, scriptPath)) {
        scripts.add(scriptPath);
      }
    }
  }

  return scripts;
}

async function copyProductionAssets(
  sourceFiles: string[],
  htmlFiles: string[],
  projectRoot: string,
  outputRoot: string
): Promise<void> {
  const classicScripts = await getClassicScripts(
    htmlFiles,
    projectRoot
  );

  for (const sourceFile of sourceFiles) {
    const name = sourceFile.split(/[\\/]/).pop() ?? '';

    if (EXCLUDED_FILES.has(name)) {
      continue;
    }

    const extension = extname(sourceFile).toLowerCase();

    if (
      SOURCE_EXTENSIONS.has(extension) &&
      !classicScripts.has(sourceFile)
    ) {
      continue;
    }

    const relativeFile = relative(
      projectRoot,
      sourceFile
    );

    const outputFile = join(
      outputRoot,
      relativeFile
    );

    await mkdir(dirname(outputFile), {
      recursive: true
    });

    await cp(sourceFile, outputFile);
  }

  console.log('[NgBuild] Production assets copied.');
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

  const plugins = new PluginManager(
    projectRoot,
    'production'
  );

  await plugins.load();
  await plugins.buildStart();

  console.log(`
  NgBuild v${VERSION}

  Mode: Production
  Root: ${projectRoot}
  Out:  ${outputRoot}
  Plugins: ${plugins.count}
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

  await copyProductionAssets(
    sourceFiles,
    htmlFiles,
    projectRoot,
    outputRoot
  );

  const builtScripts = new Set<string>();

  for (const htmlFile of htmlFiles) {
    await processHtml(
      htmlFile,
      projectRoot,
      outputRoot,
      builtScripts,
      plugins
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
