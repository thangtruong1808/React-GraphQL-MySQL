import React from 'react';
import { FaCalendarAlt, FaEdit, FaEnvelope, FaIdBadge, FaTrash, FaUser } from 'react-icons/fa';
import { User } from '../../types/userManagement';
import { formatDate } from './usersUtils';
import { formatRoleForDisplay } from '../../utils/roleFormatter';

interface UsersTableRowProps {
  user: User;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
}

/**
 * Users Table Row Component
 * Displays individual user row with actions
 */
const UsersTableRow: React.FC<UsersTableRowProps> = ({ user, onEdit, onDelete }) => {
  // Handle edit click
  const handleEdit = () => {
    onEdit(user);
  };

  // Handle delete click
  const handleDelete = () => {
    onDelete(user);
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
      key={user.id}
      className="transition-colors duration-150"
      style={{ backgroundColor: 'var(--table-row-bg)', borderBottomColor: 'var(--border-color)', borderBottomWidth: 1 }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* ID Column - Hidden on mobile */}
      <td className="hidden lg:table-cell px-4 py-4 whitespace-nowrap text-sm text-left" style={{ color: 'var(--table-text-primary)' }}>
        {user.id}
      </td>

      {/* First Name Column */}
      <td className="px-4 py-4 whitespace-nowrap text-sm text-left" style={{ color: 'var(--table-text-primary)' }}>
        <div className="flex items-center space-x-2">
          <FaIdBadge className="w-3 h-3" style={{ color: 'var(--text-muted)' }} />
          <span>{user.firstName}</span>
        </div>
      </td>

      {/* Last Name Column - Hidden on small screens */}
      <td className="hidden sm:table-cell px-4 py-4 whitespace-nowrap text-sm text-left" style={{ color: 'var(--table-text-primary)' }}>
        <div className="flex items-center space-x-2">
          <FaIdBadge className="w-3 h-3" style={{ color: 'var(--text-muted)' }} />
          <span>{user.lastName}</span>
        </div>
      </td>

      {/* Email Column */}
      <td className="px-4 py-4 whitespace-nowrap text-sm text-left" style={{ color: 'var(--table-text-primary)' }}>
        <div className="flex items-center space-x-2">
          <FaEnvelope className="w-3 h-3" style={{ color: 'var(--text-muted)' }} />
          <span>{user.email}</span>
        </div>
      </td>

      {/* Role Column */}
      <td className="px-4 py-4 whitespace-nowrap text-left">
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium" style={{ backgroundColor: 'var(--badge-neutral-bg)', color: 'var(--badge-neutral-text)' }}>
          {formatRoleForDisplay(user.role)}
        </span>
      </td>

      {/* Created Date Column - Hidden on extra small screens */}
      <td className="hidden xs:table-cell px-4 py-4 whitespace-nowrap text-sm text-left" style={{ color: 'var(--table-text-secondary)' }}>
        <div className="flex items-center space-x-1">
          <FaCalendarAlt className="w-3 h-3" style={{ color: 'var(--text-muted)' }} />
          <span>{formatDate(user.createdAt)}</span>
        </div>
      </td>

      {/* Updated Date Column - Hidden on mobile and tablet */}
      <td className="hidden lg:table-cell px-4 py-4 whitespace-nowrap text-sm text-left" style={{ color: 'var(--table-text-secondary)' }}>
        <div className="flex items-center space-x-1">
          <FaCalendarAlt className="w-3 h-3" style={{ color: 'var(--text-muted)' }} />
          <span>{formatDate(user.updatedAt)}</span>
        </div>
      </td>

      {/* Actions Column */}
      <td className="px-4 py-4 whitespace-nowrap text-left">
        <div className="flex justify-start space-x-2">
          {/* Edit button */}
          <button
            onClick={handleEdit}
            className="inline-flex items-center px-3 py-1.5 border text-xs font-medium rounded-md transition-colors duration-150 shadow-sm"
            style={{ backgroundColor: 'var(--button-secondary-bg)', color: 'var(--button-primary-text)', borderColor: 'var(--border-color)', borderWidth: 1 }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--button-secondary-hover-bg)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'var(--button-secondary-bg)'; }}
            title="Edit user"
          >
            <FaEdit className="w-3 h-3 mr-1" />
            Edit
          </button>

          {/* Delete button */}
          <button
            onClick={handleDelete}
            className="inline-flex items-center px-3 py-1.5 border text-xs font-medium rounded-md transition-colors duration-150 shadow-sm"
            style={{ backgroundColor: 'var(--button-danger-bg)', color: 'var(--button-primary-text)', borderColor: 'var(--border-color)', borderWidth: 1 }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--button-danger-hover-bg)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'var(--button-danger-bg)'; }}
            title="Delete user"
          >
            <FaTrash className="w-3 h-3 mr-1" />
            Delete
          </button>
        </div>
      </td>
    </tr>
  );
};

export default UsersTableRow;

