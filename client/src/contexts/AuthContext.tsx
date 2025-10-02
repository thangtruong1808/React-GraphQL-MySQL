import React, { createContext, ReactNode, useContext, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { LoginInput, User } from '../types/graphql';
import { useAuthState, useAuthActions, useSessionManager, useAuthInitializer } from './auth';
import { TokenManager } from '../utils/tokenManager/TokenManager';
import { AuthInitializationSkeleton, LoginPageSkeleton, ProjectsPageSkeleton, TeamPageSkeleton, NavBarSkeleton, SearchResultsPageSkeleton } from '../components/ui';
import { DashboardLayout } from '../components/layout';
import { ROUTE_PATHS } from '../constants/routingConstants';

/**
 * Authentication Context Interface
 * Defines the shape of the authentication context for login functionality
 */
interface AuthContextType {
  // State
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitializing: boolean;
  showLoadingSpinner: boolean;

  // Session expiry state
  showSessionExpiryModal: boolean;
  sessionExpiryMessage: string;

  // Notification state
  notification: {
    message: string;
    type: 'success' | 'error' | 'info';
    isVisible: boolean;
  };

  // Loading states
  loginLoading: boolean;
  logoutLoading: boolean;

  // Actions
  login: (input: LoginInput) => Promise<{ success: boolean; user?: User; error?: string }>;
  performLogout: (options?: { showToast?: boolean; fromModal?: boolean; immediate?: boolean }) => Promise<void>;
  refreshSession: () => Promise<boolean>;

  // Session management
  validateSession: () => Promise<boolean>;
  handleUserActivity: () => Promise<void>;

  // Notification management
  showNotification: (message: string, type: 'success' | 'error' | 'info') => void;
  hideNotification: () => void;

  // Utilities
  hasRole: (role: string) => boolean;
}

/**
 * AuthProvider Props Interface
 * Defines props for the AuthProvider component
 */
interface AuthProviderProps {
  children: ReactNode;
}

/**
 * Step 1 AuthContext Creation
 * Creates the authentication context with default values
 */
const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Step 3 Custom hook to use authentication context
 * Provides type-safe access to authentication state and functions
 */
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

/**
 * Step 2 Create AuthProvider Component
 * Wraps the application and provides authentication context
 * Combines all authentication modules into a single provider
 * 
 * EXECUTION FLOW FOR DIFFERENT SCENARIOS:
 * 
 * 1. FIRST TIME LOGIN (No tokens):
 *    - validateSession() → returns false (no tokens)
 *    - login() → calls loginMutation → apollo-client.ts → server auth.ts → DB
 *    - saveTokens() → stores tokens in tokenManager.ts
 *    - setUser() + setIsAuthenticated(true) → updates state
 * 
 * 2. ACTIVE USER (Within ACCESS_TOKEN_EXPIRY):
 *    - User activity detected → updateActivity() → extends session
 *    - User remains authenticated → no logout
 * 
 * 3. INACTIVE USER (ACCESS_TOKEN_EXPIRY reached):
 *    - User inactive for 2 minutes → modal appears → user can continue or logout
 * 
 * 4. REFRESH_TOKEN_EXPIRY reached (Absolute timeout):
 *    - Regardless of activity → automatic logout
 *    - User must login again
 */
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  // Get current location to check if user is on login route
  const location = useLocation();

  // Authentication state management
  const authState = useAuthState();

  // Authentication actions management (initial version without pause/resume)
  const authActions = useAuthActions(
    authState.setUser,
    authState.setIsAuthenticated,
    authState.setLoginLoading,
    authState.setLogoutLoading,
    authState.showNotification,
    authState.setShowSessionExpiryModal,
    authState.setSessionExpiryMessage,
    authState.setLastModalShowTime,
    authState.setModalAutoLogoutTimer,
    authState.modalAutoLogoutTimer,
    undefined, // pauseAutoLogoutForRefresh
    undefined, // resumeAutoLogoutAfterRefresh
  );

  // Session management
  const sessionManager = useSessionManager(
    authState.user,
    authState.isAuthenticated,
    authState.showSessionExpiryModal,
    authState.lastModalShowTime,
    authActions.refreshUserSession,
    authActions.performCompleteLogout,
    authState.showNotification,
    authState.setShowSessionExpiryModal,
    authState.setSessionExpiryMessage,
    authState.setLastModalShowTime,
    authState.setModalAutoLogoutTimer,
  );

  // Authentication initialization
  useAuthInitializer(
    authActions.refreshUserSession,
    authActions.performCompleteLogout,
    authState.setIsInitializing,
    authState.setShowLoadingSpinner,
    authState.setIsLoading,
    authState.setUser,
    authState.setIsAuthenticated,
  );

  // Sync session expiry modal state with TokenManager
  useEffect(() => {
    TokenManager.setSessionExpiryModalShowing(authState.showSessionExpiryModal);
  }, [authState.showSessionExpiryModal]);

  // Context value with all authentication state and functions
  const contextValue: AuthContextType = {
    // State
    user: authState.user,
    isAuthenticated: authState.isAuthenticated,
    isLoading: authState.isLoading,
    isInitializing: authState.isInitializing,
    showLoadingSpinner: authState.showLoadingSpinner,

    // Session expiry state
    showSessionExpiryModal: authState.showSessionExpiryModal,
    sessionExpiryMessage: authState.sessionExpiryMessage,

    // Notification state
    notification: authState.notification,

    // Loading states
    loginLoading: authState.loginLoading,
    logoutLoading: authState.logoutLoading,

    // Actions
    login: authActions.login,
    performLogout: authActions.performLogout,
    refreshSession: authActions.refreshSession,

    // Session management
    validateSession: sessionManager.validateSession,
    handleUserActivity: sessionManager.handleUserActivity,

    // Notification management
    showNotification: authState.showNotification,
    hideNotification: authState.hideNotification,

    // Utilities
    hasRole: sessionManager.hasRole,
  };

  // Check current route to show appropriate skeleton during initialization
  const isOnLoginRoute = location.pathname === ROUTE_PATHS.LOGIN;
  const isOnProjectsRoute = location.pathname === ROUTE_PATHS.PROJECTS;
  const isOnTeamRoute = location.pathname === ROUTE_PATHS.TEAM;
  const isOnSearchRoute = location.pathname === ROUTE_PATHS.SEARCH;

  return (
    <AuthContext.Provider value={contextValue}>
      {authState.isInitializing ? (
        isOnLoginRoute ? (
          <LoginPageSkeleton />
        ) : (
          <DashboardLayout>
            {isOnProjectsRoute ? (
              <ProjectsPageSkeleton />
            ) : isOnTeamRoute ? (
              <TeamPageSkeleton />
            ) : isOnSearchRoute ? (
              <SearchResultsPageSkeleton />
            ) : (
              <AuthInitializationSkeleton />
            )}
          </DashboardLayout>
        )
      ) : children}
    </AuthContext.Provider>
  );
}; 