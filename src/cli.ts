import { resolve, join, dirname, basename } from 'node:path';
import { mkdir, readFile, writeFile, copyFile, constants } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { startServer } from './server.js';
import { buildProject } from './build.js';
import { VERSION } from './version.js';

const args = process.argv.slice(2);

const command = args[0] ?? 'dev';

const portIndex = args.indexOf('--port');

const portValue = portIndex !== -1
  ? args[portIndex + 1]
  : undefined;

if (portIndex !== -1 && (
  !portValue || portValue.startsWith('--')
)) {
  console.error('NgBuild: --port requires a number.');
  process.exit(1);
}

const port = portValue === undefined
  ? 4178
  : Number(portValue);

if (
  !Number.isInteger(port) ||
  port < 1 ||
  port > 65535
) {
  console.error('NgBuild: Invalid port (1-65535).');
  process.exit(1);
}

const positional = args.slice(1).filter((arg, index, all) => {
  if (arg === '--port') return false;
  if (index > 0 && all[index - 1] === '--port') return false;
  return true;
});

const root = resolve(
  process.cwd(),
  positional[0] ?? '.'
);

async function initProject(projectRoot: string): Promise<void> {
  const files: Record<string, string> = {
    'src/index.html': `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="theme-color" content="#0c0d11">
  <meta name="description" content="NgBuild frontend development starter project">
  <title>NgBuild â€” Build Something Great</title>
  <link rel="stylesheet" href="./style.css">
  <link rel="icon" type="image/x-icon" href="/favicon.ico">
</head>
<body>
  <div class="site-shell">
    <header class="header">
      <a class="brand" href="/" aria-label="NgBuild home">
        <span class="brand-icon">N<span>G</span></span>
        <span class="brand-text">NgBuild<span class="brand-dot">.</span></span>
      </a>

      <div class="header-right">
        <span class="header-version">v${VERSION}</span>
        <a
          class="github-link"
          href="https://github.com/yedincoder/ngbuild"
          target="_blank"
          rel="noopener noreferrer"
        >GitHub â†—</a>
      </div>
    </header>

    <main id="app">
      <section class="hero">
        <div class="hero-content">
          <div class="eyebrow">
            <span class="status-dot"></span>
            YOUR DEVELOPMENT ENVIRONMENT IS READY
          </div>

          <h1>
            Build fast.<br>
            <span>Ship better.</span>
          </h1>

          <p class="hero-description">
            A lightweight frontend development and build tool.
            Powered by Node.js, TypeScript and esbuild.
            No unnecessary complexity.
          </p>

          <div class="hero-actions">
            <a
              href="https://github.com/yedincoder/ngbuild"
              target="_blank"
              rel="noopener noreferrer"
              class="btn btn-primary"
            >Explore NgBuild <span>â†—</span></a>

            <a
              href="https://www.npmjs.com/package/@yedincoder/ngbuild"
              target="_blank"
              rel="noopener noreferrer"
              class="btn btn-outline"
            >View on npm <span>â†—</span></a>
          </div>

          <div class="hero-meta">
            <span><span class="meta-square"></span> Native ESM</span>
            <span><span class="meta-square"></span> TypeScript</span>
            <span><span class="meta-square"></span> Hot Reload</span>
          </div>
        </div>

        <div class="terminal-wrap">
          <div class="terminal">
            <div class="terminal-header">
              <div class="terminal-dots">
                <span></span><span></span><span></span>
              </div>
              <span>terminal â€” ngbuild</span>
              <span class="terminal-label">DEV</span>
            </div>

            <div class="terminal-body">
              <div class="terminal-command">
                <span class="prompt">â¯</span>
                <span>npx ngbuild dev</span>
              </div>

              <div class="terminal-output">
                <div class="terminal-title">NG<span>BUILD</span></div>

                <div class="terminal-line">
                  <span class="muted">Version</span>
                  <span>v${VERSION}</span>
                </div>
                <div class="terminal-line">
                  <span class="muted">Local</span>
                  <span class="terminal-url">localhost:4178</span>
                </div>
                <div class="terminal-line">
                  <span class="muted">Environment</span>
                  <span class="terminal-ready">â— Ready</span>
                </div>

                <div class="terminal-divider"></div>

                <div class="terminal-feature">
                  <span class="check">âœ“</span> File watcher active
                </div>
                <div class="terminal-feature">
                  <span class="check">âœ“</span> Hot module replacement
                </div>
                <div class="terminal-feature">
                  <span class="check">âœ“</span> TypeScript supported
                </div>
                <div class="terminal-feature">
                  <span class="check">âœ“</span> Production bundler ready
                </div>
              </div>
            </div>
          </div>
          <div class="terminal-caption">
            <span class="status-dot"></span>
            DEV SERVER ACTIVE
          </div>
        </div>
      </section>

      <section class="features-section">
        <div class="section-heading">
          <div>
            <span class="section-label">THE TOOLKIT</span>
            <h2>Everything you need to build.</h2>
          </div>
          <span class="section-index">01 / FEATURES</span>
        </div>

        <div class="feature-grid">
          <div class="feature-card">
            <span class="feature-number">01</span>
            <div class="feature-symbol">âš¡</div>
            <h3>Fast Development</h3>
            <p>Development server with file watching and instant browser updates.</p>
          </div>

          <div class="feature-card">
            <span class="feature-number">02</span>
            <div class="feature-symbol">&lt;/&gt;</div>
            <h3>Native ESM</h3>
            <p>Modern JavaScript modules with TypeScript, JSX and TSX support.</p>
          </div>

          <div class="feature-card">
            <span class="feature-number">03</span>
            <div class="feature-symbol">â†»</div>
            <h3>Hot Updates</h3>
            <p>JavaScript HMR, CSS Hot Update and React Fast Refresh.</p>
          </div>

          <div class="feature-card">
            <span class="feature-number">04</span>
            <div class="feature-symbol">â–£</div>
            <h3>Production Build</h3>
            <p>Optimized bundles, HTML minification and asset cleanup.</p>
          </div>
        </div>
      </section>

      <section class="playground-section">
        <div class="playground-info">
          <span class="section-label">INTERACTIVE DEMO</span>
          <h2>Make it yours.</h2>
          <p>
            This starter is ready for development.
            Try the counter, then edit main.js and see the result.
          </p>
        </div>

        <div class="counter-box">
          <div class="counter-label">LIVE COUNTER / HMR DEMO</div>
          <div class="counter-display" id="counter-value">00</div>
          <div class="counter-actions">
            <button type="button" id="decrement" aria-label="Decrease counter">âˆ’</button>
            <button type="button" id="reset">Reset</button>
            <button type="button" id="increment" aria-label="Increase counter">+</button>
          </div>
          <span class="counter-hint">State preserved during accepted updates</span>
        </div>
      </section>

      <section class="command-section">
        <div>
          <span class="section-label">NEXT STEP</span>
          <h2>Ready to go production?</h2>
          <p>Build an optimized version of your frontend project.</p>
        </div>

        <div class="command-copy">
          <code>npx ngbuild build</code>
          <button type="button" id="copy-command" aria-label="Copy build command">Copy</button>
        </div>
      </section>
    </main>

    <footer class="footer">
      <span>Â© <span id="year"></span> NgBuild. Built by YedinCoder.</span>
      <span>LIGHTWEIGHT BY DESIGN.</span>
    </footer>
  </div>

  <script type="module" src="./main.js"></script>
</body>
</html>
`,

    'src/main.js': `let count = import.meta.hot?.data.count ?? 0;

const counterValue = document.querySelector('#counter-value');
const incrementButton = document.querySelector('#increment');
const decrementButton = document.querySelector('#decrement');
const resetButton = document.querySelector('#reset');
const copyButton = document.querySelector('#copy-command');
const yearElement = document.querySelector('#year');

function renderCounter() {
  if (!counterValue) return;

  const prefix = count < 0 ? '-' : '';
  counterValue.textContent =
    prefix + String(Math.abs(count)).padStart(2, '0');
}

incrementButton?.addEventListener('click', () => {
  count++;
  renderCounter();
});

decrementButton?.addEventListener('click', () => {
  count--;
  renderCounter();
});

resetButton?.addEventListener('click', () => {
  count = 0;
  renderCounter();
});

copyButton?.addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText('npx ngbuild build');
    copyButton.textContent = 'Copied!';
  } catch {
    copyButton.textContent = 'Copy failed';
  }
});

if (yearElement) {
  yearElement.textContent = new Date().getFullYear();
}

renderCounter();

if (import.meta.hot) {
  import.meta.hot.dispose((data) => {
    data.count = count;
  });

  import.meta.hot.accept(() => {
    console.log('[NgBuild] Starter HMR accepted');
  });
}

console.log('[NgBuild] Starter ready');
`,

    'src/style.css': `@import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=DM+Sans:wght@400;500;600;700;800&display=swap');

:root {
  color-scheme: dark;
  font-family: 'DM Sans', Arial, sans-serif;
  font-synthesis: none;
  background: #0c0d11;
  color: #f4f4f5;
  --orange: #f97316;
  --orange-light: #fb923c;
  --background: #0c0d11;
  --surface: #13151b;
  --surface-2: #191b22;
  --line: #292b33;
  --muted: #999ba6;
  --mono: 'DM Mono', Consolas, monospace;
}

* {
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

body {
  margin: 0;
  min-width: 320px;
}

a {
  color: inherit;
  text-decoration: none;
}

button {
  font: inherit;
  cursor: pointer;
}

.site-shell {
  width: min(100%, 1440px);
  min-height: 100vh;
  margin: 0 auto;
}

.header {
  height: 84px;
  padding: 0 6%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid var(--line);
}

.brand {
  display: flex;
  align-items: center;
  gap: 12px;
}

.brand-icon {
  display: grid;
  place-items: center;
  width: 43px;
  height: 43px;
  background: var(--orange);
  color: #111;
  font-weight: 800;
  font-size: 17px;
  letter-spacing: -2px;
}

.brand-icon span {
  margin-left: -2px;
}

.brand-text {
  font-size: 23px;
  font-weight: 800;
  letter-spacing: -1px;
}

.brand-dot {
  color: var(--orange);
}

.header-right {
  display: flex;
  align-items: center;
  gap: 26px;
}

.header-version {
  color: var(--muted);
  font: 12px var(--mono);
}

.github-link {
  font-size: 13px;
  font-weight: 700;
  transition: color .2s;
}

.github-link:hover {
  color: var(--orange);
}

.hero {
  display: grid;
  grid-template-columns: 1.12fr 1fr;
  gap: 7%;
  align-items: center;
  padding: 100px 6% 110px;
  border-bottom: 1px solid var(--line);
}

.eyebrow,
.section-label,
.section-index,
.counter-label,
.counter-hint,
.terminal-caption {
  font-family: var(--mono);
  font-size: 11px;
  letter-spacing: 1.5px;
}

.eyebrow {
  color: var(--orange-light);
  display: flex;
  align-items: center;
  gap: 10px;
}

.status-dot {
  display: inline-block;
  width: 8px;
  height: 8px;
  flex-shrink: 0;
  border-radius: 50%;
  background: #48d69a;
  box-shadow: 0 0 12px #48d69a88;
}

.hero h1 {
  margin: 29px 0 24px;
  font-size: clamp(48px, 5.1vw, 83px);
  line-height: 1.04;
  letter-spacing: -4px;
  font-weight: 800;
}

.hero h1 span {
  color: var(--orange);
}

.hero-description {
  max-width: 500px;
  margin: 0;
  color: var(--muted);
  font-size: 16px;
  line-height: 1.9;
}

.hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 34px;
}

.btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 24px;
  min-height: 50px;
  padding: 0 21px;
  font-size: 13px;
  font-weight: 700;
  transition: background .2s, color .2s;
}

.btn-primary {
  color: #111;
  background: var(--orange);
}

.btn-primary:hover {
  background: var(--orange-light);
}

.btn-outline {
  border: 1px solid #484a54;
}

.btn-outline:hover {
  background: var(--surface-2);
}

.hero-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 22px;
  margin-top: 47px;
}

.hero-meta > span {
  display: flex;
  align-items: center;
  gap: 8px;
  font: 11px var(--mono);
  color: var(--muted);
}

.meta-square {
  width: 6px;
  height: 6px;
  background: var(--orange);
}

.terminal-wrap {
  min-width: 0;
}

.terminal {
  border: 1px solid #363840;
  background: #101218;
  box-shadow: 16px 16px 0 rgba(249, 115, 22, .07);
}

.terminal-header {
  height: 47px;
  padding: 0 18px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid var(--line);
  color: #838591;
  font: 11px var(--mono);
}

.terminal-dots {
  display: flex;
  gap: 6px;
}

.terminal-dots span {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #5e606b;
}

.terminal-dots span:first-child {
  background: var(--orange);
}

.terminal-label {
  color: var(--orange);
}

.terminal-body {
  padding: 28px;
  font-family: var(--mono);
  font-size: 12px;
}

.terminal-command {
  display: flex;
  gap: 13px;
  color: #f5f5f5;
}

.prompt {
  color: var(--orange);
}

.terminal-output {
  padding: 27px 0 5px 18px;
}

.terminal-title {
  font-size: 22px;
  font-weight: 500;
  letter-spacing: -1px;
  margin-bottom: 25px;
}

.terminal-title span {
  color: var(--orange);
}

.terminal-line {
  display: grid;
  grid-template-columns: 135px 1fr;
  gap: 10px;
  margin-bottom: 16px;
}

.muted {
  color: #858894;
}

.terminal-url {
  color: #7cb6ff;
}

.terminal-ready,
.check {
  color: #48d69a;
}

.terminal-divider {
  margin: 25px 0;
  border-top: 1px dashed #333640;
}

.terminal-feature {
  margin: 13px 0;
  color: #b9bac2;
}

.check {
  margin-right: 10px;
}

.terminal-caption {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 9px;
  color: #9799a3;
  margin-top: 25px;
}

.features-section {
  padding: 94px 6%;
}

.section-heading {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 35px;
}

.section-label {
  color: var(--orange);
}

.section-heading h2,
.playground-info h2,
.command-section h2 {
  font-size: clamp(28px, 3.2vw, 44px);
  line-height: 1.15;
  letter-spacing: -1.7px;
  margin: 15px 0 0;
}

.section-index {
  color: #696b76;
}

.feature-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  border-top: 1px solid var(--line);
  border-left: 1px solid var(--line);
}

.feature-card {
  position: relative;
  min-height: 260px;
  padding: 28px 24px;
  border-right: 1px solid var(--line);
  border-bottom: 1px solid var(--line);
  transition: background .2s;
}

.feature-card:hover {
  background: var(--surface);
}

.feature-number {
  color: #747681;
  font: 11px var(--mono);
}

.feature-symbol {
  height: 60px;
  margin-top: 28px;
  font-size: 31px;
  color: var(--orange);
  font-family: var(--mono);
}

.feature-card h3 {
  margin: 0 0 12px;
  font-size: 16px;
}

.feature-card p,
.playground-info p,
.command-section p {
  margin: 0;
  color: var(--muted);
  font-size: 13px;
  line-height: 1.9;
}

.playground-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10%;
  align-items: center;
  background: var(--surface);
  border-top: 1px solid var(--line);
  border-bottom: 1px solid var(--line);
  padding: 85px 6%;
}

.playground-info p {
  max-width: 380px;
  margin-top: 20px;
  font-size: 15px;
}

.counter-box {
  padding: 28px;
  border: 1px solid #3b3d47;
  background: var(--background);
  text-align: center;
}

.counter-label {
  color: var(--orange);
}

.counter-display {
  padding: 34px 0 18px;
  font-size: 100px;
  font-weight: 800;
  font-variant-numeric: tabular-nums;
  letter-spacing: -6px;
  line-height: 1;
}

.counter-actions {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 8px;
  margin: 18px 0 23px;
}

.counter-actions button {
  height: 45px;
  background: #23252d;
  color: white;
  border: 1px solid #373943;
  border-radius: 0;
}

.counter-actions button:hover {
  background: var(--orange);
  color: #111;
}

.counter-hint {
  color: #838591;
  letter-spacing: 0;
}

.command-section {
  display: flex;
  gap: 40px;
  align-items: center;
  justify-content: space-between;
  padding: 75px 6%;
  border-bottom: 1px solid var(--line);
}

.command-section p {
  margin-top: 15px;
}

.command-copy {
  display: flex;
  align-items: center;
  border: 1px solid #474954;
  background: var(--surface);
  min-width: 320px;
}

.command-copy code {
  flex: 1;
  padding: 0 20px;
  color: #f7f7f8;
  font: 12px var(--mono);
}

.command-copy button {
  height: 52px;
  padding: 0 20px;
  border: 0;
  border-left: 1px solid #474954;
  border-radius: 0;
  background: var(--orange);
  color: #121212;
  font-weight: 700;
}

.footer {
  padding: 30px 6%;
  display: flex;
  justify-content: space-between;
  gap: 20px;
  color: #7f818e;
  font: 11px var(--mono);
}

@media (max-width: 1000px) {
  .hero {
    grid-template-columns: 1fr;
    gap: 65px;
    padding-top: 75px;
  }

  .feature-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .playground-section {
    gap: 35px;
  }
}

@media (max-width: 640px) {
  .header {
    height: 70px;
    padding: 0 5%;
  }

  .header-right {
    gap: 14px;
  }

  .hero {
    padding: 65px 5%;
  }

  .hero h1 {
    font-size: 52px;
    letter-spacing: -2.8px;
  }

  .hero-meta {
    gap: 14px;
  }

  .terminal-body {
    padding: 19px;
  }

  .terminal-output {
    padding-left: 0;
  }

  .terminal-line {
    grid-template-columns: 110px 1fr;
    font-size: 11px;
  }

  .features-section {
    padding: 70px 5%;
  }

  .section-index {
    display: none;
  }

  .feature-grid {
    grid-template-columns: 1fr;
  }

  .feature-card {
    min-height: 215px;
  }

  .feature-symbol {
    margin-top: 15px;
    height: 50px;
  }

  .playground-section {
    padding: 65px 5%;
    grid-template-columns: 1fr;
  }

  .counter-display {
    font-size: 80px;
  }

  .command-section {
    padding: 65px 5%;
    flex-direction: column;
    align-items: stretch;
  }

  .command-copy {
    min-width: 0;
  }

  .footer {
    padding: 28px 5%;
    flex-direction: column;
  }
}
`
  };

  files['package.json'] = JSON.stringify({
    name: basename(projectRoot).toLowerCase().replace(/[^a-z0-9._-]/g, '-'),
    version: '1.0.0',
    private: true,
    type: 'module',
    scripts: {
      dev: 'ngbuild dev',
      build: 'ngbuild build'
    },
    devDependencies: {
      '@yedincoder/ngbuild': `^${VERSION}`
    }
  }, null, 2) + '\n';

  files['.gitignore'] = 'node_modules/\ndist/\n*.log\n*.tgz\n';

  await mkdir(projectRoot, {
    recursive: true
  });

  console.log(`
NgBuild v${VERSION}

Initializing project: ${projectRoot}
`);

  for (const [filename, content] of Object.entries(files)) {
    const filePath = join(projectRoot, filename);

    try {
      await mkdir(dirname(filePath), { recursive: true });
      await writeFile(filePath, content, {
        encoding: 'utf-8',
        flag: 'wx'
      });

      console.log(`[NgBuild] Created: ${filename}`);
    } catch (error) {
      const err = error as NodeJS.ErrnoException;

      if (err.code === 'EEXIST') {
        console.log(`[NgBuild] Skipped: ${filename} (already exists)`);
        continue;
      }

      throw error;
    }
  }

  // Preserve existing package configuration and only add missing NgBuild scripts.
  const packagePath = join(projectRoot, 'package.json');
  const packageContents = await readFile(packagePath, 'utf-8');
  let packageData: Record<string, unknown>;

  try {
    const parsed: unknown = JSON.parse(packageContents);
    if (parsed === null || typeof parsed !== 'object' || Array.isArray(parsed)) {
      throw new Error('package.json must contain an object.');
    }
    packageData = parsed as Record<string, unknown>;
  } catch (error) {
    throw new Error(`Invalid package.json: ${(error as Error).message}`);
  }

  if (
    packageData.scripts !== undefined &&
    (packageData.scripts === null ||
      typeof packageData.scripts !== 'object' ||
      Array.isArray(packageData.scripts))
  ) {
    throw new Error('package.json scripts must be an object.');
  }

  const scripts = (packageData.scripts ?? {}) as Record<string, unknown>;
  let updated = false;

  if (!Object.hasOwn(scripts, 'dev')) {
    scripts.dev = 'ngbuild dev';
    updated = true;
  }
  if (!Object.hasOwn(scripts, 'build')) {
    scripts.build = 'ngbuild build';
    updated = true;
  }

  if (updated) {
    packageData.scripts = scripts;
    await writeFile(packagePath, JSON.stringify(packageData, null, 2) + '\n', 'utf-8');
    console.log('[NgBuild] Updated: package.json (missing scripts added)');
  }

  const faviconPath = join(projectRoot, 'public', 'favicon.ico');
  await mkdir(dirname(faviconPath), { recursive: true });

  // Bundled source asset, never a generated replacement icon.
  const faviconSource = resolve(
    dirname(fileURLToPath(import.meta.url)),
    '../assets/favicon.ico'
  );

  try {
    await copyFile(faviconSource, faviconPath, constants.COPYFILE_EXCL);
    console.log('[NgBuild] Created: public/favicon.ico');
  } catch (error) {
    const err = error as NodeJS.ErrnoException;
    if (err.code === 'EEXIST') {
      console.log('[NgBuild] Skipped: public/favicon.ico (already exists)');
    } else if (err.code === 'ENOENT') {
      throw new Error('Bundled favicon missing: assets/favicon.ico. Include the original favicon before packing.');
    } else {
      throw error;
    }
  }

  console.log(`
Project initialization completed.

Next steps:

  ${resolve(projectRoot) === process.cwd() ? '' : 'cd ' + basename(projectRoot) + '\n  '}npm install
  npm run dev

Production build:

  npm run build
`);
}

switch (command) {
  case 'dev':
    await startServer(root, port);
    break;

  case 'build':
    if (portIndex !== -1) {
      console.error('NgBuild: --port is only supported by dev.');
      process.exitCode = 1;
      break;
    }

    try {
      await buildProject(root);
    } catch (error) {
      const err = error as Error;
      console.error('[NgBuild] Build failed:', err.message);
      process.exitCode = 1;
    }
    break;

  case 'init':
    if (portIndex !== -1) {
      console.error('NgBuild: --port is only supported by dev.');
      process.exitCode = 1;
      break;
    }

    try {
      await initProject(root);
    } catch (error) {
      const err = error as Error;
      console.error('[NgBuild] Init failed:', err.message);
      process.exitCode = 1;
    }
    break;

  case '--version':
  case '-v':
    console.log(`NgBuild v${VERSION}`);
    break;

  case '--help':
  case '-h':
    console.log(`
NgBuild v${VERSION}

Usage:
  ngbuild init [root]
  ngbuild dev [root]
  ngbuild dev [root] --port 4178
  ngbuild build [root]
  ngbuild --version
  ngbuild --help

Commands:
  init     Initialize a frontend project
  dev      Start development server
  build    Create optimized production output

Options:
  --port   Development server port (default: 4178)
  --version, -v
  --help, -h
`);
    break;

  default:
    console.error(`Unknown command: ${command}`);
    process.exitCode = 1;
}
