import React, { useState, useEffect } from 'react';
import { FaSearch } from 'react-icons/fa';
import { TaskSearchInputProps } from '../../types/taskManagement';
import { TASK_SEARCH_DEBOUNCE_DELAY } from '../../constants/taskManagement';

/**
 * Task Search Input Component
 * Provides search functionality for tasks with debounced input
 * Searches by task title and description
 * 
 * CALLED BY: TasksPage component
 * SCENARIOS: Searching tasks by title or description
 */
const TaskSearchInput: React.FC<TaskSearchInputProps> = ({
  value,
  onChange,
  placeholder = 'Search tasks by title or description...',
  loading = false
}) => {
  const [localValue, setLocalValue] = useState(value);

  /**
   * Debounce search input to avoid excessive API calls
   * Updates parent component after 1 second of no typing
   */
  useEffect(() => {
    const timer = setTimeout(() => {
      if (localValue !== value) {
        onChange(localValue);
      }
    }, TASK_SEARCH_DEBOUNCE_DELAY);

    return () => clearTimeout(timer);
  }, [localValue, value, onChange]);

  /**
   * Handle input change
   * Updates local state immediately for responsive UI
   */
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalValue(e.target.value);
  };

  /**
   * Handle clear button click
   * Clears both local and parent state
   */
  const handleClear = () => {
    setLocalValue('');
    onChange('');
  };

  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <FaSearch className="h-5 w-5" aria-hidden="true" style={{ color: 'var(--text-muted)' }} />
      </div>
      <input
        type="text"
        value={localValue}
        onChange={handleInputChange}
        className="block w-full pl-10 pr-10 py-3 border rounded-lg focus:outline-none transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
        style={{ backgroundColor: 'var(--input-bg)', color: 'var(--text-primary)', borderColor: 'var(--border-color)' }}
        onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--accent-from)'; e.currentTarget.style.boxShadow = '0 0 0 2px var(--accent-ring)'; }}
        onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--border-color)'; e.currentTarget.style.boxShadow = 'none'; }}
        placeholder={placeholder}
        disabled={loading}
      />
      {localValue && (
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
          <button
            type="button"
            onClick={handleClear}
            disabled={loading}
            className="focus:outline-none disabled:cursor-not-allowed transition-colors duration-200"
            style={{ color: 'var(--text-muted)' }}
            onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--text-secondary)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-muted)'; }}
            aria-label="Clear search"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
};

export default TaskSearchInput;
