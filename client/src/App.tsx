import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ApolloProvider } from '@apollo/client';
import client from './services/graphql/apollo-client';
import NavBar from './components/layout/NavBar';
import HomePage from './pages/home/HomePage';
import { AuthProvider, useAuth } from './contexts/AuthContext';

// Lazy load pages for better performance and code splitting
const LoginPage = React.lazy(() => import('./pages/auth/LoginPage'));

/**
 * Protected Route Component
 * Wraps routes that require authentication
 * Shows loading spinner while checking auth status
 * Redirects to login if user is not authenticated
 * Checks for force logout and redirects immediately
 */
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading, validateSession } = useAuth();

  console.log('ProtectedRoute - isLoading:', isLoading, 'isAuthenticated:', isAuthenticated);

  // Show loading spinner while checking authentication status
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Additional validation for authenticated users to check for force logout
  if (isAuthenticated && !validateSession()) {
    console.log('ProtectedRoute - Session validation failed, redirecting to login');
    return <Navigate to="/login" replace />;
  }

  // Redirect to login if user is not authenticated
  if (!isAuthenticated) {
    console.log('ProtectedRoute - Redirecting to login');
    return <Navigate to="/login" replace />;
  }

  // Render protected content if user is authenticated
  console.log('ProtectedRoute - Rendering protected content');
  return <>{children}</>;
};

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
                  <Route path="/" element={<HomePage />} />
                  <Route path="/login" element={<LoginPage />} />

                  {/* Catch-all route - redirect to home */}
                  <Route path="*" element={<Navigate to="/" replace />} />
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
