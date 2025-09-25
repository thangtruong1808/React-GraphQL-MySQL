import React, { useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { TaskFlowOverview } from '../../components/dashboard';
import { PublicDashboard } from '../../components/shared';

/**
 * Authenticated Skeleton Component
 * Shows loading skeleton for authenticated users (logged in)
 */
export const AuthenticatedSkeleton: React.FC = () => {
  return (
    <div className="min-h-full bg-gray-50">
      {/* Hero Section Skeleton */}
      <div className="bg-gradient-to-br from-emerald-50 via-teal-50 to-emerald-100 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="h-12 bg-gray-200 rounded-lg mb-6 animate-pulse max-w-2xl mx-auto"></div>
            <div className="h-8 bg-gray-200 rounded-lg animate-pulse max-w-3xl mx-auto"></div>
          </div>
        </div>
      </div>

      {/* Main Content Section Skeleton - Matches authenticated layout */}
      <div className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* User Welcome Card Skeleton */}
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-6 animate-pulse"></div>
                <div className="h-8 bg-gray-200 rounded-lg mb-2 animate-pulse"></div>
                <div className="h-6 bg-gray-200 rounded-lg animate-pulse"></div>
              </div>
              <div className="h-10 bg-gray-200 rounded-lg animate-pulse"></div>
            </div>

            {/* User Information Card Skeleton */}
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
              <div className="h-8 bg-gray-200 rounded-lg mb-6 animate-pulse"></div>
              <div className="space-y-4">
                <div className="h-12 bg-gray-200 rounded-lg animate-pulse"></div>
                <div className="h-12 bg-gray-200 rounded-lg animate-pulse"></div>
                <div className="h-12 bg-gray-200 rounded-lg animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};



/**
 * HomePage Component
 * Shows appropriate content based on authentication state
 * AuthProvider ensures this component only renders after authentication is initialized
 */
const HomePage: React.FC = () => {
  const { isAuthenticated, user } = useAuth();

  // Reset scroll position to top when component mounts for better UX
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  }, []);

  // AuthProvider handles gating - we only render here after initialization is complete
  if (!user || !isAuthenticated) {
    // We're sure user is not logged in - show public dashboard with insights
    return <PublicDashboard />;
  }

  // User is authenticated and ready - show TaskFlow dashboard
  return <TaskFlowOverview />;
};

export default HomePage; 