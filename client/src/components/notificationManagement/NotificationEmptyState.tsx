import React from 'react';

/**
 * Notification Empty State Component
 * Displays empty state when no notifications are found
 */
const NotificationEmptyState: React.FC = () => {
  return (
    <tr>
      <td colSpan={8} className="px-6 py-12 text-center theme-table-text-secondary">
        <div className="flex flex-col items-center">
          <svg className="w-12 h-12 theme-table-text-muted mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4.828 7l2.586 2.586a2 2 0 002.828 0L12.828 7H4.828z" />
          </svg>
          <p className="text-lg font-medium theme-table-text-primary mb-1">No notifications found</p>
          <p className="theme-table-text-secondary">Try adjusting your search criteria or create a new notification.</p>
        </div>
      </td>
    </tr>
  );
};

export default NotificationEmptyState;

