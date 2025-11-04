import React from 'react';

/**
 * Navbar Notification Badge Props Interface
 */
interface NavbarNotificationBadgeProps {
  unreadCount: number | null;
}

/**
 * Navbar Notification Badge Component
 * Displays notification count with theme-aware styling
 * Shows loading state when count is null (waiting for server authentication)
 * Shows different colors based on unread status
 * Responsive design for mobile and desktop displays
 * Positioned next to icon for better UX
 */
const NavbarNotificationBadge: React.FC<NavbarNotificationBadgeProps> = ({ unreadCount }) => {
  // Show loading state when count is null (waiting for server authentication)
  if (unreadCount === null) {
    return (
      <span
        className="ml-1.5 sm:ml-2 text-[10px] sm:text-xs rounded-full px-1 sm:px-1.5 py-0.5 min-w-[16px] sm:min-w-[18px] h-[16px] sm:h-[18px] flex items-center justify-center font-semibold shadow-sm animate-pulse"
        style={{ backgroundColor: 'var(--badge-neutral-bg)', color: 'var(--badge-neutral-text)' }}
      >
        ...
      </span>
    );
  }

  // Don't show badge if count is 0
  if (unreadCount === 0) {
    return null;
  }

  return (
    <span
      className="ml-1.5 sm:ml-2 text-[10px] sm:text-xs rounded-full px-1 sm:px-1.5 py-0.5 min-w-[16px] sm:min-w-[18px] h-[16px] sm:h-[18px] flex items-center justify-center font-semibold shadow-sm whitespace-nowrap"
      style={
        unreadCount > 0
          ? { backgroundColor: 'var(--badge-warning-bg)', color: 'var(--badge-warning-text)' }
          : { backgroundColor: 'var(--badge-neutral-bg)', color: 'var(--badge-neutral-text)' }
      }
    >
      {unreadCount > 99 ? '99+' : unreadCount}
    </span>
  );
};

export default NavbarNotificationBadge;

