import React from 'react';
import { User } from '../../types/userManagement';

interface EditUserInfoProps {
  user: User;
}

/**
 * Edit User Info Component
 * Displays user ID and created date information
 */
const EditUserInfo: React.FC<EditUserInfoProps> = ({ user }) => {
  // Format created date
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="mb-6 p-4 rounded-lg" style={{ backgroundColor: 'var(--table-row-bg)' }}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>
            User ID
          </label>
          <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
            {user.id}
          </p>
        </div>
        <div>
          <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>
            Created Date
          </label>
          <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
            {formatDate(user.createdAt)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default EditUserInfo;

