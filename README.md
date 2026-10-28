# NgBuild

**A lightweight frontend development tool built with Node.js and TypeScript.**

![Version](https://img.shields.io/badge/version-0.2.0-orange)
![Node.js](https://img.shields.io/badge/Node.js-%3E%3D20-green)
![TypeScript](https://img.shields.io/badge/TypeScript-supported-blue)
![Status](https://img.shields.io/badge/status-early%20development-yellow)

NgBuild adalah frontend development tool yang dikembangkan secara independen untuk menyediakan lingkungan pengembangan aplikasi web berbasis native ES Modules.

NgBuild dirancang dengan pendekatan sederhana, modular, dan bertahap, mulai dari development server hingga rencana dukungan transformer, bundler, dan plugin system.

> **Development Status:** NgBuild masih dalam tahap awal pengembangan dan belum ditujukan sebagai pengganti penuh Vite untuk production.

## Features

Fitur yang sudah diimplementasikan pada NgBuild v0.2.0:

- **CLI** — Menjalankan development server melalui terminal.
- **Development Server** — HTTP server berbasis Node.js.
- **Native ES Modules** — Mendukung import JavaScript yang dapat ditangani langsung oleh browser.
- **File Watcher** — Memantau perubahan file dalam project.
- **Auto Reload** — Memperbarui halaman browser melalui Server-Sent Events (SSE).
- **Static Asset Serving** — Menyajikan HTML, CSS, JavaScript, JSON, dan file gambar.
- **Custom Port** — Mendukung konfigurasi port melalui CLI.
- **Project Root** — Menentukan direktori aplikasi yang akan dijalankan.

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

Compile TypeScript:

```bash
npm run compile
```

## Quick Start

Jalankan playground bawaan:

```bash
npm run playground
```

Development server akan berjalan pada:

**http://localhost:4178**

Contoh output terminal:

```text
NgBuild v0.2.0

Local: http://localhost:4178/
Root:  .../ngbuild/playground

File Watcher: Active
Auto Reload:  Active
ES Modules:   Native

Press Ctrl+C to stop.
```

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

Menjalankan dengan custom port:

```bash
node bin/ngbuild.js dev playground --port 4205
```

### Global CLI (Development)

Untuk menggunakan perintah `ngbuild` secara langsung selama pengembangan:

```bash
npm run compile
npm link
```

Masuk ke direktori aplikasi:

```bash
cd playground
ngbuild dev
```

Menggunakan custom port:

```bash
ngbuild dev --port 4205
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
│   ├── main.js
│   ├── utils.js
│   └── style.css
├── .gitignore
├── package.json
├── package-lock.json
├── tsconfig.json
└── README.md
```

**Directory Overview**

| Directory | Description |
|---|---|
| `bin/` | Entry point CLI NgBuild |
| `src/` | Source code utama menggunakan TypeScript |
| `playground/` | Aplikasi percobaan untuk development dan testing |
| `dist/` | Output kompilasi internal TypeScript |

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

NgBuild v0.2.0 belum menyediakan transformasi otomatis untuk TypeScript, JSX, TSX, atau bare imports dari package npm.

## File Watcher & Auto Reload

NgBuild menggunakan File Watcher dari Node.js untuk mendeteksi perubahan file.

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

Saat file project berubah, server mengirimkan event kepada browser yang terhubung.

Browser kemudian melakukan full-page reload untuk menampilkan perubahan terbaru.

**Catatan:** Auto Reload pada v0.2.0 belum menggunakan Hot Module Replacement (HMR). State halaman akan di-reset ketika browser melakukan reload.

## Development Scripts

| Command | Description |
|---|---|
| `npm run compile` | Compile TypeScript internal NgBuild |
| `npm run playground` | Compile dan jalankan playground |
| `npm run dev` | Compile dan jalankan development server |
| `npm run build` | Compile source TypeScript internal NgBuild |

Perintah `npm run build` belum menghasilkan production bundle untuk aplikasi frontend.

## Roadmap

| Version | Development Focus | Status |
|---|---|---|
| v0.1.0 | CLI & HTTP Development Server | Completed |
| v0.2.0 | File Watcher, Auto Reload & Native ES Modules | Implemented |
| v0.3.0 | TypeScript, JSX & TSX Transformer | Planned |
| v0.4.0 | Hot Module Replacement (HMR) | Planned |
| v0.5.0 | Production Bundler & Asset Optimization | Planned |
| v0.6.0 | Plugin System | Planned |

Roadmap dapat berubah mengikuti kebutuhan dan hasil pengujian.

## Current Limitations

NgBuild v0.2.0 belum mendukung:

- Hot Module Replacement (HMR).
- Transformasi TypeScript, JSX, dan TSX untuk aplikasi.
- Bare import resolution dari dependencies npm.
- Production bundling dan minification.
- Plugin system.
- Konfigurasi framework khusus seperti React atau Vue.

NgBuild masih menggunakan native browser ES Modules dan full-page reload selama development.

## Development

Repository ini dikembangkan secara bertahap dengan mempertahankan kompatibilitas fitur yang sudah berjalan.

Untuk memulai pengembangan:

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

Built independently with Node.js and TypeScript.