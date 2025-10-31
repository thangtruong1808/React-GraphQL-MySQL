import React from 'react';
import { useLocation } from 'react-router-dom';
import { ROUTE_PATHS } from '../../../constants/routingConstants';
import SidebarNavItem from './SidebarNavItem';
import { SidebarItem } from './sidebarConstants';

/**
 * Sidebar Nav Items Props Interface
 */
interface SidebarNavItemsProps {
  items: SidebarItem[];
  isCollapsed: boolean;
}

/**
 * Sidebar Nav Items Component
 * Renders list of navigation items in the sidebar
 * Handles active state detection for navigation items
 */
const SidebarNavItems: React.FC<SidebarNavItemsProps> = ({ items, isCollapsed }) => {
  const location = useLocation();

  /**
   * Check if navigation item is active
   * Compares current pathname with item path, handling special cases
   */
  const isActiveItem = (item: SidebarItem) => {
    if (item.path === ROUTE_PATHS.DASHBOARD) {
      return location.pathname === ROUTE_PATHS.DASHBOARD;
    }
    return location.pathname === item.path;
  };

  return (
    <nav className="flex-1 p-3 space-y-2">
      {items.map((item) => (
        <SidebarNavItem
          key={item.id}
          item={item}
          isActive={isActiveItem(item)}
          isCollapsed={isCollapsed}
        />
      ))}
    </nav>
  );
};

export default SidebarNavItems;

