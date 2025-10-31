import React from 'react';
import { COMMENT_TABLE_COLUMNS } from '../../../constants/commentManagement';

/**
 * Comment Loading Skeleton Component
 * Displays loading state skeleton rows for table
 */
const CommentLoadingSkeleton: React.FC = () => {
  return (
    <>
      {Array.from({ length: 5 }).map((_, index) => (
        <tr key={index} className="animate-pulse">
          {/* ID Column - Hidden on mobile */}
          <td className={`hidden lg:table-cell px-4 py-4 whitespace-nowrap text-sm text-gray-900 text-left ${COMMENT_TABLE_COLUMNS.ID.width}`}>
            <div className="h-4 bg-gray-200 rounded w-8"></div>
          </td>
          {/* Content */}
          <td className={`px-4 py-4 text-sm text-gray-900 text-left ${COMMENT_TABLE_COLUMNS.CONTENT.width}`}>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </td>
          {/* Author Column - Hidden on small screens */}
          <td className={`hidden sm:table-cell px-4 py-4 whitespace-nowrap text-sm text-gray-900 text-left ${COMMENT_TABLE_COLUMNS.AUTHOR.width}`}>
            <div className="h-4 bg-gray-200 rounded w-24"></div>
          </td>
          {/* Task Column - Hidden on extra small screens */}
          <td className={`hidden xs:table-cell px-4 py-4 whitespace-nowrap text-sm text-gray-900 text-left ${COMMENT_TABLE_COLUMNS.TASK.width}`}>
            <div className="h-4 bg-gray-200 rounded w-20"></div>
          </td>
          {/* Project Column - Hidden on mobile and tablet */}
          <td className={`hidden lg:table-cell px-4 py-4 whitespace-nowrap text-sm text-gray-900 text-left ${COMMENT_TABLE_COLUMNS.PROJECT.width}`}>
            <div className="h-4 bg-gray-200 rounded w-16"></div>
          </td>
          {/* Likes Column - Hidden on small screens */}
          <td className={`hidden sm:table-cell px-4 py-4 whitespace-nowrap text-sm text-gray-900 text-left ${COMMENT_TABLE_COLUMNS.LIKES.width}`}>
            <div className="h-4 bg-gray-200 rounded w-8"></div>
          </td>
          {/* Created Column - Hidden on extra small screens */}
          <td className={`hidden xs:table-cell px-4 py-4 whitespace-nowrap text-sm text-gray-500 text-left ${COMMENT_TABLE_COLUMNS.CREATED.width}`}>
            <div className="h-4 bg-gray-200 rounded w-20"></div>
          </td>
          {/* Updated Column - Hidden on mobile and tablet */}
          <td className={`hidden lg:table-cell px-4 py-4 whitespace-nowrap text-sm text-gray-500 text-left ${COMMENT_TABLE_COLUMNS.UPDATED.width}`}>
            <div className="h-4 bg-gray-200 rounded w-20"></div>
          </td>
          {/* Actions */}
          <td className={`px-4 py-4 whitespace-nowrap text-left ${COMMENT_TABLE_COLUMNS.ACTIONS.width}`}>
            <div className="flex justify-start space-x-2">
              <div className="h-6 bg-gray-200 rounded w-12"></div>
              <div className="h-6 bg-gray-200 rounded w-16"></div>
            </div>
          </td>
        </tr>
      ))}
    </>
  );
};

export default CommentLoadingSkeleton;

