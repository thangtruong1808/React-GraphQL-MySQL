import { useState } from 'react';
import { User } from '../../types/graphql';
import { AUTH_FEATURES } from '../../constants/auth';

/**
 * Authentication State Interface
 * Defines the structure of authentication state
 */
export interface AuthState {
  // Core authentication state
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitializing: boolean;
  showLoadingSpinner: boolean;

  // Session expiry state
  showSessionExpiryModal: boolean;
  sessionExpiryMessage: string;
  lastModalShowTime: number | null;
  modalAutoLogoutTimer: NodeJS.Timeout | null;

  // Loading states
  loginLoading: boolean;
  logoutLoading: boolean;

  // Notification state
  notification: {
    message: string;
    type: 'success' | 'error' | 'info';
    isVisible: boolean;
  };
}

/**
 * Initial authentication state
 * Provides default values for all authentication state properties
 * Starts with loading states as true to prevent authentication flicker
 */
export const initialAuthState: AuthState = {
  // Core authentication state
  user: null,
  isAuthenticated: false,
  isLoading: true, // Start as true to prevent flicker during auth initialization
  isInitializing: true, // Start as true to prevent flicker during auth initialization
  showLoadingSpinner: false,

  // Session expiry state
  showSessionExpiryModal: false,
  sessionExpiryMessage: '',
  lastModalShowTime: null,
  modalAutoLogoutTimer: null,

  // Loading states
  loginLoading: false,
  logoutLoading: false,

  // Notification state
  notification: {
    message: '',
    type: 'info',
    isVisible: false,
  },
};

/**
 * Authentication State Manager
 * Manages all authentication-related state with proper setters
 */
export const useAuthState = () => {
  const [state, setState] = useState<AuthState>(initialAuthState);

  // Core authentication state setters
  const setUser = (user: User | null) => {
    setState(prev => ({ ...prev, user }));
  };

  const setIsAuthenticated = (isAuthenticated: boolean) => {
    setState(prev => ({ ...prev, isAuthenticated }));
  };

  const setIsLoading = (isLoading: boolean) => {
    setState(prev => ({ ...prev, isLoading }));
  };

  const setIsInitializing = (isInitializing: boolean) => {
    setState(prev => ({ ...prev, isInitializing }));
  };

  const setShowLoadingSpinner = (showLoadingSpinner: boolean) => {
    setState(prev => ({ ...prev, showLoadingSpinner }));
  };

  // Session expiry state setters
  const setShowSessionExpiryModal = (showSessionExpiryModal: boolean) => {
    setState(prev => ({ ...prev, showSessionExpiryModal }));
  };

  const setSessionExpiryMessage = (sessionExpiryMessage: string) => {
    setState(prev => ({ ...prev, sessionExpiryMessage }));
  };

  const setLastModalShowTime = (lastModalShowTime: number | null) => {
    setState(prev => ({ ...prev, lastModalShowTime }));
  };

  const setModalAutoLogoutTimer = (modalAutoLogoutTimer: NodeJS.Timeout | null) => {
    setState(prev => ({ ...prev, modalAutoLogoutTimer }));
  };

  // Loading state setters
  const setLoginLoading = (loginLoading: boolean) => {
    setState(prev => ({ ...prev, loginLoading }));
  };

  const setLogoutLoading = (logoutLoading: boolean) => {
    setState(prev => ({ ...prev, logoutLoading }));
  };

  // Notification state setters
  const setNotification = (notification: { message: string; type: 'success' | 'error' | 'info'; isVisible: boolean }) => {
    setState(prev => ({ ...prev, notification }));
  };

  const showNotification = (message: string, type: 'success' | 'error' | 'info') => {
    setState(prev => ({
      ...prev,
      notification: {
        message,
        type,
        isVisible: true,
      },
    }));
  };

  const hideNotification = () => {
    setState(prev => ({
      ...prev,
      notification: {
        ...prev.notification,
        isVisible: false,
      },
    }));
  };

  return {
    // State
    ...state,

    // Setters
    setUser,
    setIsAuthenticated,
    setIsLoading,
    setIsInitializing,
    setShowLoadingSpinner,
    setShowSessionExpiryModal,
    setSessionExpiryMessage,
    setLastModalShowTime,
    setModalAutoLogoutTimer,
    setLoginLoading,
    setLogoutLoading,
    setNotification,
    showNotification,
    hideNotification,
  };
}; 