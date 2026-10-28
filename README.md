# NgBuild v0.1.0

CLI dan development server sederhana untuk aplikasi frontend berbasis ES Modules.

## Persyaratan

Node.js 20 atau lebih baru dan npm.

## Menjalankan playground

```bash
npm install
npm run playground
```

Buka http://localhost:4178

## Perintah

```bash
npm run compile
node bin/ngbuild.js --help
node bin/ngbuild.js --version
node bin/ngbuild.js dev playground
```

## Mengaktifkan CLI global untuk pengembangan

```bash
npm run compile
npm link
cd playground
ngbuild dev
```

Catatan: `npm run build` hanya mengompilasi TypeScript internal NgBuild. HMR, transform JSX/TSX, dan production bundling aplikasi belum tersedia.
