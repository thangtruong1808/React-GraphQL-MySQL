import React from 'react';

/**
 * Sidebar Toggle Button Props Interface
 */
interface SidebarToggleButtonProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

/**
 * Sidebar Toggle Button Component
 * Toggle button positioned on the middle-right border of the sidebar
 * Expands or collapses the sidebar on click
 */
const SidebarToggleButton: React.FC<SidebarToggleButtonProps> = ({ isCollapsed, onToggle }) => {
  return (
    <button
      onClick={onToggle}
      className="absolute top-1/2 -right-3.5 transform -translate-y-1/2 w-8 h-8 bg-white dark:bg-gray-800 [data-theme='brand']:bg-purple-50 border-2 border-gray-300 dark:border-gray-600 [data-theme='brand']:border-purple-300 rounded-full shadow-lg hover:bg-gray-50 dark:hover:bg-gray-700 [data-theme='brand']:hover:bg-purple-100 hover:border-gray-400 dark:hover:border-gray-500 [data-theme='brand']:hover:border-purple-400 transition-all duration-200 z-20 flex items-center justify-center"
      title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
    >
      <svg className="w-4 h-4 text-gray-600 dark:text-gray-300 [data-theme='brand']:text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        {isCollapsed ? (
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
        ) : (
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
        )}
      </svg>
    </button>
  );
};

export default SidebarToggleButton;

