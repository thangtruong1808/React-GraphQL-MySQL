import React from 'react';
import { formatRoleForDisplay } from '../../utils/roleFormatter';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

interface UserSelectionListProps {
  users: User[];
  selectedUserId: string;
  onUserSelect: (userId: string) => void;
  loading: boolean;
  searchTerm: string;
}

/**
 * UserSelectionList Component
 * Displays a list of available users for selection
 * Shows user details and handles selection
 */
const UserSelectionList: React.FC<UserSelectionListProps> = ({
  users,
  selectedUserId,
  onUserSelect,
  loading,
  searchTerm
}) => {
  if (loading) {
    return (
      <div className="theme-border rounded-md max-h-64 overflow-y-auto">
        <div className="p-4 text-center theme-table-text-secondary">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 theme-button-primary mx-auto mb-2"></div>
          Loading users...
        </div>
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="theme-border rounded-md max-h-64 overflow-y-auto">
        <div className="p-4 text-center theme-table-text-secondary">
          {searchTerm ? 'No users found matching your search.' : 'No available users to add.'}
        </div>
      </div>
    );
  }

  return (
    <div className="theme-border rounded-md max-h-64 overflow-y-auto">
      <div className="theme-table-divide">
        {users.map((user) => (
          <div
            key={user.id}
            className={`p-3 cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/20 [data-theme='brand']:hover:bg-purple-100 transition-colors border-b theme-border-medium ${selectedUserId === user.id ? 'theme-tab-active-bg border-l-4 theme-tab-active-border' : ''
              }`}
            onClick={() => onUserSelect(user.id)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="flex-shrink-0 h-8 w-8 rounded-full theme-avatar-bg flex items-center justify-center mr-3 border theme-border-medium">
                  <span className="text-sm font-medium theme-avatar-text">
                    {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium theme-table-text-primary truncate">
                    {user.firstName} {user.lastName}
                  </div>
                  <div className="text-sm theme-table-text-secondary truncate">{user.email}</div>
                </div>
              </div>
              <div className="flex items-center ml-3">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium theme-badge-neutral border theme-border-medium">
                  {formatRoleForDisplay(user.role)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserSelectionList;
