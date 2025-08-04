import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { User } from '../../types/graphql';
import { NavItem } from '../../constants/navigation';
import NavIcon from '../ui/NavIcon';

/**
 * Mobile Menu Component
 * Displays responsive mobile navigation menu
 * Handles user authentication display and actions
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

  // Get navigation items for mobile (all items for mobile menu)
  const mobileNavItems = navItems.filter(item => {
    // Show all items on mobile for better UX
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
    <div className="lg:hidden bg-white border-t border-gray-100 shadow-sm">
      <div className="px-4 py-2 space-y-1">
        {/* Mobile Navigation Links */}
        {mobileNavItems.map((item) => {
          const isActive = isActiveItem(item.path);
          return (
            <Link
              key={item.id}
              to={item.path}
              onClick={onClose}
              className={`flex items-center space-x-3 px-4 py-3 text-base font-medium rounded-lg transition-colors duration-200 ${isActive
                ? 'text-emerald-700 bg-emerald-50'
                : 'text-gray-700 hover:text-emerald-700 hover:bg-emerald-50'
                }`}
              title={item.description}
            >
              <NavIcon
                icon={item.icon || 'default'}
                className={`w-5 h-5 ${isActive ? 'text-emerald-700' : 'text-gray-500'}`}
              />
              <span>{item.label}</span>
            </Link>
          );
        })}

        {/* Mobile User Section */}
        {isAuthenticated ? (
          <div className="border-t border-gray-100 pt-4 pb-3">
            <div className="flex items-center px-3 py-2">
              {/* User Avatar */}
              <div className="w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center mr-3">
                <span className="text-sm font-medium text-white">
                  {getUserInitials()}
                </span>
              </div>

              {/* User Info */}
              <div className="flex-1">
                <div className="text-base font-medium text-gray-900">
                  {user?.firstName} {user?.lastName}
                </div>
                <div className="text-sm text-gray-500">
                  {user?.email}
                </div>
              </div>
            </div>

            {/* Mobile User Actions */}
            <div className="mt-3 space-y-1">
              <button
                onClick={onLogout}
                disabled={logoutLoading}
                className="w-full text-left px-3 py-2 text-base font-medium text-red-600 hover:text-red-700 hover:bg-red-50 disabled:opacity-50 rounded-lg transition-colors duration-200"
              >
                {logoutLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600 mr-2"></div>
                    Signing out...
                  </div>
                ) : (
                  'Sign Out'
                )}
              </button>
            </div>
          </div>
        ) : (
          <div className="border-t border-gray-100 pt-4 pb-3 space-y-2">
            <Link
              to="/login"
              onClick={onClose}
              className="block w-full text-center px-3 py-3 text-base font-medium text-emerald-700 hover:text-emerald-800 hover:bg-emerald-50 rounded-lg transition-colors duration-200 border border-emerald-700"
            >
              Login
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default MobileMenu; 