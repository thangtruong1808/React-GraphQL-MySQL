import React, { useState, useEffect } from 'react';
import { FaSearch } from 'react-icons/fa';
import { TaskSearchInputProps } from '../../types/taskManagement';

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
   * Updates parent component after 300ms of no typing
   */
  useEffect(() => {
    const timer = setTimeout(() => {
      if (localValue !== value) {
        onChange(localValue);
      }
    }, 300);

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
        <FaSearch className="h-5 w-5 text-gray-400" aria-hidden="true" />
      </div>
      <input
        type="text"
        value={localValue}
        onChange={handleInputChange}
        className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
        placeholder={placeholder}
        disabled={loading}
      />
      {localValue && (
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
          <button
            type="button"
            onClick={handleClear}
            disabled={loading}
            className="text-gray-400 hover:text-gray-600 focus:outline-none focus:text-gray-600 transition ease-in-out duration-150"
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
