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
      <div className="h-screen bg-gray-50 pt-24 flex flex-col overflow-hidden">

        {/* Section 1: Hero Section - Main Title & Introduction (Reduced height ~10%) */}
        <div className="px-4 sm:px-6 lg:px-8 py-2">
          <div className="max-w-7xl mx-auto bg-white rounded-2xl p-4 shadow-lg border border-gray-200 skeleton-fade-in">
            <div className="text-center">
              <SkeletonBox className="h-10 w-80 mx-auto mb-3" variant="wave" delay={100} />
              <SkeletonBox className="h-4 w-96 mx-auto mb-4" variant="wave" delay={200} />
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-4xl mx-auto">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div key={index} className="bg-gray-100 rounded-xl p-3 border border-gray-300 text-center skeleton-hover-lift" style={{ animationDelay: `${300 + index * 150}ms` }}>
                    <div className="w-8 h-8 bg-gray-200 rounded-lg mx-auto mb-2 skeleton-breathe"></div>
                    <SkeletonBox className="h-6 w-16 mx-auto mb-1" variant="slide" delay={400 + index * 100} />
                    <SkeletonBox className="h-3 w-20 mx-auto" variant="slide" delay={500 + index * 100} />
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

/**
 * About Page Skeleton Component
 * Shows skeleton loading state for about page
 * Professional layout with consistent bg-white sections and no scrolling
 */
export const AboutPageSkeleton: React.FC = () => {
  return (
    <div className="w-full public-dashboard bg-gray-50">
      <div className="h-screen bg-gray-50 pt-24 flex flex-col">

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
 * Login Page Skeleton Component
 * Shows skeleton loading state for login page
 * Exactly matches actual LoginPage layout and design structure
 * Represents LoginHeader, LoginForm, LoginFooter, and LoginCredentials components
 */
export const LoginPageSkeleton: React.FC = () => {
  return (
    <>
      <div className="min-h-screen flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">

        {/* Login Form Container - Fixed width - matches actual structure */}
        <div className="max-w-lg w-full space-y-8 relative z-10">

          {/* Card Container - Enhanced styling to match PublicCallToAction - matches actual card */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-purple-200 p-8">

            {/* LoginHeader Skeleton - matches actual LoginHeader component */}
            <div className="text-center">
              {/* Logo/Icon - GraphQL icon with purple-pink gradient - matches actual styling */}
              <div className="mx-auto h-12 w-12 bg-gradient-to-br from-gray-200 to-gray-300 rounded-xl flex items-center justify-center mb-6 shadow-lg">
                <div className="h-8 w-8 bg-gray-300 rounded"></div>
              </div>

              {/* Welcome Title - matches actual h2 styling */}
              <SkeletonBox className="h-8 w-40 mx-auto mb-2" />

              {/* Subtitle - matches actual p styling */}
              <SkeletonBox className="h-4 w-56 mx-auto" />
            </div>

            {/* LoginForm Skeleton - matches actual form structure */}
            <form className="mt-8 space-y-6">
              {/* Email Input - matches EnhancedInput structure */}
              <div className="space-y-1">
                {/* Label */}
                <SkeletonBox className="h-4 w-24" />

                {/* Input Container with left icon */}
                <div className="relative">
                  {/* Left Icon - matches actual email icon */}
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <div className="w-5 h-5 bg-gray-200 rounded"></div>
                  </div>
                  {/* Input Field - matches actual input styling */}
                  <SkeletonBox className="h-12 w-full pl-10 pr-3 rounded-lg border border-gray-200" />
                </div>
              </div>

              {/* Password Input - matches EnhancedInput structure */}
              <div className="space-y-1">
                {/* Label */}
                <SkeletonBox className="h-4 w-20" />

                {/* Input Container with left and right icons */}
                <div className="relative">
                  {/* Left Icon - matches actual lock icon */}
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <div className="w-5 h-5 bg-gray-200 rounded"></div>
                  </div>
                  {/* Input Field - matches actual input styling */}
                  <SkeletonBox className="h-12 w-full pl-10 pr-10 rounded-lg border border-gray-200" />
                  {/* Right Icon - matches actual eye icon */}
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <div className="w-5 h-5 bg-gray-200 rounded"></div>
                  </div>
                </div>
              </div>

              {/* Submit Button - matches actual button styling */}
              <button
                type="button"
                disabled
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-gray-300 to-gray-400 cursor-not-allowed"
              >
                <SkeletonBox className="h-5 w-16" />
              </button>
            </form>
          </div>

          {/* LoginFooter Skeleton - matches actual LoginFooter component - outside card */}
          <div className="text-center text-sm text-gray-500">
            <div className="flex items-center justify-center space-x-1">
              {/* Security Icon - matches actual lock icon */}
              <div className="w-5 h-5 bg-gray-200 rounded"></div>
              {/* Security Text */}
              <SkeletonBox className="h-4 w-48" />
            </div>
          </div>
        </div>

        {/* LoginCredentials Skeleton - Independent container with wider width - matches actual structure */}
        <div className="text-center text-xs text-gray-500 border border-gray-200 pt-4 py-2 px-4 rounded-lg mt-8 w-full max-w-6xl mx-auto">

          {/* First Row - 3 columns - matches actual grid structure */}
          <div className="grid grid-cols-3 gap-4 mb-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="flex flex-col items-start">
                {/* Email line */}
                <SkeletonBox className="h-3 w-40 mb-1" />
                {/* Password line */}
                <SkeletonBox className="h-3 w-36 mb-1" />
                {/* Role line */}
                <SkeletonBox className="h-3 w-20" />
              </div>
            ))}
          </div>

          {/* Second Row - 3 columns - matches actual grid structure */}
          <div className="grid grid-cols-3 gap-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="flex flex-col items-start">
                {/* Email line */}
                <SkeletonBox className="h-3 w-40 mb-1" />
                {/* Password line */}
                <SkeletonBox className="h-3 w-36 mb-1" />
                {/* Role line */}
                <SkeletonBox className="h-3 w-20" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
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

/**
 * Navigation Bar Skeleton Component
 * Shows skeleton loading state for the navigation bar
 * Matches the exact structure of the real NavBar with logo, nav items, and user dropdown
 */
export const NavBarSkeleton: React.FC = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 w-full bg-gray-100 border-b border-gray-200 z-50">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Left Section: Logo Skeleton */}
          <div className="flex items-center flex-shrink-0">
            <div className="flex items-center space-x-2">
              <SkeletonBox className="w-8 h-8 rounded-lg" />
              <SkeletonBox className="h-6 w-24" />
            </div>
          </div>

          {/* Center Section: Navigation Items Skeleton */}
          <div className="hidden md:flex items-center justify-center flex-1">
            <div className="flex items-center space-x-3 lg:space-x-6 xl:space-x-8">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="flex flex-col items-center space-y-1 px-2 lg:px-3 py-2">
                  <SkeletonBox className="w-4 h-4" />
                  <SkeletonBox className="h-3 w-12" />
                </div>
              ))}
            </div>
          </div>

          {/* Right Section: User Dropdown Skeleton */}
          <div className="flex items-center space-x-4">
            <div className="relative hidden md:block">
              <div className="flex items-center space-x-2">
                <SkeletonBox className="w-8 h-8 rounded-full" />
                <SkeletonBox className="h-4 w-16" />
              </div>
            </div>

            {/* Mobile menu button skeleton */}
            <div className="md:hidden flex items-center">
              <SkeletonBox className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

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

/**
 * Search Section Skeleton Component
 * Generic skeleton for individual search sections (Members, Projects, Tasks)
 */
export const SearchSectionSkeleton: React.FC<{ title: string }> = ({ title }) => {
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

/**
 * Active Filters Skeleton Component
 * Skeleton for the active filters section
 */
export const ActiveFiltersSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
      <SkeletonBox className="h-5 w-32 mb-4" />
      <div className="flex flex-wrap gap-3">
        {Array.from({ length: 4 }).map((_, index) => (
          <SkeletonBox key={index} className="h-8 w-24 rounded-full" />
        ))}
      </div>
    </div>
  );
};

/**
 * Search Header Skeleton Component
 * Skeleton for the search results header section
 */
export const SearchHeaderSkeleton: React.FC = () => {
  return (
    <div className="text-center">
      {/* Main search title */}
      <SkeletonBox className="h-8 w-64 mx-auto mb-4" />

      {/* Search description */}
      <SkeletonBox className="h-4 w-96 mx-auto mb-6" />

      {/* Result counts */}
      <div className="flex justify-center space-x-6">
        <SkeletonBox className="h-6 w-20" />
        <SkeletonBox className="h-6 w-24" />
        <SkeletonBox className="h-6 w-16" />
      </div>
    </div>
  );
};

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

