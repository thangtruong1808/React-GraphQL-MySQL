import React from 'react';
import { Link } from 'react-router-dom';
import { User } from '../../types/graphql';

/**
 * User Dropdown Component
 * Displays user avatar and dropdown menu for authenticated users
 * Handles user profile actions and logout functionality
 */
interface UserDropdownProps {
  user: User | null;
  isDropdownOpen: boolean;
  logoutLoading: boolean;
  onToggleDropdown: () => void;
  onLogout: () => void;
  getUserInitials: () => string;
}

const UserDropdown: React.FC<UserDropdownProps> = ({
  user,
  isDropdownOpen,
  logoutLoading,
  onToggleDropdown,
  onLogout,
  getUserInitials,
}) => {
  return (
    <div className="relative">
      {/* User Avatar and Dropdown Trigger - Horizontal Layout */}
      <button
        onClick={onToggleDropdown}
        className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
      >
        {/* User Avatar */}
        <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-yellow-500 rounded-full flex items-center justify-center">
          <span className="text-sm font-semibold text-white">
            {getUserInitials()}
          </span>
        </div>

        {/* Dropdown Icon */}
        <svg
          className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''
            }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isDropdownOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
          {/* User Profile Section */}
          <div className="px-4 py-2 border-b border-gray-100">
            <div className="text-sm font-medium text-gray-900">
              {user?.firstName} {user?.lastName}
            </div>
            <div className="text-xs text-gray-500">
              {user?.email}
            </div>
            <div className="text-xs text-gray-400 mt-1">
              {user?.role}
            </div>
          </div>

          {/* Menu Items */}
          <Link
            to="/dashboard"
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
          >
            Dashboard
          </Link>

          <Link
            to="/profile"
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
          >
            Profile Settings
          </Link>

          <div className="border-t border-gray-100">
            <button
              onClick={onLogout}
              disabled={logoutLoading}
              className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 disabled:opacity-50 transition-colors duration-200"
            >
              {logoutLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600 mr-2"></div>
                  Logging out...
                </div>
              ) : (
                'Sign Out'
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDropdown; 