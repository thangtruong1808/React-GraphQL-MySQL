import React from 'react';
import { SkeletonBox } from '../SkeletonLoader';

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

