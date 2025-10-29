import React, { useCallback } from 'react';
import { ACTIVITY_LIMITS } from '../../constants/activityManagement';
import { ActivitySearchInputProps } from '../../types/activityManagement';

/**
 * Activity Search Input Component
 * Provides search functionality for activity management
 * Features clear button and loading state indicators
 */
const ActivitySearchInput: React.FC<ActivitySearchInputProps> = ({
  value,
  onChange,
  placeholder = 'Search activities...',
  loading = false,
}) => {

  // Handle clear search
  const handleClear = useCallback(() => {
    onChange('');
  }, [onChange]);

  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <svg
          className="h-5 w-5 text-gray-400 dark:text-gray-500 [data-theme='brand']:text-purple-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        maxLength={ACTIVITY_LIMITS.MAX_ACTION_LENGTH}
        className="block w-full pl-10 pr-10 py-3 border border-gray-300 dark:border-gray-600 [data-theme='brand']:border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors duration-200 bg-white dark:bg-gray-700 [data-theme='brand']:bg-white text-gray-900 dark:text-white [data-theme='brand']:text-gray-900 placeholder-gray-500 dark:placeholder-gray-400 [data-theme='brand']:placeholder-purple-600 disabled:opacity-60 disabled:cursor-not-allowed"
        disabled={loading}
      />
      {value && (
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
          <button
            type="button"
            onClick={handleClear}
            className="text-gray-400 dark:text-gray-500 [data-theme='brand']:text-purple-500 hover:text-gray-600 dark:hover:text-gray-400 [data-theme='brand']:hover:text-purple-600 focus:outline-none focus:text-gray-600 dark:focus:text-gray-400 [data-theme='brand']:focus:text-purple-600 transition-colors duration-200"
            disabled={loading}
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      )}
      {loading && (
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600 dark:border-purple-400 [data-theme='brand']:border-purple-700"></div>
        </div>
      )}
    </div>
  );
};

export default ActivitySearchInput;
