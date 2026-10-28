
import { getMessage } from './utils.js';

const app = document.querySelector('#app');

app.innerHTML = `
  <h1>NgBuild v0.2.0</h1>
  <p>${getMessage()}</p>
  <p>Port default: 4178</p>
  <p>Edit file untuk menguji Auto Reload.</p>
`;

console.log('[NgBuild] Playground running');
