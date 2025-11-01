import React from 'react';
import { FaUserTag, FaExclamationTriangle } from 'react-icons/fa';
import { USER_ROLE_OPTIONS } from '../../constants/userManagement';

interface UserRoleFieldProps {
  value: string;
  error?: string;
  touched?: boolean;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onBlur: (e: React.FocusEvent<HTMLSelectElement>) => void;
  disabled: boolean;
}

/**
 * User Role Field Component
 * Displays role select field with validation feedback
 */
const UserRoleField: React.FC<UserRoleFieldProps> = ({ value, error, touched, onChange, onBlur, disabled }) => {
  // Handle select change
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(e);
  };

  // Handle select blur
  const handleBlur = (e: React.FocusEvent<HTMLSelectElement>) => {
    onBlur(e);
  };

  return (
    <div>
      <label htmlFor="role" className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
        Role *
      </label>
      <div className="relative">
        <select
          id="role"
          name="role"
          value={value}
          onChange={handleChange}
          disabled={disabled}
          className={`block w-full pl-10 pr-4 py-3 border rounded-xl shadow-sm focus:outline-none transition-all duration-200 appearance-none ${error ? 'border-red-500' : ''} disabled:opacity-50 disabled:cursor-not-allowed`}
          style={{
            backgroundColor: 'var(--input-bg)',
            color: 'var(--text-primary)',
            borderColor: error ? '#ef4444' : 'var(--border-color)'
          }}
          onFocus={(e) => {
            if (!error) {
              e.currentTarget.style.borderColor = 'var(--accent-from)';
              e.currentTarget.style.boxShadow = '0 0 0 2px var(--accent-ring)';
            }
          }}
          onBlur={(e) => {
            handleBlur(e);
            e.currentTarget.style.borderColor = error ? '#ef4444' : 'var(--border-color)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          {USER_ROLE_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <FaUserTag className={`h-4 w-4 ${error ? 'text-red-400' : ''}`} style={!error ? { color: 'var(--text-primary)' } : {}} />
        </div>
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
          <svg className="h-4 w-4" style={{ color: 'var(--text-muted)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
      {error && (
        <div className="mt-2 flex items-center text-sm" style={{ color: '#ef4444' }}>
          <FaExclamationTriangle className="h-4 w-4 mr-1" />
          {error}
        </div>
      )}
    </div>
  );
};

export default UserRoleField;

