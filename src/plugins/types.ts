export type NgBuildMode = 'development' | 'production';

export interface NgBuildPluginContext {
  root: string;
  mode: NgBuildMode;
}

export interface NgBuildPlugin {
  name: string;

  config?: (
    context: NgBuildPluginContext
  ) => void | Promise<void>;

  buildStart?: (
    context: NgBuildPluginContext
  ) => void | Promise<void>;

  transform?: (
    code: string,
    id: string,
    context: NgBuildPluginContext
  ) => string | null | undefined |
    Promise<string | null | undefined>;
}

export interface NgBuildConfig {
  plugins?: NgBuildPlugin[];
}