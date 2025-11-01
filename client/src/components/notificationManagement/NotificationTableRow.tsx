import React from 'react';
import { FaAlignLeft, FaCalendarAlt, FaCheck, FaEdit, FaEnvelope, FaTrash, FaUser } from 'react-icons/fa';
import { Notification } from '../../types/notificationManagement';
import { formatDate } from './utils';

interface NotificationTableRowProps {
  notification: Notification;
  onEdit: (notification: Notification) => void;
  onDelete: (notification: Notification) => void;
  onMarkRead: (notification: Notification) => void;
  onMarkUnread: (notification: Notification) => void;
}

/**
 * Notification Table Row Component
 * Displays individual notification row with actions
 */
const NotificationTableRow: React.FC<NotificationTableRowProps> = ({
  notification,
  onEdit,
  onDelete,
  onMarkRead,
  onMarkUnread
}) => {
  // Handle edit click
  const handleEdit = () => {
    onEdit(notification);
  };

  // Handle delete click
  const handleDelete = () => {
    onDelete(notification);
  };

  // Handle mark as read click
  const handleMarkRead = () => {
    onMarkRead(notification);
  };

  // Handle mark as unread click
  const handleMarkUnread = () => {
    onMarkUnread(notification);
  };

  // Handle row hover enter
  const handleMouseEnter = (e: React.MouseEvent<HTMLTableRowElement>) => {
    e.currentTarget.style.backgroundColor = 'var(--table-row-hover-bg)';
  };

  // Handle row hover leave
  const handleMouseLeave = (e: React.MouseEvent<HTMLTableRowElement>) => {
    e.currentTarget.style.backgroundColor = 'var(--table-row-bg)';
  };

  return (
    <tr
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ backgroundColor: 'var(--table-row-bg)' }}
    >
      {/* ID Column - Hidden on mobile */}
      <td className="hidden lg:table-cell px-4 py-4 whitespace-nowrap text-sm theme-table-text-primary text-left">
        {notification.id}
      </td>

      {/* User Column - Hidden on small screens */}
      <td className="hidden sm:table-cell px-4 py-4 whitespace-nowrap text-sm theme-table-text-primary text-left">
        <div className="flex items-center space-x-2">
          <FaUser className="w-3 h-3" style={{ color: 'var(--text-muted)' }} />
          <span>{notification.user.firstName} {notification.user.lastName}</span>
        </div>
      </td>

      {/* Message Column - Always visible */}
      <td className="px-4 py-4 text-sm theme-table-text-primary text-left">
        <p className="truncate flex items-center space-x-2" title={notification.message}>
          <FaAlignLeft className="w-3 h-3" style={{ color: 'var(--text-muted)' }} />
          <span>{notification.message}</span>
        </p>
      </td>

      {/* Status Column - Always visible */}
      <td className="px-4 py-4 whitespace-nowrap text-left">
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium" style={{ backgroundColor: 'var(--badge-secondary-bg)', color: 'var(--badge-secondary-text)' }}>
          {notification.isRead ? 'Read' : 'Unread'}
        </span>
      </td>

      {/* Created Date Column - Hidden on extra small screens */}
      <td className="hidden xs:table-cell px-4 py-4 whitespace-nowrap text-sm theme-table-text-secondary text-left">
        <div className="flex items-center space-x-2">
          <FaCalendarAlt className="w-3 h-3" style={{ color: 'var(--text-muted)' }} />
          <span>{formatDate(notification.createdAt)}</span>
        </div>
      </td>

      {/* Updated Date Column - Hidden on mobile and tablet */}
      <td className="hidden lg:table-cell px-4 py-4 whitespace-nowrap text-sm theme-table-text-secondary text-left">
        <div className="flex items-center space-x-2">
          <FaCalendarAlt className="w-3 h-3" style={{ color: 'var(--text-muted)' }} />
          <span>{formatDate(notification.updatedAt)}</span>
        </div>
      </td>

      {/* Actions Column - Always visible */}
      <td className="px-4 py-4 whitespace-nowrap text-left">
        <div className="flex justify-start space-x-2">
          <button
            onClick={handleEdit}
            className="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-md transition-colors duration-150"
            style={{ backgroundColor: 'var(--button-secondary-bg)', color: 'var(--button-primary-text)' }}
            title="Edit notification"
          >
            <FaEdit className="w-3 h-3 mr-1" />
            Edit
          </button>
          {notification.isRead ? (
            <button
              onClick={handleMarkUnread}
              className="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-md transition-colors duration-150"
              style={{ backgroundColor: 'var(--button-secondary-bg)', color: 'var(--button-primary-text)' }}
              title="Mark as unread"
            >
              <FaEnvelope className="w-3 h-3 mr-1" />
              Unread
            </button>
          ) : (
            <button
              onClick={handleMarkRead}
              className="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-md transition-colors duration-150"
              style={{ backgroundColor: 'var(--button-secondary-bg)', color: 'var(--button-primary-text)' }}
              title="Mark as read"
            >
              <FaCheck className="w-3 h-3 mr-1" />
              Read
            </button>
          )}
          <button
            onClick={handleDelete}
            className="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-md transition-colors duration-150"
            style={{ backgroundColor: 'var(--button-danger-bg)', color: 'var(--button-primary-text)' }}
            title="Delete notification"
          >
            <FaTrash className="w-3 h-3 mr-1" />
            Delete
          </button>
        </div>
      </td>
    </tr>
  );
};

export default NotificationTableRow;

