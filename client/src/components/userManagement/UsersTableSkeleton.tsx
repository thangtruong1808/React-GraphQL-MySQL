import React from 'react';
import { SkeletonBox } from '../ui/SkeletonLoader';

/**
 * Users Table Skeleton Component
 * Shows skeleton loading state for users table with search, pagination, and table rows
 * Matches the exact structure of the real UsersTable component
 */
export const UsersTableSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Search Input Skeleton */}
      <div className="p-6 border-b border-gray-200">
        <div className="max-w-md">
          <SkeletonBox className="h-4 w-20 mb-2" />
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SkeletonBox className="w-5 h-5" />
            </div>
            <SkeletonBox className="h-10 w-full pl-10 pr-3 rounded-lg border border-gray-200" />
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
                <SkeletonBox className="h-4 w-8" />
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <SkeletonBox className="h-4 w-20" />
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <SkeletonBox className="h-4 w-20" />
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <SkeletonBox className="h-4 w-16" />
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <SkeletonBox className="h-4 w-12" />
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <SkeletonBox className="h-4 w-20" />
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <SkeletonBox className="h-4 w-16" />
              </th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="bg-white divide-y divide-gray-200">
            {Array.from({ length: 10 }).map((_, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="w-16 px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                  <SkeletonBox className="h-4 w-8" />
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                  <SkeletonBox className="h-4 w-24" />
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                  <SkeletonBox className="h-4 w-28" />
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                  <SkeletonBox className="h-4 w-40" />
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                  <SkeletonBox className="h-6 w-24 rounded-full" />
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                  <SkeletonBox className="h-4 w-20" />
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex items-center space-x-2">
                    <SkeletonBox className="h-8 w-16 rounded-lg" />
                    <SkeletonBox className="h-8 w-16 rounded-lg" />
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
          <SkeletonBox className="h-8 w-20 rounded-lg" />
          <SkeletonBox className="h-8 w-20 rounded-lg" />
        </div>
        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center space-x-1">
              <SkeletonBox className="h-4 w-16" />
              <SkeletonBox className="h-8 w-16 rounded-lg" />
              <SkeletonBox className="h-4 w-32" />
            </div>
          </div>
          <div>
            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
              <SkeletonBox className="h-8 w-8 rounded-l-md" />
              <SkeletonBox className="h-8 w-8" />
              <SkeletonBox className="h-8 w-8" />
              <SkeletonBox className="h-8 w-8" />
              <SkeletonBox className="h-8 w-8 rounded-r-md" />
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UsersTableSkeleton;
