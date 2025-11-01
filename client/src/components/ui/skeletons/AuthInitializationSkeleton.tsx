import React from 'react';
import { SkeletonBox } from '../SkeletonLoader';

/**
 * Authentication Initialization Skeleton Component
 * Shows skeleton loading state during authentication initialization
 * Used by AuthProvider during app startup - matches corrected PublicDashboard structure
 * Professional skeleton design with correct section order and element counts
 */
export const AuthInitializationSkeleton: React.FC = () => {
  return (
    <div className="w-full public-dashboard bg-gray-50">
      <div className="h-screen bg-gray-50 pt-24 flex flex-col overflow-hidden">

        {/* Section 1: Hero Section - Main Title & Introduction (Reduced height ~10%) */}
        <div className="px-4 sm:px-6 lg:px-8 py-2">
          <div className="max-w-7xl mx-auto bg-white rounded-2xl p-4 shadow-lg border border-gray-200">
            <div className="text-center">
              <SkeletonBox className="h-10 w-80 mx-auto mb-3" />
              <SkeletonBox className="h-4 w-96 mx-auto mb-4" />
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-4xl mx-auto">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div key={index} className="bg-gray-100 rounded-xl p-3 border border-gray-300 text-center">
                    <div className="w-8 h-8 bg-gray-200 rounded-lg mx-auto mb-2"></div>
                    <SkeletonBox className="h-6 w-16 mx-auto mb-1" />
                    <SkeletonBox className="h-3 w-20 mx-auto" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Charts Section - Project Status + Task Progress (Original height restored) */}
        <div className="px-4 sm:px-6 lg:px-8 py-4">
          <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

              {/* Left: Project Status Overview Chart */}
              <div className="bg-gray-100 rounded-xl p-6 border border-gray-300 flex flex-col">
                <SkeletonBox className="h-6 w-52 mb-5" />
                <div className="flex justify-center items-center mb-5">
                  <SkeletonBox className="w-32 h-32 rounded-full" />
                </div>
                <div className="space-y-4">
                  {Array.from({ length: 3 }).map((_, index) => (
                    <div key={index} className="flex items-center space-x-4">
                      <SkeletonBox className="w-4 h-4 rounded-full" />
                      <SkeletonBox className="h-4 w-36" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Right: Task Completion Progress Chart */}
              <div className="bg-gray-100 rounded-xl p-6 border border-gray-300 flex flex-col">
                <SkeletonBox className="h-6 w-52 mb-5" />
                <div className="space-y-5">
                  {Array.from({ length: 3 }).map((_, index) => (
                    <div key={index} className="flex items-center space-x-4">
                      <SkeletonBox className="h-4 w-20 flex-shrink-0" />
                      <div className="flex-1 bg-gray-200 rounded-full h-4">
                        <SkeletonBox className={`h-4 rounded-full ${index === 0 ? 'w-5/6' : index === 1 ? 'w-4/6' : 'w-3/6'}`} />
                      </div>
                      <SkeletonBox className="h-4 w-14 flex-shrink-0" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Comment Activity Overview - Consistent bg-white */}
        <div className="px-4 sm:px-6 lg:px-8 py-3">
          <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
            <SkeletonBox className="h-6 w-64 mx-auto mb-6" />
            <div className="space-y-4">
              {/* Total Comments Card */}
              <div className="flex justify-between items-center p-4 bg-gray-100 rounded-xl border border-gray-300">
                <SkeletonBox className="h-5 w-32" />
                <SkeletonBox className="h-8 w-16" />
              </div>

              {/* Comments by Task Status - 3 Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className="text-center p-4 bg-gray-100 rounded-xl border border-gray-300">
                    <SkeletonBox className="h-8 w-12 mx-auto mb-2" />
                    <SkeletonBox className="h-3 w-24 mx-auto" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Section 4: Call to Action - Professional Engagement */}
        <div className="px-4 sm:px-6 lg:px-8 py-3 pb-6">
          <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
            <div className="text-center">
              <SkeletonBox className="h-8 w-96 mx-auto mb-4" />
              <SkeletonBox className="h-4 w-full mb-2" />
              <SkeletonBox className="h-4 w-4/5 mx-auto mb-6" />
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <SkeletonBox className="h-10 w-48 rounded-lg" />
                <SkeletonBox className="h-10 w-40 rounded-lg" />
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

