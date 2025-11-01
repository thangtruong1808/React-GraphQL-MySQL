import React from 'react';
import { SkeletonBox } from '../SkeletonLoader';

/**
 * Projects Grid Skeleton Component
 * Loading skeleton for the projects grid section only
 */
export const ProjectsGridSkeleton: React.FC = () => {
  return (
    <div className="py-4 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-200">
              <div className="p-6">
                {/* Project Title and Status */}
                <div className="flex items-start justify-between mb-4">
                  <SkeletonBox className="h-6 w-3/4" />
                  <SkeletonBox className="h-6 w-16 rounded-full" />
                </div>

                {/* Project Description */}
                <div className="space-y-2 mb-4">
                  <SkeletonBox className="h-4 w-full" />
                  <SkeletonBox className="h-4 w-5/6" />
                </div>

                {/* Detailed Info Rows */}
                <div className="space-y-3 mb-4">
                  {/* Tasks Row */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <SkeletonBox className="w-4 h-4" />
                      <SkeletonBox className="h-4 w-12" />
                    </div>
                    <SkeletonBox className="h-4 w-8 rounded-full" />
                  </div>

                  {/* Team Members Row */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <SkeletonBox className="w-4 h-4" />
                      <SkeletonBox className="h-4 w-16" />
                    </div>
                    <SkeletonBox className="h-4 w-8 rounded-full" />
                  </div>

                  {/* Project Owner Row */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <SkeletonBox className="w-4 h-4" />
                      <SkeletonBox className="h-4 w-20" />
                    </div>
                    <SkeletonBox className="h-4 w-16" />
                  </div>

                  {/* Created Date Row */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <SkeletonBox className="w-4 h-4" />
                      <SkeletonBox className="h-4 w-12" />
                    </div>
                    <SkeletonBox className="h-4 w-16" />
                  </div>
                </div>

                {/* Button Section */}
                <div className="pt-4 border-t border-gray-100">
                  <SkeletonBox className="h-8 w-full rounded-lg" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

