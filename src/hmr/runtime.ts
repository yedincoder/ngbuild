export const HMR_RUNTIME = `
<script type="module">
  import RefreshRuntime from '/__ngbuild/react-refresh';

  const events = new EventSource('/__ngbuild/events');
  const hotModules = new Map();

  RefreshRuntime.injectIntoGlobalHook(window);
  window.$RefreshReg$ = () => {};
  window.$RefreshSig$ = RefreshRuntime.createSignatureFunctionForTransform;
  window.__ngbuild_refresh = RefreshRuntime;

  window.__ngbuild_hot = {
    createContext(id) {
      let record = hotModules.get(id);
      if (!record) {
        record = { callbacks: [], disposeCallbacks: [], data: {} };
        hotModules.set(id, record);
      }
      record.callbacks = [];
      record.disposeCallbacks = [];
      return {
        data: record.data,
        accept(callback) {
          record.callbacks.push(typeof callback === 'function' ? callback : () => {});
        },
        dispose(callback) {
          if (typeof callback === 'function') record.disposeCallbacks.push(callback);
        }
      };
    }
  };

  events.addEventListener('css-update', (event) => {
    const changedFile = event.data.replaceAll('\\\\', '/');
    const stylesheets = document.querySelectorAll('link[rel="stylesheet"]');
    for (const link of stylesheets) {
      const url = new URL(link.href);
      if (url.pathname === '/' + changedFile || url.pathname.endsWith('/' + changedFile)) {
        url.searchParams.set('ngbuild', Date.now().toString());
        link.href = url.toString();
        console.info('[NgBuild] CSS updated:', changedFile);
      }
    }
  });

  events.addEventListener('js-update', async (event) => {
    const path = event.data;
    const record = hotModules.get(path);
    if (!record || record.callbacks.length === 0) {
      window.location.reload();
      return;
    }
    try {
      for (const dispose of [...record.disposeCallbacks]) {
        await dispose(record.data);
      }
      const url = path + (path.includes('?') ? '&' : '?') + 'ngbuild=' + Date.now();
      const updatedModule = await import(url);
      const updatedRecord = hotModules.get(path);
      if (!updatedRecord || updatedRecord.callbacks.length === 0) {
        window.location.reload();
        return;
      }
      for (const callback of updatedRecord.callbacks) {
        await callback(updatedModule);
      }
      console.info('[NgBuild] JS updated:', path);
    } catch (error) {
      console.error('[NgBuild] HMR failed:', error);
      window.location.reload();
    }
  });

  events.addEventListener('react-update', async (event) => {
    const path = event.data;
    try {
      const url = path + (path.includes('?') ? '&' : '?') + 'ngbuild=' + Date.now();
      await import(url);
      RefreshRuntime.performReactRefresh();
      console.info('[NgBuild] React Fast Refresh:', path);
    } catch (error) {
      console.error('[NgBuild] React Fast Refresh failed:', error);
      window.location.reload();
    }
  });

  events.addEventListener('reload', () => {
    console.info('[NgBuild] Reloading...');
    window.location.reload();
  });

  events.addEventListener('open', () => {
    console.info('[NgBuild] HMR connected');
  });
</script>
`;
