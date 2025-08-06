import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { ROUTES } from '../../constants';

/**
 * Authentication Redirect Component
 * Handles safe redirects to login page when user is not authenticated
 * Prevents infinite loops by checking current route before redirecting
 * 
 * CALLED BY: App.tsx when user is not authenticated
 * SCENARIOS: All logout scenarios that require redirect to login
 */
const AuthRedirect: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading, isInitializing } = useAuth();

  useEffect(() => {
    // Only redirect if not loading, not initializing, and not authenticated
    if (!isLoading && !isInitializing && !isAuthenticated) {
      // Check if we're not already on the login page to prevent loops
      if (window.location.pathname !== ROUTES.LOGIN) {
        console.log('🔀 Redirecting to login page...');
        navigate(ROUTES.LOGIN, { replace: true });
      }
    }
  }, [isAuthenticated, isLoading, isInitializing, navigate]);

  return null; // This component doesn't render anything
};

export default AuthRedirect; 