# NgBuild

**A lightweight frontend development tool built with Node.js and TypeScript.**

![Version](https://img.shields.io/badge/version-0.3.0-orange)
![Node.js](https://img.shields.io/badge/Node.js-%3E%3D20-green)
![TypeScript](https://img.shields.io/badge/TypeScript-supported-blue)
![React](https://img.shields.io/badge/React-supported-61DAFB)
![Status](https://img.shields.io/badge/status-early%20development-yellow)

NgBuild adalah frontend development tool independen berbasis Node.js dan TypeScript untuk menjalankan aplikasi web menggunakan ES Modules, TypeScript, JSX, dan TSX tanpa bergantung pada Vite.

NgBuild memiliki CLI, HTTP development server, File Watcher, Auto Reload, dan transformer berbasis esbuild untuk pengembangan aplikasi frontend, termasuk React.

> **Development Status:** NgBuild masih dalam tahap awal pengembangan. Production bundling, HMR, dan plugin system belum tersedia.

## Features

Fitur NgBuild v0.3.0:

- **CLI** — Menjalankan development server melalui terminal.
- **Development Server** — HTTP server berbasis Node.js.
- **Native ES Modules** — Mendukung modul JavaScript native browser.
- **TypeScript Transformer** — Mengubah `.ts` menjadi JavaScript.
- **JSX/TSX Transformer** — Memproses `.jsx` dan `.tsx`.
- **React Support** — Menjalankan aplikasi React dengan React DOM.
- **esbuild Integration** — Transformasi dan bundling modul entry selama development.
- **File Watcher** — Memantau perubahan file project.
- **Auto Reload** — Refresh browser otomatis melalui Server-Sent Events (SSE).
- **Static Asset Serving** — Menyajikan HTML, CSS, JavaScript, JSON, dan gambar.
- **Custom Port** — Mendukung pengaturan port melalui CLI.
- **Project Root** — Menentukan direktori aplikasi yang dijalankan.

## Requirements

- Node.js 20 atau lebih baru
- npm
- Windows, Linux, atau macOS dengan dukungan file watching yang sesuai

## Installation

Clone repository:

```bash
git clone https://github.com/yedincoder/ngbuild.git
cd ngbuild
```

Install dependencies:

```bash
npm install
```

Compile TypeScript internal NgBuild:

```bash
npm run compile
```

## Quick Start

Jalankan playground bawaan:

```bash
npm run playground
```

Development server berjalan pada:

**http://localhost:4178**

Contoh output terminal:

```text
NgBuild v0.3.0

Local: http://localhost:4178/
Root:  .../ngbuild/playground

File Watcher: Active
Auto Reload:  Active
ES Modules:   Native
TypeScript:   Enabled
JSX / TSX:    Enabled
React:        Supported

Press Ctrl+C to stop.
```

## Playground

NgBuild menyediakan dua halaman pengujian.

| URL | Description |
|---|---|
| `http://localhost:4178/` | Native JavaScript ES Modules |
| `http://localhost:4178/react.html` | React + TypeScript + TSX |

Halaman React digunakan untuk menguji transformer, rendering React, dan interaksi komponen.

## CLI Usage

Menjalankan development server:

```bash
node bin/ngbuild.js dev playground
```

Menampilkan versi:

```bash
node bin/ngbuild.js --version
```

Menampilkan bantuan:

```bash
node bin/ngbuild.js --help
```

Menggunakan custom port:

```bash
node bin/ngbuild.js dev playground --port 4205
```

### Global CLI (Development)

Untuk menggunakan perintah `ngbuild` secara langsung:

```bash
npm run compile
npm link
```

Masuk ke direktori playground:

```bash
cd playground
ngbuild dev
```

Menggunakan custom port:

```bash
ngbuild dev --port 4205
```

`npm link` digunakan untuk pengembangan lokal dan tidak memublikasikan package ke npm registry.

## Default Port

NgBuild menggunakan **4178** sebagai port identitas default.

| Configuration | Value |
|---|---|
| Default Port | `4178` |
| Default Host | `127.0.0.1` |
| Default URL | `http://localhost:4178` |
| Custom Port | `--port` |
| Development Command | `ngbuild dev` |

Port dapat diubah tanpa memodifikasi source code.

## Project Structure

```text
ngbuild/
├── bin/
│   └── ngbuild.js
├── src/
│   ├── cli.ts
│   └── server.ts
├── playground/
│   ├── index.html
│   ├── react.html
│   ├── main.js
│   ├── utils.js
│   ├── app.tsx
│   └── style.css
├── .gitignore
├── package.json
├── package-lock.json
├── tsconfig.json
└── README.md
```

| Directory | Description |
|---|---|
| `bin/` | Entry point CLI NgBuild |
| `src/` | Source code utama TypeScript |
| `playground/` | Aplikasi pengujian JavaScript dan React |
| `dist/` | Output kompilasi internal TypeScript |

## Native ES Modules

NgBuild mendukung ES Modules native browser.

Contoh `utils.js`:

```javascript
export function getMessage() {
  return 'Hello from NgBuild!';
}
```

Contoh `main.js`:

```javascript
import { getMessage } from './utils.js';

document.querySelector('#app').textContent = getMessage();
```

Import relatif seperti `./utils.js` dapat digunakan langsung oleh browser.

## TypeScript & JSX/TSX Transformer

Mulai v0.3.0, NgBuild mendukung transformasi:

| Extension | Support |
|---|---|
| `.js` | Native ES Modules |
| `.mjs` | Native ES Modules |
| `.ts` | esbuild |
| `.jsx` | esbuild |
| `.tsx` | esbuild |

NgBuild menggunakan esbuild untuk mentransformasi dan membundel entry TypeScript/JSX/TSX menjadi JavaScript yang dapat dijalankan browser.

Proses ini berlangsung saat file entry diminta oleh browser.

Type-checking aplikasi secara penuh belum disediakan oleh transformer.

## React Support

NgBuild dapat menjalankan aplikasi React menggunakan TypeScript dan TSX.

Contoh `app.tsx`:

```tsx
import { useState } from 'react';
import { createRoot } from 'react-dom/client';

function App() {
  const [count, setCount] = useState<number>(0);

  return (
    <main>
      <h1>NgBuild v0.3.0</h1>
      <p>React + TypeScript + TSX</p>
      <p>Counter: {count}</p>

      <button onClick={() => setCount(count + 1)}>
        Tambah Counter
      </button>
    </main>
  );
}

const container = document.getElementById('app');

if (!container) {
  throw new Error('Root element #app not found');
}

createRoot(container).render(<App />);
```

HTML entry:

```html
<div id="app"></div>
<script type="module" src="/app.tsx"></script>
```

Jalankan:

```bash
npm run playground
```

Buka:

**http://localhost:4178/react.html**

React dan React DOM harus tersedia dalam dependencies project yang dijalankan.

## File Watcher & Auto Reload

NgBuild menggunakan File Watcher bawaan Node.js untuk mendeteksi perubahan file.

Alur kerja:

```text
Source File Changed
        |
        v
Node.js File Watcher
        |
        v
NgBuild Dev Server
        |
        v
Server-Sent Events (SSE)
        |
        v
Browser Reload
```

Ketika file berubah, NgBuild mengirimkan event melalui SSE dan browser melakukan full-page reload.

**Catatan:** Auto Reload belum menggunakan Hot Module Replacement (HMR). State React akan di-reset setelah reload.

## Development Scripts

| Command | Description |
|---|---|
| `npm run compile` | Compile TypeScript internal NgBuild |
| `npm run playground` | Compile dan jalankan playground |
| `npm run dev` | Compile dan jalankan development server |
| `npm run build` | Compile source TypeScript internal NgBuild |

Perintah `npm run build` belum menghasilkan production bundle aplikasi frontend.

## Roadmap

| Version | Development Focus | Status |
|---|---|---|
| v0.1.0 | CLI & HTTP Development Server | Completed |
| v0.2.0 | File Watcher, Auto Reload & Native ES Modules | Completed |
| v0.3.0 | TypeScript, JSX/TSX Transformer & React Support | Implemented |
| v0.4.0 | Hot Module Replacement (HMR) | Planned |
| v0.5.0 | Production Bundler & Asset Optimization | Planned |
| v0.6.0 | Plugin System | Planned |

Roadmap dapat berubah sesuai hasil pengembangan dan pengujian.

## Current Limitations

NgBuild v0.3.0 belum mendukung:

- Hot Module Replacement (HMR).
- React Fast Refresh.
- Production bundling aplikasi frontend.
- Production asset optimization dan minification.
- Plugin system.
- Type-checking penuh pada aplikasi.
- Bare imports pada JavaScript native yang tidak melalui transformer/bundler.
- Module graph dan incremental transformation seperti pada build tool yang lebih matang.

NgBuild saat ini menggunakan esbuild untuk transformasi entry TypeScript/JSX/TSX dan full-page reload selama development.

## Development

Clone repository dan jalankan:

```bash
git clone https://github.com/yedincoder/ngbuild.git
cd ngbuild
npm install
npm run playground
```

## Author

**YedinCoder**

GitHub: https://github.com/yedincoder

Repository: https://github.com/yedincoder/ngbuild

---

**NgBuild — Modern Frontend Development Tool.**

Built independently with Node.js, TypeScript, and esbuild.