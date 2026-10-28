# NgBuild

**A lightweight frontend development tool built with Node.js and TypeScript.**

![Version](https://img.shields.io/badge/version-0.5.0-orange)
![Node.js](https://img.shields.io/badge/Node.js-%3E%3D20-green)
![TypeScript](https://img.shields.io/badge/TypeScript-supported-blue)
![React](https://img.shields.io/badge/React-supported-61DAFB)
![Status](https://img.shields.io/badge/status-early%20development-yellow)

NgBuild adalah frontend development tool independen berbasis Node.js dan TypeScript untuk mengembangkan dan membangun aplikasi web menggunakan native ES Modules, TypeScript, JSX, dan TSX tanpa bergantung pada Vite.

NgBuild menyediakan CLI, HTTP Development Server, File Watcher, Auto Reload, CSS Hot Update, TypeScript/JSX/TSX Transformer, React Support, serta Production Bundler berbasis esbuild.

> **Development Status:** NgBuild masih dalam tahap awal pengembangan. Production Build dasar sudah tersedia, sedangkan JavaScript HMR, React Fast Refresh, dan Plugin System belum diimplementasikan.

## Features

Fitur NgBuild v0.5.0:

- **CLI** — Menjalankan perintah development dan production build.
- **Development Server** — HTTP server berbasis Node.js.
- **Native ES Modules** — Mendukung JavaScript ES Modules native browser.
- **TypeScript Transformer** — Mengubah `.ts` menjadi JavaScript.
- **JSX/TSX Transformer** — Memproses `.jsx` dan `.tsx`.
- **React Support** — Menjalankan aplikasi React dengan React DOM.
- **esbuild Integration** — Transformasi dan bundling modul frontend.
- **File Watcher** — Memantau perubahan file project.
- **Auto Reload** — Refresh browser melalui Server-Sent Events (SSE).
- **CSS Hot Update** — Memperbarui stylesheet tanpa full-page reload.
- **Production Build** — Menghasilkan output frontend ke folder `dist/`.
- **JavaScript Bundling** — Membundel entry JavaScript, TypeScript, JSX, dan TSX.
- **JavaScript Minification** — Meminifikasi JavaScript hasil bundling.
- **CSS Minification** — Meminifikasi stylesheet CSS.
- **HTML Processing** — Memperbarui referensi module script ke hasil build.
- **Static Asset Serving** — Menyajikan HTML, CSS, JavaScript, JSON, dan gambar.
- **Custom Port** — Mendukung konfigurasi port melalui CLI.
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

Jalankan development playground:

```bash
npm run playground
```

Development server berjalan pada:

**http://localhost:4178**

Contoh output:

```text
NgBuild v0.5.0

Local: http://localhost:4178/
Root:  .../ngbuild/playground

File Watcher: Active
Auto Reload:  Active
CSS Hot Update: Enabled
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
| http://localhost:4178/ | Native JavaScript ES Modules |
| http://localhost:4178/react.html | React + TypeScript + TSX |

Halaman React digunakan untuk menguji transformer, rendering React, interaksi komponen, CSS Hot Update, dan hasil production build.

## CLI Usage

### Development Server

Menjalankan development server:

```bash
node bin/ngbuild.js dev playground
```

Menggunakan custom port:

```bash
node bin/ngbuild.js dev playground --port 4205
```

### Production Build

Membangun aplikasi frontend:

```bash
node bin/ngbuild.js build playground
```

Output akan dibuat di:

```text
playground/dist/
```

### Version

```bash
node bin/ngbuild.js --version
```

Output:

```text
NgBuild v0.5.0
```

### Help

```bash
node bin/ngbuild.js --help
```

### Global CLI (Development)

Untuk menggunakan perintah `ngbuild` secara langsung selama pengembangan:

```bash
npm run compile
npm link
```

Menjalankan development server:

```bash
ngbuild dev playground
```

Menjalankan production build:

```bash
ngbuild build playground
```

Menggunakan custom port:

```bash
ngbuild dev playground --port 4205
```

`npm link` digunakan untuk menghubungkan package lokal ke lingkungan pengembangan, bukan untuk memublikasikannya ke npm registry.

## Default Port

NgBuild menggunakan **4178** sebagai port identitas default.

| Configuration | Value |
|---|---|
| Default Port | `4178` |
| Default Host | `127.0.0.1` |
| Default URL | `http://localhost:4178` |
| Custom Port | `--port` |
| Development Command | `ngbuild dev` |
| Production Command | `ngbuild build` |

Port hanya digunakan oleh development server. Perintah production build tidak memerlukan port.

## Project Structure

```text
ngbuild/
├── bin/
│   └── ngbuild.js
├── src/
│   ├── cli.ts
│   ├── server.ts
│   └── build.ts
├── playground/
│   ├── index.html
│   ├── react.html
│   ├── main.js
│   ├── utils.js
│   ├── app.tsx
│   ├── style.css
│   └── dist/
│       ├── index.html
│       ├── react.html
│       ├── main.js
│       ├── utils.js
│       ├── app.js
│       ├── app.tsx
│       └── style.css
├── .gitignore
├── package.json
├── package-lock.json
├── tsconfig.json
└── README.md
```

| Directory | Description |
|---|---|
| `bin/` | Entry point CLI NgBuild |
| `src/` | Source code utama menggunakan TypeScript |
| `src/server.ts` | Development server, watcher, dan CSS Hot Update |
| `src/build.ts` | Production builder berbasis esbuild |
| `playground/` | Aplikasi pengujian JavaScript dan React |
| `playground/dist/` | Output production build playground |
| `dist/` | Output kompilasi internal TypeScript NgBuild |

## Native ES Modules

NgBuild mendukung ES Modules yang dapat diproses langsung oleh browser.

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

Mulai v0.3.0, NgBuild mendukung transformasi TypeScript, JSX, dan TSX.

| Extension | Development | Production |
|---|---|---|
| `.js` | Native ES Modules | Bundling entry |
| `.mjs` | Native ES Modules | Bundling entry |
| `.ts` | esbuild | esbuild |
| `.jsx` | esbuild | esbuild |
| `.tsx` | esbuild | esbuild |

Selama development, NgBuild menggunakan esbuild untuk mentransformasi dan membundel entry TypeScript/JSX/TSX menjadi JavaScript yang dapat dijalankan browser.

Selama production build, NgBuild membundel module script yang direferensikan oleh HTML.

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
      <h1>NgBuild v0.5.0</h1>
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
Browser Update
```

NgBuild menentukan jenis pembaruan berdasarkan file yang berubah:

- File `.css` menggunakan CSS Hot Update.
- File `.js`, `.ts`, `.jsx`, `.tsx`, dan HTML menggunakan full-page reload.
- File lainnya menggunakan fallback full-page reload.

## CSS Hot Update

Mulai v0.4.0, NgBuild mendukung pembaruan CSS tanpa melakukan reload seluruh halaman.

Ketika file `.css` berubah:

1. File Watcher mendeteksi perubahan.
2. Development server mengirimkan event `css-update` melalui SSE.
3. Browser mencari stylesheet yang sesuai.
4. URL stylesheet diperbarui menggunakan cache-busting query parameter.
5. Browser mengambil stylesheet terbaru tanpa full-page reload.

Contoh:

```html
<link rel="stylesheet" href="/style.css">
```

Ketika `style.css` disimpan, NgBuild memperbarui stylesheet secara otomatis.

### CSS Hot Update vs React Fast Refresh

| Feature | v0.5.0 |
|---|---|
| CSS Hot Update | Supported |
| Full-page Auto Reload | Supported |
| TypeScript/JSX/TSX Transform | Supported |
| Production Build | Supported |
| JavaScript HMR | Not yet |
| React Fast Refresh | Not yet |
| React State Preservation on CSS Change | Supported |
| React State Preservation on TSX Change | Not yet |

Perubahan TSX masih memicu full-page reload sehingga state React akan di-reset.

## Production Build

Mulai v0.5.0, NgBuild menyediakan perintah production build.

Jalankan:

```bash
node bin/ngbuild.js build playground
```

Contoh output:

```text
NgBuild v0.5.0

Mode: Production
Root: .../ngbuild/playground
Out:  .../ngbuild/playground/dist

[NgBuild] Bundled: app.js
[NgBuild] HTML processed: index.html
[NgBuild] HTML processed: react.html
[NgBuild] CSS optimized: style.css

Production build completed.

Output: .../ngbuild/playground/dist
```

### Production Build Process

```text
Source Project
      |
      v
HTML Entry Discovery
      |
      v
Module Script Detection
      |
      v
esbuild Bundling
      |
      v
JavaScript Minification
      |
      v
CSS Minification
      |
      v
HTML Script Reference Update
      |
      v
Production Output (dist/)
```

### Production Build Features

| Feature | Status |
|---|---|
| HTML Entry Discovery | Supported |
| JavaScript Bundling | Supported |
| TypeScript Bundling | Supported |
| JSX/TSX Bundling | Supported |
| React Production Bundling | Supported |
| JavaScript Minification | Supported |
| CSS Minification | Supported |
| HTML Script Reference Update | Supported |
| Static Asset Copying | Supported |
| HTML Minification | Not yet |
| Unused Source File Removal | Not yet |
| Advanced Asset Optimization | Not yet |

### Production Output

NgBuild membuat direktori `dist/` di dalam project yang dibangun.

Contoh:

```text
playground/
├── index.html
├── react.html
├── main.js
├── utils.js
├── app.tsx
├── style.css
└── dist/
    ├── index.html
    ├── react.html
    ├── main.js
    ├── utils.js
    ├── app.js
    ├── app.tsx
    └── style.css
```

File sumber yang tidak diperlukan masih dapat ikut tersalin ke output pada v0.5.0.

### Testing Production Output

Setelah build selesai, jalankan:

```bash
node bin/ngbuild.js dev playground/dist --port 4205
```

Buka:

**http://localhost:4205/react.html**

Perintah ini menggunakan development server untuk menguji hasil build, bukan menjalankan production server khusus.

## Development Scripts

| Command | Description |
|---|---|
| `npm run compile` | Compile TypeScript internal NgBuild |
| `npm run playground` | Compile dan jalankan playground |
| `npm run dev` | Compile dan jalankan development server |
| `npm run build` | Compile source TypeScript internal NgBuild |
| `ngbuild build [root]` | Production build aplikasi frontend |

**Catatan:** `npm run build` pada repository NgBuild masih digunakan untuk kompilasi internal. Untuk membangun aplikasi frontend, gunakan `ngbuild build`.

## Roadmap

| Version | Development Focus | Status |
|---|---|---|
| v0.1.0 | CLI & HTTP Development Server | Completed |
| v0.2.0 | File Watcher, Auto Reload & Native ES Modules | Completed |
| v0.3.0 | TypeScript, JSX/TSX Transformer & React Support | Completed |
| v0.4.0 | CSS Hot Update & HMR Foundation | Completed |
| v0.5.0 | Production Bundler & Basic Asset Optimization | Implemented |
| v0.6.0 | Plugin System | Planned |

Roadmap dapat berubah sesuai hasil pengembangan dan pengujian.

## Current Limitations

NgBuild v0.5.0 belum mendukung:

- JavaScript Hot Module Replacement.
- React Fast Refresh.
- HTML minification.
- Penghapusan otomatis file sumber yang tidak diperlukan dari production output.
- Advanced asset optimization.
- Plugin system.
- Type-checking penuh pada aplikasi.
- Bare imports pada JavaScript native yang tidak melalui transformer/bundler.
- Module graph dan incremental transformation seperti pada build tool yang lebih matang.

NgBuild menggunakan esbuild untuk transformasi TypeScript/JSX/TSX, CSS Hot Update untuk stylesheet selama development, dan production bundling dasar untuk menghasilkan aplikasi frontend.

## Development

Repository ini dikembangkan secara bertahap dengan mempertahankan kompatibilitas fitur yang sudah berjalan.

Untuk memulai pengembangan:

```bash
git clone https://github.com/yedincoder/ngbuild.git
cd ngbuild
npm install
npm run playground
```

Untuk membuat production build:

```bash
node bin/ngbuild.js build playground
```

## Author

**YedinCoder**

GitHub: https://github.com/yedincoder

Repository: https://github.com/yedincoder/ngbuild

---

**NgBuild — Modern Frontend Development Tool.**

Built independently with Node.js, TypeScript, and esbuild.