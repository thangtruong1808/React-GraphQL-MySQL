import React from 'react';
import { FaUser } from 'react-icons/fa';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  role: string;
}

interface ProjectOwnerFieldProps {
  value: string;
  users?: User[];
  loading: boolean;
  usersLoading: boolean;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

/**
 * Project Owner Field Component
 * Select field for project owner (optional)
 */
const ProjectOwnerField: React.FC<ProjectOwnerFieldProps> = ({
  value,
  users,
  loading,
  usersLoading,
  onChange
}) => {
  return (
    <div>
      <label htmlFor="ownerId" className="block text-sm font-semibold text-gray-700 mb-2">
        <FaUser className="inline h-4 w-4 mr-2 text-purple-600" />
        Project Owner (Optional)
      </label>
      <div className="relative">
        <select
          id="ownerId"
          name="ownerId"
          value={value}
          onChange={onChange}
          disabled={loading || usersLoading}
          className="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed hover:border-gray-400"
        >
          <option value="">Select a project owner...</option>
          {users?.map((user) => (
            <option key={user.id} value={user.id}>
              {user.firstName} {user.lastName} - {user.role}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <FaUser className={`h-4 w-4 ${usersLoading ? 'text-gray-300' : 'text-gray-400'}`} />
        </div>
        {usersLoading && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-purple-500 border-t-transparent"></div>
          </div>
        )}
      </div>
      <p className="mt-1 text-xs text-gray-500">
        Select a user to assign as the project owner
      </p>
    </div>
  );
};

export default ProjectOwnerField;

