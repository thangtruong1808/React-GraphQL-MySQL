import React from 'react';
import { SkeletonBox } from '../SkeletonLoader';

/**
 * Project Detail Page Skeleton Component
 * Shows skeleton loading state for a single project detail page
 * Matches key sections: back link, header, stats, owner, timeline, tasks, members
 */
export const ProjectDetailPageSkeleton: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back link */}
        <div className="mb-6">
          <SkeletonBox className="h-6 w-32" />
        </div>

        {/* Project header */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <SkeletonBox className="h-8 w-96 mb-2" />
              <SkeletonBox className="h-6 w-full mb-2" />
              <SkeletonBox className="h-6 w-3/4" />
            </div>
            <SkeletonBox className="h-8 w-24 rounded-full" />
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="text-center">
                <SkeletonBox className="h-8 w-16 mx-auto mb-2" />
                <SkeletonBox className="h-4 w-20 mx-auto" />
              </div>
            ))}
          </div>
        </div>

        {/* Owner and timeline */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <SkeletonBox className="h-6 w-32 mb-4" />
            <div className="flex items-center space-x-4">
              <SkeletonBox className="w-12 h-12 rounded-full" />
              <div className="flex-1">
                <SkeletonBox className="h-5 w-32 mb-1" />
                <SkeletonBox className="h-4 w-40 mb-1" />
                <SkeletonBox className="h-4 w-24" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <SkeletonBox className="h-6 w-32 mb-4" />
            <div className="space-y-3">
              <div className="flex justify-between">
                <SkeletonBox className="h-4 w-16" />
                <SkeletonBox className="h-4 w-24" />
              </div>
              <div className="flex justify-between">
                <SkeletonBox className="h-4 w-20" />
                <SkeletonBox className="h-4 w-24" />
              </div>
            </div>
          </div>
        </div>

        {/* Tasks */}
        <div className="bg-white rounded-lg shadow-lg p-6 mt-6">
          <SkeletonBox className="h-6 w-32 mb-4" />
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <SkeletonBox className="h-5 w-3/4 mb-3" />
                    <div className="flex items-center space-x-4">
                      <SkeletonBox className="h-6 w-20 rounded-full" />
                      <SkeletonBox className="h-6 w-16 rounded-full" />
                      <SkeletonBox className="h-4 w-32" />
                      <SkeletonBox className="h-4 w-24" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Members */}
        <div className="bg-white rounded-lg shadow-lg p-6 mt-6">
          <SkeletonBox className="h-6 w-32 mb-4" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg">
                <SkeletonBox className="w-10 h-10 rounded-full" />
                <div className="flex-1">
                  <SkeletonBox className="h-4 w-24 mb-1" />
                  <SkeletonBox className="h-3 w-32 mb-1" />
                  <SkeletonBox className="h-3 w-20" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

