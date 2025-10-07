import React from 'react';

/**
 * Sidebar Skeleton Component
 * Shows skeleton loading state for the sidebar navigation
 * Matches the exact structure of the real Sidebar component
 */
export const SidebarSkeleton: React.FC = () => {
  return (
    <div className="w-64 bg-gray-50 border-r border-gray-200 flex flex-col">
      {/* Logo Section Skeleton */}
      <div className="p-6 border-b border-gray-200">
        <div className="h-8 bg-gray-200 rounded w-32 animate-pulse"></div>
      </div>

      {/* Navigation Items Skeleton */}
      <div className="flex-1 p-4 space-y-2">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-10 bg-gray-200 rounded animate-pulse"></div>
        ))}
      </div>

      {/* User Section Skeleton */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="h-8 w-8 bg-gray-200 rounded-full animate-pulse"></div>
          <div className="flex-1">
            <div className="h-4 bg-gray-200 rounded w-24 mb-1 animate-pulse"></div>
            <div className="h-3 bg-gray-200 rounded w-16 animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SidebarSkeleton;
