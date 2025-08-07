import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ApolloProvider } from '@apollo/client';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { useActivityTracker } from './hooks/custom/useActivityTracker';
import { ProtectedRoute, PublicRoute } from './components/routing';
import NavBar from './components/layout/NavBar';
import apolloClient from './services/graphql/apollo-client';
import { ROUTE_PATHS } from './constants/routing';
import './App.css';

// Lazy load components for better performance
const HomePage = React.lazy(() => import('./pages/home/HomePage'));
const LoginPage = React.lazy(() => import('./pages/auth/LoginPage'));
const ActivityDebugger = React.lazy(() => import('./components/debug/ActivityDebugger'));
const AuthDebugger = React.lazy(() => import('./components/debug/AuthDebugger'));
const SessionExpiryModal = React.lazy(() => import('./components/ui/SessionExpiryModal'));
const Notification = React.lazy(() => import('./components/ui/Notification'));

// Loading component for Suspense fallback
const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
  </div>
);

/**
 * Main App Routes Component
 * Handles routing based on authentication status
 * 
 * CALLED BY: App component
 * SCENARIOS: All application routes and authentication states
 */
const AppRoutes: React.FC = () => {
  const { isAuthenticated, isLoading, isInitializing } = useAuth();

  // Track user activity across the application
  useActivityTracker();

  // Show loading spinner only during initial authentication check
  if (isLoading && isInitializing) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Global navigation bar - show for all users */}
      <NavBar />

      <main>
        <Routes>
          {/* Public routes - accessible without authentication */}
          <Route
            path={ROUTE_PATHS.LOGIN}
            element={
              <PublicRoute>
                <LoginPage />
              </PublicRoute>
            }
          />

          {/* Home route - accessible to all users */}
          <Route
            path={ROUTE_PATHS.HOME}
            element={<HomePage />}
          />

          {/* Catch-all route - redirect to HomePage first */}
          <Route
            path="*"
            element={<Navigate to={ROUTE_PATHS.HOME} replace />}
          />
        </Routes>
      </main>
    </div>
  );
};

/**
 * App Component with Session Expiry Modal
 * Main application component with authentication and session management
 * 
 * CALLED BY: main.tsx
 * SCENARIOS: All application scenarios
 */
const AppContent: React.FC = () => {
  const {
    showSessionExpiryModal,
    sessionExpiryMessage,
    refreshSession,
    logout,
    notification,
    hideNotification
  } = useAuth();

  return (
    <>
      <BrowserRouter>
        <Suspense fallback={<LoadingSpinner />}>
          <AppRoutes />
        </Suspense>
      </BrowserRouter>

      {/* Session Expiry Modal */}
      <Suspense fallback={null}>
        <SessionExpiryModal
          isOpen={showSessionExpiryModal}
          message={sessionExpiryMessage}
          onRefresh={refreshSession}
          onLogout={logout}
        />
      </Suspense>

      {/* Notification */}
      <Suspense fallback={null}>
        <Notification
          message={notification.message}
          type={notification.type}
          isVisible={notification.isVisible}
          onClose={hideNotification}
        />
      </Suspense>

      {/* Activity Debugger (development only) */}
      {process.env.NODE_ENV === 'development' && (
        <Suspense fallback={null}>
          <ActivityDebugger />
        </Suspense>
      )}

      {/* Auth Debugger (development only) */}
      {process.env.NODE_ENV === 'development' && (
        <Suspense fallback={null}>
          <AuthDebugger />
        </Suspense>
      )}
    </>
  );
};

/**
 * Main App Component
 * Sets up Apollo Client, Router, and application layout
 * Handles lazy loading of pages with Suspense
 * Implements protected routes for authentication
 */
function App() {
  return (
    <ApolloProvider client={apolloClient}>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ApolloProvider>
  );
}

export default App;
