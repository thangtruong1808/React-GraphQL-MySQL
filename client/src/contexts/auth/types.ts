import { LoginInput, User } from '../../types/graphql';

/**
 * Authentication Actions Interface
 * Defines the structure of authentication actions
 */
export interface AuthActions {
  // Core actions
  login: (input: LoginInput) => Promise<{ success: boolean; user?: User; error?: string }>;
  performLogout: (options?: { showToast?: boolean; fromModal?: boolean; immediate?: boolean }) => Promise<void>;
  refreshSession: () => Promise<boolean>;
  
  // Token management
  refreshUserSession: (isSessionRestoration?: boolean) => Promise<boolean>;
  
  // Utilities
  performCompleteLogout: (showToast: boolean, reason?: string) => Promise<void>;
}

/**
 * Auth Actions Dependencies Interface
 * Defines all dependencies needed for auth actions
 */
export interface AuthActionsDependencies {
  setUser: (user: User | null) => void;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
  setLoginLoading: (loading: boolean) => void;
  setLogoutLoading: (loading: boolean) => void;
  showNotification: (message: string, type: 'success' | 'error' | 'info') => void;
  setShowSessionExpiryModal: (show: boolean) => void;
  setSessionExpiryMessage: (message: string) => void;
  setLastModalShowTime: (time: number | null) => void;
  setModalAutoLogoutTimer: (timer: NodeJS.Timeout | null) => void;
  modalAutoLogoutTimer: NodeJS.Timeout | null;
  pauseAutoLogoutForRefresh?: () => void;
  resumeAutoLogoutAfterRefresh?: () => void;
}

