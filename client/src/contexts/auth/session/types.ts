/**
 * Session Manager Interface
 * Defines the structure of session management functions
 */
export interface SessionManager {
  // Session validation
  validateSession: () => Promise<boolean>;
  handleUserActivity: () => Promise<void>;
  
  // Session checking
  checkSessionAndActivity: () => Promise<void>;
  setupActivityTracking: () => void;
  
  // Utilities
  hasRole: (role: string) => boolean;
  pauseAutoLogoutForRefresh: () => void;
  resumeAutoLogoutAfterRefresh: () => void;
}

/**
 * Session Manager Dependencies Interface
 * Defines all dependencies needed for session management
 */
export interface SessionManagerDependencies {
  user: any;
  isAuthenticated: boolean;
  showSessionExpiryModal: boolean;
  lastModalShowTime: number | null;
  refreshUserSession: (isSessionRestoration?: boolean) => Promise<boolean>;
  performCompleteLogout: (showToast: boolean, reason?: string) => Promise<void>;
  showNotification: (message: string, type: 'success' | 'error' | 'info') => void;
  setShowSessionExpiryModal: (show: boolean) => void;
  setSessionExpiryMessage: (message: string) => void;
  setLastModalShowTime: (time: number | null) => void;
  setModalAutoLogoutTimer: (timer: NodeJS.Timeout | null) => void;
}

