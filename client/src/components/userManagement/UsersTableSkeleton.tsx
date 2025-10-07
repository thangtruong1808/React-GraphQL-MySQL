import React from 'react';
import { SkeletonBox } from '../ui/SkeletonLoader';

/**
 * Users Table Skeleton Component
 * Shows skeleton loading state for users table with search, pagination, and table rows
 * Matches the exact structure of the real UsersTable component
 */
export const UsersTableSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 skeleton-fade-in">
      {/* Search Input Skeleton */}
      <div className="p-6 border-b border-gray-200">
        <div className="max-w-md">
          <SkeletonBox className="h-4 w-20 mb-2" variant="wave" delay={500} />
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SkeletonBox className="w-5 h-5" variant="breathe" delay={600} />
            </div>
            <SkeletonBox className="h-10 w-full pl-10 pr-3 rounded-lg border border-gray-200" variant="slide" delay={700} />
          </div>
        </div>
      </div>

      {/* Table Skeleton */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          {/* Table Header */}
          <thead className="bg-gray-50">
            <tr>
              <th className="w-16 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <SkeletonBox className="h-4 w-8" variant="wave" delay={800} />
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <SkeletonBox className="h-4 w-20" variant="wave" delay={850} />
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <SkeletonBox className="h-4 w-20" variant="wave" delay={900} />
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <SkeletonBox className="h-4 w-16" variant="wave" delay={950} />
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <SkeletonBox className="h-4 w-12" variant="wave" delay={1000} />
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <SkeletonBox className="h-4 w-20" variant="wave" delay={1050} />
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <SkeletonBox className="h-4 w-16" variant="wave" delay={1100} />
              </th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="bg-white divide-y divide-gray-200">
            {Array.from({ length: 10 }).map((_, index) => (
              <tr key={index} className="hover:bg-gray-50 skeleton-hover-lift" style={{ animationDelay: `${1200 + index * 100}ms` }}>
                <td className="w-16 px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                  <SkeletonBox className="h-4 w-8" variant="slide" delay={1200 + index * 100} />
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                  <SkeletonBox className="h-4 w-24" variant="slide" delay={1200 + index * 100 + 50} />
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                  <SkeletonBox className="h-4 w-28" variant="slide" delay={1200 + index * 100 + 100} />
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                  <SkeletonBox className="h-4 w-40" variant="slide" delay={1200 + index * 100 + 150} />
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                  <SkeletonBox className="h-6 w-24 rounded-full" variant="breathe" delay={1200 + index * 100 + 200} />
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                  <SkeletonBox className="h-4 w-20" variant="slide" delay={1200 + index * 100 + 250} />
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex items-center space-x-2">
                    <SkeletonBox className="h-8 w-16 rounded-lg" variant="slide" delay={1200 + index * 100 + 300} />
                    <SkeletonBox className="h-8 w-16 rounded-lg" variant="slide" delay={1200 + index * 100 + 350} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Skeleton */}
      <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
        <div className="flex-1 flex justify-between sm:hidden">
          <SkeletonBox className="h-8 w-20 rounded-lg" variant="slide" delay={2300} />
          <SkeletonBox className="h-8 w-20 rounded-lg" variant="slide" delay={2400} />
        </div>
        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center space-x-1">
              <SkeletonBox className="h-4 w-16" variant="wave" delay={2300} />
              <SkeletonBox className="h-8 w-16 rounded-lg" variant="slide" delay={2350} />
              <SkeletonBox className="h-4 w-32" variant="wave" delay={2400} />
            </div>
          </div>
          <div>
            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
              <SkeletonBox className="h-8 w-8 rounded-l-md" variant="slide" delay={2450} />
              <SkeletonBox className="h-8 w-8" variant="slide" delay={2500} />
              <SkeletonBox className="h-8 w-8" variant="slide" delay={2550} />
              <SkeletonBox className="h-8 w-8" variant="slide" delay={2600} />
              <SkeletonBox className="h-8 w-8 rounded-r-md" variant="slide" delay={2650} />
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UsersTableSkeleton;
