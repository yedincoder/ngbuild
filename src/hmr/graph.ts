import { relative, resolve } from 'node:path';

export interface ModuleNode {
  id: string;
  dependencies: Set<string>;
  importers: Set<string>;
  selfAccepting: boolean;
}

export class ModuleGraph {
  private modules = new Map<string, ModuleNode>();

  constructor(private root: string) {}

  private normalize(id: string): string {
    return resolve(id).replace(/\\/g, '/');
  }

  ensureEntry(id: string): ModuleNode {
    const normalized = this.normalize(id);

    let node = this.modules.get(normalized);

    if (!node) {
      node = {
        id: normalized,
        dependencies: new Set(),
        importers: new Set(),
        selfAccepting: false
      };

      this.modules.set(normalized, node);
    }

    return node;
  }

  updateModule(
    id: string,
    dependencies: string[],
    selfAccepting: boolean
  ): void {
    const node = this.ensureEntry(id);

    for (const dependency of node.dependencies) {
      this.modules.get(dependency)?.importers.delete(node.id);
    }

    node.dependencies.clear();

    for (const dependency of dependencies) {
      const dep = this.ensureEntry(dependency);

      node.dependencies.add(dep.id);
      dep.importers.add(node.id);
    }

    node.selfAccepting = selfAccepting;
  }

  getModule(id: string): ModuleNode | undefined {
    return this.modules.get(this.normalize(id));
  }

  isHmrAccepted(id: string): boolean {
    return this.getModule(id)?.selfAccepting ?? false;
  }

  toBrowserPath(id: string): string {
    const path = relative(this.root, id).replace(/\\/g, '/');
    return `/${path}`;
  }

  clear(): void {
    this.modules.clear();
  }
}