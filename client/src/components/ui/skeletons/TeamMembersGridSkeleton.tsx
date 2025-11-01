import React from 'react';
import { SkeletonBox } from '../SkeletonLoader';

/**
 * Team Members Grid Skeleton Component
 * Shows skeleton loading state for team members grid during filtering
 * Displays 8 team member card skeletons in responsive grid
 */
export const TeamMembersGridSkeleton: React.FC = () => {
  return (
    <div className="py-4 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-4"></div>
              <SkeletonBox className="h-5 w-3/4 mx-auto mb-3" />
              <SkeletonBox className="h-4 w-1/2 mx-auto mb-4" />
              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between">
                  <SkeletonBox className="w-3 h-3" />
                  <SkeletonBox className="h-4 w-8 rounded-full" />
                </div>
                <div className="flex items-center justify-between">
                  <SkeletonBox className="w-3 h-3" />
                  <SkeletonBox className="h-4 w-8 rounded-full" />
                </div>
                <div className="flex items-center justify-between">
                  <SkeletonBox className="w-3 h-3" />
                  <SkeletonBox className="h-3 w-16" />
                </div>
              </div>
              <SkeletonBox className="h-8 w-full rounded-lg" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

