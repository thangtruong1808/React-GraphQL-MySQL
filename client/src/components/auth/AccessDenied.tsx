import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { formatRoleForDisplay } from '../../utils/roleFormatter';
import { FaLock, FaUserShield, FaArrowLeft } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { ROUTE_PATHS } from '../../constants/routingConstants';

/**
 * Access Denied Component
 * Displays when users don't have permission to access dashboard pages
 * Shows appropriate message based on user role
 */

interface AccessDeniedProps {
  feature?: string;
  className?: string;
}

const AccessDenied: React.FC<AccessDeniedProps> = ({
  feature = 'dashboard',
  className = ''
}) => {
  const { user } = useAuth();

  // Get user's display role
  const userRole = user ? formatRoleForDisplay(user.role) : 'Unknown';
  const userName = user ? `${user.firstName} ${user.lastName}` : 'User';

  return (
    <div className={`min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 ${className}`}>
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          {/* Icon */}
          <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-red-100 mb-6">
            <FaLock className="h-10 w-10 text-red-600" />
          </div>

          {/* Title */}
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Access Denied
          </h2>

          {/* Description */}
          <div className="space-y-4">
            <p className="text-lg text-gray-600">
              Sorry, <span className="font-semibold text-gray-900">{userName}</span>,
              you don't have permission to access the {feature}.
            </p>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center">
                <FaUserShield className="h-5 w-5 text-yellow-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-yellow-800">
                    Your Role: {userRole}
                  </p>
                  <p className="text-sm text-yellow-700 mt-1">
                    Only Admin and Project Manager roles can access dashboard features.
                  </p>
                </div>
              </div>
            </div>

            <p className="text-sm text-gray-500">
              If you believe this is an error, please contact your administrator.
            </p>
          </div>

          {/* Action Button */}
          <div className="mt-8">
            <Link
              to={ROUTE_PATHS.HOME}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors duration-200"
            >
              <FaArrowLeft className="h-4 w-4 mr-2" />
              Return to Home
            </Link>
          </div>

          {/* Additional Info */}
          <div className="mt-8 text-xs text-gray-400">
            <p>
              Need help? Contact support or check with your administrator about role permissions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccessDenied;
