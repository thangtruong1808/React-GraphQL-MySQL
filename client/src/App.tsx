import React, { Suspense } from 'react';
import { BrowserRouter, useLocation } from 'react-router-dom';
import { ApolloProvider } from '@apollo/client';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ErrorProvider, useError } from './contexts/ErrorContext';
import { AppRoutes } from './components/routing';
import NavBar from './components/layout/NavBar';
import { ActivityTracker } from './components/activity';

import apolloClient, { setGlobalErrorHandler } from './services/graphql/apollo-client';
import { LoginPageSkeleton, ProjectsPageSkeleton, TeamPageSkeleton, AboutPageSkeleton, AuthInitializationSkeleton, NavBarSkeleton, SearchResultsPageSkeleton } from './components/ui';
import { DashboardLayout } from './components/layout';
import { ROUTE_PATHS } from './constants/routingConstants';
import './App.css';

// Lazy load components for better performance
const ActivityDebugger = React.lazy(() => import('./components/debug/ActivityDebugger'));
const SessionExpiryModal = React.lazy(() => import('./components/ui/SessionExpiryModal'));
const Notification = React.lazy(() => import('./components/ui/Notification'));

// Loading component for Suspense fallback - route-aware
const RouteAwareLoadingFallback = () => {
  const location = useLocation();

  // Show LoginPageSkeleton for login route
  if (location.pathname === ROUTE_PATHS.LOGIN) {
    return <LoginPageSkeleton />;
  }

  // Show NavBar layout for public pages (Projects, Team, About)
  if (location.pathname === ROUTE_PATHS.PROJECTS) {
    return (
      <div className="min-h-screen flex flex-col">
        <NavBarSkeleton />
        <main className="flex-1">
          <ProjectsPageSkeleton />
        </main>
      </div>
    );
  }

  if (location.pathname === ROUTE_PATHS.TEAM) {
    return (
      <div className="min-h-screen flex flex-col">
        <NavBarSkeleton />
        <main className="flex-1">
          <TeamPageSkeleton />
        </main>
      </div>
    );
  }

  if (location.pathname === ROUTE_PATHS.ABOUT) {
    return (
      <div className="min-h-screen flex flex-col">
        <NavBarSkeleton />
        <main className="flex-1">
          <AboutPageSkeleton />
        </main>
      </div>
    );
  }

  if (location.pathname === ROUTE_PATHS.HOME) {
    return (
      <div className="min-h-screen flex flex-col">
        <NavBarSkeleton />
        <main className="flex-1">
          <AuthInitializationSkeleton />
        </main>
      </div>
    );
  }

  if (location.pathname === ROUTE_PATHS.SEARCH) {
    return (
      <div className="min-h-screen flex flex-col">
        <NavBarSkeleton />
        <main className="flex-1">
          <SearchResultsPageSkeleton />
        </main>
      </div>
    );
  }

  // Generic loading spinner for other routes (like About, Search, etc.)
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
    </div>
  );
};

/**
 * Main App Content Component
 * Handles main application layout and routing
 * 
 * CALLED BY: App component
 * SCENARIOS: All application scenarios
 */
const AppContent: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  // Show NavBar for non-authenticated users, login page, homepage, search page, or public pages
  const shouldShowNavBar = !isAuthenticated || location.pathname === ROUTE_PATHS.LOGIN || location.pathname === ROUTE_PATHS.HOME || location.pathname === ROUTE_PATHS.SEARCH || location.pathname === ROUTE_PATHS.PROJECTS || location.pathname === ROUTE_PATHS.TEAM || location.pathname === ROUTE_PATHS.ABOUT || location.pathname.startsWith('/projects/');

  // For authenticated users on dashboard routes (not homepage, search, or public pages), use edge-to-edge layout
  if (isAuthenticated && location.pathname !== ROUTE_PATHS.HOME && location.pathname !== ROUTE_PATHS.SEARCH && location.pathname !== ROUTE_PATHS.PROJECTS && location.pathname !== ROUTE_PATHS.TEAM && location.pathname !== ROUTE_PATHS.ABOUT && !location.pathname.startsWith('/projects/')) {
    return (
      <>
        {/* Activity tracker - handles user activity monitoring */}
        <ActivityTracker />

        {/* Main content area - direct rendering for edge-to-edge */}
        <AppRoutes />
      </>
    );
  }

  // For non-authenticated users or authenticated users on homepage, use layout with NavBar
  return (
    <div className="min-h-screen flex flex-col">
      {/* Global navigation bar - show for non-authenticated users and authenticated users on homepage */}
      {shouldShowNavBar && <NavBar />}

      {/* Activity tracker - handles user activity monitoring */}
      <ActivityTracker />

      {/* Main content area - flex-1 to take remaining space with top padding for fixed NavBar */}
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
      <Suspense fallback={<RouteAwareLoadingFallback />}>
        <AppContent />
      </Suspense>

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
 * AuthProvider moved inside BrowserRouter to allow route-based skeleton logic
 * 
 * CALLED BY: main.tsx
 * SCENARIOS: All application scenarios
 */
function App() {
  return (
    <ApolloProvider client={apolloClient}>
      <ErrorProvider>
        <BrowserRouter>
          <AuthProvider>
            <AppWithModals />
          </AuthProvider>
        </BrowserRouter>
      </ErrorProvider>
    </ApolloProvider>
  );
}

export default App;
