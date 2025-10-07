import React, { useState, useEffect } from 'react';
import { FaSearch } from 'react-icons/fa';
import { ProjectSearchInputProps } from '../../types/projectManagement';
import { PROJECT_SEARCH_DEBOUNCE_DELAY } from '../../constants/projectManagement';

/**
 * Project Search Input Component
 * Provides search functionality for projects with debounced input
 * Includes loading state and clear functionality
 * 
 * CALLED BY: ProjectsPage component
 * SCENARIOS: Searching projects by name or description
 */
const ProjectSearchInput: React.FC<ProjectSearchInputProps> = ({
  value,
  onChange,
  placeholder = 'Search projects by name or description...',
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
    }, PROJECT_SEARCH_DEBOUNCE_DELAY);

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
        className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 disabled:bg-gray-50 disabled:cursor-not-allowed text-sm transition-colors duration-200"
        placeholder={placeholder}
        disabled={loading}
      />
      {localValue && (
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
          <button
            type="button"
            onClick={handleClear}
            disabled={loading}
            className="text-gray-400 hover:text-gray-600 focus:outline-none focus:text-gray-600 disabled:cursor-not-allowed transition-colors duration-200"
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

export default ProjectSearchInput;
