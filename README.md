# NgBuild

[![npm](https://img.shields.io/npm/v/@yedincoder/ngbuild)](https://www.npmjs.com/package/@yedincoder/ngbuild)
![Node.js](https://img.shields.io/badge/Node.js-%3E%3D20-green)
![TypeScript](https://img.shields.io/badge/TypeScript-supported-blue)
![React](https://img.shields.io/badge/React-supported-61DAFB)
![License](https://img.shields.io/badge/status-stable-brightgreen)

**A lightweight frontend development and build tool built with Node.js, TypeScript, and esbuild.**

NgBuild provides a development server, native ES Modules, TypeScript/JSX/TSX support, file watching, hot updates, React Fast Refresh, a plugin system, and optimized production builds.

> **Current npm release:** `@yedincoder/ngbuild` (v1.0.2). The commands below use the npm `latest` release without pinning a version.

## Requirements

- Node.js **20 or newer**
- npm

## Quick start

From your project root, install NgBuild and initialize the current directory:

```bash
npm install -D @yedincoder/ngbuild
npx ngbuild init .
npm run dev
```

Open **http://localhost:4178/**.

Build for production:

```bash
npm run build
```

The starter is deliberately framework-neutral. NgBuild does **not** require React or any particular frontend framework.

### Project structure

```text
PROJECT_ROOT/
├── src/
│   ├── index.html
│   ├── main.js
│   └── style.css
├── public/
│   └── favicon.ico
├── package.json
├── .gitignore
├── node_modules/          # created by npm install
├── package-lock.json      # created by npm install
└── dist/                  # created by npm run build
    ├── index.html
    ├── main.js
    ├── style.css
    └── favicon.ico
```

- **`src/`** — application HTML, JavaScript, and CSS.
- **`public/`** — public static assets copied to the build output.
- **`dist/`** — optimized production output; generated when you run `build`.
- **`node_modules/`** — installed dependencies; not part of application source.

The generated `src/index.html` references `./main.js`, `./style.css`, and `/favicon.ico`. The favicon is copied from the NgBuild package `assets/favicon.ico` to `public/favicon.ico`, not generated. An existing favicon is not overwritten.

The generated `package.json` includes:

```json
{
  "scripts": {
    "dev": "ngbuild dev",
    "build": "ngbuild build"
  }
}
```

The generated manifest also includes `@yedincoder/ngbuild` as a development dependency. When `package.json` already exists, `init` adds missing `dev` and `build` scripts without replacing existing ones.

**Existing source and favicon files are never overwritten by `ngbuild init`.** Run `ngbuild init .` in your existing project root; no additional project folder is required.

## Commands

| Command | Description |
| --- | --- |
| `ngbuild init [root]` | Generate a frontend starter in the selected directory; use `.` for the current root |
| `ngbuild dev [root]` | Start the development server (default port **4178**) |
| `ngbuild dev [root] --port 4200` | Start with a custom port |
| `ngbuild build [root]` | Generate optimized production output in `<root>/dist/` |
| `ngbuild --version` | Print the installed tool version |
| `ngbuild --help` | Show CLI usage |

When installed as a project dependency, prefer `npm run dev` and `npm run build`.

## Development features

- Native JavaScript ES Modules
- TypeScript (`.ts`), JSX (`.jsx`), and TSX (`.tsx`) transformations
- Recursive file watcher and browser reload
- CSS Hot Update
- JavaScript HMR and dependency propagation
- React Fast Refresh support
- Plugin hooks for configuration, build start, and transforms

NgBuild is a frontend build tool, **not** an application framework. Framework selection and application architecture are up to the developer.

## Production build

Run:

```bash
npm run build
```

NgBuild discovers HTML entries, bundles referenced module scripts with esbuild, minifies HTML, optimizes CSS, and copies public assets. The output directory is always the project-level `dist/` for the current starter layout.

For example:

```text
PROJECT_ROOT/src/index.html   → PROJECT_ROOT/dist/index.html
PROJECT_ROOT/src/main.js      → PROJECT_ROOT/dist/main.js
PROJECT_ROOT/src/style.css    → PROJECT_ROOT/dist/style.css
PROJECT_ROOT/public/favicon.ico → PROJECT_ROOT/dist/favicon.ico
```

## Existing projects (v1.0.0 layout)

NgBuild v1.0.2 continues to support projects that keep `index.html` at the project root.

```text
existing-project/
├── index.html
├── main.js
├── style.css
└── ngbuild.config.js    # if your project uses a plugin configuration
```

From the NgBuild source repository, test the existing playground with:

```bash
npm run compile
node bin/ngbuild.js dev playground
```

In another terminal, create a production build:

```bash
node bin/ngbuild.js build playground
```

The old layout does not need to be migrated to `src/` to keep using `dev` and `build`.

## Test from the NgBuild source repository

The starter can also be tested directly from local source. From the NgBuild repository:

```powershell
cd D:\ngappid-project\ngbuild
npm install
npm run compile
node bin/ngbuild.js init .\playground-test
node bin/ngbuild.js dev .\playground-test
```

Stop the development server with **Ctrl+C**, then build:

```powershell
node bin/ngbuild.js build .\playground-test
```

Note: These commands execute the source repository directly. Normal projects should use the Quick start instructions above.

## Plugin system

NgBuild supports project plugins through the existing plugin loader, including configuration, build-start, and transform hooks. The repository's `playground` demonstrates a working example plugin. Keep the plugin configuration in the project root so both development and production modes can load it.

## Package information

- **npm:** [@yedincoder/ngbuild](https://www.npmjs.com/package/@yedincoder/ngbuild)
- **GitHub:** [yedincoder/ngbuild](https://github.com/yedincoder/ngbuild)
- **CLI executable:** `ngbuild`
- **Node.js:** `>=20`

## Changelog

### v1.0.2

- Use the original packaged `assets/favicon.ico` when initializing a project; remove generated favicon artwork.
- Preserve an existing `public/favicon.ico`.
- Keep the existing project-root behavior and all development/build features.

### v1.0.1

- Added `ngbuild init` to generate a framework-neutral starter project.
- Starter application files are stored in `src/`.
- Static assets, including the project favicon, are stored in `public/`.
- Production output remains in the top-level `dist/` directory.
- Development and build commands support the new layout while preserving existing root-level HTML projects.
