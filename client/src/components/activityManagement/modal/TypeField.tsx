import React from 'react';
import { FaExclamationTriangle } from 'react-icons/fa';
import { ACTIVITY_TYPE_OPTIONS } from '../../../constants/activityManagement';

interface TypeFieldProps {
  value: string;
  error?: string;
  loading: boolean;
  onChange: (value: string) => void;
}

/**
 * Type Field Component
 * Select dropdown for activity type
 */
const TypeField: React.FC<TypeFieldProps> = ({
  value,
  error,
  loading,
  onChange
}) => {
  return (
    <div>
      <label htmlFor="type" className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
        Activity Type *
      </label>
      <div className="relative">
        <select
          id="type"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="block w-full px-4 py-3 border rounded-xl shadow-sm focus:outline-none sm:text-sm transition-colors"
          style={{ backgroundColor: 'var(--input-bg)', color: 'var(--text-primary)', border: `1px solid ${error ? '#ef4444' : 'var(--border-color)'}` }}
          onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--accent-from)'; e.currentTarget.style.boxShadow = '0 0 0 2px var(--accent-ring)'; }}
          onBlur={(e) => { e.currentTarget.style.borderColor = error ? '#ef4444' : 'var(--border-color)'; e.currentTarget.style.boxShadow = 'none'; }}
          disabled={loading}
        >
          {ACTIVITY_TYPE_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error && (
          <div className="mt-2 flex items-center text-sm" style={{ color: '#ef4444' }}>
            <FaExclamationTriangle className="h-4 w-4 mr-1" />
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default TypeField;

