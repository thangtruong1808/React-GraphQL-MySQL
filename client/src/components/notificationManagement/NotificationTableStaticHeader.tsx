import React from 'react';
import { NOTIFICATION_TABLE_COLUMNS } from '../../constants/notificationManagement';

/**
 * Notification Table Static Header Component
 * Displays static table headers for loading state (no sorting)
 */
const NotificationTableStaticHeader: React.FC = () => {
  return (
    <thead className="theme-table-header-bg">
      <tr>
        <th className={`px-4 py-3 text-left text-xs font-medium theme-table-text-secondary uppercase tracking-wider ${NOTIFICATION_TABLE_COLUMNS.ID.width}`}>
          ID
        </th>
        <th className={`px-4 py-3 text-left text-xs font-medium theme-table-text-secondary uppercase tracking-wider ${NOTIFICATION_TABLE_COLUMNS.USER.width}`}>
          User
        </th>
        <th className={`px-4 py-3 text-left text-xs font-medium theme-table-text-secondary uppercase tracking-wider ${NOTIFICATION_TABLE_COLUMNS.MESSAGE.width}`}>
          Message
        </th>
        <th className={`px-4 py-3 text-left text-xs font-medium theme-table-text-secondary uppercase tracking-wider ${NOTIFICATION_TABLE_COLUMNS.STATUS.width}`}>
          Status
        </th>
        <th className={`px-4 py-3 text-left text-xs font-medium theme-table-text-secondary uppercase tracking-wider ${NOTIFICATION_TABLE_COLUMNS.CREATED.width}`}>
          Created
        </th>
        <th className={`px-4 py-3 text-left text-xs font-medium theme-table-text-secondary uppercase tracking-wider ${NOTIFICATION_TABLE_COLUMNS.UPDATED.width}`}>
          Updated
        </th>
        <th className={`px-4 py-3 text-left text-xs font-medium theme-table-text-secondary uppercase tracking-wider ${NOTIFICATION_TABLE_COLUMNS.ACTIONS.width}`}>
          Actions
        </th>
      </tr>
    </thead>
  );
};

export default NotificationTableStaticHeader;

