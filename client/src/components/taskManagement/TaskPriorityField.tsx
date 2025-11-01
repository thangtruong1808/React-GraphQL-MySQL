import React from 'react';
import { FaFlag } from 'react-icons/fa';
import { TASK_PRIORITY_OPTIONS } from '../../constants/taskManagement';

interface TaskPriorityFieldProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  disabled: boolean;
}

/**
 * Task Priority Field Component
 * Displays priority select field with options
 */
const TaskPriorityField: React.FC<TaskPriorityFieldProps> = ({ value, onChange, disabled }) => {
  // Handle select change
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(e);
  };

  return (
    <div>
      <label htmlFor="priority" className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
        <FaFlag className="inline h-4 w-4 mr-2" style={{ color: 'var(--accent-from)' }} />
        Priority *
      </label>
      <div className="relative">
        <select
          id="priority"
          name="priority"
          value={value}
          onChange={handleChange}
          disabled={disabled}
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
          {TASK_PRIORITY_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <FaFlag className="h-4 w-4" style={{ color: 'var(--text-muted)' }} />
        </div>
      </div>
    </div>
  );
};

export default TaskPriorityField;

