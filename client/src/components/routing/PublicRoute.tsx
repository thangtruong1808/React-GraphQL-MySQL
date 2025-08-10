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

  // Show loading spinner during authentication check
  if (isLoading || isInitializing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  // Redirect authenticated users to home page
  if (isAuthenticated) {
    // Debug logging disabled for better user experience
    return (
      <Navigate
        to={redirectPath}
        replace={true}
      />
    );
  }

  // Render public content if not authenticated
  return <>{children}</>;
};

export default PublicRoute; 