import React from 'react';
import { SkeletonBox } from '../SkeletonLoader';

/**
 * Authenticated Dashboard Skeleton Component
 * Shows skeleton loading state for authenticated user dashboard
 * Elegant design inspired by AboutPage: welcome header, key metrics, visual analytics, project/task lists
 * Professional layout with proper visual hierarchy and priority-based sections
 */
export const AuthenticatedDashboardSkeleton: React.FC = () => {
  return (
    <div className="w-full public-dashboard bg-gray-50">
      <div className="h-screen bg-gray-50 mt-16 flex flex-col overflow-hidden">

        {/* Section 1: Welcome Header - User Greeting & Quick Actions */}
        <div className="px-4 sm:px-6 lg:px-8 py-3">
          <div className="max-w-7xl mx-auto bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <SkeletonBox className="h-8 w-56 mb-3" />
                <SkeletonBox className="h-4 w-72" />
              </div>
              <div className="flex items-center space-x-4">
                <SkeletonBox className="h-10 w-28 rounded-lg" />
                <SkeletonBox className="h-10 w-24 rounded-lg" />
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Key Metrics - Dashboard Statistics */}
        <div className="px-4 sm:px-6 lg:px-8 py-3">
          <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
            <div className="text-center mb-6">
              <SkeletonBox className="h-8 w-64 mx-auto mb-4" />
              <SkeletonBox className="h-4 w-80 mx-auto" />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="bg-gray-100 rounded-xl p-4 border border-gray-300 text-center">
                  <div className="w-10 h-10 bg-gray-200 rounded-lg mx-auto mb-3"></div>
                  <SkeletonBox className="h-8 w-16 mx-auto mb-2" />
                  <SkeletonBox className="h-3 w-20 mx-auto" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Section 3: Visual Analytics - Charts & Insights */}
        <div className="flex-1 px-4 sm:px-6 lg:px-8 py-3">
          <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-lg p-6 border border-gray-200 h-full flex flex-col">
            <div className="text-center mb-6">
              <SkeletonBox className="h-8 w-72 mx-auto mb-4" />
              <SkeletonBox className="h-4 w-80 mx-auto" />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1">

              {/* Left: Project Progress Chart */}
              <div className="bg-gray-100 rounded-xl p-6 border border-gray-300 flex flex-col">
                <SkeletonBox className="h-6 w-40 mb-4" />
                <div className="h-32 flex items-end justify-center space-x-3 flex-1">
                  {Array.from({ length: 4 }).map((_, index) => (
                    <div key={index} className="flex flex-col items-center">
                      <SkeletonBox className={`w-8 rounded-t mb-2 ${index === 0 ? 'h-24' : index === 1 ? 'h-18' : index === 2 ? 'h-12' : 'h-8'}`} />
                      <SkeletonBox className="h-3 w-12" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Right: Task Status Chart */}
              <div className="bg-gray-100 rounded-xl p-6 border border-gray-300 flex flex-col">
                <SkeletonBox className="h-6 w-40 mb-4" />
                <div className="flex items-center justify-center mb-4">
                  <SkeletonBox className="w-24 h-24 rounded-full" />
                </div>
                <div className="space-y-3">
                  {Array.from({ length: 3 }).map((_, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <SkeletonBox className="w-4 h-4 rounded-full" />
                      <SkeletonBox className="h-4 w-28" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 4: Project & Task Lists - Recent Activity */}
        <div className="px-4 sm:px-6 lg:px-8 py-3 pb-6">
          <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
            <div className="text-center mb-6">
              <SkeletonBox className="h-8 w-80 mx-auto mb-4" />
              <SkeletonBox className="h-4 w-96 mx-auto" />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

              {/* Recent Projects List */}
              <div className="bg-gray-100 rounded-xl p-6 border border-gray-300">
                <SkeletonBox className="h-6 w-40 mb-4" />
                <div className="space-y-4">
                  {Array.from({ length: 3 }).map((_, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200">
                      <div className="flex-1">
                        <SkeletonBox className="h-5 w-3/4 mb-2" />
                        <SkeletonBox className="h-3 w-1/2" />
                      </div>
                      <div className="flex items-center space-x-3">
                        <SkeletonBox className="h-6 w-20 rounded-full" />
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <SkeletonBox className="h-2 rounded-full w-2/3" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Upcoming Tasks List */}
              <div className="bg-gray-100 rounded-xl p-6 border border-gray-300">
                <SkeletonBox className="h-6 w-40 mb-4" />
                <div className="space-y-4">
                  {Array.from({ length: 3 }).map((_, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200">
                      <div className="flex-1">
                        <SkeletonBox className="h-5 w-3/4 mb-2" />
                        <SkeletonBox className="h-3 w-1/2" />
                      </div>
                      <div className="flex items-center space-x-3">
                        <SkeletonBox className="h-6 w-16 rounded-full" />
                        <SkeletonBox className="h-4 w-20" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Audit Widgets Skeleton - mirrors audit rows */}
        <div className="px-4 sm:px-6 lg:px-8 py-3">
          <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
              {[0,1].map((i) => (
                <div key={i} className="bg-gray-100 rounded-xl p-4 border border-gray-300">
                  <div className="h-5 w-24 bg-gray-200 rounded mb-3" />
                  <div className="space-y-2">
                    {Array.from({ length: 3 }).map((_, j) => (
                      <div key={j} className="h-3 w-full bg-gray-200 rounded" />
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              {[0,1,2].map((i) => (
                <div key={i} className="bg-gray-100 rounded-xl p-4 border border-gray-300">
                  <div className="h-5 w-28 bg-gray-200 rounded mb-3" />
                  <div className="space-y-2">
                    {Array.from({ length: 4 }).map((_, j) => (
                      <div key={j} className="h-3 w-full bg-gray-200 rounded" />
                    ))}
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

