import { useState } from 'react';
import { createRoot } from 'react-dom/client';

function App() {
  const [count, setCount] = useState<number>(0);

  return (
    <main>
      <h1>NgBuild</h1>

      <p>React Fast Refresh Test</p>

      <p>Counter: {count}</p>

      <button
        onClick={() => setCount(count + 1)}
        style={{
          padding: '12px 24px',
          background: '#f97316',
          color: '#ffffff',
          border: 'none',
          borderRadius: 0,
          cursor: 'pointer'
        }}
      >
        Tambah Counter
      </button>

      <p>Powered by NgBuild</p>
    </main>
  );
}

const container = document.getElementById('app');

if (!container) {
  throw new Error('Root element #app not found');
}

createRoot(container).render(<App />);