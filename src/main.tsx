import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

console.log('Main.tsx loaded');

// Add error handler for uncaught errors
window.onerror = (message, source, lineno, colno, error) => {
  console.error('Global error:', { message, source, lineno, colno, error });
  document.getElementById('root')!.innerHTML = `
    <div style="padding: 20px; font-family: system-ui;">
      <h1 style="color: red;">Application Error</h1>
      <p>${message}</p>
      <p>Source: ${source}:${lineno}:${colno}</p>
      <pre>${error?.stack || 'No stack trace'}</pre>
    </div>
  `;
  return true;
};

// Add handler for unhandled promise rejections
window.onunhandledrejection = (event) => {
  console.error('Unhandled rejection:', event.reason);
};

try {
  console.log('Importing App...');
  import('./App.tsx').then((module) => {
    console.log('App imported successfully');
    const App = module.default;
    createRoot(document.getElementById('root')!).render(
      <StrictMode>
        <App />
      </StrictMode>,
    );
    console.log('App rendered');
  }).catch((error) => {
    console.error('Failed to import App:', error);
    document.getElementById('root')!.innerHTML = `
      <div style="padding: 20px; font-family: system-ui;">
        <h1 style="color: red;">Failed to Load Application</h1>
        <p>${error.message}</p>
        <pre>${error.stack}</pre>
      </div>
    `;
  });
} catch (error) {
  console.error('Error in main.tsx:', error);
}
