import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { performanceManager } from './lib/performance';
import App from './App.tsx';
import './index.css';

// Enhanced error handling for deployment debugging
window.addEventListener('error', (e) => {
  console.error('Global error:', e.error);
  console.error('Error details:', {
    message: e.message,
    filename: e.filename,
    lineno: e.lineno,
    colno: e.colno,
    stack: e.error?.stack
  });
});

window.addEventListener('unhandledrejection', (e) => {
  console.error('Unhandled promise rejection:', e.reason);
  console.error('Promise rejection details:', e);
});

// Check if we're in production and log environment info
console.log('Environment:', {
  NODE_ENV: import.meta.env.MODE,
  BASE_URL: import.meta.env.BASE_URL,
  PROD: import.meta.env.PROD,
  DEV: import.meta.env.DEV
});

try {
  // Initialize performance optimizations
  performanceManager.init();
} catch (error) {
  console.error('Performance manager initialization failed:', error);
}

const rootElement = document.getElementById('root');
console.log('Root element found:', !!rootElement);

if (rootElement) {
  try {
    const root = createRoot(rootElement);
    console.log('React root created successfully');
    
    root.render(
      <StrictMode>
        <App />
      </StrictMode>
    );
    console.log('App rendered successfully');
  } catch (error) {
    console.error('Failed to render app:', error);
    // Fallback error display
    rootElement.innerHTML = `
      <div style="padding: 20px; font-family: Arial, sans-serif; color: #333;">
        <h1>Application Error</h1>
        <p>Failed to load the application. Please check the console for details.</p>
        <pre style="background: #f5f5f5; padding: 10px; border-radius: 4px; overflow: auto;">
          ${error instanceof Error ? error.stack : String(error)}
        </pre>
      </div>
    `;
  }
} else {
  console.error('Root element not found');
  document.body.innerHTML = `
    <div style="padding: 20px; font-family: Arial, sans-serif; color: #333;">
      <h1>Root Element Missing</h1>
      <p>The root element with id="root" was not found in the HTML.</p>
    </div>
  `;
}