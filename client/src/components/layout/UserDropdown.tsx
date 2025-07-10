import React from 'react';
import { Link } from 'react-router-dom';
import { User } from '../../types/graphql';

/**
 * User Dropdown Component
 * Displays user avatar and dropdown menu for authenticated users
 * Handles user profile actions and logout functionality with enhanced styling and icons
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
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl z-50 border border-gray-200">
          {/* User Profile Section */}
          <div className="px-4 py-3 border-b border-gray-100 bg-gradient-to-r from-emerald-50 to-teal-50">
            <div className="flex items-center space-x-3">
              {/* User Avatar in Dropdown */}
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-yellow-500 rounded-full flex items-center justify-center">
                <span className="text-sm font-semibold text-white">
                  {getUserInitials()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-gray-900 truncate">
                  {user?.firstName} {user?.lastName}
                </div>
                <div className="text-xs text-gray-600 truncate">
                  {user?.email}
                </div>
                <div className="flex items-center mt-1">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                    {user?.role}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="py-1">
            {/* Profile Link */}
            <Link
              to="/profile"
              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors duration-200"
            >
              <svg className="w-4 h-4 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Profile
            </Link>

            {/* Settings Link */}
            <Link
              to="/settings"
              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors duration-200"
            >
              <svg className="w-4 h-4 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Settings
            </Link>

            {/* Dashboard Link */}
            <Link
              to="/dashboard"
              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors duration-200"
            >
              <svg className="w-4 h-4 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Dashboard
            </Link>
          </div>

          {/* Logout Section */}
          <div className="border-t border-gray-100 pt-0">
            <button
              onClick={onLogout}
              disabled={logoutLoading}
              className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 disabled:opacity-50 transition-colors duration-200"
            >
              {logoutLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600 mr-3"></div>
                  Logging out...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 mr-3 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Sign Out
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDropdown; 