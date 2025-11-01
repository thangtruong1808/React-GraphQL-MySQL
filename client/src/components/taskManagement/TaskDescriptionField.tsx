import React from 'react';
import { FaAlignLeft, FaCheck, FaExclamationTriangle } from 'react-icons/fa';

interface TaskDescriptionFieldProps {
  value: string;
  error?: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  disabled: boolean;
}

/**
 * Task Description Field Component
 * Displays description textarea field with validation feedback
 */
const TaskDescriptionField: React.FC<TaskDescriptionFieldProps> = ({ value, error, onChange, disabled }) => {
  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e);
  };

  return (
    <div>
      <label htmlFor="description" className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
        <FaAlignLeft className="inline h-4 w-4 mr-2" style={{ color: 'var(--accent-from)' }} />
        Description *
      </label>
      <div className="relative">
        <textarea
          id="description"
          name="description"
          value={value}
          onChange={handleChange}
          disabled={disabled}
          rows={4}
          className={`block w-full pl-10 pr-4 py-3 border rounded-xl shadow-sm transition-colors resize-none disabled:opacity-50 disabled:cursor-not-allowed`}
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
          placeholder="Enter task description"
        />
        <div className="absolute top-3 left-3 flex items-start pointer-events-none">
          <FaAlignLeft className={`h-4 w-4 ${error ? 'text-red-400' : 'text-gray-400'}`} />
        </div>
        {value && !error && (
          <div className="absolute top-3 right-3 flex items-start">
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

export default TaskDescriptionField;

