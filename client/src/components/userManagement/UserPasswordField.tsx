import React from 'react';
import { FaLock, FaCheck, FaExclamationTriangle, FaEye, FaEyeSlash } from 'react-icons/fa';

interface UserPasswordFieldProps {
  value: string;
  error?: string;
  touched?: boolean;
  showPassword: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
  onToggleVisibility: () => void;
  disabled: boolean;
}

/**
 * User Password Field Component
 * Displays password input field with visibility toggle and validation feedback
 */
const UserPasswordField: React.FC<UserPasswordFieldProps> = ({ value, error, touched, showPassword, onChange, onBlur, onToggleVisibility, disabled }) => {
  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e);
  };

  // Handle input blur
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    onBlur(e);
  };

  // Handle toggle password visibility click
  const handleToggleVisibility = () => {
    onToggleVisibility();
  };

  return (
    <div>
      <label htmlFor="password" className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
        Password *
      </label>
      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          id="password"
          name="password"
          value={value}
          onChange={handleChange}
          disabled={disabled}
          className={`block w-full pl-10 pr-12 py-3 border rounded-xl shadow-sm focus:outline-none transition-all duration-200 ${error ? 'border-red-500' : ''} disabled:opacity-50 disabled:cursor-not-allowed`}
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
          placeholder="Minimum 8 characters"
        />
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <FaLock className={`h-4 w-4 ${error ? 'text-red-400' : ''}`} style={!error ? { color: 'var(--text-primary)' } : {}} />
        </div>
        {/* Password toggle button */}
        <button
          type="button"
          onClick={handleToggleVisibility}
          disabled={disabled}
          className="absolute inset-y-0 right-0 pr-3 flex items-center focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          style={{ color: 'var(--text-muted)' }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = 'var(--text-secondary)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = 'var(--text-muted)';
          }}
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? (
            <FaEyeSlash className="h-4 w-4" />
          ) : (
            <FaEye className="h-4 w-4" />
          )}
        </button>
        {value && !error && !showPassword && (
          <div className="absolute inset-y-0 right-8 pr-3 flex items-center">
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
      {value && value.length >= 8 && !error && (
        <div className="mt-2 flex items-center text-sm text-green-600">
          <FaCheck className="h-3 w-3 mr-1" />
          Password meets requirements
        </div>
      )}
    </div>
  );
};

export default UserPasswordField;

