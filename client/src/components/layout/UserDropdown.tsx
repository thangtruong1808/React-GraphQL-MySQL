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
  // Format role for display from database values to user-friendly format
  const formatRoleForDisplay = (role: string) => {
    switch (role) {
      case 'ADMIN': return 'Administrator';
      case 'Project Manager': return 'Project Manager';
      case 'Software Architect': return 'Software Architect';
      case 'Frontend Developer': return 'Frontend Developer';
      case 'Backend Developer': return 'Backend Developer';
      case 'Full-Stack Developer': return 'Full-Stack Developer';
      case 'DevOps Engineer': return 'DevOps Engineer';
      case 'QA Engineer': return 'QA Engineer';
      case 'QC Engineer': return 'QC Engineer';
      case 'UX/UI Designer': return 'UX/UI Designer';
      case 'Business Analyst': return 'Business Analyst';
      case 'Database Administrator': return 'Database Administrator';
      case 'Technical Writer': return 'Technical Writer';
      case 'Support Engineer': return 'Support Engineer';
      default: return role;
    }
  };
  return (
    <div className="relative">
      {/* User Avatar and Dropdown Trigger - Horizontal Layout */}
      <button
        onClick={onToggleDropdown}
        className="flex items-center space-x-2 p-2 rounded-xl hover:bg-emerald-50 hover:shadow-md transition-all duration-300 transform hover:-translate-y-0.5"
      >
        {/* User Avatar */}
        <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center shadow-md">
          <span className="text-sm font-semibold text-white">
            {getUserInitials()}
          </span>
        </div>

        {/* Dropdown Icon */}
        <svg
          className={`w-4 h-4 text-gray-500 transition-all duration-300 ${isDropdownOpen ? 'rotate-180 text-emerald-600' : ''
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
        <div className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-2xl z-50 border border-gray-100 backdrop-blur-sm bg-opacity-95 animate-in slide-in-from-top-2 duration-300">
          {/* User Profile Section */}
          <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 rounded-t-2xl">
            <div className="flex items-center space-x-4">
              {/* User Avatar in Dropdown */}
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-lg font-bold text-white">
                  {getUserInitials()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-base font-bold text-gray-900 truncate">
                  {user?.firstName} {user?.lastName}
                </div>
                <div className="text-sm text-gray-600 truncate mt-1">
                  {user?.email}
                </div>
                <div className="flex items-center mt-2">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 shadow-sm">
                    {user?.role ? formatRoleForDisplay(user.role) : ''}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="py-2">
            {/* No additional menu items for minimal login feature */}
          </div>

          {/* Logout Section */}
          <div className="border-t border-gray-100 pt-2 rounded-b-2xl">
            <button
              onClick={onLogout}
              disabled={logoutLoading}
              className="w-full flex items-center px-6 py-3 text-sm text-red-600 hover:bg-red-50 disabled:opacity-50 transition-all duration-300 hover:shadow-inner rounded-b-2xl"
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