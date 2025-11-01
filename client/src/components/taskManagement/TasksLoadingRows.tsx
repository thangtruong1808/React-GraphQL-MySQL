import React from 'react';

/**
 * Tasks Loading Rows Component
 * Displays skeleton rows for loading state
 */
const TasksLoadingRows: React.FC = () => {
  return (
    <>
      {Array.from({ length: 5 }).map((_, index) => (
        <tr key={index} className="animate-pulse">
          {/* ID Column - Hidden on mobile and tablet */}
          <td className="hidden lg:table-cell px-4 py-4 whitespace-nowrap">
            <div className="h-4 bg-gray-200 rounded w-8"></div>
          </td>
          {/* Title Column - Always visible */}
          <td className="px-4 py-4 whitespace-nowrap">
            <div className="h-4 bg-gray-200 rounded w-32"></div>
          </td>
          {/* Description Column - Hidden on mobile */}
          <td className="hidden sm:table-cell px-4 py-4">
            <div className="space-y-1">
              <div className="h-4 bg-gray-200 rounded w-48"></div>
              <div className="h-4 bg-gray-200 rounded w-32"></div>
            </div>
          </td>
          {/* Status Column - Always visible */}
          <td className="px-4 py-4 whitespace-nowrap">
            <div className="h-6 bg-gray-200 rounded-full w-16"></div>
          </td>
          {/* Priority Column - Hidden on mobile */}
          <td className="hidden sm:table-cell px-4 py-4 whitespace-nowrap">
            <div className="h-6 bg-gray-200 rounded-full w-12"></div>
          </td>
          {/* Project Column - Hidden on mobile and tablet */}
          <td className="hidden lg:table-cell px-4 py-4 whitespace-nowrap">
            <div className="h-4 bg-gray-200 rounded w-24"></div>
          </td>
          {/* Assigned To Column - Hidden on mobile and tablet */}
          <td className="hidden lg:table-cell px-4 py-4 whitespace-nowrap">
            <div className="h-4 bg-gray-200 rounded w-20"></div>
          </td>
          {/* Tags Column - Hidden on mobile and tablet */}
          <td className="hidden lg:table-cell px-4 py-4 whitespace-nowrap">
            <div className="h-4 bg-gray-200 rounded w-20"></div>
          </td>
          {/* Due Date Column - Hidden on mobile and tablet */}
          <td className="hidden lg:table-cell px-4 py-4 whitespace-nowrap">
            <div className="h-4 bg-gray-200 rounded w-20"></div>
          </td>
          {/* Created Date Column - Hidden on mobile and tablet */}
          <td className="hidden lg:table-cell px-4 py-4 whitespace-nowrap">
            <div className="h-4 bg-gray-200 rounded w-20"></div>
          </td>
          {/* Updated Date Column - Hidden on mobile and tablet */}
          <td className="hidden lg:table-cell px-4 py-4 whitespace-nowrap">
            <div className="h-4 bg-gray-200 rounded w-20"></div>
          </td>
          {/* Actions Column - Always visible */}
          <td className="px-4 py-4 whitespace-nowrap">
            <div className="flex items-center space-x-2">
              <div className="h-8 bg-gray-200 rounded w-16"></div>
              <div className="h-8 bg-gray-200 rounded w-16"></div>
            </div>
          </td>
        </tr>
      ))}
    </>
  );
};

export default TasksLoadingRows;

