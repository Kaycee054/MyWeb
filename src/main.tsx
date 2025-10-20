import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { performanceManager } from './lib/performance';
import App from './App.tsx';
import './index.css';

// Initialize performance optimizations
performanceManager.init();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
