import React from 'react';

/**
 * ProjectMembersTableSkeleton Component
 * Loading skeleton for project members table
 * Shows animated placeholder rows while data is loading
 */
const ProjectMembersTableSkeleton: React.FC = () => {
  const renderLoadingRows = () => {
    return Array.from({ length: 5 }).map((_, index) => (
      <tr key={index} className="animate-pulse">
        {/* User Column */}
        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 text-left">
          <div className="flex items-center">
            <div className="flex-shrink-0 h-8 w-8 bg-gray-200 rounded-full"></div>
            <div className="ml-4">
              <div className="h-4 bg-gray-200 rounded w-24 mb-1"></div>
              <div className="h-3 bg-gray-200 rounded w-16"></div>
            </div>
          </div>
        </td>
        {/* Role Column */}
        <td className="px-4 py-4 whitespace-nowrap text-left">
          <div className="h-6 bg-gray-200 rounded-full w-16"></div>
        </td>
        {/* User Role Column - Hidden on small screens */}
        <td className="hidden sm:table-cell px-4 py-4 whitespace-nowrap text-sm text-gray-900 text-left">
          <div className="h-4 bg-gray-200 rounded w-20"></div>
        </td>
        {/* Joined Column - Hidden on extra small screens */}
        <td className="hidden xs:table-cell px-4 py-4 whitespace-nowrap text-sm text-gray-500 text-left">
          <div className="h-4 bg-gray-200 rounded w-20"></div>
        </td>
        {/* Actions */}
        <td className="px-4 py-4 whitespace-nowrap text-left">
          <div className="flex justify-start space-x-2">
            <div className="h-6 bg-gray-200 rounded w-12"></div>
            <div className="h-6 bg-gray-200 rounded w-16"></div>
          </div>
        </td>
      </tr>
    ));
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {/* User Column */}
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                User
              </th>
              {/* Role Column */}
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Role
              </th>
              {/* User Role Column - Hidden on small screens */}
              <th className="hidden sm:table-cell px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                User Role
              </th>
              {/* Joined Column - Hidden on extra small screens */}
              <th className="hidden xs:table-cell px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Joined
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {renderLoadingRows()}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProjectMembersTableSkeleton;
