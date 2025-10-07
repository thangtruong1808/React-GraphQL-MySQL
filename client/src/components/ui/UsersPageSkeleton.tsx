import React from 'react';
import { UsersTableSkeleton } from '../userManagement';

/**
 * Users Page Skeleton Component
 * Shows skeleton loading state for the entire users page content
 * Includes header, search, and table skeleton
 */
export const UsersPageSkeleton: React.FC = () => {
  return (
    <div className="w-full h-full dashboard-content">
      {/* Header Section Skeleton */}
      <div className="bg-white border-b border-gray-200 w-full">
        <div className="px-8 py-8 w-full">
          <div className="flex items-center justify-between">
            <div>
              <div className="h-8 bg-gray-200 rounded w-64 mb-2 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-96 animate-pulse"></div>
            </div>
            <div className="h-10 bg-gray-200 rounded w-32 animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Main Content Skeleton */}
      <div className="w-full">
        <div className="px-8 py-8 w-full">
          <div className="space-y-6">
            {/* Search Input Skeleton */}
            <div className="h-10 bg-gray-200 rounded w-full animate-pulse"></div>

            {/* Table Skeleton */}
            <UsersTableSkeleton />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UsersPageSkeleton;
