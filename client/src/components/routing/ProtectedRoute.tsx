import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { ROUTE_CONFIG } from '../../constants/routingConstants';

/**
 * Protected Route Component
 * Wraps routes that require authentication
 * Redirects unauthenticated users to login page
 * 
 * CALLED BY: App.tsx for protected routes
 * SCENARIOS: All protected route access attempts
 */
interface ProtectedRouteProps {
  children: React.ReactNode;
  fallbackPath?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  fallbackPath = ROUTE_CONFIG.DEFAULT_UNAUTHENTICATED_ROUTE
}) => {
  const { isAuthenticated, isLoading, isInitializing } = useAuth();
  const location = useLocation();

  // Show loading spinner during authentication check
  if (isLoading || isInitializing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    // Debug logging disabled for better user experience
    return (
      <Navigate
        to={fallbackPath}
        state={{ from: location }}
        replace={true}
      />
    );
  }

  // Render protected content if authenticated
  return <>{children}</>;
};

export default ProtectedRoute; 