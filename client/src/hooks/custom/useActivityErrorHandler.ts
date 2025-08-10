import { useState, useCallback } from 'react';
import { INLINE_ACTIVITY_ERROR_MESSAGES } from '../../constants/inlineErrorDisplay';

/**
 * Activity Error Handler Hook
 * Manages activity tracking errors and provides inline error display
 * 
 * USED BY: HomePage, SessionManager for activity tracking error handling
 * PURPOSE: Replace notification-based errors with inline error display
 */
export const useActivityErrorHandler = () => {
  // State for activity tracking error
  const [activityError, setActivityError] = useState<string | null>(null);
  const [isRetrying, setIsRetrying] = useState(false);

  /**
   * Set activity tracking error
   * @param error - Error message to display
   */
  const setError = useCallback((error: string) => {
    setActivityError(error);
  }, []);

  /**
   * Clear activity tracking error
   */
  const clearError = useCallback(() => {
    setActivityError(null);
  }, []);

  /**
   * Handle activity tracking failure
   * @param errorType - Type of activity tracking error
   */
  const handleActivityError = useCallback((errorType: keyof typeof INLINE_ACTIVITY_ERROR_MESSAGES) => {
    const errorMessage = INLINE_ACTIVITY_ERROR_MESSAGES[errorType];
    setActivityError(errorMessage);
  }, []);

  /**
   * Retry activity tracking
   * @param retryFunction - Function to retry activity tracking
   */
  const retryActivityTracking = useCallback(async (retryFunction: () => Promise<void>) => {
    try {
      setIsRetrying(true);
      clearError();
      await retryFunction();
    } catch (error) {
      // If retry fails, show error again
      setError(INLINE_ACTIVITY_ERROR_MESSAGES.TRACKING_FAILED);
    } finally {
      setIsRetrying(false);
    }
  }, [clearError, setError]);

  /**
   * Check if there's an active error
   */
  const hasError = useCallback(() => {
    return activityError !== null;
  }, [activityError]);

  return {
    // Error state
    activityError,
    isRetrying,
    hasError: hasError(),
    
    // Error actions
    setError,
    clearError,
    handleActivityError,
    retryActivityTracking
  };
};
