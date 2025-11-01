import React from 'react';
import { FaUser, FaCheck, FaExclamationTriangle } from 'react-icons/fa';

interface UserFirstNameFieldProps {
  value: string;
  error?: string;
  touched?: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
  disabled: boolean;
}

/**
 * User First Name Field Component
 * Displays first name input field with validation feedback
 */
const UserFirstNameField: React.FC<UserFirstNameFieldProps> = ({ value, error, touched, onChange, onBlur, disabled }) => {
  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e);
  };

  // Handle input blur
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    onBlur(e);
  };

  return (
    <div>
      <label htmlFor="firstName" className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
        First Name *
      </label>
      <div className="relative">
        <input
          type="text"
          id="firstName"
          name="firstName"
          value={value}
          onChange={handleChange}
          disabled={disabled}
          className={`block w-full pl-10 pr-4 py-3 border rounded-xl shadow-sm focus:outline-none transition-all duration-200 ${error ? 'border-red-500' : ''} disabled:opacity-50 disabled:cursor-not-allowed`}
          style={{
            backgroundColor: 'var(--input-bg)',
            color: 'var(--text-primary)',
            borderColor: error ? '#ef4444' : 'var(--border-color)',
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
          placeholder="John"
        />
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <FaUser className={`h-4 w-4 ${error ? 'text-red-400' : ''}`} style={!error ? { color: 'var(--text-primary)' } : {}} />
        </div>
        {value && !error && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            <FaCheck className="h-4 w-4 text-green-600" />
          </div>
        )}
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

export default UserFirstNameField;

