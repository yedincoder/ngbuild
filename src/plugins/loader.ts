import { access, readFile } from 'node:fs/promises';
import { isAbsolute, relative, resolve, sep } from 'node:path';
import { pathToFileURL } from 'node:url';
import type { Plugin } from 'esbuild';

import type {
  NgBuildConfig,
  NgBuildMode,
  NgBuildPlugin,
  NgBuildPluginContext
} from './types.js';

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

export class PluginManager {
  private readonly plugins: NgBuildPlugin[] = [];

  readonly context: NgBuildPluginContext;

  constructor(root: string, mode: NgBuildMode) {
    this.context = { root, mode };
  }

  async load(): Promise<void> {
    const configPath = resolve(
      this.context.root,
      'ngbuild.config.js'
    );

    try {
      await access(configPath);
    } catch (error) {
      const err = error as NodeJS.ErrnoException;

      if (err.code === 'ENOENT') {
        return;
      }

      throw error;
    }

    const configUrl = pathToFileURL(configPath).href;
    const module = await import(configUrl);

    const config: NgBuildConfig = module.default;

    if (
      !config ||
      typeof config !== 'object' ||
      (
        config.plugins !== undefined &&
        !Array.isArray(config.plugins)
      )
    ) {
      throw new Error(
        'NgBuild: Invalid ngbuild.config.js configuration.'
      );
    }

    for (const plugin of config.plugins ?? []) {
      if (
        !plugin ||
        typeof plugin.name !== 'string' ||
        !plugin.name.trim()
      ) {
        throw new Error(
          'NgBuild: Every plugin requires a valid name.'
        );
      }

      this.plugins.push(plugin);

      console.log(`[NgBuild] Plugin loaded: ${plugin.name}`);
    }

    for (const plugin of this.plugins) {
      await plugin.config?.(this.context);
    }
  }

  async buildStart(): Promise<void> {
    for (const plugin of this.plugins) {
      await plugin.buildStart?.(this.context);
    }
  }

  async transform(code: string, id: string): Promise<string> {
    let result = code;

    for (const plugin of this.plugins) {
      if (!plugin.transform) {
        continue;
      }

      const transformed = await plugin.transform(
        result,
        id,
        this.context
      );

      if (transformed !== null && transformed !== undefined) {
        if (typeof transformed !== 'string') {
          throw new Error(
            `NgBuild: Plugin "${plugin.name}" returned invalid transform output.`
          );
        }

        result = transformed;
      }
    }

    return result;
  }

  createEsbuildPlugin(): Plugin {
    const manager = this;

    return {
      name: 'ngbuild-transform-hooks',

      setup(esbuild) {
        esbuild.onLoad(
          { filter: /\.(js|mjs|ts|tsx|jsx)$/ },
          async (args) => {
            if (!isWithin(manager.context.root, args.path)) {
              return undefined;
            }

            const code = await readFile(args.path, 'utf-8');

            const contents = await manager.transform(
              code,
              args.path
            );

            const extension = args.path.match(
              /\.(js|mjs|ts|tsx|jsx)$/
            )?.[1];

            const loader = extension === 'mjs'
              ? 'js'
              : extension === 'ts' ||
                extension === 'tsx' ||
                extension === 'jsx'
                ? extension
                : 'js';

            return {
              contents,
              loader,
              resolveDir: resolve(args.path, '..')
            };
          }
        );
      }
    };
  }

  get count(): number {
    return this.plugins.length;
  }
}