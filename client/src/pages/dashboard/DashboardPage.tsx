import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { formatMemberSince } from '../../utils/helpers';
import UserSessionManager from '../../components/admin/UserSessionManager';

/**
 * Dashboard Page Component
 * Displays user information and dashboard content for authenticated users
 * Shows loading state while fetching user data
 * Includes force logout detection for immediate response
 */
const DashboardPage: React.FC = () => {
  const { user, isAuthenticated, isLoading, validateSession } = useAuth();

  // Check for force logout on component mount and when user changes
  React.useEffect(() => {
    if (isAuthenticated && !validateSession()) {
      console.log('🔐 Dashboard - Session validation failed, redirecting to login');
      window.location.href = '/login';
    }
  }, [isAuthenticated, validateSession]);

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Show error if not authenticated
  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Access Denied
          </h1>
          <p className="text-gray-600">
            You must be logged in to access this page.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome to your Dashboard
          </h1>
          <p className="mt-2 text-gray-600">
            Manage your projects and tasks from here.
          </p>
        </div>

        {/* User Information Card */}
        <div className="bg-white shadow rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            User Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <p className="mt-1 text-sm text-gray-900">
                {user.firstName} {user.lastName}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <p className="mt-1 text-sm text-gray-900">
                {user.email}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Role
              </label>
              <p className="mt-1 text-sm text-gray-900">
                {user.role}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                User ID
              </label>
              <p className="mt-1 text-sm text-gray-900">
                {user.id}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                UUID
              </label>
              <p className="mt-1 text-sm text-gray-900 font-mono">
                {user.uuid}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Member Since
              </label>
              <p className="mt-1 text-sm text-gray-900">
                {formatMemberSince(user.createdAt)}
              </p>
            </div>
          </div>
        </div>

        {/* Authentication Status Card */}
        <div className="bg-white shadow rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Authentication Status
          </h2>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-sm text-gray-900">
              Successfully authenticated
            </span>
          </div>
          <p className="mt-2 text-sm text-gray-600">
            Your session is active and secure.
          </p>
        </div>

        {/* Admin Section - Only show for admin users */}
        {user.role === 'ADMIN' && (
          <div className="bg-white shadow rounded-lg p-6 mb-8">
            <UserSessionManager />
          </div>
        )}

        {/* Quick Actions Card */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200">
              Create Project
            </button>
            <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200">
              Add Task
            </button>
            <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200">
              View Reports
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage; 