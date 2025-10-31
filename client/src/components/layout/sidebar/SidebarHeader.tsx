import React from 'react';
import Logo from '../Logo';

/**
 * Sidebar Header Props Interface
 */
interface SidebarHeaderProps {
  isCollapsed: boolean;
}

/**
 * Sidebar Header Component
 * Displays logo in sidebar header
 * Logo is centered when collapsed, left-aligned when expanded
 */
const SidebarHeader: React.FC<SidebarHeaderProps> = ({ isCollapsed }) => {
  return (
    <div className="p-4 border-b border-gray-200 dark:border-gray-700 [data-theme='brand']:border-purple-200">
      {/* Logo - Centered when collapsed, left-aligned when expanded */}
      <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-start'}`}>
        <Logo collapsed={isCollapsed} />
      </div>
    </div>
  );
};

export default SidebarHeader;

