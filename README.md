
# NgBuild

**A lightweight frontend development tool built with Node.js and TypeScript.**

![Version](https://img.shields.io/badge/version-0.8.0-orange)
![Node.js](https://img.shields.io/badge/Node.js-%3E%3D20-green)
![TypeScript](https://img.shields.io/badge/TypeScript-supported-blue)
![React](https://img.shields.io/badge/React-supported-61DAFB)
![Status](https://img.shields.io/badge/status-early%20development-yellow)

NgBuild adalah frontend development tool independen berbasis Node.js dan TypeScript untuk mengembangkan dan membangun aplikasi web menggunakan native ES Modules, TypeScript, JSX, dan TSX tanpa bergantung pada Vite.

NgBuild menyediakan CLI, HTTP Development Server, File Watcher, Auto Reload, CSS Hot Update, transformer dan production bundler berbasis esbuild, React Support, Plugin System, Module Graph, JavaScript HMR, serta React Fast Refresh.

> **Development Status:** NgBuild masih dalam tahap awal pengembangan. Plugin System dasar tersedia sejak v0.6.0, JavaScript HMR dasar sejak v0.7.0, dan React Fast Refresh sejak v0.8.0.

## Features

- **CLI** — Perintah `dev`, `build`, `--version`, dan `--help`.
- **Development Server** — HTTP server berbasis Node.js, port default `4178`.
- **Native ES Modules** — Menyajikan modul JavaScript langsung ke browser.
- **TypeScript, JSX & TSX** — Transformasi dan bundling menggunakan esbuild.
- **React Support** — Menjalankan aplikasi React dengan React DOM.
- **React Fast Refresh** — Memperbarui komponen React sambil mempertahankan state pada pengujian yang didukung.
- **JavaScript HMR** — Pembaruan modul JavaScript yang menerima update melalui `import.meta.hot.accept()`.
- **File Watcher & Auto Reload** — Memantau file dan mengirim pembaruan browser menggunakan SSE.
- **CSS Hot Update** — Memperbarui stylesheet tanpa full-page reload.
- **Production Build** — Membuat output `dist/` dengan bundling dan minification.
- **HTML Processing** — Memperbarui referensi module script ke hasil bundling.
- **Static Asset Serving & Copying** — Menyajikan dan menyalin aset project.
- **Plugin System** — Hook `config`, `buildStart`, dan `transform`.
- **Module Graph** — Melacak dependensi dan status penerimaan HMR.
- **Custom Port & Project Root** — Menentukan folder project dan port development.

## Requirements

- Node.js 20 atau lebih baru
- npm
- Windows, Linux, atau macOS dengan dukungan file watching yang sesuai

## Installation

```bash
git clone https://github.com/yedincoder/ngbuild.git
cd ngbuild
npm install
npm run compile
```

## Quick Start

Jalankan playground bawaan:

```bash
npm run playground
```

Development server tersedia di:

`http://localhost:4178/`

Contoh output:

```text
[NgBuild] Plugin loaded: ngbuild-example-plugin
[Example Plugin] Config: development
[Example Plugin] Build started: development

  NgBuild v0.8.0

  Local: http://localhost:4178/
  Root:  .../ngbuild/playground

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
  Plugin System: Enabled (1 loaded)

  Press Ctrl+C to stop.
```

Output plugin berlaku apabila playground menggunakan plugin contoh.

## Playground

| URL | Description |
|---|---|
| `http://localhost:4178/` | Halaman utama React playground |
| `http://localhost:4178/react.html` | React + TypeScript + React Fast Refresh |
| `http://localhost:4178/hmr.html` | JavaScript HMR test |

Pada struktur playground saat ini, `index.html` dan `react.html` sama-sama memuat `app.tsx`. Karena itu, keduanya menampilkan aplikasi React yang sama.

`hmr.html` menggunakan `hmr-test.js` untuk menguji JavaScript HMR secara terpisah.

Ketiga halaman dipertahankan untuk memeriksa regresi fitur selama pengembangan.

## CLI Usage

Development server:

```bash
node bin/ngbuild.js dev playground
```

Custom port:

```bash
node bin/ngbuild.js dev playground --port 4205
```

Production build:

```bash
node bin/ngbuild.js build playground
```

Versi dan bantuan:

```bash
node bin/ngbuild.js --version
node bin/ngbuild.js --help
```

Menggunakan CLI secara langsung selama pengembangan lokal:

```bash
npm run compile
npm link
ngbuild dev playground
ngbuild build playground
```

`npm link` tidak memublikasikan package ke npm registry.

## Default Port

| Configuration | Value |
|---|---|
| Default Port | `4178` |
| Default Host | `127.0.0.1` |
| Default URL | `http://localhost:4178` |
| Custom Port | `--port` |
| Development Command | `ngbuild dev` |
| Production Build Command | `ngbuild build` |

Port dapat diubah selama port tujuan tersedia.

Port `4179` yang digunakan selama pengujian production bukan default NgBuild, melainkan port yang dipilih untuk menjalankan static preview server.

## Project Structure

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
├── playground/
│   ├── ngbuild.config.js
│   ├── index.html
│   ├── react.html
│   ├── hmr.html
│   ├── main.js
│   ├── utils.js
│   ├── app.tsx
│   ├── hmr-test.js
│   ├── style.css
│   └── dist/
├── .gitignore
├── package.json
├── package-lock.json
├── tsconfig.json
└── README.md
```

Folder `dist/` di root repository digunakan untuk hasil kompilasi TypeScript internal NgBuild.

Folder `playground/dist/` merupakan hasil production build aplikasi playground.

## Version Management

Mulai v0.8.0, nomor versi menggunakan `package.json` sebagai sumber utama.

```json
{
  "name": "ngbuild",
  "version": "0.8.0"
}
```

`src/version.ts` membaca versi tersebut dan mengekspor `VERSION` untuk digunakan oleh CLI, development server, dan production builder.

Dengan pendekatan ini, nomor versi tidak perlu ditulis ulang secara terpisah pada setiap source file.

## Native ES Modules

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

| Extension | Development | Production |
|---|---|---|
| `.js` | Native ES Modules | Bundling untuk module script entry |
| `.mjs` | Native ES Modules | Bundling untuk module script entry |
| `.ts` | esbuild | esbuild |
| `.jsx` | esbuild + React Refresh instrumentation | esbuild |
| `.tsx` | esbuild + React Refresh instrumentation | esbuild |

Saat development, file TypeScript/JSX/TSX diproses ketika diminta browser.

Untuk `.jsx` dan `.tsx`, implementasi v0.8.0 juga menggunakan Babel React Refresh.

Pada production build, NgBuild membundel module script yang direferensikan HTML menggunakan esbuild.

Transformer tidak menyediakan type-checking penuh terhadap seluruh aplikasi pengguna.

## React Support

Contoh `app.tsx`:

```tsx
import { useState } from 'react';
import { createRoot } from 'react-dom/client';

function App() {
  const [count, setCount] = useState<number>(0);

  return (
    <main>
      <h1>NgBuild v0.8.0</h1>

      <p>React Fast Refresh Test</p>

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

React dan React DOM harus tersedia dalam dependency environment project.

## File Watcher & Auto Reload

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
Server-Sent Events
        |
        v
Browser Update
```

Perilaku pada v0.8.0:

- Perubahan `.css` mengirim `css-update`.
- Perubahan `.js`/`.mjs` yang menerima HMR mengirim `js-update`.
- Perubahan `.jsx`/`.tsx` mengirim `react-update`.
- Perubahan JavaScript yang tidak menerima HMR menggunakan fallback full-page reload.
- Perubahan HTML dan file lain menggunakan fallback full-page reload.

## CSS Hot Update

Mulai v0.4.0, NgBuild mendukung pembaruan stylesheet tanpa reload halaman.

```html
<link rel="stylesheet" href="/style.css">
```

Saat CSS berubah, browser memperbarui URL stylesheet menggunakan cache-busting query parameter.

State React tetap dipertahankan selama hanya stylesheet yang berubah.

## JavaScript HMR (v0.7.0)

NgBuild mendukung HMR dasar pada JavaScript native yang menerima update secara eksplisit.

Contoh `hmr-test.js`:

```javascript
let count = import.meta.hot?.data.count ?? 0;

function render() {
  document.querySelector('#app').innerHTML = `
    <h1>NgBuild JavaScript HMR</h1>
    <p>Counter: ${count}</p>
    <button id="increment">Tambah</button>
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

Pengujian:

```bash
node bin/ngbuild.js dev playground
```

Buka:

`http://localhost:4178/hmr.html`

Ubah judul pada `hmr-test.js` saat counter sudah dinaikkan.

Pada pengujian v0.7.0, judul berubah dan counter tetap terjaga.

JavaScript HMR dasar tetap dipertahankan pada v0.8.0.

## React Fast Refresh (v0.8.0)

NgBuild v0.8.0 menambahkan React Fast Refresh untuk perubahan komponen `.jsx` dan `.tsx`.

Komponen utama:

- **esbuild** — Transformasi JSX/TSX.
- **Babel** — Instrumentasi registrasi komponen React.
- **react-refresh** — Runtime pembaruan React.
- **React Vendor Modules** — Menyediakan modul React, React DOM, dan JSX Runtime pada development server.
- **SSE** — Mengirim event `react-update` ke browser.

Endpoint development:

```text
/__ngbuild/events
/__ngbuild/react-refresh
/__ngbuild/vendor/react.js
/__ngbuild/vendor/react-dom-client.js
/__ngbuild/vendor/jsx-runtime.js
```

### Pengujian React Fast Refresh

Jalankan:

```bash
node bin/ngbuild.js dev playground
```

Buka:

`http://localhost:4178/react.html`

Langkah pengujian:

1. Jalankan aplikasi React.
2. Naikkan counter ke angka 10.
3. Ubah teks komponen pada `app.tsx`.
4. Simpan file tanpa me-refresh browser.
5. Periksa apakah teks berubah dan counter tetap 10.

Hasil pengujian v0.8.0:

```text
NgBuild v0.8.0

React Fast Refresh Test 12345678910

Counter: 10

Tambah Counter

Powered by NgBuild
```

**Status:** React Fast Refresh berhasil mempertahankan state `useState` pada pengujian komponen playground.

Pengujian tersebut belum menjamin kompatibilitas dengan seluruh pola komponen React, custom hooks, dependency graph kompleks, atau seluruh kemungkinan perubahan module boundary.

## Production Build

Sejak v0.5.0, NgBuild menyediakan production bundling dasar.

Jalankan:

```bash
node bin/ngbuild.js build playground
```

Contoh hasil v0.8.0:

```text
[NgBuild] Plugin loaded: ngbuild-example-plugin
[Example Plugin] Config: production
[Example Plugin] Build started: production

  NgBuild v0.8.0

  Mode: Production
  Root: .../ngbuild/playground
  Out:  .../ngbuild/playground/dist
  Plugins: 1

[NgBuild] Bundled: hmr-test.js
[NgBuild] HTML processed: hmr.html
[Example Plugin] Transform: .../app.tsx (production)
[NgBuild] Bundled: app.js
[NgBuild] HTML processed: index.html
[NgBuild] HTML processed: react.html
[NgBuild] CSS optimized: style.css

  Production build completed.
```

### Production Features

| Feature | Status |
|---|---|
| HTML Entry Discovery | Supported |
| JavaScript/TypeScript/JSX/TSX Bundling | Supported |
| React Production Bundling | Supported |
| JavaScript Minification | Supported |
| CSS Minification | Supported |
| HTML Script Reference Update | Supported |
| Static Asset Copying | Supported |
| Plugin Transform Hook | Supported |
| HTML Minification | Not yet |
| Unused Source File Removal | Not yet |
| Advanced Asset Optimization | Not yet |

Production tidak menggunakan React Fast Refresh maupun development HMR runtime.

### Production Preview

Gunakan static server untuk memeriksa hasil build:

```bash
npx serve playground/dist -l 4179 --no-clean-urls
```

Akses:

```text
http://localhost:4179/
http://localhost:4179/react.html
http://localhost:4179/hmr.html
```

Port `4179` digunakan untuk memisahkan production preview dari development server `4178`.

Opsi `--no-clean-urls` digunakan pada pengujian dengan `serve` agar URL HTML tetap menggunakan ekstensi `.html`.

### Catatan Production

Builder saat ini masih menyalin beberapa file sumber yang tidak diperlukan ke output `dist/`, termasuk file konfigurasi `ngbuild.config.js`.

Optimasi untuk menghapus source file yang tidak dibutuhkan belum diterapkan.

## Plugin System

Mulai v0.6.0, NgBuild mendukung plugin melalui `ngbuild.config.js` pada root aplikasi.

Plugin bersifat opsional.

### Plugin Configuration

Contoh `playground/ngbuild.config.js`:

```javascript
export default {
  plugins: [
    {
      name: 'ngbuild-example-plugin',

      config(context) {
        console.log(
          `[Example Plugin] Config: ${context.mode}`
        );
      },

      buildStart(context) {
        console.log(
          `[Example Plugin] Build started: ${context.mode}`
        );
      },

      transform(code, id, context) {
        if (id.endsWith('app.tsx')) {
          console.log(
            `[Example Plugin] Transform: ${id} (${context.mode})`
          );
        }

        return code;
      }
    }
  ]
};
```

Plugin tersebut hanya menghasilkan log dan tidak mengubah source React.

### Plugin Hooks

| Hook | Purpose | When |
|---|---|---|
| `config(context)` | Membaca dan menyiapkan konfigurasi plugin | Saat plugin dimuat |
| `buildStart(context)` | Inisialisasi plugin | Saat server atau build dimulai |
| `transform(code, id, context)` | Memproses source modul | Saat transformasi modul |

Konteks plugin:

| Property | Type |
|---|---|
| `root` | `string` |
| `mode` | `'development' \| 'production'` |

Hook `transform` dapat mengembalikan source baru atau `null`/`undefined` untuk mempertahankan source sebelumnya.

### Plugin Limitations

- Plugin menggunakan tiga hook dasar.
- Konfigurasi dimuat saat proses dimulai.
- Perubahan konfigurasi belum di-hot-reload.
- Belum tersedia HTTP middleware plugin.
- Plugin berjalan sebagai kode Node.js; gunakan hanya plugin yang dipercaya.

## Development Scripts

| Command | Description |
|---|---|
| `npm run compile` | Kompilasi TypeScript internal NgBuild |
| `npm run playground` | Compile dan jalankan playground |
| `npm run dev` | Compile dan jalankan development server |
| `npm run build` | Compile TypeScript internal NgBuild |
| `ngbuild build [root]` | Production build aplikasi frontend |

`npm run build` pada repository NgBuild bukan perintah bundling frontend.

Gunakan `ngbuild build` untuk membangun aplikasi pengguna.

## Development Dependencies

Dependency development yang digunakan pada v0.8.0 mencakup:

- TypeScript
- esbuild
- React
- React DOM
- react-refresh
- Babel Core
- Type Definitions untuk Node.js dan Babel

Versi dependency mengikuti `package.json` dan lockfile project.

## Roadmap

| Version | Development Focus | Status |
|---|---|---|
| v0.1.0 | CLI & HTTP Development Server | Completed |
| v0.2.0 | File Watcher, Auto Reload & Native ES Modules | Completed |
| v0.3.0 | TypeScript, JSX/TSX Transformer & React Support | Completed |
| v0.4.0 | CSS Hot Update & HMR Foundation | Completed |
| v0.5.0 | Production Bundler & Basic Asset Optimization | Implemented |
| v0.6.0 | Plugin System (basic hooks) | Implemented |
| v0.7.0 | JavaScript HMR (basic) & Module Graph | Implemented; browser test passed |
| v0.8.0 | React Fast Refresh | Implemented; playground state-preservation test passed |

Pengembangan berikutnya ditentukan berdasarkan kebutuhan dan hasil pengujian.

## Current Limitations

NgBuild v0.8.0 masih memiliki keterbatasan:

- HMR dependency propagation belum lengkap.
- React Fast Refresh belum diuji pada seluruh pola aplikasi React.
- Type-checking aplikasi pengguna secara penuh belum tersedia.
- HTML minification belum tersedia.
- Unused source file removal pada production belum tersedia.
- Advanced asset optimization belum tersedia.
- Bare imports JavaScript native belum ditangani secara umum.
- Module Graph dan incremental transformation masih dapat dikembangkan lebih lanjut.
- Plugin System masih memiliki tiga hook dasar.

## Development

Clone repository:

```bash
git clone https://github.com/yedincoder/ngbuild.git
cd ngbuild
npm install
npm run playground
```

Production build:

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
