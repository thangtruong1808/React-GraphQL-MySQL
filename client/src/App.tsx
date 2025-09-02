import React, { Suspense } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ApolloProvider } from '@apollo/client';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ErrorProvider, useError } from './contexts/ErrorContext';
import { AppRoutes } from './components/routing';
import NavBar from './components/layout/NavBar';
import { ActivityTracker } from './components/activity';

import apolloClient, { setGlobalErrorHandler } from './services/graphql/apollo-client';
import './App.css';

// Lazy load components for better performance
const ActivityDebugger = React.lazy(() => import('./components/debug/ActivityDebugger'));
const SessionExpiryModal = React.lazy(() => import('./components/ui/SessionExpiryModal'));
const Notification = React.lazy(() => import('./components/ui/Notification'));

// Loading component for Suspense fallback
const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
  </div>
);

/**
 * Main App Content Component
 * Handles main application layout and routing
 * 
 * CALLED BY: App component
 * SCENARIOS: All application scenarios
 */
const AppContent: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Global navigation bar - show for all users */}
      <NavBar />

      {/* Activity tracker - handles user activity monitoring */}
      <ActivityTracker />

      {/* Main content area - flex-1 to take remaining space */}
      <main className="flex-1">
        <AppRoutes />
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
const AppWithModals: React.FC = () => {
  const {
    showSessionExpiryModal,
    sessionExpiryMessage,
    refreshSession,
    performLogout, // UPDATED: Use performLogout directly for better control
    notification,
    hideNotification
  } = useAuth();
  const { showError } = useError();

  // Set up global error handler for Apollo Client
  React.useEffect(() => {
    setGlobalErrorHandler((message: string, source: string) => {
      showError(message, source);
    });
  }, [showError]);

  return (
    <>
      <BrowserRouter>
        <Suspense fallback={<LoadingSpinner />}>
          <AppContent />
        </Suspense>
      </BrowserRouter>

      {/* Session Expiry Modal */}
      <Suspense fallback={null}>
        <SessionExpiryModal
          isOpen={showSessionExpiryModal}
          message={sessionExpiryMessage}
          onRefresh={refreshSession}
          onLogout={() => performLogout({ showToast: true, fromModal: true, immediate: true })} // UPDATED: Use performLogout with modal options and toast
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
 * App Component
 * Main application wrapper with authentication provider
 * 
 * CALLED BY: main.tsx
 * SCENARIOS: All application scenarios
 */
function App() {
  return (
    <ApolloProvider client={apolloClient}>
      <ErrorProvider>
        <AuthProvider>
          <AppWithModals />
        </AuthProvider>
      </ErrorProvider>
    </ApolloProvider>
  );
}

export default App;
