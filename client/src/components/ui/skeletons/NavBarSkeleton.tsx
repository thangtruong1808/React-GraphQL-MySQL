import React from 'react';
import { SkeletonBox } from '../SkeletonLoader';

/**
 * Navigation Bar Skeleton Component
 * Shows skeleton loading state for the navigation bar
 * Matches the exact structure of the real NavBar with logo, nav items, and user dropdown
 */
export const NavBarSkeleton: React.FC = () => {
  return (
    <nav
      className="fixed top-0 left-0 right-0 w-full border-b theme-border z-50 theme-navbar-bg theme-navbar-text"
      style={{
        backgroundColor: 'var(--navbar-bg)',
        backgroundImage: 'var(--navbar-gradient)',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover'
      }}
    >
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

