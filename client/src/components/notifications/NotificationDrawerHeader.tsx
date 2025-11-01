import React from 'react';
import { FaTimes, FaBell } from 'react-icons/fa';

interface NotificationDrawerHeaderProps {
  onClose: () => void;
}

/**
 * Notification Drawer Header Component
 * Displays header with title and close button
 */
const NotificationDrawerHeader: React.FC<NotificationDrawerHeaderProps> = ({ onClose }) => {
  // Handle close click
  const handleClose = () => {
    onClose();
  };

  return (
    <div className="flex items-center justify-between p-4 theme-notification-drawer-border border-b theme-notification-drawer-header-bg">
      <div className="flex items-center space-x-2">
        <FaBell className="h-5 w-5" style={{ color: 'var(--text-primary)' }} />
        <h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>Notifications</h2>
      </div>
      <button
        onClick={handleClose}
        className="p-2 rounded-full transition-colors"
        style={{ color: 'var(--text-secondary)' }}
        title="Close notifications"
      >
        <FaTimes className="h-4 w-4" style={{ color: 'var(--text-secondary)' }} />
      </button>
    </div>
  );
};

export default NotificationDrawerHeader;

