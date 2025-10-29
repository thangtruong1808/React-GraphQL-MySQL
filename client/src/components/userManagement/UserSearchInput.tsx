import React, { useState, useEffect, useCallback } from 'react';
import { FaSearch } from 'react-icons/fa';
import { UserSearchInputProps } from '../../types/userManagement';
import { USER_SEARCH_DEBOUNCE_DELAY } from '../../constants/userManagement';

/**
 * User Search Input Component
 * Provides search functionality for users with debounced input
 * Searches by first name, last name, or email
 * 
 * CALLED BY: UsersPage component
 * SCENARIOS: Real-time search with debouncing for performance
 */
const UserSearchInput: React.FC<UserSearchInputProps> = ({
  value,
  onChange,
  placeholder = "Search users by name or email...",
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
    }, USER_SEARCH_DEBOUNCE_DELAY);

    return () => clearTimeout(timer);
  }, [localValue, value, onChange]);

  // Sync local value with prop value
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  /**
   * Handle input change
   * Updates local state for immediate UI feedback
   */
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalValue(e.target.value);
  }, []);

  /**
   * Handle clear search
   * Clears both local and parent state
   */
  const handleClearSearch = useCallback(() => {
    setLocalValue('');
    onChange('');
  }, [onChange]);

  return (
    <div className="relative">
      {/* Search input with icon */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <FaSearch
            className={`h-5 w-5 ${loading ? 'text-blue-500 animate-spin' : 'text-gray-400 dark:text-gray-500 [data-theme="brand"]:text-purple-500'}`}
            aria-hidden="true"
          />
        </div>

        <input
          type="text"
          value={localValue}
          onChange={handleInputChange}
          placeholder={placeholder}
          disabled={loading}
          className="block w-full pl-10 pr-10 py-3 border border-gray-300 dark:border-gray-600 [data-theme='brand']:border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 bg-white dark:bg-gray-700 [data-theme='brand']:bg-white text-gray-900 dark:text-white [data-theme='brand']:text-gray-900 placeholder-gray-500 dark:placeholder-gray-400 [data-theme='brand']:placeholder-purple-600 disabled:opacity-60 disabled:cursor-not-allowed"
        />

        {/* Clear button */}
        {localValue && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            <button
              type="button"
              onClick={handleClearSearch}
              disabled={loading}
              className="text-gray-400 dark:text-gray-500 [data-theme='brand']:text-purple-500 hover:text-gray-600 dark:hover:text-gray-400 [data-theme='brand']:hover:text-purple-600 focus:outline-none focus:text-gray-600 dark:focus:text-gray-400 [data-theme='brand']:focus:text-purple-600
                         disabled:cursor-not-allowed transition-colors duration-200"
              aria-label="Clear search"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}
      </div>

    </div>
  );
};

export default UserSearchInput;
