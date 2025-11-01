import React from 'react';
import { SkeletonBox } from '../SkeletonLoader';

/**
 * Active Filters Skeleton Component
 * Skeleton for the active filters section
 */
export const ActiveFiltersSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
      <SkeletonBox className="h-5 w-32 mb-4" />
      <div className="flex flex-wrap gap-3">
        {Array.from({ length: 4 }).map((_, index) => (
          <SkeletonBox key={index} className="h-8 w-24 rounded-full" />
        ))}
      </div>
    </div>
  );
};

