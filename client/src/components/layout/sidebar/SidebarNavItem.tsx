import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Sidebar Nav Item Props Interface
 */
interface SidebarNavItemProps {
  item: {
    id: string;
    label: string;
    path: string;
    icon: string;
    description: string;
  };
  isActive: boolean;
  isCollapsed: boolean;
}

/**
 * Sidebar Nav Item Component
 * Individual navigation item in the sidebar
 * Displays icon and label, adapts to collapsed state
 */
const SidebarNavItem: React.FC<SidebarNavItemProps> = ({ item, isActive, isCollapsed }) => {
  return (
    <Link
      to={item.path}
      className={`group flex items-center ${isCollapsed ? 'justify-center px-2' : 'px-3'} py-6 rounded-lg text-base font-medium transition-all duration-200 ${isActive
        ? 'bg-blue-50 dark:bg-blue-900/30 [data-theme="brand"]:bg-purple-200 text-blue-800 dark:text-blue-100 [data-theme="brand"]:text-purple-900 border-r-3 border-blue-600 dark:border-blue-400 [data-theme="brand"]:border-purple-600 shadow-sm'
        : 'text-gray-700 dark:text-gray-300 [data-theme="brand"]:text-purple-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 [data-theme="brand"]:hover:bg-purple-100 hover:text-blue-700 dark:hover:text-blue-300 [data-theme="brand"]:hover:text-purple-800'
        }`}
      title={isCollapsed ? item.description : undefined}
    >
      <svg className={`flex-shrink-0 ${isCollapsed ? 'w-6 h-6' : 'w-6 h-6 mr-4'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
      </svg>
      {!isCollapsed && <span>{item.label}</span>}
    </Link>
  );
};

export default SidebarNavItem;

