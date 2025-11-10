import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

const rootElement = document.getElementById('root');

const hideLoadingScreen = () => {
  try {
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
      loadingScreen.classList.add('fade-out');
      setTimeout(() => {
        loadingScreen.style.display = 'none';
      }, 500);
    }
  } catch (error) {
    console.error('Error hiding loading screen:', error);
  }
};

if (rootElement) {
  try {
    const root = createRoot(rootElement);

    root.render(
      <StrictMode>
        <App />
      </StrictMode>
    );

    setTimeout(hideLoadingScreen, 500);

    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').catch((error) => {
          console.log('Service worker registration skipped:', error.message);
        });
      });
    }
  } catch (error) {
    console.error('Failed to render app:', error);
    hideLoadingScreen();
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
        <h1 style="font-size: 32px; margin-bottom: 16px;">Application Error</h1>
        <p style="margin-bottom: 24px; color: #999;">Failed to load the application. Please try refreshing the page.</p>
        <button onclick="window.location.reload()" style="
          background: #fff;
          color: #000;
          border: none;
          padding: 12px 24px;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          font-size: 16px;
        ">Refresh Page</button>
        <pre style="
          margin-top: 32px;
          padding: 16px;
          background: #111;
          border-radius: 8px;
          color: #f00;
          font-size: 12px;
          max-width: 600px;
          overflow: auto;
        ">${error instanceof Error ? error.message : 'Unknown error'}</pre>
      </div>
    `;
  }
} else {
  console.error('Root element not found');
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
      <h1>Fatal Error</h1>
      <p>Root element not found. The application cannot start.</p>
    </div>
  `;
}