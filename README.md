
# NgBuild

**A lightweight frontend development and build tool built with Node.js and TypeScript.**

![Version](https://img.shields.io/badge/version-0.9.0-orange)
![Node.js](https://img.shields.io/badge/Node.js-%3E%3D20-green)
![TypeScript](https://img.shields.io/badge/TypeScript-supported-blue)
![React](https://img.shields.io/badge/React-supported-61DAFB)
![Status](https://img.shields.io/badge/status-pre--release-yellow)

NgBuild adalah frontend development tool independen berbasis Node.js dan TypeScript untuk mengembangkan dan membangun aplikasi web menggunakan native ES Modules, TypeScript, JSX, dan TSX tanpa bergantung pada Vite.

NgBuild menyediakan CLI, HTTP Development Server, File Watcher, Auto Reload, CSS Hot Update, TypeScript Transformer, Production Bundler berbasis esbuild, React Support, Plugin System, Module Graph, JavaScript HMR, React Fast Refresh, HTML Minification, Production Build Optimization, dan JavaScript HMR Dependency Propagation.

> **Development Status:** NgBuild v0.9.0 telah menyelesaikan pengujian fitur utama, production build, dan instalasi package lokal pada project eksternal. Versi ini masih dalam tahap pre-release dan belum dinyatakan sebagai rilis stabil v1.0.0.

## Features

- **CLI** — Perintah `dev`, `build`, `--version`, dan `--help`.
- **Development Server** — HTTP server berbasis Node.js dengan port default `4178`.
- **Native ES Modules** — Menyajikan modul JavaScript langsung ke browser.
- **TypeScript, JSX & TSX** — Transformasi menggunakan esbuild.
- **React Support** — Mendukung aplikasi React dan React DOM.
- **React Fast Refresh** — Memperbarui komponen React dan mempertahankan state pada pengujian yang didukung.
- **JavaScript HMR** — Memperbarui modul yang menerima perubahan melalui `import.meta.hot.accept()`.
- **HMR Dependency Propagation** — Menelusuri dependency dan menemukan modul pengimpor yang menerima HMR.
- **Module Graph** — Melacak hubungan dependencies, importers, dan HMR boundaries.
- **File Watcher & Auto Reload** — Memantau perubahan file menggunakan Node.js File Watcher dan Server-Sent Events.
- **CSS Hot Update** — Memperbarui stylesheet tanpa full-page reload.
- **Production Bundling** — Membundel JavaScript, TypeScript, JSX, dan TSX menggunakan esbuild.
- **JavaScript Minification** — Meminimalkan kode JavaScript hasil bundling.
- **CSS Minification** — Mengoptimalkan file CSS.
- **HTML Minification** — Mengurangi whitespace dan komentar HTML secara konservatif.
- **Production Build Optimization** — Mengecualikan source dan konfigurasi development yang tidak diperlukan dari output.
- **Static Asset Support** — Menyajikan dan menyalin aset statis.
- **Plugin System** — Hook `config`, `buildStart`, dan `transform`.
- **Custom Port & Project Root** — Menentukan folder project dan port development.
- **Local Package Distribution** — Mendukung instalasi package dari folder atau tarball npm.

## Requirements

- Node.js 20 atau lebih baru.
- npm.
- Windows, Linux, atau macOS dengan dukungan file watching sesuai platform.

## Installation

### Development from Source

Clone repository:

```bash
git clone https://github.com/yedincoder/ngbuild.git
cd ngbuild
npm install
npm run compile
```

### Local Package Installation

NgBuild dapat diuji sebagai package lokal tanpa melakukan publikasi ke npm registry.

Contoh struktur:

```text
ngappid-project/
├── ngbuild/
└── ngbuild-test/
```

Dari folder `ngbuild-test`:

```bash
npm install -D ../ngbuild
```

Pada Windows PowerShell:

```powershell
npm install -D ..\ngbuild
```

Verifikasi:

```bash
npx ngbuild --version
npx ngbuild --help
```

> **Catatan:** Nama `ngbuild` juga ditemukan sebagai package pada npm registry. Perintah `npm install -D ngbuild` tidak boleh diasumsikan menginstal source NgBuild dari repository ini. Untuk pengujian versi lokal, gunakan path folder atau file tarball yang dihasilkan dari repository.

## Quick Start

### Run Built-in Playground

Dari repository NgBuild:

```bash
npm run playground
```

Development server tersedia di:

```text
http://localhost:4178/
```

Contoh output:

```text
[NgBuild] Plugin loaded: ngbuild-example-plugin
[Example Plugin] Config: development
[Example Plugin] Build started: development

  NgBuild v0.9.0

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

Jumlah plugin bergantung pada konfigurasi project.

### Build Playground

```bash
node bin/ngbuild.js build playground
```

Hasil production build berada di:

```text
playground/dist/
```

## Playground

NgBuild menyediakan empat halaman pengujian.

| URL | Description |
|---|---|
| `http://localhost:4178/` | React playground utama |
| `http://localhost:4178/react.html` | React Fast Refresh |
| `http://localhost:4178/hmr.html` | JavaScript HMR |
| `http://localhost:4178/dependency.html` | JavaScript HMR Dependency Propagation |

`index.html` dan `react.html` sama-sama menggunakan `app.tsx`.

`hmr.html` menggunakan `hmr-test.js` untuk pengujian JavaScript HMR.

`dependency.html` menggunakan `main.js` yang mengimpor `utils.js` untuk menguji HMR Dependency Propagation.

Keempat halaman digunakan untuk pengujian fitur dan pemeriksaan regresi.

## CLI Usage

### Development Server

```bash
node bin/ngbuild.js dev playground
```

Atau setelah package NgBuild terinstal:

```bash
npx ngbuild dev
```

### Custom Port

```bash
node bin/ngbuild.js dev playground --port 4205
```

### Production Build

```bash
node bin/ngbuild.js build playground
```

Dari project yang sudah memasang NgBuild:

```bash
npx ngbuild build
```

### Version

```bash
npx ngbuild --version
```

Contoh output:

```text
NgBuild v0.9.0
```

### Help

```bash
npx ngbuild --help
```

Output:

```text
NgBuild v0.9.0

Usage:
  ngbuild dev [root]
  ngbuild dev [root] --port 4178
  ngbuild build [root]
  ngbuild --version
  ngbuild --help

Commands:
  dev      Start development server
  build    Create optimized production output

Options:
  --port   Development server port (default: 4178)
  --version, -v
  --help, -h
```

### Local CLI Linking

Untuk menjalankan CLI langsung dari repository:

```bash
npm run compile
npm link
```

Setelah linking:

```bash
ngbuild dev playground
ngbuild build playground
```

`npm link` tidak menerbitkan package ke npm registry.

## Default Port

| Configuration | Value |
|---|---|
| Default Port | `4178` |
| Default Host | `127.0.0.1` |
| Default URL | `http://localhost:4178` |
| Custom Port | `--port` |
| Development Command | `ngbuild dev` |
| Production Build Command | `ngbuild build` |

Port `4179` yang digunakan selama pengujian production merupakan port static preview server, bukan default NgBuild.

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
├── dist/
│   ├── cli.js
│   ├── server.js
│   ├── build.js
│   ├── version.js
│   ├── hmr/
│   └── plugins/
├── playground/
│   ├── ngbuild.config.js
│   ├── index.html
│   ├── react.html
│   ├── hmr.html
│   ├── dependency.html
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

Folder `dist/` di root repository merupakan output kompilasi TypeScript internal NgBuild.

Folder `playground/dist/` merupakan output production build aplikasi playground.

Kedua folder memiliki fungsi berbeda.

## Version Management

Sejak v0.8.0, versi NgBuild menggunakan `package.json` sebagai sumber utama.

Contoh:

```json
{
  "name": "ngbuild",
  "version": "0.9.0"
}
```

`src/version.ts` membaca nomor versi tersebut dan mengekspor `VERSION`.

Nilai `VERSION` digunakan oleh:

- CLI.
- Development Server.
- Production Builder.

Perubahan versi tidak perlu dilakukan secara manual pada setiap source file.

## Native ES Modules

NgBuild mendukung JavaScript menggunakan native ES Modules.

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
| `.js` | Native ES Modules + HMR | Bundling untuk module entry |
| `.mjs` | Native ES Modules + HMR | Bundling untuk module entry |
| `.ts` | esbuild | esbuild |
| `.jsx` | esbuild + React Refresh | esbuild |
| `.tsx` | esbuild + React Refresh | esbuild |

Saat development, TypeScript, JSX, dan TSX ditransformasi menggunakan esbuild.

Untuk JSX/TSX, NgBuild menggunakan instrumentasi Babel React Refresh.

Saat production, JavaScript dan TypeScript yang direferensikan sebagai HTML module script dibundel menggunakan esbuild.

Transformer tidak melakukan type-checking penuh terhadap seluruh aplikasi pengguna.

## React Support

Contoh aplikasi React:

```tsx
import { useState } from 'react';
import { createRoot } from 'react-dom/client';

function App() {
  const [count, setCount] = useState<number>(0);

  return (
    <main>
      <h1>NgBuild</h1>

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

React dan React DOM harus tersedia pada environment tempat aplikasi digunakan.

## File Watcher & Auto Reload

Alur pembaruan development:

```text
Source File Changed
        |
        v
Node.js File Watcher
        |
        v
NgBuild Development Server
        |
        v
Server-Sent Events
        |
        v
Browser Update
```

Perilaku NgBuild v0.9.0:

- Perubahan `.css` mengirim event `css-update`.
- Perubahan `.js` atau `.mjs` diperiksa melalui Module Graph.
- Jika tersedia HMR boundary yang valid, server mengirim `js-update`.
- Jika perubahan JavaScript tidak dapat diterima, browser melakukan full-page reload.
- Perubahan `.jsx` atau `.tsx` mengirim `react-update`.
- Perubahan HTML dan file lain umumnya menggunakan fallback full-page reload.

## CSS Hot Update

Sejak v0.4.0, NgBuild mendukung pembaruan stylesheet tanpa reload halaman.

Contoh:

```html
<link rel="stylesheet" href="/style.css">
```

Saat file CSS berubah, browser memperbarui URL stylesheet dengan cache-busting query parameter.

Pengujian CSS Hot Update dilakukan tanpa melakukan full-page reload.

## JavaScript HMR (v0.7.0)

JavaScript HMR memungkinkan modul JavaScript menerima pembaruan tanpa memuat ulang seluruh halaman.

Contoh:

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

```text
http://localhost:4178/hmr.html
```

Naikkan counter, lalu ubah teks di `hmr-test.js`.

Pada pengujian fitur, teks berhasil berubah dan counter tetap dipertahankan.

## JavaScript HMR Dependency Propagation (v0.9.0)

NgBuild v0.9.0 menambahkan kemampuan menelusuri hubungan dependency pada Module Graph untuk menentukan HMR boundary.

Contoh dependency:

```text
main.js
   |
   +-- imports utils.js
```

Jika `utils.js` berubah, Module Graph memeriksa apakah `main.js` atau modul pengimpor lainnya dapat menerima pembaruan.

### Module Graph

Setiap Module Node menyimpan:

```typescript
interface ModuleNode {
  id: string;
  dependencies: Set<string>;
  importers: Set<string>;
  selfAccepting: boolean;
}
```

Method terkait:

- `ensureEntry()` — membuat atau memperoleh module node.
- `updateModule()` — memperbarui hubungan dependency.
- `getModule()` — memperoleh module node.
- `isHmrAccepted()` — memeriksa penerimaan HMR.
- `getHmrBoundaries()` — mencari HMR boundaries.
- `getHmrPropagation()` — memeriksa jalur propagasi.
- `toBrowserPath()` — mengubah path filesystem menjadi browser path.
- `clear()` — mengosongkan graph.

### Dependency HMR Example

`playground/utils.js`:

```javascript
export function getMessage() {
  return 'NgBuild Auto Reload berhasil!';
}
```

`playground/main.js` mengimpor `getMessage()` dari `utils.js` dan menerima HMR.

Halaman pengujian:

```text
http://localhost:4178/dependency.html
```

Langkah pengujian:

1. Jalankan development server.
2. Buka `dependency.html`.
3. Naikkan counter sampai 10.
4. Ubah pesan di `utils.js`.
5. Simpan file.
6. Periksa pesan dan counter tanpa refresh manual.

Hasil pengujian v0.9.0:

```text
NgBuild Dependency HMR

NgBuild Dependency HMR v0.9.0 berhasil!

Port default: 4178

Counter: 10

Tambah Counter

Edit utils.js untuk menguji Dependency HMR.
```

**Status:** Dependency HMR berhasil memperbarui pesan dari `utils.js`, dan counter tetap 10 pada pengujian playground.

Pengujian ini belum membuktikan kompatibilitas dengan seluruh pola dependency graph atau seluruh jenis import JavaScript.

## React Fast Refresh (v0.8.0)

React Fast Refresh memperbarui komponen React saat pengembangan tanpa kehilangan state pada perubahan yang didukung.

Komponen utama:

- **esbuild** — Transformasi JSX/TSX.
- **Babel** — Instrumentasi React Refresh.
- **react-refresh** — Runtime pembaruan React.
- **React Vendor Modules** — Menyediakan modul React, React DOM, dan JSX Runtime.
- **SSE** — Mengirim event pembaruan ke browser.

Endpoint development:

```text
/__ngbuild/events
/__ngbuild/react-refresh
/__ngbuild/vendor/react.js
/__ngbuild/vendor/react-dom-client.js
/__ngbuild/vendor/jsx-runtime.js
```

### React Fast Refresh Test

Jalankan:

```bash
node bin/ngbuild.js dev playground
```

Buka:

```text
http://localhost:4178/react.html
```

Langkah pengujian:

1. Jalankan aplikasi React.
2. Naikkan counter sampai 10.
3. Ubah teks komponen di `app.tsx`.
4. Simpan tanpa refresh manual.
5. Periksa apakah teks berubah dan counter tetap 10.

Hasil pengujian:

```text
NgBuild v0.8.0

React Fast Refresh Test 12345678910

Counter: 10

Tambah Counter

Powered by NgBuild
```

**Status:** React Fast Refresh berhasil mempertahankan state `useState` pada pengujian playground.

Hasil tersebut belum menjamin seluruh kemungkinan React component boundaries, custom hooks, atau pola aplikasi kompleks.

## Production Build

NgBuild menyediakan production bundling menggunakan esbuild.

Jalankan:

```bash
node bin/ngbuild.js build playground
```

Contoh output v0.9.0:

```text
[NgBuild] Plugin loaded: ngbuild-example-plugin
[Example Plugin] Config: production
[Example Plugin] Build started: production

  NgBuild v0.9.0

  Mode: Production
  Root: .../ngbuild/playground
  Out:  .../ngbuild/playground/dist
  Plugins: 1

[NgBuild] Production assets copied.
[NgBuild] Bundled: main.js
[NgBuild] HTML processed: dependency.html
[NgBuild] HTML optimized: dependency.html
[NgBuild] Bundled: hmr-test.js
[NgBuild] HTML processed: hmr.html
[NgBuild] HTML optimized: hmr.html
[Example Plugin] Transform: .../app.tsx (production)
[NgBuild] Bundled: app.js
[NgBuild] HTML processed: index.html
[NgBuild] HTML optimized: index.html
[NgBuild] HTML processed: react.html
[NgBuild] HTML optimized: react.html
[NgBuild] CSS optimized: style.css

  Production build completed.
```

### Production Features

| Feature | Status |
|---|---|
| HTML Entry Discovery | Supported |
| JavaScript Bundling | Supported |
| TypeScript Bundling | Supported |
| JSX/TSX Bundling | Supported |
| React Production Bundling | Supported |
| JavaScript Minification | Supported |
| CSS Minification | Supported |
| HTML Minification | Supported |
| HTML Script Reference Update | Supported |
| Production Asset Cleanup | Supported |
| Static Asset Copying | Supported |
| Plugin Transform Hook | Supported |
| Advanced Asset Optimization | Not yet |

Development HMR runtime dan React Fast Refresh tidak digunakan pada output production.

### HTML Minification (v0.9.0)

NgBuild menggunakan `html-minifier-terser` untuk mengoptimalkan HTML saat production build.

Optimasi mencakup:

- Pengurangan whitespace.
- Penghapusan komentar HTML.
- Pengurangan redundant attributes sesuai konfigurasi konservatif.
- Mempertahankan optional tags dan atribut yang berpotensi memengaruhi kompatibilitas.

JavaScript dan CSS tidak diminifikasi melalui HTML Minifier karena keduanya sudah memiliki proses optimasi tersendiri.

### Production Build Optimization (v0.9.0)

NgBuild tidak lagi menyalin seluruh source project secara langsung.

File development yang dikecualikan mencakup:

- Source TypeScript/TSX dan JSX yang tidak diperlukan sebagai aset statis.
- Source JavaScript yang tidak diperlukan sebagai file terpisah setelah bundling.
- `ngbuild.config.js`.
- `ngbuild.config.mjs`.
- `ngbuild.config.ts`.
- `tsconfig.json`.
- `package.json`.
- `package-lock.json`.
- `npm-shrinkwrap.json`.

HTML, CSS, gambar, font, JSON yang relevan, dan aset statis lainnya tetap dapat disalin.

JavaScript klasik yang direferensikan HTML tetap didukung.

**Batasan:** aset atau JavaScript yang hanya dimuat melalui pola dynamic runtime tertentu belum dijamin terdeteksi otomatis.

### Playground Production Output

Pada pengujian v0.9.0, output `playground/dist/` berisi:

```text
playground/dist/
├── app.js
├── dependency.html
├── hmr-test.js
├── hmr.html
├── index.html
├── main.js
├── react.html
└── style.css
```

Source `app.tsx`, `utils.js`, dan konfigurasi plugin tidak ikut disalin sebagai file sumber terpisah.

### Production Preview

Jalankan static preview server:

```bash
npx serve playground/dist -l 4179
```

Untuk pengujian dengan `serve` yang membutuhkan URL HTML tetap berekstensi `.html`, konfigurasi dapat dibuat di `playground/dist/serve.json`:

```json
{
  "cleanUrls": false
}
```

Kemudian jalankan ulang static server.

Akses langsung:

```text
http://127.0.0.1:4179/index.html
http://127.0.0.1:4179/react.html
http://127.0.0.1:4179/hmr.html
http://127.0.0.1:4179/dependency.html
```

Pada pengujian, server mengembalikan HTTP 200 atau 304 untuk file aplikasi.

HTTP 304 berarti browser menggunakan cache yang masih valid.

`serve.json` merupakan konfigurasi alat preview, bukan bagian wajib dari output build NgBuild.

### External Project Build Test

NgBuild v0.9.0 juga diuji pada project eksternal:

```text
D:\ngappid-project\ngbuild-test
```

Perintah:

```bash
npx ngbuild build
```

Hasil:

```text
dist/
├── index.html
└── main.js
```

Production build berhasil dan file metadata npm tidak ikut disalin ke output.

## Plugin System

Sejak v0.6.0, NgBuild mendukung konfigurasi plugin melalui `ngbuild.config.js`.

Plugin bersifat opsional.

### Plugin Configuration

Contoh:

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

Plugin contoh hanya menghasilkan log dan tidak mengubah source React.

### Plugin Hooks

| Hook | Purpose | When |
|---|---|---|
| `config(context)` | Konfigurasi awal | Saat plugin dimuat |
| `buildStart(context)` | Inisialisasi | Saat server atau build dimulai |
| `transform(code, id, context)` | Memproses source modul | Saat transformasi modul |

Konteks plugin:

| Property | Type |
|---|---|
| `root` | `string` |
| `mode` | `'development' \| 'production'` |

Hook `transform` dapat mengembalikan source baru atau `null`/`undefined` untuk mempertahankan source sebelumnya.

### Plugin Limitations

- Plugin mendukung tiga hook dasar.
- Konfigurasi dimuat saat proses dimulai.
- Hot reload konfigurasi plugin belum tersedia.
- HTTP middleware plugin belum tersedia.
- Plugin berjalan sebagai kode Node.js, sehingga hanya plugin tepercaya yang sebaiknya digunakan.

## NPM Package Distribution

NgBuild menggunakan `package.json` untuk mengatur file yang masuk paket distribusi.

Konfigurasi utama:

```json
{
  "name": "ngbuild",
  "version": "0.9.0",
  "type": "module",
  "bin": {
    "ngbuild": "./bin/ngbuild.js"
  },
  "files": [
    "bin/",
    "dist/"
  ]
}
```

Script `prepack` menjalankan kompilasi TypeScript sebelum packing.

### Package Validation

Jalankan dari repository:

```bash
npm run compile
npm pack --dry-run
```

Untuk membuat tarball:

```bash
npm pack
```

Hasil pengujian v0.9.0:

```text
ngbuild-0.9.0.tgz
Package size: 15.3 kB
Total files: 11
```

Isi package mencakup:

```text
bin/ngbuild.js
dist/build.js
dist/cli.js
dist/hmr/graph.js
dist/hmr/runtime.js
dist/plugins/loader.js
dist/plugins/types.js
dist/server.js
dist/version.js
package.json
README.md
```

Source TypeScript dan folder playground tidak ikut masuk package.

### Tarball Installation Test

Pada project eksternal:

```powershell
npm install -D ..\ngbuild\ngbuild-0.9.0.tgz
```

Verifikasi:

```bash
npx ngbuild --version
npx ngbuild build
```

Hasil pengujian:

- Package tarball berhasil diinstal.
- CLI menampilkan `NgBuild v0.9.0`.
- Production build berhasil.
- Audit dependency pada pengujian melaporkan 0 vulnerabilities.

Pengujian tarball tidak berarti package sudah dipublikasikan ke npm registry.

## Development Scripts

| Command | Description |
|---|---|
| `npm run compile` | Kompilasi source TypeScript NgBuild |
| `npm run playground` | Compile dan jalankan playground |
| `npm run dev` | Compile dan jalankan development server |
| `npm run build` | Compile TypeScript internal NgBuild |
| `npm pack --dry-run` | Periksa isi package npm |
| `npm pack` | Membuat tarball package |
| `ngbuild dev [root]` | Development server aplikasi |
| `ngbuild build [root]` | Production build aplikasi |

`npm run build` dalam repository NgBuild berbeda dari `ngbuild build`.

Perintah pertama mengompilasi tool NgBuild, sedangkan perintah kedua membangun aplikasi frontend.

## Dependencies

### Runtime Dependencies

NgBuild v0.9.0 menggunakan:

- `@babel/core`
- `esbuild`
- `html-minifier-terser`
- `react`
- `react-dom`
- `react-refresh`

### Development Dependencies

- `typescript`
- `@types/node`
- `@types/babel__core`
- `@types/html-minifier-terser`

Versi dependency mengikuti `package.json` dan lockfile project.

## Roadmap

| Version | Development Focus | Status |
|---|---|---|
| v0.1.0 | CLI & HTTP Development Server | Completed |
| v0.2.0 | File Watcher, Auto Reload & Native ES Modules | Completed |
| v0.3.0 | TypeScript, JSX/TSX & React Support | Completed |
| v0.4.0 | CSS Hot Update & HMR Foundation | Completed |
| v0.5.0 | Production Bundler | Completed |
| v0.6.0 | Plugin System | Completed |
| v0.7.0 | JavaScript HMR & Module Graph | Tested |
| v0.8.0 | React Fast Refresh | Tested |
| v0.9.0 | HTML Minification, Production Build Optimization & HMR Dependency Propagation | Tested |
| v1.0.0 | Release Stabilization & Package Readiness | Planned |

## Current Limitations

NgBuild v0.9.0 masih memiliki keterbatasan:

- HMR Dependency Propagation baru diuji pada pola dependency sederhana.
- React Fast Refresh belum diuji pada seluruh pola aplikasi React.
- Type-checking penuh aplikasi pengguna belum tersedia secara otomatis.
- Bare imports pada native JavaScript belum ditangani secara umum.
- Tidak semua dynamic imports dan aset runtime dapat dianalisis otomatis.
- Advanced Asset Optimization belum tersedia.
- Module Graph dan incremental transformation masih dapat dikembangkan.
- Plugin System masih menyediakan tiga hook dasar.
- Pengujian lintas sistem operasi dan aplikasi berskala besar belum lengkap.

## Development

Clone repository:

```bash
git clone https://github.com/yedincoder/ngbuild.git
cd ngbuild
npm install
npm run playground
```

Production build playground:

```bash
node bin/ngbuild.js build playground
```

Periksa package distribusi:

```bash
npm pack --dry-run
```

## Author

**YedinCoder**

GitHub: https://github.com/yedincoder

Repository: https://github.com/yedincoder/ngbuild

---

**NgBuild — Modern Frontend Development Tool.**

Built independently with Node.js, TypeScript, and esbuild.
