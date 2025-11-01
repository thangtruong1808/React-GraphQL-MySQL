import React from 'react';
import { NOTIFICATION_TABLE_COLUMNS } from '../../constants/notificationManagement';

/**
 * Notification Loading Rows Component
 * Displays skeleton loading rows while data is being fetched
 */
const NotificationLoadingRows: React.FC = () => {
  return (
    <>
      {Array.from({ length: 5 }).map((_, index) => (
        <tr key={index} className="animate-pulse">
          <td className={`px-4 py-4 whitespace-nowrap text-sm text-gray-900 text-left ${NOTIFICATION_TABLE_COLUMNS.ID.width}`}>
            <div className="h-4 bg-gray-200 rounded w-8"></div>
          </td>
          <td className={`px-4 py-4 whitespace-nowrap text-sm text-gray-900 text-left ${NOTIFICATION_TABLE_COLUMNS.USER.width}`}>
            <div className="h-4 bg-gray-200 rounded w-24"></div>
          </td>
          <td className={`px-4 py-4 text-sm text-gray-900 text-left ${NOTIFICATION_TABLE_COLUMNS.MESSAGE.width}`}>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </td>
          <td className={`px-4 py-4 whitespace-nowrap text-sm text-gray-900 text-left ${NOTIFICATION_TABLE_COLUMNS.STATUS.width}`}>
            <div className="h-4 bg-gray-200 rounded w-16"></div>
          </td>
          <td className={`px-4 py-4 whitespace-nowrap text-sm text-gray-500 text-left ${NOTIFICATION_TABLE_COLUMNS.CREATED.width}`}>
            <div className="h-4 bg-gray-200 rounded w-20"></div>
          </td>
          <td className={`px-4 py-4 whitespace-nowrap text-sm text-gray-500 text-left ${NOTIFICATION_TABLE_COLUMNS.UPDATED.width}`}>
            <div className="h-4 bg-gray-200 rounded w-20"></div>
          </td>
          <td className={`px-4 py-4 whitespace-nowrap text-left ${NOTIFICATION_TABLE_COLUMNS.ACTIONS.width}`}>
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

export default NotificationLoadingRows;

