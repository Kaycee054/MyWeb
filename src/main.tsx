import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { performanceManager } from './lib/performance';
import App from './App.tsx';
import './index.css';

// Add error boundary for deployment debugging
window.addEventListener('error', (e) => {
  console.error('Global error:', e.error);
});

window.addEventListener('unhandledrejection', (e) => {
  console.error('Unhandled promise rejection:', e.reason);
});

// Initialize performance optimizations
performanceManager.init();

const rootElement = document.getElementById('root');
if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
} else {
  console.error('Root element not found');
}
