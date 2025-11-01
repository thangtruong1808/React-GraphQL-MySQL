import React from 'react';
import { FaCalendarAlt } from 'react-icons/fa';

interface TaskDueDateFieldProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled: boolean;
}

/**
 * Task Due Date Field Component
 * Displays due date input field
 */
const TaskDueDateField: React.FC<TaskDueDateFieldProps> = ({ value, onChange, disabled }) => {
  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e);
  };

  return (
    <div>
      <label htmlFor="dueDate" className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
        <FaCalendarAlt className="inline h-4 w-4 mr-2" style={{ color: 'var(--accent-from)' }} />
        Due Date
      </label>
      <div className="relative">
        <input
          type="date"
          id="dueDate"
          name="dueDate"
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
        />
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <FaCalendarAlt className="h-4 w-4" style={{ color: 'var(--text-muted)' }} />
        </div>
      </div>
      <p className="mt-1 text-xs" style={{ color: 'var(--text-secondary)' }}>
        Optional due date for this task
      </p>
    </div>
  );
};

export default TaskDueDateField;

