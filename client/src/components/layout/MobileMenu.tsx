import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { User } from '../../types/graphql';
import { NavItem } from '../../constants/navigation';
import NavIcon from '../ui/NavIcon';

/**
 * Mobile Menu Component
 * Displays responsive mobile navigation menu
 * Shows only navigation items (user info handled by desktop UserDropdown)
 */
interface MobileMenuProps {
  isOpen: boolean;
  user: User | null;
  isAuthenticated: boolean;
  logoutLoading: boolean;
  onClose: () => void;
  onLogout: () => void;
  getUserInitials: () => string;
  navItems?: NavItem[];
}

const MobileMenu: React.FC<MobileMenuProps> = ({
  isOpen,
  user,
  isAuthenticated,
  logoutLoading,
  onClose,
  onLogout,
  getUserInitials,
  navItems = [],
}) => {
  const location = useLocation();

  // Don't render if not open
  if (!isOpen) return null;

  // Get navigation items for mobile (show all items including login)
  const mobileNavItems = navItems.filter(item => {
    // Show all navigation items for better UX
    return true;
  });

  /**
   * Check if navigation item is currently active
   * @param itemPath - Navigation item path
   * @returns True if item is active
   */
  const isActiveItem = (itemPath: string): boolean => {
    if (itemPath === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(itemPath);
  };

  return (
    <div className="md:hidden bg-white border-t border-gray-100 shadow-sm">
      <div className="px-4 py-2 space-y-1">
        {/* Mobile Navigation Links */}
        {mobileNavItems.map((item) => {
          const isActive = isActiveItem(item.path);

          // Handle Sign Out as a special section with user info
          if (item.id === 'signout') {
            return (
              <div key={item.id} className="border-t border-gray-100 pt-4 pb-3">
                {/* User Information Section */}
                <div className="flex items-center px-3 py-2 mb-3">
                  {/* User Avatar */}
                  <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center mr-3">
                    <span className="text-sm font-medium text-white">
                      {getUserInitials()}
                    </span>
                  </div>

                  {/* User Details */}
                  <div className="flex-1">
                    <div className="text-base font-medium text-gray-900">
                      {user?.firstName} {user?.lastName}
                    </div>
                    <div className="text-sm text-gray-500">
                      {user?.email}
                    </div>
                    {user?.role && (
                      <div className="text-xs text-purple-600 font-medium mt-1">
                        {user.role}
                      </div>
                    )}
                  </div>
                </div>

                {/* Sign Out Button */}
                <button
                  onClick={() => {
                    onClose();
                    onLogout();
                  }}
                  disabled={logoutLoading}
                  className="w-full flex items-center justify-center space-x-3 px-4 py-3 text-base font-medium rounded-lg transition-colors duration-200 text-red-600 hover:text-red-700 hover:bg-red-50 disabled:opacity-50"
                  title={item.description}
                >
                  <NavIcon
                    icon={item.icon || 'default'}
                    className="w-5 h-5 text-red-600"
                  />
                  <span>
                    {logoutLoading ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600 mr-2"></div>
                        Signing out...
                      </div>
                    ) : (
                      item.label
                    )}
                  </span>
                </button>
              </div>
            );
          }

          // Regular navigation items as Links
          return (
            <Link
              key={item.id}
              to={item.path}
              onClick={onClose}
              className={`flex items-center space-x-3 px-4 py-3 text-base font-medium rounded-lg transition-colors duration-200 ${isActive
                ? 'text-purple-700 bg-purple-50'
                : 'text-gray-700 hover:text-purple-700 hover:bg-purple-50'
                }`}
              title={item.description}
            >
              <NavIcon
                icon={item.icon || 'default'}
                className={`w-5 h-5 ${isActive ? 'text-purple-700' : 'text-gray-500'}`}
              />
              <span>{item.label}</span>
            </Link>
          );
        })}

        {/* Mobile User Section - Removed to avoid duplication with mobileNavItems */}
        {/* User information and actions are handled by desktop UserDropdown component */}
        {/* Mobile menu only shows navigation items for cleaner UX */}
      </div>
    </div>
  );
};

export default MobileMenu; 