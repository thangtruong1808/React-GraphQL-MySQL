import React from 'react';

interface NotificationSectionProps {
  title: string;
  count: number;
  isUnread?: boolean;
}

/**
 * Notification Section Component
 * Displays section header for unread/read notifications
 */
const NotificationSection: React.FC<NotificationSectionProps> = ({ title, count, isUnread = false }) => {
  return (
    <h3 className="text-sm font-semibold mb-3 flex items-center" style={{ color: isUnread ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
      <div className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: isUnread ? 'var(--accent-from)' : 'var(--border-color)' }}></div>
      {title} ({count})
    </h3>
  );
};

export default NotificationSection;

