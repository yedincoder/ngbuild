export const HMR_RUNTIME = `
<script>
  const events = new EventSource('/__ngbuild/events');
  const hotModules = new Map();

  window.__ngbuild_hot = {
    createContext(id) {
      let record = hotModules.get(id);

      if (!record) {
        record = {
          callbacks: [],
          disposeCallbacks: [],
          data: {}
        };

        hotModules.set(id, record);
      }

      record.callbacks = [];
      record.disposeCallbacks = [];

      return {
        data: record.data,

        accept(callback) {
          record.callbacks.push(
            typeof callback === 'function'
              ? callback
              : () => {}
          );
        },

        dispose(callback) {
          if (typeof callback === 'function') {
            record.disposeCallbacks.push(callback);
          }
        }
      };
    }
  };

  events.addEventListener('css-update', (event) => {
    const changedFile = event.data.replaceAll('\\\\', '/');

    const stylesheets = document.querySelectorAll(
      'link[rel="stylesheet"]'
    );

    for (const link of stylesheets) {
      const url = new URL(link.href);

      if (
        url.pathname === '/' + changedFile ||
        url.pathname.endsWith('/' + changedFile)
      ) {
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
      const disposeCallbacks = [...record.disposeCallbacks];

      for (const dispose of disposeCallbacks) {
        await dispose(record.data);
      }

      const url = path +
        (path.includes('?') ? '&' : '?') +
        'ngbuild=' + Date.now();

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

  events.addEventListener('reload', () => {
    console.info('[NgBuild] Reloading...');
    window.location.reload();
  });

  events.addEventListener('open', () => {
    console.info('[NgBuild] HMR connected');
  });
</script>
`;