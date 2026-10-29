# NgBuild

**A lightweight frontend development and build tool built with Node.js, TypeScript, and esbuild.**

NgBuild provides a development server, native ES Modules, TypeScript/JSX/TSX support, file watching, hot updates, React Fast Refresh, a plugin system, and optimized production builds.

> **Release status:** This README documents the v1.0.1 source currently being tested. The published npm package remains v1.0.0 until v1.0.1 is explicitly published. The `init` command and new starter layout are **not** available in the published v1.0.0 package.

## Requirements

- Node.js **20 or newer**
- npm

## Quick start (v1.0.1, after publication)

Create a new project using NgBuild v1.0.1:

```bash
mkdir my-workspace
cd my-workspace
npm exec --yes --package=@yedincoder/ngbuild@1.0.1 -- ngbuild init my-app
cd my-app
npm install
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
my-app/
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

The generated `src/index.html` references `./main.js`, `./style.css`, and `/favicon.ico`. The favicon is created automatically in `public/`.

The generated `package.json` includes:

```json
{
  "scripts": {
    "dev": "ngbuild dev",
    "build": "ngbuild build"
  }
}
```

The generated manifest also includes `@yedincoder/ngbuild` as a development dependency.

**Existing files are never overwritten by `ngbuild init`.** For a clean test, initialize a new directory rather than reusing one from an earlier test.

## Commands

| Command | Description |
| --- | --- |
| `ngbuild init [root]` | Generate a frontend starter in the selected directory (v1.0.1) |
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
my-app/src/index.html   → my-app/dist/index.html
my-app/src/main.js      → my-app/dist/main.js
my-app/src/style.css    → my-app/dist/style.css
my-app/public/favicon.ico → my-app/dist/favicon.ico
```

## Existing projects (v1.0.0 layout)

NgBuild v1.0.1 continues to support projects that keep `index.html` at the project root.

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

## Use the current unpublished v1.0.1 source

The new starter can be tested **locally before publishing**. From the NgBuild repository:

```powershell
cd D:\ngappid-project\ngbuild
npm install
npm run compile
node bin/ngbuild.js init D:\ngappid-project\ngbuild-101-test
node bin/ngbuild.js dev D:\ngappid-project\ngbuild-101-test
```

Stop the development server with **Ctrl+C**, then build:

```powershell
node bin/ngbuild.js build D:\ngappid-project\ngbuild-101-test
```

Note: the generated `package.json` uses the version currently reported by the local NgBuild source. Before v1.0.1 is published, `npm install` in a newly generated starter may install the published v1.0.0 package, which does **not** include the new `src/` layout support. For local v1.0.1 testing, use the direct `node bin/ngbuild.js ...` commands above.

## Plugin system

NgBuild supports project plugins through the existing plugin loader, including configuration, build-start, and transform hooks. The repository's `playground` demonstrates a working example plugin. Keep the plugin configuration in the project root so both development and production modes can load it.

## Package information

- **npm:** [@yedincoder/ngbuild](https://www.npmjs.com/package/@yedincoder/ngbuild)
- **GitHub:** [yedincoder/ngbuild](https://github.com/yedincoder/ngbuild)
- **CLI executable:** `ngbuild`
- **Node.js:** `>=20`

## v1.0.1 changes

- Added `ngbuild init` to generate a framework-neutral starter project.
- Starter application files are stored in `src/`.
- Static assets, including an orange-and-black NG favicon, are stored in `public/`.
- Production output remains in the top-level `dist/` directory.
- Development and build commands support the new layout while preserving existing root-level HTML projects.

**Publishing note:** Do not announce v1.0.1 as available on npm until the package has been published and its version verified.
