
# NgBuild

**A lightweight frontend development and build tool powered by Node.js, TypeScript, and esbuild.**

[![npm](https://img.shields.io/npm/v/@yedincoder/ngbuild)](https://www.npmjs.com/package/@yedincoder/ngbuild)
![Node.js](https://img.shields.io/badge/Node.js-%3E%3D20-green)
![TypeScript](https://img.shields.io/badge/TypeScript-supported-blue)
![React](https://img.shields.io/badge/React-supported-61DAFB)
![License](https://img.shields.io/badge/status-stable-brightgreen)

NgBuild adalah frontend development dan build tool independen berbasis Node.js dan TypeScript.

NgBuild menyediakan development server, native ES Modules, TypeScript, JSX/TSX, React Fast Refresh, JavaScript HMR, CSS Hot Update, Plugin System, dan optimized production build menggunakan esbuild.

NgBuild dikembangkan secara independen tanpa bergantung pada Vite.

**Current npm release:** `@yedincoder/ngbuild@1.0.0`

**GitHub:** https://github.com/yedincoder/ngbuild

**npm:** https://www.npmjs.com/package/@yedincoder/ngbuild

**GitHub Release:** https://github.com/yedincoder/ngbuild/releases/tag/v1.0.0

---

## Features

| Feature | Available |
|---|---|
| CLI Development Server | Yes |
| Native ES Modules | Yes |
| TypeScript | Yes |
| JSX / TSX | Yes |
| React Support | Yes |
| React Fast Refresh | Yes |
| JavaScript HMR | Yes |
| HMR Dependency Propagation | Yes |
| CSS Hot Update | Yes |
| File Watcher | Yes |
| Auto Reload | Yes |
| Module Graph | Yes |
| Plugin System | Yes |
| Production Bundling | Yes |
| JavaScript Minification | Yes |
| CSS Minification | Yes |
| HTML Minification | Yes |
| Production Asset Cleanup | Yes |
| Custom Development Port | Yes |
| Project Initialization (`init`) | In development |

> The `init` command is under development and is not included in the published npm v1.0.0 package.

---

## Requirements

- Node.js 20 or newer
- npm
- Modern browser

The development server uses port `4178` by default.

---

## Installation

### 1. Create a frontend project

Create a directory for your application.

Example using PowerShell:

```powershell
mkdir my-ngbuild-app
cd my-ngbuild-app
npm init -y
```

### 2. Install NgBuild

```powershell
npm install --save-dev @yedincoder/ngbuild
```

This installs NgBuild as a development dependency.

### 3. Verify installation

```powershell
npx ngbuild --version
```

Expected output for the current published release:

```text
NgBuild v1.0.0
```

### 4. Create index.html

Create `index.html` in your application root:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>My NgBuild App</title>
  <link rel="stylesheet" href="./style.css">
</head>
<body>
  <div id="app"></div>
  <script type="module" src="./main.js"></script>
</body>
</html>
```

### 5. Create main.js

```javascript
const app = document.querySelector('#app');

app.innerHTML = `
  <h1>Hello NgBuild!</h1>
  <p>Your development environment is ready.</p>
`;

console.log('[NgBuild] Application started');
```

### 6. Create style.css

```css
body {
  margin: 0;
  padding: 40px;
  font-family: Arial, sans-serif;
  background: #0c0d11;
  color: #ffffff;
}

h1 {
  color: #f97316;
}
```

### 7. Project structure

Your directory should look like this:

```text
my-ngbuild-app/
├── node_modules/
├── index.html
├── main.js
├── style.css
├── package.json
└── package-lock.json
```

NgBuild v1.0.0 does not generate these application files automatically.

Installing the npm package only installs the development tool and its dependencies.

### 8. Start development server

```powershell
npx ngbuild dev
```

Open:

http://localhost:4178/

The application should display:

```text
Hello NgBuild!

Your development environment is ready.
```

---

## Quick Start

For an existing frontend project with an `index.html`:

```powershell
npm install --save-dev @yedincoder/ngbuild
npx ngbuild dev
```

For production:

```powershell
npx ngbuild build
```

NgBuild creates the optimized output in:

```text
dist/
```

---

## CLI Commands

| Command | Description |
|---|---|
| `npx ngbuild dev` | Start development server |
| `npx ngbuild dev --port 4205` | Start using a custom port |
| `npx ngbuild build` | Create optimized production build |
| `npx ngbuild --version` | Show installed NgBuild version |
| `npx ngbuild --help` | Show CLI help |

### Development

```powershell
npx ngbuild dev
```

### Custom port

```powershell
npx ngbuild dev --port 4205
```

### Production

```powershell
npx ngbuild build
```

### Specify project root

```powershell
npx ngbuild dev ./my-project
npx ngbuild build ./my-project
```

### Show version

```powershell
npx ngbuild --version
```

### Help

```powershell
npx ngbuild --help
```

---

## Development Server

NgBuild provides a Node.js HTTP development server.

Default configuration:

| Setting | Value |
|---|---|
| Host | 127.0.0.1 |
| Port | 4178 |
| Mode | Development |
| Module Format | ESM |
| File Watcher | Enabled |
| CSS Hot Update | Enabled |
| JavaScript HMR | Enabled |
| React Fast Refresh | Enabled |

Example startup:

```text
NgBuild v1.0.0

Local: http://localhost:4178/
Root:  /path/to/project

File Watcher: Active
Auto Reload:  Active
CSS Hot Update: Enabled
JavaScript HMR: Enabled
Module Graph:  Enabled
ES Modules:    Native
TypeScript:    Enabled
JSX / TSX:     Enabled
React:         Supported
React Refresh: Enabled
Plugin System: Enabled (0 loaded)
```

NgBuild requires application source files to serve.

If the requested file does not exist, the development server returns HTTP 404.

---

## Native ES Modules

NgBuild supports native JavaScript modules.

Example `utils.js`:

```javascript
export function getMessage() {
  return 'Hello from NgBuild!';
}
```

Example `main.js`:

```javascript
import { getMessage } from './utils.js';

document.querySelector('#app').textContent =
  getMessage();
```

Relative imports are supported in development.

---

## TypeScript, JSX and TSX

NgBuild uses esbuild to transform supported frontend source files.

| Extension | Development | Production |
|---|---|---|
| `.js` | Native ESM / HMR | Bundled |
| `.mjs` | Native ESM / HMR | Bundled |
| `.ts` | esbuild | Bundled |
| `.jsx` | esbuild / React Refresh | Bundled |
| `.tsx` | esbuild / React Refresh | Bundled |

Example TypeScript:

```typescript
const message: string = 'Hello TypeScript!';

document.querySelector('#app')!.textContent = message;
```

HTML:

```html
<div id="app"></div>
<script type="module" src="./main.ts"></script>
```

NgBuild transforms TypeScript for browser execution.

Full TypeScript type checking is not automatically performed for user applications.

---

## React Support

NgBuild supports React applications using JSX and TSX.

Install React in your application:

```powershell
npm install react react-dom
```

Example `app.tsx`:

```tsx
import { useState } from 'react';
import { createRoot } from 'react-dom/client';

function App() {
  const [count, setCount] = useState(0);

  return (
    <main>
      <h1>NgBuild React</h1>
      <p>Counter: {count}</p>

      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
    </main>
  );
}

const container = document.getElementById('app');

if (!container) {
  throw new Error('Root element not found');
}

createRoot(container).render(<App />);
```

HTML:

```html
<div id="app"></div>
<script type="module" src="./app.tsx"></script>
```

Run:

```powershell
npx ngbuild dev
```

React Fast Refresh supports state-preserving updates for tested component changes.

Not every React component pattern or dependency graph has been validated.

---

## JavaScript HMR

NgBuild supports Hot Module Replacement for JavaScript modules that accept updates.

Example:

```javascript
let count = import.meta.hot?.data.count ?? 0;

const app = document.querySelector('#app');

function render() {
  app.innerHTML = `
    <h1>NgBuild JavaScript HMR</h1>
    <p>Counter: ${count}</p>
    <button id="increment">Increment</button>
  `;

  document.querySelector('#increment').onclick = () => {
    count++;
    render();
  };
}

render();

if (import.meta.hot) {
  import.meta.hot.dispose((data) => {
    data.count = count;
  });

  import.meta.hot.accept(() => {
    console.log('[NgBuild] HMR accepted');
  });
}
```

When the module is updated during development, NgBuild can update it without a full-page reload.

If a change cannot be accepted, the development server falls back to reloading the page.

---

## HMR Dependency Propagation

NgBuild tracks dependencies and importers using its Module Graph.

Example:

```text
main.js
   └── utils.js
```

When `utils.js` changes, NgBuild checks whether `main.js` or another importer can accept the update.

This feature was tested with a counter that remained at 10 while the imported message changed.

The current implementation supports tested JavaScript module patterns and is not a complete replacement for advanced dependency graph handling.

---

## CSS Hot Update

NgBuild updates stylesheets during development without requiring a full-page reload.

HTML:

```html
<link rel="stylesheet" href="./style.css">
```

Update `style.css`, save the file, and the browser receives a CSS update through Server-Sent Events.

---

## React Fast Refresh

NgBuild uses:

- esbuild
- Babel React Refresh instrumentation
- react-refresh runtime
- React vendor modules
- Server-Sent Events

The development server provides internal endpoints:

```text
/__ngbuild/events
/__ngbuild/react-refresh
/__ngbuild/vendor/react.js
/__ngbuild/vendor/react-dom-client.js
/__ngbuild/vendor/jsx-runtime.js
```

React Fast Refresh was introduced in v0.8.0 and remains available in v1.0.0.

---

## Production Build

Run:

```powershell
npx ngbuild build
```

NgBuild scans HTML entries, bundles referenced module scripts, and writes optimized output into `dist/`.

Production features:

| Feature | Available |
|---|---|
| HTML Entry Discovery | Yes |
| JavaScript Bundling | Yes |
| TypeScript Bundling | Yes |
| JSX/TSX Bundling | Yes |
| React Production Bundling | Yes |
| JavaScript Minification | Yes |
| CSS Minification | Yes |
| HTML Minification | Yes |
| HTML Module Script Processing | Yes |
| Production Asset Cleanup | Yes |
| Static Asset Copying | Yes |
| Plugin Transform Hook | Yes |

Example output:

```text
dist/
├── index.html
├── main.js
└── style.css
```

Actual output depends on your project files.

### HTML Minification

NgBuild uses `html-minifier-terser`.

The configured HTML minification process conservatively reduces whitespace and comments.

### Production Asset Cleanup

NgBuild excludes known development-only files from its production output.

Examples:

```text
ngbuild.config.js
ngbuild.config.mjs
ngbuild.config.ts
tsconfig.json
package.json
package-lock.json
npm-shrinkwrap.json
```

JavaScript and TypeScript source files that have been bundled are not separately copied unless required by the supported asset-copying logic.

Advanced dynamic imports and runtime-loaded assets may need additional handling.

### Production Preview

The `dist/` directory contains static output.

You can preview it using a static server:

```powershell
npx serve dist -l 4179
```

The exact URL handling depends on the static server configuration.

NgBuild's default development server uses port `4178`; port `4179` is only an example production preview port.

---

## Plugin System

NgBuild supports plugins using `ngbuild.config.js`.

Example:

```javascript
export default {
  plugins: [
    {
      name: 'ngbuild-example-plugin',

      config(context) {
        console.log(
          '[NgBuild] Mode:', context.mode
        );
      },

      buildStart(context) {
        console.log(
          '[NgBuild] Build started:', context.mode
        );
      },

      transform(code, id, context) {
        return code;
      }
    }
  ]
};
```

Supported hooks:

| Hook | Description |
|---|---|
| `config(context)` | Configure plugin |
| `buildStart(context)` | Execute before development or build |
| `transform(code, id, context)` | Transform module source |

Plugin context includes:

```text
root
mode
```

The mode is either `development` or `production`.

Plugins execute as Node.js code. Only load trusted plugins.

---

## Project Initialization — In Development

The next update is adding a project initializer.

Planned command:

```powershell
npx ngbuild init
```

This command is **not available in the published v1.0.0 package**.

The development implementation creates:

```text
my-ngbuild-app/
├── index.html
├── main.js
└── style.css
```

It includes a starter UI with NgBuild branding, development information, and an interactive counter.

Existing files are skipped instead of being overwritten.

### Test the local development implementation

Clone the NgBuild source:

```powershell
git clone https://github.com/yedincoder/ngbuild.git
cd ngbuild
npm install
npm run compile
```

The commands below require a local source revision that includes the new `init` implementation.

Initialize a separate test project:

```powershell
node bin/ngbuild.js init ../ngbuild-init-test
```

Start the development server:

```powershell
node bin/ngbuild.js dev ../ngbuild-init-test
```

Build the application:

```powershell
node bin/ngbuild.js build ../ngbuild-init-test
```

The initializer will become part of a future npm release after its testing and release process is complete.

---

## Development from Source

Repository:

https://github.com/yedincoder/ngbuild

Clone:

```powershell
git clone https://github.com/yedincoder/ngbuild.git
cd ngbuild
npm install
```

Compile the internal TypeScript source:

```powershell
npm run compile
```

Start the built-in playground:

```powershell
npm run playground
```

Production build:

```powershell
node bin/ngbuild.js build playground
```

### Development Scripts

| Command | Purpose |
|---|---|
| `npm run compile` | Compile NgBuild TypeScript |
| `npm run dev` | Compile and start development server |
| `npm run playground` | Compile and start playground |
| `npm run build` | Compile internal NgBuild source |
| `npm pack --dry-run` | Inspect npm package contents |
| `npm pack` | Create npm distribution archive |

`npm run build` in the NgBuild repository is not the same as `npx ngbuild build`.

---

## Internal Project Structure

```text
ngbuild/
├── bin/
│   └── ngbuild.js
├── src/
│   ├── cli.ts
│   ├── server.ts
│   ├── build.ts
│   ├── version.ts
│   ├── hmr/
│   │   ├── graph.ts
│   │   └── runtime.ts
│   └── plugins/
│       ├── types.ts
│       └── loader.ts
├── dist/
├── playground/
├── package.json
├── package-lock.json
├── tsconfig.json
└── README.md
```

The root `dist/` contains compiled NgBuild code.

The `playground/dist/` directory contains production output generated from the playground application.

---

## npm Package Distribution

Official npm package:

```text
@yedincoder/ngbuild
```

CLI executable:

```text
ngbuild
```

Installation:

```powershell
npm install -D @yedincoder/ngbuild
```

Use:

```powershell
npx ngbuild dev
npx ngbuild build
```

Do not confuse this package with the separate unscoped `ngbuild` package on npm.

### Package Contents

The published distribution contains the CLI, compiled JavaScript, package metadata, and README.

Source TypeScript files and playground source are not included in the npm package.

---

## Release History

| Version | Features |
|---|---|
| v0.1.0 | CLI and Development Server |
| v0.2.0 | File Watcher, Auto Reload and Native ESM |
| v0.3.0 | TypeScript, JSX/TSX and React Support |
| v0.4.0 | CSS Hot Update |
| v0.5.0 | Production Bundler |
| v0.6.0 | Plugin System |
| v0.7.0 | JavaScript HMR and Module Graph |
| v0.8.0 | React Fast Refresh |
| v0.9.0 | HTML Minification, Production Optimization, HMR Dependency Propagation |
| v1.0.0 | First Stable Release, npm Distribution and CLI Validation |

### Next Development

Project Initialization and starter UI are being developed for a future update.

They have not yet been published in npm v1.0.0.

---

## Current Limitations

- No project initialization command in npm v1.0.0.
- JavaScript HMR dependency propagation has been tested on basic dependency patterns.
- React Fast Refresh has not been validated with every React component architecture.
- Full application TypeScript type checking is not automatically performed.
- Advanced dynamic import handling is limited.
- Some runtime-loaded assets may require explicit management.
- The Plugin System currently has three basic hooks.
- Cross-platform and large-project regression testing remains limited.

---

## Links

**npm:** https://www.npmjs.com/package/@yedincoder/ngbuild

**GitHub:** https://github.com/yedincoder/ngbuild

**GitHub Releases:** https://github.com/yedincoder/ngbuild/releases

---

## Author

**YedinCoder**

GitHub: https://github.com/yedincoder

---

**NgBuild — Modern Frontend Development Tool.**

Built independently with Node.js, TypeScript, and esbuild.
