import React from 'react';
import { ACTIVITY_TABLE_COLUMNS } from '../../../constants/activityManagement';

/**
 * Activity Loading Skeleton Component
 * Displays loading state skeleton rows for table
 */
const ActivityLoadingSkeleton: React.FC = () => {
  return (
    <>
      {Array.from({ length: 5 }).map((_, index) => (
        <tr key={index} className="animate-pulse">
          <td className={`px-4 py-4 whitespace-nowrap text-sm text-gray-900 text-left ${ACTIVITY_TABLE_COLUMNS.ID.width}`}>
            <div className="h-4 bg-gray-200 rounded w-8"></div>
          </td>
          <td className={`px-4 py-4 whitespace-nowrap text-sm text-gray-900 text-left ${ACTIVITY_TABLE_COLUMNS.USER.width}`}>
            <div className="h-4 bg-gray-200 rounded w-24"></div>
          </td>
          <td className={`px-4 py-4 whitespace-nowrap text-sm text-gray-900 text-left ${ACTIVITY_TABLE_COLUMNS.TYPE.width}`}>
            <div className="h-6 bg-gray-200 rounded-full w-20"></div>
          </td>
          <td className={`px-4 py-4 text-sm text-gray-900 text-left ${ACTIVITY_TABLE_COLUMNS.ACTION.width}`}>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </td>
          <td className={`px-4 py-4 whitespace-nowrap text-sm text-gray-900 text-left ${ACTIVITY_TABLE_COLUMNS.TARGET_USER.width}`}>
            <div className="h-4 bg-gray-200 rounded w-20"></div>
          </td>
          <td className={`px-4 py-4 whitespace-nowrap text-sm text-gray-900 text-left ${ACTIVITY_TABLE_COLUMNS.PROJECT.width}`}>
            <div className="h-4 bg-gray-200 rounded w-16"></div>
          </td>
          <td className={`px-4 py-4 whitespace-nowrap text-sm text-gray-900 text-left ${ACTIVITY_TABLE_COLUMNS.TASK.width}`}>
            <div className="h-4 bg-gray-200 rounded w-20"></div>
          </td>
          <td className={`px-4 py-4 whitespace-nowrap text-sm text-gray-500 text-left ${ACTIVITY_TABLE_COLUMNS.CREATED.width}`}>
            <div className="h-4 bg-gray-200 rounded w-20"></div>
          </td>
          <td className={`px-4 py-4 whitespace-nowrap text-sm text-gray-500 text-left ${ACTIVITY_TABLE_COLUMNS.UPDATED.width}`}>
            <div className="h-4 bg-gray-200 rounded w-20"></div>
          </td>
          <td className={`px-4 py-4 whitespace-nowrap text-left ${ACTIVITY_TABLE_COLUMNS.ACTIONS.width}`}>
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

export default ActivityLoadingSkeleton;

