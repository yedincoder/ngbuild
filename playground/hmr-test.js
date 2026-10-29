let count = import.meta.hot?.data.count ?? 0;

function render() {
  document.querySelector('#app').innerHTML = `
    <h1>NgBuild HMR TEST FINAL TESTER 123 tambah 4</h1>
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