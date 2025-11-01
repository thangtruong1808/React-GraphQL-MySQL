import React from 'react';
import { SkeletonBox } from '../SkeletonLoader';

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

