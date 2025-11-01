import React from 'react';

/**
 * Tags Loading Rows Component
 * Displays skeleton rows for loading state
 */
const TagsLoadingRows: React.FC = () => {
  return (
    <>
      {Array.from({ length: 5 }).map((_, index) => (
        <tr key={index} className="animate-pulse">
          {/* ID Column - Hidden on mobile */}
          <td className="hidden lg:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-left">
            <div className="h-4 bg-gray-200 rounded w-8"></div>
          </td>
          {/* Name Column */}
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-left">
            <div className="h-4 bg-gray-200 rounded w-24"></div>
          </td>
          {/* Description Column - Hidden on small screens */}
          <td className="hidden sm:table-cell px-6 py-4 text-sm text-gray-900 text-left">
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </td>
          {/* Type Column - Hidden on extra small screens */}
          <td className="hidden xs:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-left">
            <div className="h-4 bg-gray-200 rounded w-16"></div>
          </td>
          {/* Category Column - Hidden on mobile and tablet */}
          <td className="hidden lg:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-left">
            <div className="h-4 bg-gray-200 rounded w-16"></div>
          </td>
          {/* Created Column - Hidden on extra small screens */}
          <td className="hidden xs:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-left">
            <div className="h-4 bg-gray-200 rounded w-20"></div>
          </td>
          {/* Updated Column - Hidden on mobile and tablet */}
          <td className="hidden lg:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-left">
            <div className="h-4 bg-gray-200 rounded w-20"></div>
          </td>
          {/* Actions Column */}
          <td className="px-6 py-4 whitespace-nowrap text-left">
            <div className="flex space-x-2">
              <div className="h-8 w-8 bg-gray-200 rounded"></div>
              <div className="h-8 w-8 bg-gray-200 rounded"></div>
            </div>
          </td>
        </tr>
      ))}
    </>
  );
};

export default TagsLoadingRows;

