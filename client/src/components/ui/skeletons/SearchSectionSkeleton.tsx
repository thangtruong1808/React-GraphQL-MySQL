import React from 'react';
import { SkeletonBox } from '../SkeletonLoader';

interface SearchSectionSkeletonProps {
  title: string;
}

/**
 * Search Section Skeleton Component
 * Generic skeleton for individual search sections (Members, Projects, Tasks)
 */
export const SearchSectionSkeleton: React.FC<SearchSectionSkeletonProps> = ({ title }) => {
  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex items-center space-x-3">
        <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg">
          <SkeletonBox className="w-5 h-5" />
        </div>
        <SkeletonBox className="h-6 w-24" />
      </div>

      {/* Section Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-start space-x-5">
              <SkeletonBox className="w-16 h-16 rounded-full" />
              <div className="flex-1 space-y-4">
                <div>
                  <SkeletonBox className="h-4 w-20 mb-2" />
                  <SkeletonBox className="h-6 w-32" />
                </div>
                <div>
                  <SkeletonBox className="h-4 w-24 mb-2" />
                  <SkeletonBox className="h-4 w-40" />
                </div>
                <div>
                  <SkeletonBox className="h-4 w-16 mb-2" />
                  <SkeletonBox className="h-6 w-24 rounded-full" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

