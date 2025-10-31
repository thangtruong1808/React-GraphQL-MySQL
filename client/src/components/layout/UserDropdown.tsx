import React from 'react';
import { User } from '../../types/graphql';
import { formatRoleForDisplay } from '../../utils/roleFormatter';

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
        className="user-dropdown-toggle-btn flex items-center space-x-2 p-2 rounded-xl hover:shadow-md transition-all duration-300 transform hover:-translate-y-0.5"
        style={{
          backgroundColor: 'transparent',
          color: 'var(--navbar-text)'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = 'var(--tab-inactive-hover-bg)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'transparent';
        }}
      >
        {/* User Avatar */}
        <div className="w-8 h-8 theme-accent-gradient rounded-full flex items-center justify-center shadow-md">
          <span className="text-sm font-semibold text-white">
            {getUserInitials()}
          </span>
        </div>

        {/* Dropdown Icon */}
        <svg
          className={`w-4 h-4 transition-all duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`}
          style={{
            color: isDropdownOpen ? 'var(--accent-from)' : 'var(--navbar-text-secondary)'
          }}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isDropdownOpen && (
        <div className="absolute right-0 mt-3 w-64 theme-user-dropdown-bg rounded-2xl shadow-2xl z-50 theme-user-dropdown-border border backdrop-blur-sm bg-opacity-95 animate-in slide-in-from-top-2 duration-300">
          {/* User Profile Section */}
          <div className="px-6 py-4 theme-user-profile-bg rounded-t-2xl">
            <div className="flex items-center space-x-4">
              {/* User Avatar in Dropdown */}
              <div className="w-12 h-12 theme-accent-gradient rounded-full flex items-center justify-center shadow-lg">
                <span className="text-lg font-bold text-white">
                  {getUserInitials()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-base font-bold theme-user-profile-text truncate">
                  {user?.firstName} {user?.lastName}
                </div>
                <div className="text-sm theme-user-profile-text-secondary truncate mt-1">
                  {user?.email}
                </div>
                <div className="flex items-center mt-2">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold theme-user-profile-role-bg theme-user-profile-role-text shadow-sm">
                    {user?.role ? formatRoleForDisplay(user.role) : ''}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Logout Section */}
          <div className="theme-user-dropdown-border border-t rounded-b-2xl overflow-hidden">
            <button
              onClick={onLogout}
              disabled={logoutLoading}
              className="user-dropdown-logout-btn w-full flex items-center px-6 py-3 text-sm disabled:opacity-50 transition-all duration-300"
              style={{
                color: 'var(--text-primary)',
                backgroundColor: 'transparent'
              }}
              onMouseEnter={(e) => {
                if (!logoutLoading) {
                  e.currentTarget.style.backgroundColor = 'var(--card-hover-bg)';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              {logoutLoading ? (
                <>
                  <div
                    className="animate-spin rounded-full h-4 w-4 border-b-2 mr-3"
                    style={{
                      borderColor: 'var(--text-secondary)'
                    }}
                  ></div>
                  <span style={{ color: 'var(--text-secondary)' }}>Logging out...</span>
                </>
              ) : (
                <>
                  <svg
                    className="w-4 h-4 mr-3"
                    style={{ color: 'var(--text-secondary)' }}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  <span>Sign Out</span>
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