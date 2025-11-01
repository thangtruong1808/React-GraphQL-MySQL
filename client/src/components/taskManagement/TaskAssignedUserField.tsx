import React from 'react';
import { FaUser } from 'react-icons/fa';
import { formatRoleForDisplay } from '../../utils/roleFormatter';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  role: string;
}

interface TaskAssignedUserFieldProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  disabled: boolean;
  loading: boolean;
  users?: User[];
}

/**
 * Task Assigned User Field Component
 * Displays assigned user select field with options from database
 */
const TaskAssignedUserField: React.FC<TaskAssignedUserFieldProps> = ({ value, onChange, disabled, loading, users = [] }) => {
  // Handle select change
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(e);
  };

  return (
    <div>
      <label htmlFor="assignedUserId" className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
        <FaUser className="inline h-4 w-4 mr-2" style={{ color: 'var(--accent-from)' }} />
        Assigned User (Optional)
      </label>
      <div className="relative">
        <select
          id="assignedUserId"
          name="assignedUserId"
          value={value}
          onChange={handleChange}
          disabled={disabled || loading}
          className="block w-full pl-10 pr-4 py-3 border rounded-xl shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            backgroundColor: 'var(--input-bg)',
            color: 'var(--text-primary)',
            borderColor: 'var(--border-color)',
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = 'var(--accent-from)';
            e.currentTarget.style.boxShadow = '0 0 0 2px var(--accent-ring)';
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = 'var(--border-color)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          <option value="">Select a user...</option>
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.firstName} {user.lastName} - {formatRoleForDisplay(user.role)}
            </option>
          ))}
          {!loading && users.length === 0 && (
            <option value="" disabled>No users available</option>
          )}
        </select>
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <FaUser className={`h-4 w-4 ${loading ? 'text-gray-300' : 'text-gray-400'}`} />
        </div>
        {loading && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-t-transparent" style={{ borderColor: 'var(--accent-from)' }}></div>
          </div>
        )}
      </div>
      <p className="mt-1 text-xs" style={{ color: 'var(--text-secondary)' }}>
        Select a user to assign this task to
      </p>
    </div>
  );
};

export default TaskAssignedUserField;

