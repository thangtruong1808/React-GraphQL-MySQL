import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ApolloProvider } from '@apollo/client';
import client from './services/graphql/apollo-client';
import NavBar from './components/layout/NavBar';
import HomePage from './pages/home/HomePage';
import { ROUTES } from './constants';
import { AuthProvider, useAuth } from './contexts/AuthContext';

// Lazy load pages for better performance and code splitting
const LoginPage = React.lazy(() => import('./pages/auth/LoginPage'));

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


          </div>
        </Router>
      </AuthProvider>
    </ApolloProvider>
  );
}

export default App;
