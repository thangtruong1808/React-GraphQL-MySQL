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

/** Description: Renders a notification row with themed action buttons inside the notifications dashboard table; Data created: None (stateless row component); Author: thangtruong */
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
      style={{
        backgroundColor: 'var(--table-row-bg)',
        borderBottomColor: 'var(--border-color)',
        borderBottomWidth: 1
      }}
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
            className="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 transition-transform duration-150"
            style={{
              backgroundImage: 'linear-gradient(120deg, var(--button-secondary-bg), var(--accent-to))',
              color: 'var(--button-primary-text)',
              boxShadow: '0 10px 20px -8px var(--shadow-color)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-1px)';
              e.currentTarget.style.boxShadow = '0 12px 24px -8px var(--shadow-color)';
              e.currentTarget.style.backgroundImage = 'linear-gradient(120deg, var(--button-secondary-hover-bg), var(--accent-to))';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 10px 20px -8px var(--shadow-color)';
              e.currentTarget.style.backgroundImage = 'linear-gradient(120deg, var(--button-secondary-bg), var(--accent-to))';
            }}
            title="Edit notification"
          >
            <FaEdit className="w-3 h-3 mr-1" />
            Edit
          </button>
          {notification.isRead ? (
            <button
              onClick={handleMarkUnread}
              className="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 transition-transform duration-150"
              style={{
                backgroundImage: 'linear-gradient(120deg, var(--button-secondary-bg), var(--accent-to))',
                color: 'var(--button-primary-text)',
                boxShadow: '0 10px 20px -8px var(--shadow-color)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-1px)';
                e.currentTarget.style.boxShadow = '0 12px 24px -8px var(--shadow-color)';
                e.currentTarget.style.backgroundImage = 'linear-gradient(120deg, var(--button-secondary-hover-bg), var(--accent-to))';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 10px 20px -8px var(--shadow-color)';
                e.currentTarget.style.backgroundImage = 'linear-gradient(120deg, var(--button-secondary-bg), var(--accent-to))';
              }}
              title="Mark as unread"
            >
              <FaEnvelope className="w-3 h-3 mr-1" />
              Unread
            </button>
          ) : (
            <button
              onClick={handleMarkRead}
              className="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 transition-transform duration-150"
              style={{
                backgroundImage: 'linear-gradient(120deg, var(--button-secondary-bg), var(--accent-to))',
                color: 'var(--button-primary-text)',
                boxShadow: '0 10px 20px -8px var(--shadow-color)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-1px)';
                e.currentTarget.style.boxShadow = '0 12px 24px -8px var(--shadow-color)';
                e.currentTarget.style.backgroundImage = 'linear-gradient(120deg, var(--button-secondary-hover-bg), var(--accent-to))';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 10px 20px -8px var(--shadow-color)';
                e.currentTarget.style.backgroundImage = 'linear-gradient(120deg, var(--button-secondary-bg), var(--accent-to))';
              }}
              title="Mark as read"
            >
              <FaCheck className="w-3 h-3 mr-1" />
              Read
            </button>
          )}
          <button
            onClick={handleDelete}
            className="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 transition-transform duration-150"
            style={{
              backgroundImage: 'linear-gradient(120deg, var(--button-danger-bg), #ef4444)',
              color: 'var(--button-primary-text)',
              boxShadow: '0 10px 20px -8px rgba(220, 38, 38, 0.45)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-1px)';
              e.currentTarget.style.boxShadow = '0 12px 24px -8px rgba(220, 38, 38, 0.55)';
              e.currentTarget.style.backgroundImage = 'linear-gradient(120deg, var(--button-danger-hover-bg), #ef4444)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 10px 20px -8px rgba(220, 38, 38, 0.45)';
              e.currentTarget.style.backgroundImage = 'linear-gradient(120deg, var(--button-danger-bg), #ef4444)';
            }}
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

