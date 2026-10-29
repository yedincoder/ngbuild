import { getMessage } from './utils.js';

const app = document.querySelector('#app');

let count = import.meta.hot?.data.count ?? 0;

function render() {
  app.innerHTML = `
    <h1>NgBuild Dependency HMR</h1>
    <p>${getMessage()}</p>
    <p>Port default: 4178</p>
    <p>Counter: ${count}</p>
    <button id="increment">Tambah Counter</button>
    <p>Edit utils.js untuk menguji Dependency HMR.</p>
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
    console.log('[NgBuild] Dependency HMR accepted');
  });
}

console.log('[NgBuild] Playground running');