import React from 'react';
import { SkeletonBox } from '../SkeletonLoader';

/**
 * Search Header Skeleton Component
 * Skeleton for the search results header section
 */
export const SearchHeaderSkeleton: React.FC = () => {
  return (
    <div className="text-center">
      {/* Main search title */}
      <SkeletonBox className="h-8 w-64 mx-auto mb-4" />

      {/* Search description */}
      <SkeletonBox className="h-4 w-96 mx-auto mb-6" />

      {/* Result counts */}
      <div className="flex justify-center space-x-6">
        <SkeletonBox className="h-6 w-20" />
        <SkeletonBox className="h-6 w-24" />
        <SkeletonBox className="h-6 w-16" />
      </div>
    </div>
  );
};

