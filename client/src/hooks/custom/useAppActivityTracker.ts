import { useCallback } from 'react';
import { useAuth } from '../../contexts/AuthContext';

/**
 * Custom hook to track application-level user actions
 * Provides functions to manually trigger activity updates for meaningful actions
 * 
 * CALLED BY: Components that perform application actions
 * SCENARIOS: Form submissions, API calls, data operations, etc.
 */
export const useAppActivityTracker = () => {
  const { handleUserActivity } = useAuth();

  /**
   * Track form submission activity
   * Called when user submits any form in the application
   * 
   * CALLED BY: Form components on successful submission
   * SCENARIOS: Login, registration, data entry forms
   */
  const trackFormSubmission = useCallback(() => {
    handleUserActivity();
  }, [handleUserActivity]);

  /**
   * Track data operation activity
   * Called when user performs data operations (create, update, delete)
   * 
   * CALLED BY: Components that perform CRUD operations
   * SCENARIOS: Creating/editing/deleting records, data management
   */
  const trackDataOperation = useCallback(() => {
    handleUserActivity();
  }, [handleUserActivity]);

  /**
   * Track API call activity
   * Called when user triggers API calls through GraphQL mutations/queries
   * 
   * CALLED BY: Components that make API calls
   * SCENARIOS: GraphQL mutations, queries, data fetching
   */
  const trackApiCall = useCallback(() => {
    handleUserActivity();
  }, [handleUserActivity]);

  /**
   * Track user preference change activity
   * Called when user changes application settings or preferences
   * 
   * CALLED BY: Settings components, preference panels
   * SCENARIOS: Theme changes, language changes, settings updates
   */
  const trackPreferenceChange = useCallback(() => {
    handleUserActivity();
  }, [handleUserActivity]);

  /**
   * Track general application action
   * Generic function for any other application-level action
   * 
   * CALLED BY: Components for custom application actions
   * SCENARIOS: Any meaningful user interaction not covered by other functions
   */
  const trackAppAction = useCallback((actionName: string) => {
    handleUserActivity();
  }, [handleUserActivity]);

  return {
    trackFormSubmission,
    trackDataOperation,
    trackApiCall,
    trackPreferenceChange,
    trackAppAction,
  };
}; 