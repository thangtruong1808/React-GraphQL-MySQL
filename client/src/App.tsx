import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ApolloProvider } from '@apollo/client';
import client from './services/graphql/apollo-client';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { useActivityTracker } from './hooks/custom/useActivityTracker';
import NavBar from './components/layout/NavBar';
import HomePage from './pages/home/HomePage';
import { ROUTES } from './constants';
import ActivityDebugger from './components/debug/ActivityDebugger';
import './App.css';

// Lazy load pages for better performance and code splitting
const LoginPage = React.lazy(() => import('./pages/auth/LoginPage'));

/**
 * App Content Component
 * Contains the main application content with activity tracking
 * Must be inside Router context to use useLocation()
 */
function AppContent() {
  const { isLoading, isInitializing, showLoadingSpinner, isAuthenticated } = useAuth();

  // Track user activity across the application (inside Router context)
  useActivityTracker();

  // Show loading spinner during authentication initialization to prevent state flicker
  // This ensures users don't see unauthenticated state briefly on page refresh
  if (isLoading || isInitializing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">
            {isInitializing ? 'Initializing...' : 'Loading...'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Global navigation bar */}
      <NavBar />
      <main>
        {/* Suspense wrapper for lazy-loaded pages */}
        <React.Suspense
          fallback={
            <div className="min-h-screen flex items-center justify-center">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
            </div>
          }
        >
          <Routes>
            {/* Public routes */}
            <Route path={ROUTES.HOME} element={<HomePage />} />
            <Route path={ROUTES.LOGIN} element={<LoginPage />} />

            {/* Catch-all route - redirect to home */}
            <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
          </Routes>
        </React.Suspense>
      </main>

      {/* Debug component for development */}
      <ActivityDebugger />
    </div>
  );
}

/**
 * Main App Component
 * Sets up Apollo Client, Router, and application layout
 * Handles lazy loading of pages with Suspense
 * Implements protected routes for authentication
 */
function App() {
  return (
    <ApolloProvider client={client}>
      <AuthProvider>
        <Router>
          <AppContent />
        </Router>
      </AuthProvider>
    </ApolloProvider>
  );
}

export default App;
