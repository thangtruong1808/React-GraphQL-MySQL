import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ApolloProvider } from '@apollo/client';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { useActivityTracker } from './hooks/custom/useActivityTracker';
import NavBar from './components/layout/NavBar';
import apolloClient from './services/graphql/apollo-client';
import { ROUTES } from './constants';
import './App.css';

// Lazy load components for better performance
const HomePage = React.lazy(() => import('./pages/home/HomePage'));
const LoginPage = React.lazy(() => import('./pages/auth/LoginPage'));
const ActivityDebugger = React.lazy(() => import('./components/debug/ActivityDebugger'));
const SessionExpiryModal = React.lazy(() => import('./components/ui/SessionExpiryModal'));
const Notification = React.lazy(() => import('./components/ui/Notification'));
const AuthRedirect = React.lazy(() => import('./components/auth/AuthRedirect'));

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
  const { isAuthenticated, isLoading, isInitializing, showLoadingSpinner } = useAuth();

  // Track user activity across the application (inside Router context)
  useActivityTracker();

  // Show loading spinner during authentication initialization
  if (isLoading || isInitializing || showLoadingSpinner) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Global navigation bar */}
      <NavBar />
      <main>
        <Routes>
          {/* Public routes */}
          <Route path={ROUTES.HOME} element={<HomePage />} />
          <Route path={ROUTES.LOGIN} element={<LoginPage />} />

          {/* Catch-all route - redirect to home */}
          <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
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

        {/* Authentication Redirect Handler */}
        <Suspense fallback={null}>
          <AuthRedirect />
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
