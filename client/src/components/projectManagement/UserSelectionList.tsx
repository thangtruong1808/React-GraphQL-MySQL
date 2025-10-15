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
      <div className="border border-gray-300 rounded-md max-h-48 overflow-y-auto">
        <div className="p-4 text-center text-gray-500">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600 mx-auto mb-2"></div>
          Loading users...
        </div>
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="border border-gray-300 rounded-md max-h-48 overflow-y-auto">
        <div className="p-4 text-center text-gray-500">
          {searchTerm ? 'No users found matching your search.' : 'No available users to add.'}
        </div>
      </div>
    );
  }

  return (
    <div className="border border-gray-300 rounded-md max-h-48 overflow-y-auto">
      <div className="divide-y divide-gray-200">
        {users.map((user) => (
          <div
            key={user.id}
            className={`p-3 cursor-pointer hover:bg-gray-50 transition-colors ${selectedUserId === user.id ? 'bg-purple-50 border-l-4 border-purple-600' : ''
              }`}
            onClick={() => onUserSelect(user.id)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="flex-shrink-0 h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                  <span className="text-sm font-medium text-purple-600">
                    {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                  </span>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-900">
                    {user.firstName} {user.lastName}
                  </div>
                  <div className="text-sm text-gray-500">{user.email}</div>
                </div>
              </div>
              <div className="flex items-center">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
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
