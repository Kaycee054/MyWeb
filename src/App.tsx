import React from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { Navigation } from './components/Navigation'
import { Footer } from './components/Footer'
import { HomePage } from './pages/HomePage'
import { ResumePage } from './pages/ResumePage'
import { ContactPage } from './pages/ContactPage'
import { AdminPage } from './pages/AdminPage'

function ErrorFallback({error, resetErrorBoundary}: {error: Error, resetErrorBoundary: () => void}) {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <h1 className="text-2xl font-bold text-white mb-4">Something went wrong</h1>
        <p className="text-gray-400 mb-6">
          We encountered an unexpected error. Please try refreshing the page.
        </p>
        <button
          onClick={resetErrorBoundary}
          className="bg-white text-black px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
        >
          Try again
        </button>
        <details className="mt-4 text-left">
          <summary className="cursor-pointer text-gray-400 hover:text-white text-sm">
            Error Details
          </summary>
          <pre className="mt-2 p-4 bg-gray-900 rounded-lg text-xs text-red-300 overflow-auto">
            {error.message}
          </pre>
        </details>
      </div>
    </div>
  )
}

function App() {
  console.log('App component rendering...');
  
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-black text-white">
            <Navigation />
            <main role="main">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/resume/:id" element={<ResumePage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/admin" element={<AdminPage />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  )
}

export default App
