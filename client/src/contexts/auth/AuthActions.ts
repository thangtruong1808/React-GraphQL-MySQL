import { User } from '../../types/graphql';
import { useLoginAction } from './actions';
import { useLogoutActions } from './actions';
import { useRefreshActions } from './actions';
import { AuthActions, AuthActionsDependencies } from './types';

/**
 * Authentication Actions Hook
 * Manages all authentication-related actions by combining separate action modules
 * Provides a unified interface for all authentication operations
 */
export const useAuthActions = (
  setUser: (user: User | null) => void,
  setIsAuthenticated: (isAuthenticated: boolean) => void,
  setLoginLoading: (loading: boolean) => void,
  setLogoutLoading: (loading: boolean) => void,
  showNotification: (message: string, type: 'success' | 'error' | 'info') => void,
  setShowSessionExpiryModal: (show: boolean) => void,
  setSessionExpiryMessage: (message: string) => void,
  setLastModalShowTime: (time: number | null) => void,
  setModalAutoLogoutTimer: (timer: NodeJS.Timeout | null) => void,
  modalAutoLogoutTimer: NodeJS.Timeout | null,
  pauseAutoLogoutForRefresh?: () => void,
  resumeAutoLogoutAfterRefresh?: () => void,
): AuthActions & { loginLoading: boolean; logoutLoading: boolean } => {
  // Prepare dependencies object for all action hooks
  const deps: AuthActionsDependencies = {
    setUser,
    setIsAuthenticated,
    setLoginLoading,
    setLogoutLoading,
    showNotification,
    setShowSessionExpiryModal,
    setSessionExpiryMessage,
    setLastModalShowTime,
    setModalAutoLogoutTimer,
    modalAutoLogoutTimer,
    pauseAutoLogoutForRefresh,
    resumeAutoLogoutAfterRefresh,
  };

  // Initialize all action hooks
  const { login, loginLoading } = useLoginAction(deps);
  const { performLogout, performCompleteLogout, logoutLoading } = useLogoutActions(deps);
  const { refreshUserSession, refreshSession } = useRefreshActions(deps);

  // Return combined actions interface
  return {
    login,
    performLogout,
    refreshSession,
    refreshUserSession,
    performCompleteLogout,
    loginLoading,
    logoutLoading,
  };
};

// Re-export types for convenience
export type { AuthActions } from './types'; 