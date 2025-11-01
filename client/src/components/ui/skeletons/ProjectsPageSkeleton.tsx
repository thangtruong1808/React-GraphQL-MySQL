import React from 'react';
import { SkeletonBox } from '../SkeletonLoader';

/**
 * Projects Page Skeleton Component
 * Shows skeleton loading state for projects page
 * Professional layout with consistent bg-white sections and no scrolling
 */
export const ProjectsPageSkeleton: React.FC = () => {
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
              <SkeletonBox className="h-4 w-16" />
              {Array.from({ length: 4 }).map((_, index) => (
                <SkeletonBox key={index} className="h-8 w-24 rounded-lg" />
              ))}
            </div>
          </div>
        </div>

        {/* Section 3: Filter Section */}
        <div className="py-4 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
            <div className="flex flex-wrap gap-4 justify-center">
              {Array.from({ length: 4 }).map((_, index) => (
                <SkeletonBox key={index} className="h-12 w-32 rounded-lg" />
              ))}
            </div>
          </div>
        </div>

        {/* Section 4: Projects Grid */}
        <div className="py-4 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md border border-gray-100 p-6">
                  <div className="flex items-start justify-between mb-4">
                    <SkeletonBox className="h-6 w-3/4" />
                    <SkeletonBox className="h-6 w-16 rounded-full" />
                  </div>
                  <div className="space-y-2 mb-4">
                    <SkeletonBox className="h-4 w-full" />
                    <SkeletonBox className="h-4 w-5/6" />
                  </div>
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <SkeletonBox className="w-4 h-4" />
                        <SkeletonBox className="h-4 w-12" />
                      </div>
                      <SkeletonBox className="h-4 w-8 rounded-full" />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <SkeletonBox className="w-4 h-4" />
                        <SkeletonBox className="h-4 w-16" />
                      </div>
                      <SkeletonBox className="h-4 w-8 rounded-full" />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <SkeletonBox className="w-4 h-4" />
                        <SkeletonBox className="h-4 w-20" />
                      </div>
                      <SkeletonBox className="h-4 w-16" />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <SkeletonBox className="w-4 h-4" />
                        <SkeletonBox className="h-4 w-12" />
                      </div>
                      <SkeletonBox className="h-4 w-16" />
                    </div>
                  </div>
                  <div className="pt-4 border-t border-gray-100">
                    <SkeletonBox className="h-8 w-full rounded-lg" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Section 5: Call to Action */}
        <div className="py-4 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
            <div className="text-center rounded-2xl p-8 border border-gray-100 bg-white shadow-lg">
              <div className="flex items-center justify-center mb-4">
                <SkeletonBox className="w-12 h-12 rounded-full" />
              </div>
              <SkeletonBox className="h-8 w-64 mx-auto mb-4" />
              <SkeletonBox className="h-4 w-96 mx-auto mb-6" />
              <SkeletonBox className="h-12 w-48 mx-auto rounded-lg" />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

