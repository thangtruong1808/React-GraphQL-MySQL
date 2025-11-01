import React from 'react';
import { FaBell } from 'react-icons/fa';

/**
 * Notification Empty State Component
 * Displays empty state when no notifications are available
 */
const NotificationEmptyState: React.FC = () => {
  return (
    <div className="flex-1 flex items-center justify-center p-8">
      <div className="text-center">
        <FaBell className="h-16 w-16 theme-notification-drawer-text-secondary mx-auto mb-4" />
        <h3 className="text-lg font-medium theme-notification-drawer-text mb-2">No notifications</h3>
        <p className="theme-notification-drawer-text-secondary">You're all caught up!</p>
      </div>
    </div>
  );
};

export default NotificationEmptyState;

