import React from 'react';
import { useLocation } from 'react-router-dom';
import { ROUTE_PATHS } from '../../../constants/routingConstants';
import NavbarNavItem from './NavbarNavItem';

/**
 * Navbar Desktop Navigation Props Interface
 */
interface NavbarDesktopNavigationProps {
  navItems: Array<{
    id: string;
    label: string;
    path?: string;
    icon?: string;
    description: string;
  }>;
  unreadCount: number | null;
  onSearchToggle: () => void;
  onNotificationToggle: () => void;
}

/**
 * Navbar Desktop Navigation Component
 * Displays desktop navigation items with search and notifications
 * Handles active state detection and item rendering
 */
const NavbarDesktopNavigation: React.FC<NavbarDesktopNavigationProps> = ({
  navItems,
  unreadCount,
  onSearchToggle,
  onNotificationToggle
}) => {
  const location = useLocation();

  /**
   * Check if a navigation item is currently active
   * Compares current pathname with item path, handling special cases
   */
  const isNavItemActive = (item: any) => {
    // Special handling for search item (button, not link)
    if (item.id === 'search') {
      return location.pathname === '/search';
    }

    // For home route, check if we're on root path
    if (item.path === ROUTE_PATHS.HOME) {
      return location.pathname === '/' || location.pathname === ROUTE_PATHS.HOME;
    }

    // For other routes, check exact match
    return location.pathname === item.path;
  };

  return (
    <div className="hidden md:flex items-center justify-center flex-1">
      <div className="flex items-center space-x-3 lg:space-x-6 xl:space-x-8">
        {navItems.map((item) => {
          const isActive = isNavItemActive(item);
          return (
            <NavbarNavItem
              key={item.id}
              item={item}
              isActive={isActive}
              unreadCount={unreadCount}
              onSearchClick={item.id === 'search' ? onSearchToggle : undefined}
              onNotificationClick={item.id === 'notifications' ? onNotificationToggle : undefined}
            />
          );
        })}
      </div>
    </div>
  );
};

export default NavbarDesktopNavigation;

