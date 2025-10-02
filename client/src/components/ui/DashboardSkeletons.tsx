import React from 'react';
import { SkeletonBox } from './SkeletonLoader';

/**
 * Public Dashboard Skeleton Component
 * Shows skeleton loading state for public dashboard (non-authenticated users)
 * Matches actual homepage structure: hero, charts, comment activity, call-to-action
 * Professional layout with correct section order and element counts
 */
export const PublicDashboardSkeleton: React.FC = () => {
  return (
    <div className="w-full public-dashboard bg-gray-50">
      <div className="h-screen bg-gray-50 mt-16 flex flex-col overflow-hidden">

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

      </div>
    </div>
  );
};

/**
 * Authentication Initialization Skeleton Component
 * Shows skeleton loading state during authentication initialization
 * Used by AuthProvider during app startup - matches corrected PublicDashboard structure
 * Professional skeleton design with correct section order and element counts
 */
export const AuthInitializationSkeleton: React.FC = () => {
  return (
    <div className="w-full public-dashboard bg-gray-50">
      <div className="h-screen bg-gray-50 mt-16 flex flex-col overflow-hidden">

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

/**
 * Projects Page Skeleton Component
 * Shows skeleton loading state for projects page
 * Professional layout with consistent bg-white sections and no scrolling
 */
export const ProjectsPageSkeleton: React.FC = () => {
  return (
    <div className="w-full public-dashboard bg-gray-50">
      <div className="h-screen bg-gray-50 mt-16 flex flex-col">

        {/* Section 1: Header */}
        <div className="px-4 sm:px-6 lg:px-8 py-4">
          <div className="max-w-7xl mx-auto bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
            <div className="text-center">
              <SkeletonBox className="h-10 w-80 mx-auto mb-4" />
              <SkeletonBox className="h-5 w-96 mx-auto mb-2" />
            </div>
          </div>
        </div>

        {/* Section 2: Filter Section */}
        <div className="px-4 sm:px-6 lg:px-8 py-3">
          <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
            <div className="flex flex-wrap gap-3 justify-center">
              {Array.from({ length: 4 }).map((_, index) => (
                <SkeletonBox key={index} className="h-10 w-32 rounded-lg" />
              ))}
            </div>
          </div>
        </div>

        {/* Section 3: Sort Section */}
        <div className="px-4 sm:px-6 lg:px-8 py-3">
          <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
            <div className="flex flex-wrap gap-3 justify-center items-center">
              <SkeletonBox className="h-4 w-16" />
              {Array.from({ length: 4 }).map((_, index) => (
                <SkeletonBox key={index} className="h-8 w-24 rounded-lg" />
              ))}
            </div>
          </div>
        </div>

        {/* Section 4: Projects Grid */}
        <div className="flex-1 px-4 sm:px-6 lg:px-8 py-3">
          <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-lg p-6 border border-gray-200 h-full">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 h-full">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md border border-gray-100 p-4">
                  <div className="flex items-start justify-between mb-3">
                    <SkeletonBox className="h-5 w-3/4" />
                    <SkeletonBox className="h-5 w-16 rounded-full" />
                  </div>
                  <div className="space-y-2 mb-3">
                    <SkeletonBox className="h-3 w-full" />
                    <SkeletonBox className="h-3 w-5/6" />
                  </div>
                  <div className="space-y-2 mb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <SkeletonBox className="w-3 h-3" />
                        <SkeletonBox className="h-3 w-12" />
                      </div>
                      <SkeletonBox className="h-4 w-8 rounded-full" />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <SkeletonBox className="w-3 h-3" />
                        <SkeletonBox className="h-3 w-16" />
                      </div>
                      <SkeletonBox className="h-4 w-8 rounded-full" />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <SkeletonBox className="w-3 h-3" />
                        <SkeletonBox className="h-3 w-20" />
                      </div>
                      <SkeletonBox className="h-3 w-16" />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <SkeletonBox className="w-3 h-3" />
                        <SkeletonBox className="h-3 w-12" />
                      </div>
                      <SkeletonBox className="h-3 w-14" />
                    </div>
                  </div>
                  <div className="pt-3 border-t border-gray-100">
                    <SkeletonBox className="h-8 w-full rounded-lg" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Section 5: Call to Action */}
        <div className="px-4 sm:px-6 lg:px-8 py-3 pb-6">
          <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
            <div className="text-center">
              <div className="flex items-center justify-center mb-3">
                <SkeletonBox className="w-8 h-8 rounded-full" />
              </div>
              <SkeletonBox className="h-6 w-64 mx-auto mb-3" />
              <SkeletonBox className="h-4 w-80 mx-auto mb-4" />
              <SkeletonBox className="h-10 w-48 rounded-lg mx-auto" />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

/**
 * Team Page Skeleton Component
 * Shows skeleton loading state for team page
 * Professional layout with consistent bg-white sections and no scrolling
 */
export const TeamPageSkeleton: React.FC = () => {
  return (
    <div className="w-full public-dashboard bg-gray-50">
      <div className="h-screen bg-gray-50 mt-16 flex flex-col">

        {/* Section 1: Header */}
        <div className="px-4 sm:px-6 lg:px-8 py-4">
          <div className="max-w-7xl mx-auto bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
            <div className="text-center">
              <SkeletonBox className="h-12 w-80 mx-auto mb-4" />
              <SkeletonBox className="h-5 w-96 mx-auto mb-2" />
            </div>
          </div>
        </div>

        {/* Section 2: Filter Section */}
        <div className="px-4 sm:px-6 lg:px-8 py-3">
          <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
            <div className="flex flex-wrap gap-3 justify-center">
              {Array.from({ length: 8 }).map((_, index) => (
                <SkeletonBox key={index} className="h-10 w-36 rounded-lg" />
              ))}
            </div>
          </div>
        </div>

        {/* Section 3: Sort Section */}
        <div className="px-4 sm:px-6 lg:px-8 py-3">
          <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
            <div className="flex flex-wrap gap-3 justify-center items-center">
              <SkeletonBox className="h-4 w-20" />
              {Array.from({ length: 5 }).map((_, index) => (
                <SkeletonBox key={index} className="h-8 w-24 rounded-lg" />
              ))}
            </div>
          </div>
        </div>

        {/* Section 4: Team Members Grid */}
        <div className="flex-1 px-4 sm:px-6 lg:px-8 py-3">
          <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-lg p-6 border border-gray-200 h-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 h-full">
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

/**
 * About Page Skeleton Component
 * Shows skeleton loading state for about page
 * Professional layout with consistent bg-white sections and no scrolling
 */
export const AboutPageSkeleton: React.FC = () => {
  return (
    <div className="w-full public-dashboard bg-gray-50">
      <div className="h-screen bg-gray-50 mt-16 flex flex-col">

        {/* Section 1: Hero */}
        <div className="px-4 sm:px-6 lg:px-8 py-3">
          <div className="max-w-7xl mx-auto bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
            <div className="text-center">
              <SkeletonBox className="h-12 w-80 mx-auto mb-4" />
              <SkeletonBox className="h-5 w-96 mx-auto mb-2" />
            </div>
          </div>
        </div>

        {/* Section 2: Mission */}
        <div className="px-4 sm:px-6 lg:px-8 py-3">
          <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
            <div className="text-center">
              <SkeletonBox className="h-8 w-48 mx-auto mb-4" />
              <SkeletonBox className="h-4 w-full mb-2" />
              <SkeletonBox className="h-4 w-5/6 mx-auto mb-2" />
              <SkeletonBox className="h-4 w-4/5 mx-auto" />
            </div>
          </div>
        </div>

        {/* Section 3: Features */}
        <div className="flex-1 px-4 sm:px-6 lg:px-8 py-3">
          <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-lg p-6 border border-gray-200 h-full flex flex-col">
            <div className="text-center mb-6">
              <SkeletonBox className="h-8 w-64 mx-auto mb-4" />
              <SkeletonBox className="h-4 w-full mb-2" />
              <SkeletonBox className="h-4 w-3/4 mx-auto" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 flex-1">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="bg-gray-100 rounded-xl p-4 border border-gray-300 flex flex-col">
                  <div className="w-12 h-12 bg-gray-200 rounded-lg mb-4"></div>
                  <SkeletonBox className="h-5 w-3/4 mb-3" />
                  <div className="space-y-2 flex-1">
                    <SkeletonBox className="h-3 w-full" />
                    <SkeletonBox className="h-3 w-5/6" />
                    <SkeletonBox className="h-3 w-4/5" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Section 4: Statistics */}
        <div className="px-4 sm:px-6 lg:px-8 py-3">
          <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
            <div className="text-center mb-6">
              <SkeletonBox className="h-8 w-72 mx-auto mb-4" />
              <SkeletonBox className="h-4 w-80 mx-auto" />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="bg-gray-100 rounded-xl p-4 border border-gray-300 text-center">
                  <div className="w-10 h-10 bg-gray-200 rounded-lg mx-auto mb-3"></div>
                  <SkeletonBox className="h-8 w-16 mx-auto mb-2" />
                  <SkeletonBox className="h-3 w-20 mx-auto" />
                </div>
              ))}
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

        {/* Section 5: Technology Stack */}
        <div className="px-4 sm:px-6 lg:px-8 py-3">
          <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
            <div className="text-center mb-8">
              <SkeletonBox className="h-8 w-80 mx-auto mb-4" />
              <SkeletonBox className="h-4 w-full mb-2" />
              <SkeletonBox className="h-4 w-3/4 mx-auto" />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, index) => (
                <div key={index} className="bg-gray-100 rounded-lg p-4 border border-gray-300 text-center">
                  <div className="w-12 h-12 bg-gray-200 rounded-lg mx-auto mb-3"></div>
                  <SkeletonBox className="h-4 w-3/4 mx-auto mb-2" />
                  <SkeletonBox className="h-3 w-full" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Section 6: Call to Action */}
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

