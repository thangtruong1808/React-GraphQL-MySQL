import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { ROUTE_CONFIG } from '../../constants/routingConstants';

/**
 * Public Route Component
 * Wraps routes that should not be accessible to authenticated users
 * Redirects authenticated users to home page
 * 
 * CALLED BY: App.tsx for public routes like login
 * SCENARIOS: Authenticated users trying to access login page
 */
interface PublicRouteProps {
  children: React.ReactNode;
  redirectPath?: string;
}

const PublicRoute: React.FC<PublicRouteProps> = ({
  children,
  redirectPath = ROUTE_CONFIG.DEFAULT_AUTHENTICATED_ROUTE
}) => {
  const { isAuthenticated, isLoading, isInitializing } = useAuth();
  const location = useLocation();

  // Let the HomePage handle its own loading state with skeleton
  // Only redirect if authenticated and not loading
  if (!isLoading && !isInitializing && isAuthenticated) {
    // Debug logging disabled for better user experience
    return (
      <Navigate
        to={redirectPath}
        replace={true}
      />
    );
  }

  // Render public content if not authenticated or still loading
  return <>{children}</>;
};

export default PublicRoute; 