import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import NavIcon from '../../ui/NavIcon';
import NavbarNotificationBadge from './NavbarNotificationBadge';

/**
 * Navbar Nav Item Props Interface
 */
interface NavbarNavItemProps {
  item: {
    id: string;
    label: string;
    path?: string;
    icon?: string;
    description: string;
  };
  isActive: boolean;
  unreadCount?: number | null;
  onSearchClick?: () => void;
  onNotificationClick?: () => void;
}

/**
 * Navbar Nav Item Component
 * Renders individual navigation items (links, search button, notifications button)
 * Handles different item types with appropriate interactions
 */
const NavbarNavItem: React.FC<NavbarNavItemProps> = ({
  item,
  isActive,
  unreadCount,
  onSearchClick,
  onNotificationClick
}) => {
  // Handle default value for unreadCount - preserve null for loading state, default to 0 for other items
  const count = unreadCount !== undefined ? unreadCount : (item.id === 'notifications' ? null : 0);
  const location = useLocation();
  const baseClassName = `group relative px-2 lg:px-3 py-2 rounded-lg text-xs lg:text-sm font-medium transition-all duration-300 theme-tab-inactive-hover-bg hover:shadow-md transform hover:-translate-y-0.5 ${isActive
    ? 'theme-tab-active-text theme-tab-active-bg shadow-md'
    : ''
    } theme-navbar-text`;

  // Search button
  if (item.id === 'search') {
    return (
      <button
        onClick={onSearchClick}
        className={`${baseClassName} px-8 lg:px-3`}
        title={item.description}
      >
        {/* Navigation icon and text */}
        <div className="flex flex-col items-center space-y-1">
          <NavIcon icon={item.icon || 'default'} className="w-4 h-4" />
          <span className="text-xs lg:text-sm">{item.label}</span>
        </div>

        {/* Hover tooltip */}
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
          {item.description}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
        </div>
      </button>
    );
  }

  // Notifications button
  if (item.id === 'notifications') {
    return (
      <button
        onClick={onNotificationClick}
        className={baseClassName}
        title={item.description}
      >
        {/* Navigation icon and text */}
        <div className="flex flex-col items-center space-y-1">
          <div className="flex items-center justify-center">
            {/* Dynamic notification icon based on unread status */}
            {count !== null && count > 0 ? (
              // Bell icon with subtle lean for unread notifications
              <div className="transform rotate-12 transition-transform duration-300 hover:rotate-0">
                <NavIcon icon={item.icon || 'default'} className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
              </div>
            ) : (
              // Normal bell icon for no unread notifications or loading state
              <NavIcon icon={item.icon || 'default'} className="w-4 h-4 sm:w-5 sm:h-5" />
            )}
            {/* Notification badge - positioned next to icon */}
            <NavbarNotificationBadge unreadCount={count} />
          </div>
          <span className="text-xs lg:text-sm">{item.label}</span>
        </div>

        {/* Hover tooltip */}
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
          {item.description}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
        </div>
      </button>
    );
  }

  // Regular navigation link
  return (
    <Link
      to={item.path || '#'}
      className={baseClassName}
      title={item.description}
    >
      {/* Navigation icon and text */}
      <div className="flex flex-col items-center space-y-1">
        <NavIcon icon={item.icon || 'default'} className="w-4 h-4" />
        <span className="text-xs lg:text-sm">{item.label}</span>
      </div>

      {/* Hover tooltip */}
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
        {item.description}
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
      </div>
    </Link>
  );
};

export default NavbarNavItem;

