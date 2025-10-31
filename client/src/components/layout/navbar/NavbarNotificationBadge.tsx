import React from 'react';

/**
 * Navbar Notification Badge Props Interface
 */
interface NavbarNotificationBadgeProps {
  unreadCount: number;
}

/**
 * Navbar Notification Badge Component
 * Displays notification count with theme-aware styling
 * Shows different colors based on unread status
 */
const NavbarNotificationBadge: React.FC<NavbarNotificationBadgeProps> = ({ unreadCount }) => {
  return (
    <div className="ml-1 flex items-center">
      <span
        className="text-xs rounded-full px-1.5 py-0.5 min-w-[18px] h-[18px] flex items-center justify-center font-medium shadow-sm"
        style={
          unreadCount > 0
            ? { backgroundColor: 'var(--badge-warning-bg)', color: 'var(--badge-warning-text)' }
            : { backgroundColor: 'var(--badge-neutral-bg)', color: 'var(--badge-neutral-text)' }
        }
      >
        {unreadCount > 99 ? '99+' : unreadCount}
      </span>
    </div>
  );
};

export default NavbarNotificationBadge;

