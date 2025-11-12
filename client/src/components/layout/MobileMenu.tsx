import React, { CSSProperties } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { User } from '../../types/graphql';
import { NavItem } from '../../constants/navigation';
import { formatRoleForDisplay } from '../../utils/roleFormatter';
import NavIcon from '../ui/NavIcon';
import NavbarNotificationBadge from './navbar/NavbarNotificationBadge';

/**
 * Description: Provides the responsive navigation drawer with theme-driven styling for mobile users.
 * Data created: None; derives display state from props and inline hover handlers only.
 * Author: thangtruong
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
  onSearchToggle?: () => void;
  unreadCount?: number | null;
  onNotificationToggle?: () => void;
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
  onSearchToggle,
  unreadCount,
  onNotificationToggle,
}) => {
  // Handle default value for unreadCount - preserve null for loading state
  const count = unreadCount !== undefined ? unreadCount : null;
  const location = useLocation();
  const containerStyle: CSSProperties = {
    backgroundColor: 'var(--card-bg)',
    backgroundImage: 'var(--card-surface-overlay)',
    borderColor: 'var(--border-color)',
    boxShadow: '0 28px 56px var(--shadow-color)',
    color: 'var(--navbar-text, var(--text-primary))'
  };
  const getItemStyle = (active: boolean): CSSProperties => ({
    backgroundColor: active ? 'var(--tab-active-bg)' : 'transparent',
    color: active ? 'var(--tab-active-text, var(--navbar-text))' : 'var(--navbar-text, var(--text-primary))',
    border: active ? `1px solid var(--tab-active-border)` : '1px solid transparent',
    boxShadow: active ? '0 16px 32px var(--shadow-color)' : 'none'
  });
  const handleItemEnter = (
    event: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>,
    active: boolean
  ) => {
    if (!active) {
      event.currentTarget.style.color = 'var(--accent-from)';
      event.currentTarget.style.backgroundColor = 'var(--tab-inactive-hover-bg)';
      event.currentTarget.style.borderColor = 'var(--tab-active-border)';
      event.currentTarget.style.boxShadow = '0 18px 36px var(--shadow-color)';
      event.currentTarget.style.transform = 'translateY(-2px)';
    }
  };
  const handleItemLeave = (
    event: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>,
    active: boolean
  ) => {
    if (!active) {
      event.currentTarget.style.color = 'var(--navbar-text, var(--text-primary))';
      event.currentTarget.style.backgroundColor = 'transparent';
      event.currentTarget.style.borderColor = 'transparent';
      event.currentTarget.style.boxShadow = 'none';
      event.currentTarget.style.transform = 'translateY(0)';
    }
  };

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
    // Special handling for search route
    if (itemPath === '#search') {
      return location.pathname === '/search';
    }

    // For home route, check exact match
    if (itemPath === '/') {
      return location.pathname === '/';
    }

    // For other routes, check exact match
    return location.pathname === itemPath;
  };

  return (
    <div
      className="md:hidden border-t theme-border shadow-2xl theme-navbar-text"
      style={containerStyle}
    >
      <div className="px-4 py-2 space-y-1">
        {/* Mobile Navigation Links */}
        {mobileNavItems.map((item) => {
          const isActive = isActiveItem(item.path);

          // Handle Sign Out as a special section with user info
          if (item.id === 'signout') {
            return (
              <div key={item.id} className="border-t theme-border pt-4 pb-3">
                {/* User Information Section */}
                <div className="flex items-center px-3 py-2 mb-3">
                  {/* User Avatar */}
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center mr-3 shadow-md"
                    style={{
                      backgroundImage: 'linear-gradient(135deg, var(--accent-from), var(--accent-to))',
                      color: 'var(--button-primary-text)'
                    }}
                  >
                    <span className="text-sm font-medium">
                      {getUserInitials()}
                    </span>
                  </div>

                  {/* User Details */}
                  <div className="flex-1">
                    <div className="text-base font-medium" style={{ color: 'var(--navbar-text)' }}>
                      {user?.firstName} {user?.lastName}
                    </div>
                    <div className="text-sm" style={{ color: 'var(--navbar-text-secondary)' }}>
                      {user?.email}
                    </div>
                    {user?.role && (
                      <div className="text-xs font-medium mt-1" style={{ color: 'var(--accent-from)' }}>
                        {formatRoleForDisplay(user.role)}
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
                  className="w-full flex items-center justify-center space-x-3 px-4 py-3 text-base font-medium rounded-lg transition-transform duration-200 disabled:opacity-50"
                  style={{
                    backgroundColor: 'var(--button-danger-bg)',
                    color: 'var(--button-danger-text)',
                    boxShadow: '0 18px 36px var(--shadow-color)'
                  }}
                  onMouseEnter={(event) => {
                    if (!logoutLoading) {
                      event.currentTarget.style.backgroundColor = 'var(--button-danger-hover-bg)';
                      event.currentTarget.style.boxShadow = '0 22px 44px var(--shadow-color)';
                      event.currentTarget.style.transform = 'translateY(-2px)';
                    }
                  }}
                  onMouseLeave={(event) => {
                    event.currentTarget.style.backgroundColor = 'var(--button-danger-bg)';
                    event.currentTarget.style.boxShadow = '0 18px 36px var(--shadow-color)';
                    event.currentTarget.style.transform = 'translateY(0)';
                  }}
                  title={item.description}
                >
                  <NavIcon
                    icon={item.icon || 'default'}
                    className="w-5 h-5"
                  />
                  <span>
                    {logoutLoading ? (
                      <div className="flex items-center">
                        <div
                          className="animate-spin rounded-full h-4 w-4 border-b-2 mr-2"
                          style={{ borderColor: 'var(--button-danger-text)' }}
                        ></div>
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

          // Handle search as button (not link)
          if (item.id === 'search') {
            return (
              <button
                key={item.id}
                onClick={() => {
                  onClose();
                  onSearchToggle?.();
                }}
                className="flex items-center space-x-3 px-4 py-3 text-base font-medium rounded-lg transition-transform duration-200 w-full text-left hover:-translate-y-0.5"
                style={getItemStyle(isActive)}
            onMouseEnter={(event) => handleItemEnter(event, isActive)}
            onMouseLeave={(event) => handleItemLeave(event, isActive)}
                title={item.description}
              >
                <NavIcon
                  icon={item.icon || 'default'}
                  className="w-5 h-5"
                />
                <span>{item.label}</span>
              </button>
            );
          }

          // Handle notifications as button with badge
          if (item.id === 'notifications') {
            return (
              <button
                key={item.id}
                onClick={() => {
                  onClose();
                  onNotificationToggle?.();
                }}
                className="flex items-center space-x-3 px-4 py-3 text-base font-medium rounded-lg transition-transform duration-200 w-full text-left relative hover:-translate-y-0.5"
                style={getItemStyle(isActive)}
            onMouseEnter={(event) => handleItemEnter(event, isActive)}
            onMouseLeave={(event) => handleItemLeave(event, isActive)}
                title={item.description}
              >
                <div className="flex items-center">
                  {count !== null && count > 0 ? (
                    <span style={{ color: 'var(--accent-from)' }}>
                      <NavIcon
                        icon={item.icon || 'default'}
                        className="w-5 h-5"
                      />
                    </span>
                  ) : (
                    <NavIcon icon={item.icon || 'default'} className="w-5 h-5" />
                  )}
                  {/* Notification badge - positioned next to icon */}
                  <NavbarNotificationBadge unreadCount={count} />
                </div>
                <span>{item.label}</span>
              </button>
            );
          }

          // Regular navigation items as Links
          return (
            <Link
              key={item.id}
              to={item.path}
              onClick={onClose}
              className="flex items-center space-x-3 px-4 py-3 text-base font-medium rounded-lg transition-transform duration-200 hover:-translate-y-0.5"
              style={getItemStyle(isActive)}
              onMouseEnter={(event) => handleItemEnter(event, isActive)}
              onMouseLeave={(event) => handleItemLeave(event, isActive)}
              title={item.description}
            >
              <NavIcon
                icon={item.icon || 'default'}
                className="w-5 h-5"
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