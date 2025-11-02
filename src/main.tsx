import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

const hideLoadingScreen = () => {
  const loadingScreen = document.getElementById('loading-screen');
  if (loadingScreen) {
    loadingScreen.classList.add('hidden');
  }
};

setTimeout(hideLoadingScreen, 0);

window.addEventListener('error', (e) => {
  console.error('Global error:', e.error);
  hideLoadingScreen();
});

window.addEventListener('unhandledrejection', (e) => {
  console.error('Unhandled promise rejection:', e.reason);
  hideLoadingScreen();
});

const rootElement = document.getElementById('root');

if (rootElement) {
  try {
    const root = createRoot(rootElement);

    root.render(
      <StrictMode>
        <App />
      </StrictMode>
    );

    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').catch(() => {});
      });
    }
  } catch (error) {
    console.error('Failed to render app:', error);
    hideLoadingScreen();
    // Fallback error display
    rootElement.innerHTML = `
      <div style="
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: #000;
        color: #fff;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        text-align: center;
        padding: 20px;
      ">
        <h1>Application Error</h1>
        <p>Failed to load the application. Please check the console for details.</p>
        <button onclick="window.location.reload()" style="
          background: #fff;
          color: #000;
          border: none;
          padding: 12px 24px;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          margin-top: 20px;
        ">Refresh Page</button>
        <pre style="background: #111; padding: 10px; border-radius: 4px; overflow: auto; margin-top: 20px; font-size: 12px; max-width: 80%; color: #ff6b6b;">
          ${error instanceof Error ? error.stack : String(error)}
        </pre>
      </div>
    `;
  }
} else {
  console.error('Root element not found');
  hideLoadingScreen();
  document.body.innerHTML = `
    <div style="
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: #000;
      color: #fff;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      text-align: center;
      padding: 20px;
    ">
      <h1>Root Element Missing</h1>
      <p>The root element with id="root" was not found in the HTML.</p>
    </div>
  `;
}