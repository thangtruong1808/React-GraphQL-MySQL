import React from 'react';

/**
 * Sidebar Logout Button Props Interface
 */
interface SidebarLogoutButtonProps {
  onLogout: () => Promise<void>;
  logoutLoading: boolean;
}

/**
 * Sidebar Logout Button Component
 * Logout button with loading state
 * Shows spinner and loading text during logout process
 */
const SidebarLogoutButton: React.FC<SidebarLogoutButtonProps> = ({ onLogout, logoutLoading }) => {
  return (
    <button
      onClick={onLogout}
      disabled={logoutLoading}
      className="w-full mt-3 px-3 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 [data-theme='brand']:text-purple-800 bg-white dark:bg-gray-800 [data-theme='brand']:bg-purple-50 hover:bg-gray-50 dark:hover:bg-gray-700 [data-theme='brand']:hover:bg-purple-100 rounded-lg transition-colors border border-gray-200 dark:border-gray-600 [data-theme='brand']:border-purple-200 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center"
    >
      {logoutLoading ? (
        <>
          <span className="inline-block mr-2 h-4 w-4 border-2 border-transparent border-t-current rounded-full animate-spin text-gray-700 dark:text-gray-300 [data-theme='brand']:text-purple-800"></span>
          Signing out...
        </>
      ) : (
        'Sign Out'
      )}
    </button>
  );
};

export default SidebarLogoutButton;

