import React from 'react';
import { UsersTableSkeleton } from '../userManagement';
import { SkeletonBox } from './SkeletonLoader';

/**
 * Users Page Skeleton Component
 * Shows skeleton loading state for the entire users page content
 * Includes header, search, and table skeleton
 */
export const UsersPageSkeleton: React.FC = () => {
  return (
    <div className="w-full h-full dashboard-content">
      {/* Header Section Skeleton */}
      <div className="bg-white border-b border-gray-200 w-full skeleton-fade-in">
        <div className="px-8 py-8 w-full">
          <div className="flex items-center justify-between">
            <div>
              <SkeletonBox className="h-8 w-64 mb-2" variant="wave" delay={100} />
              <SkeletonBox className="h-4 w-96" variant="wave" delay={200} />
            </div>
            <SkeletonBox className="h-10 w-32" variant="slide" delay={300} />
          </div>
        </div>
      </div>

      {/* Main Content Skeleton */}
      <div className="w-full">
        <div className="px-8 py-8 w-full">
          <div className="space-y-6">
            {/* Search Input Skeleton */}
            <SkeletonBox className="h-10 w-full" variant="slide" delay={400} />

            {/* Table Skeleton */}
            <UsersTableSkeleton />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UsersPageSkeleton;
