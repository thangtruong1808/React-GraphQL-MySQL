import React from 'react';
import { SkeletonBox } from './SkeletonLoader';

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
        <SkeletonBox className="h-8 w-32" variant="wave" delay={100} />
      </div>

      {/* Navigation Items Skeleton */}
      <div className="flex-1 p-4 space-y-2">
        {Array.from({ length: 8 }).map((_, i) => (
          <SkeletonBox
            key={i}
            className="h-10 w-full"
            variant="slide"
            delay={200 + i * 100}
          />
        ))}
      </div>

      {/* User Section Skeleton */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center space-x-3">
          <SkeletonBox className="h-8 w-8 rounded-full" variant="breathe" delay={1000} />
          <div className="flex-1">
            <SkeletonBox className="h-4 w-24 mb-1" variant="wave" delay={1100} />
            <SkeletonBox className="h-3 w-16" variant="wave" delay={1200} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SidebarSkeleton;
