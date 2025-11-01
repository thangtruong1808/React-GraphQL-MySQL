import React from 'react';
import { SkeletonBox } from '../SkeletonLoader';

/**
 * Search Results Page Skeleton Component
 * Shows skeleton loading state for search results page
 * Includes Active Filters, Members, Projects, and Tasks sections
 */
export const SearchResultsPageSkeleton: React.FC = () => {
  return (
    <div className="min-h-screen public-dashboard bg-gray-50 rounded-2xl shadow-lg p-6 border border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-6">
        <div className="space-y-10">
          {/* Search Header Skeleton */}
          <div className="text-center">
            <SkeletonBox className="h-8 w-64 mx-auto mb-4" />
            <SkeletonBox className="h-4 w-96 mx-auto mb-6" />
            <div className="flex justify-center space-x-6">
              <SkeletonBox className="h-6 w-20" />
              <SkeletonBox className="h-6 w-24" />
              <SkeletonBox className="h-6 w-16" />
            </div>
          </div>

          {/* Active Filters Skeleton */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
            <SkeletonBox className="h-5 w-32 mb-4" />
            <div className="flex flex-wrap gap-3">
              {Array.from({ length: 4 }).map((_, index) => (
                <SkeletonBox key={index} className="h-8 w-24 rounded-full" />
              ))}
            </div>
          </div>

          {/* Members Section Skeleton */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl opacity-50"></div>
            <div className="relative bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-blue-200 p-6">
              <div className="space-y-6">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg">
                    <SkeletonBox className="w-5 h-5" />
                  </div>
                  <SkeletonBox className="h-6 w-20" />
                </div>
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
            </div>
          </div>

          {/* Projects Section Skeleton */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl opacity-50"></div>
            <div className="relative bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-green-200 p-6">
              <div className="space-y-6">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg">
                    <SkeletonBox className="w-5 h-5" />
                  </div>
                  <SkeletonBox className="h-6 w-24" />
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                  {Array.from({ length: 3 }).map((_, index) => (
                    <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                      <div className="flex items-start justify-between mb-4">
                        <SkeletonBox className="h-6 w-32" />
                        <SkeletonBox className="h-6 w-16 rounded-full" />
                      </div>
                      <div className="space-y-3">
                        <SkeletonBox className="h-4 w-full" />
                        <SkeletonBox className="h-4 w-3/4" />
                      </div>
                      <div className="mt-4 space-y-2">
                        <div className="flex justify-between">
                          <SkeletonBox className="h-4 w-16" />
                          <SkeletonBox className="h-4 w-8 rounded-full" />
                        </div>
                        <div className="flex justify-between">
                          <SkeletonBox className="h-4 w-20" />
                          <SkeletonBox className="h-4 w-8 rounded-full" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Tasks Section Skeleton */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl opacity-50"></div>
            <div className="relative bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-orange-200 p-6">
              <div className="space-y-6">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg">
                    <SkeletonBox className="w-5 h-5" />
                  </div>
                  <SkeletonBox className="h-6 w-16" />
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                  {Array.from({ length: 3 }).map((_, index) => (
                    <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                      <div className="flex items-start justify-between mb-4">
                        <SkeletonBox className="h-6 w-40" />
                        <SkeletonBox className="h-6 w-16 rounded-full" />
                      </div>
                      <div className="space-y-3">
                        <SkeletonBox className="h-4 w-full" />
                        <SkeletonBox className="h-4 w-2/3" />
                      </div>
                      <div className="mt-4 flex justify-between items-center">
                        <SkeletonBox className="h-4 w-20" />
                        <SkeletonBox className="h-6 w-16 rounded-full" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

