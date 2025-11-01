import React from 'react';
import { FaTasks, FaCheck, FaExclamationTriangle } from 'react-icons/fa';

interface TaskTitleFieldProps {
  value: string;
  error?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled: boolean;
}

/**
 * Task Title Field Component
 * Displays title input field with validation feedback
 */
const TaskTitleField: React.FC<TaskTitleFieldProps> = ({ value, error, onChange, disabled }) => {
  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e);
  };

  return (
    <div>
      <label htmlFor="title" className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
        <FaTasks className="inline h-4 w-4 mr-2" style={{ color: 'var(--accent-from)' }} />
        Task Title *
      </label>
      <div className="relative">
        <input
          type="text"
          id="title"
          name="title"
          value={value}
          onChange={handleChange}
          disabled={disabled}
          className={`block w-full pl-10 pr-4 py-3 border rounded-xl shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
          style={{
            backgroundColor: error ? 'var(--badge-danger-bg)' : 'var(--input-bg)',
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
            e.currentTarget.style.borderColor = error ? '#ef4444' : 'var(--border-color)';
            e.currentTarget.style.boxShadow = 'none';
          }}
          placeholder="Enter task title"
        />
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <FaTasks className={`h-4 w-4 ${error ? 'text-red-400' : 'text-gray-400'}`} />
        </div>
        {value && !error && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            <FaCheck className="h-4 w-4" style={{ color: 'var(--button-primary-bg)' }} />
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

export default TaskTitleField;

