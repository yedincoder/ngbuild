# NgBuild

**A lightweight frontend development tool built with Node.js and TypeScript.**

![Version](https://img.shields.io/badge/version-0.7.0-orange)

![Node.js](https://img.shields.io/badge/Node.js-%3E%3D20-green)

![TypeScript](https://img.shields.io/badge/TypeScript-supported-blue)

![React](https://img.shields.io/badge/React-supported-61DAFB)

![Status](https://img.shields.io/badge/status-early%20development-yellow)

NgBuild adalah frontend development tool independen berbasis Node.js dan TypeScript untuk mengembangkan dan membangun aplikasi web menggunakan native ES Modules, TypeScript, JSX, dan TSX tanpa bergantung pada Vite.

NgBuild menyediakan CLI, HTTP Development Server, File Watcher, Auto Reload, CSS Hot Update, transformer dan production bundler berbasis esbuild, React Support, Plugin System, Module Graph, serta JavaScript HMR dasar.

> **Development Status:** NgBuild masih dalam tahap awal pengembangan. Plugin System dasar tersedia sejak v0.6.0. JavaScript HMR dasar tersedia sejak v0.7.0 untuk modul JavaScript yang menerima update melalui `import.meta.hot.accept()`. React Fast Refresh belum tersedia.

## Features

- ****CLI**** — Perintah `dev`, `build`, `--version`, dan `--help`.

- ****Development Server**** — HTTP server berbasis Node.js, port default `4178`.

- ****Native ES Modules**** — Menyajikan JavaScript ES Modules langsung ke browser.

- ****TypeScript, JSX & TSX**** — Transformasi dan bundling dengan esbuild.

- ****React Support**** — Menjalankan aplikasi React dengan React DOM.

- ****File Watcher & Auto Reload**** — Memantau file dan me-refresh browser menggunakan Server-Sent Events (SSE).

- ****CSS Hot Update**** — Memperbarui stylesheet tanpa full-page reload.

- ****Production Build**** — Membuat output `dist/`, bundling JavaScript dan minification JavaScript/CSS.

- ****HTML Processing**** — Memperbarui referensi module script ke hasil bundling.

- ****Static Asset Serving & Copying**** — Menyajikan aset saat development dan menyalin file project saat build.

- ****Plugin System**** — Memuat plugin melalui `ngbuild.config.js` dan menjalankan hook `config`, `buildStart`, serta `transform`.

- ****Custom Port & Project Root**** — Menentukan root aplikasi dan port development.

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

Development server tersedia di ****http://localhost:4178/****.

Contoh output:

```text

[NgBuild] Plugin loaded: ngbuild-example-plugin

[Example Plugin] Config: development

[Example Plugin] Build started: development

NgBuild v0.7.0

Local: http://localhost:4178/

Root:  .../ngbuild/playground

File Watcher: Active

Auto Reload:  Active

CSS Hot Update: Enabled
JavaScript HMR: Enabled
Module Graph:  Enabled

ES Modules:   Native

TypeScript:   Enabled

JSX / TSX:    Enabled

React:        Supported

Plugin System: Enabled (1 loaded)

Press Ctrl+C to stop.

```

Output plugin di atas berlaku jika `playground/ngbuild.config.js` berisi plugin contoh.

## Playground

| URL | Description |

|---|---|

| http://localhost:4178/ | Native JavaScript ES Modules |

| http://localhost:4178/react.html | React + TypeScript + TSX |
| http://localhost:4178/hmr.html | JavaScript HMR test |

Halaman React digunakan untuk menguji transformer, rendering React, counter, CSS Hot Update, hook plugin, dan hasil production build.

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

Untuk menggunakan `ngbuild` secara langsung selama pengembangan lokal:

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

| Production Command | `ngbuild build` |

`--port` hanya berlaku untuk development server.

## Project Structure

```text

ngbuild/

├── bin/

│   └── ngbuild.js

├── src/

│   ├── cli.ts

│   ├── server.ts

│   ├── build.ts

│   └── plugins/

│       ├── types.ts

│       └── loader.ts

├── playground/

│   ├── ngbuild.config.js

│   ├── index.html

│   ├── react.html

│   ├── main.js

│   ├── utils.js

│   ├── app.tsx

│   ├── style.css

│   └── dist/             # Production output (generated)

├── .gitignore

├── package.json

├── package-lock.json

├── tsconfig.json

└── README.md

```

Folder `dist/` di root repository digunakan untuk hasil kompilasi internal TypeScript NgBuild. Folder `playground/dist/` adalah output production build aplikasi playground.

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

| `.js` | Native ES Modules | Bundling jika menjadi module script entry |

| `.mjs` | Native ES Modules | Bundling jika menjadi module script entry |

| `.ts` | esbuild | esbuild |

| `.jsx` | esbuild | esbuild |

| `.tsx` | esbuild | esbuild |

Saat development, entry TypeScript/JSX/TSX diproses ketika diminta browser. Pada production build, NgBuild membundel module script yang direferensikan oleh HTML. Type-checking penuh belum disediakan oleh transformer.

## React Support

Contoh `app.tsx`:

```tsx

import { useState } from 'react';

import { createRoot } from 'react-dom/client';

function App() {

  const [count, setCount] = useState\<number>(0);

  return (

    \<main>

      \<h1>NgBuild v0.7.0\</h1>

      \<p>React + TypeScript + TSX\</p>

      \<p>Counter: {count}\</p>

      \<button onClick={() => setCount(count + 1)}>

        Tambah Counter

      \</button>

    \</main>

  );

}

const container = document.getElementById('app');

if (!container) {

  throw new Error('Root element #app not found');

}

createRoot(container).render(\<App />);

```

HTML entry:

```html

\<div id="app">\</div>

\<script type="module" src="/app.tsx">\</script>

```

React dan React DOM harus tersedia sebagai dependencies project yang dijalankan.

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

Server-Sent Events (SSE)

        |

        v

Browser Update

```

- Perubahan `.css` mengirim event `css-update`.

- Perubahan `.js`/`.mjs` yang telah terdaftar sebagai self-accepting module mengirim event `js-update`.
- Perubahan `.js`/`.mjs` yang tidak menerima HMR, serta `.ts`, `.jsx`, `.tsx`, atau HTML, memicu full-page reload.

- Perubahan file lain menggunakan fallback full-page reload.

## CSS Hot Update

Mulai v0.4.0, NgBuild dapat memperbarui stylesheet tanpa full-page reload.

```html

\<link rel="stylesheet" href="/style.css">

```

Saat `style.css` disimpan, watcher mengirim event `css-update` melalui SSE. Browser menambahkan cache-busting query parameter pada stylesheet terkait dan mengambil CSS terbaru. State React tetap terjaga ketika hanya stylesheet yang berubah.

| Feature | v0.7.0 |

|---|---|

| CSS Hot Update | Supported |

| Full-page Auto Reload | Supported |

| TypeScript/JSX/TSX Transform | Supported |

| Production Build | Supported |

| Plugin System (basic hooks) | Supported |

| JavaScript HMR (self-accepting `.js`/`.mjs`) | Supported (basic) |

| React Fast Refresh | Not yet |

| React State Preservation on CSS Change | Supported |

| React State Preservation on TSX Change | Not yet |

## JavaScript HMR (v0.7.0)

NgBuild menyediakan HMR dasar untuk JavaScript native yang secara eksplisit menerima pembaruan. Runtime HMR diinjeksikan ke HTML oleh development server, lalu menggunakan SSE untuk menerima event `js-update`.

Contoh `playground/hmr-test.js`:

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

Jalankan `node bin/ngbuild.js dev playground`, lalu buka `http://localhost:4178/hmr.html`. Naikkan counter, ubah judul di `hmr-test.js`, dan simpan. Pada pengujian v0.7.0, judul berubah sementara counter tetap bernilai 4. Ini merupakan pengujian HMR dasar, bukan jaminan untuk seluruh pola impor atau framework.

**Batasan:** HMR ini berlaku untuk modul `.js`/`.mjs` yang menerima update sendiri; React Fast Refresh, HMR TypeScript/TSX, dan propagasi pembaruan dependency yang lebih lengkap belum tersedia.

## Production Build

Mulai v0.5.0, NgBuild menyediakan production bundling dasar:

```bash

node bin/ngbuild.js build playground

```

Contoh output production build dengan plugin contoh (format output dapat berbeda sesuai implementasi):

```text

[NgBuild] Plugin loaded: ngbuild-example-plugin

[Example Plugin] Config: production

[Example Plugin] Build started: production

NgBuild v0.7.0

Mode: Production

Root: .../ngbuild/playground

Out:  .../ngbuild/playground/dist

Plugins: 1

[Example Plugin] Transform: .../app.tsx (production)

[NgBuild] Bundled: app.js

[NgBuild] HTML processed: index.html

[NgBuild] HTML processed: react.html

[NgBuild] CSS optimized: style.css

Production build completed.

```

Proses build mencakup penemuan file HTML, pembacaan module script, bundling dengan esbuild, minification JavaScript/CSS, pembaruan referensi script di HTML, dan penulisan output ke `dist/`.

| Production Feature | Status |

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

**Catatan:** implementasi build saat ini masih menyalin file sumber yang tidak diperlukan ke output. File `ngbuild.config.js` juga ikut tersalin oleh mekanisme copy saat ini.

Untuk menguji output build menggunakan development server:

```bash

node bin/ngbuild.js dev playground/dist --port 4205

```

Buka ****http://localhost:4205/react.html****. Perintah tersebut bukan production server khusus.

## Plugin System

Mulai ****v0.6.0****, NgBuild mendukung plugin melalui file konfigurasi `ngbuild.config.js` di root aplikasi yang dijalankan.

Plugin bersifat opsional: project tanpa file konfigurasi tetap dapat menggunakan development server dan production build.

### Plugin Configuration

Buat file `playground/ngbuild.config.js`:

```javascript

export default {

  plugins: [

    {

      name: 'ngbuild-example-plugin',

      config(context) {

        console.log(`[Example Plugin] Config: ${context.mode}`);

      },

      buildStart(context) {

        console.log(`[Example Plugin] Build started: ${context.mode}`);

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

Plugin tersebut hanya menulis log, tanpa mengubah source React atau hasil build.

### Plugin Hooks

| Hook | Purpose | When |

|---|---|---|

| `config(context)` | Membaca konteks dan menyiapkan plugin | Saat konfigurasi plugin dimuat |

| `buildStart(context)` | Inisialisasi sebelum development server atau production build berjalan | Setelah plugin dimuat |

| `transform(code, id, context)` | Mengubah source modul yang diproses esbuild | Saat modul diproses |

Konteks plugin menyediakan:

| Property | Type | Description |

|---|---|---|

| `root` | `string` | Absolute path root aplikasi |

| `mode` | `'development' \| 'production'` | Mode eksekusi |

Hook `transform` dapat mengembalikan string kode baru, atau `null`/`undefined` untuk membiarkan kode tetap seperti sebelumnya. Jika ada beberapa plugin, hook dijalankan berurutan mengikuti array `plugins`.

### Plugin Execution

Development:

```bash

node bin/ngbuild.js dev playground

```

Buka ****http://localhost:4178/react.html**** untuk memicu transform `app.tsx`.

Production:

```bash

node bin/ngbuild.js build playground

```

Ketika `app.tsx` diproses, hook `transform` berjalan dengan `context.mode` bernilai `production`.

### Plugin Limitations

- Hook `transform` digunakan oleh esbuild dan juga oleh jalur penyajian JavaScript native di development server.

- File `ngbuild.config.js` dibaca saat proses dimulai; perubahan konfigurasi belum dimuat ulang otomatis.

- API plugin saat ini hanya memiliki tiga hook dasar, belum menyediakan sistem middleware HTTP atau hook tambahan.

- Plugin berjalan sebagai kode JavaScript Node.js di lingkungan project; gunakan hanya plugin yang dipercaya.

## Development Scripts

| Command | Description |

|---|---|

| `npm run compile` | Compile TypeScript internal NgBuild |

| `npm run playground` | Compile dan jalankan playground |

| `npm run dev` | Compile dan jalankan development server |

| `npm run build` | Compile TypeScript internal NgBuild |

| `ngbuild build [root]` | Production build aplikasi frontend |

`npm run build` di repository NgBuild bukan perintah untuk menghasilkan bundle frontend. Gunakan `ngbuild build` untuk aplikasi.

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

Roadmap dapat berubah sesuai hasil pengembangan dan pengujian.

## Current Limitations

NgBuild v0.7.0 belum mendukung React Fast Refresh, HMR untuk TypeScript/TSX, propagasi dependency HMR yang lengkap, HTML minification, penghapusan otomatis source yang tidak diperlukan dari production output, advanced asset optimization, type-checking aplikasi secara penuh, atau module graph dan incremental transformation yang lebih matang. Bare imports pada JavaScript native yang tidak diproses bundler juga belum ditangani secara umum.

## Development

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

****NgBuild — Modern Frontend Development Tool.****

Built independently with Node.js, TypeScript, and esbuild.
