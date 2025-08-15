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

  // Let the HomePage handle its own loading state with skeleton
  // Only redirect if not authenticated and not loading
  if (!isLoading && !isInitializing && !isAuthenticated) {
    // Debug logging disabled for better user experience
    return (
      <Navigate
        to={fallbackPath}
        state={{ from: location }}
        replace={true}
      />
    );
  }

  // Render protected content if authenticated or still loading
  return <>{children}</>;
};

export default ProtectedRoute; 