import React from 'react';
import { SkeletonBox } from '../SkeletonLoader';

/**
 * Team Page Skeleton Component
 * Shows skeleton loading state for team page
 * Professional layout with consistent bg-white sections and no scrolling
 */
export const TeamPageSkeleton: React.FC = () => {
  return (
    <div className="w-full public-dashboard bg-gray-50">
      <div className="min-h-screen bg-gray-50 pt-24">

        {/* Section 1: Header */}
        <div className="py-4 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
            <div className="text-center">
              <SkeletonBox className="h-12 w-80 mx-auto mb-6" />
              <SkeletonBox className="h-6 w-96 mx-auto mb-8" />
            </div>
          </div>
        </div>

        {/* Section 2: Sort Section */}
        <div className="py-4 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
            <div className="flex flex-wrap gap-3 justify-center items-center">
              <SkeletonBox className="h-4 w-20" />
              {Array.from({ length: 5 }).map((_, index) => (
                <SkeletonBox key={index} className="h-8 w-24 rounded-lg" />
              ))}
            </div>
          </div>
        </div>

        {/* Section 3: Filter Section */}
        <div className="py-4 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
            <div className="flex flex-wrap gap-4 justify-center">
              {Array.from({ length: 8 }).map((_, index) => (
                <SkeletonBox key={index} className="h-12 w-36 rounded-lg" />
              ))}
            </div>
          </div>
        </div>

        {/* Section 4: Team Members Grid */}
        <div className="py-4 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, index) => (
                <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                  <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4"></div>
                  <SkeletonBox className="h-4 w-3/4 mx-auto mb-2" />
                  <SkeletonBox className="h-3 w-1/2 mx-auto mb-4" />
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <SkeletonBox className="w-3 h-3" />
                      <SkeletonBox className="h-3 w-16" />
                    </div>
                    <div className="flex items-center justify-between">
                      <SkeletonBox className="w-3 h-3" />
                      <SkeletonBox className="h-3 w-12" />
                    </div>
                    <div className="flex items-center justify-between">
                      <SkeletonBox className="w-3 h-3" />
                      <SkeletonBox className="h-3 w-14" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

