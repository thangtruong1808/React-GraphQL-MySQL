import React, { useState, useEffect, useCallback } from 'react';
import { CommentSearchInputProps } from '../../types/commentManagement';
import { COMMENT_SEARCH_SETTINGS } from '../../constants/commentManagement';

/**
 * CommentSearchInput Component
 * Provides search functionality for comments with debouncing
 * Includes clear button and loading state
 */
const CommentSearchInput: React.FC<CommentSearchInputProps> = ({
  value,
  onChange,
  onSearch,
  placeholder = 'Search comments, authors, tasks, or projects...',
  loading = false,
}) => {
  const [localValue, setLocalValue] = useState(value);

  // Update local value when prop value changes
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  /**
   * Debounce search input to avoid excessive API calls
   * Updates parent component after 1 second of no typing
   */
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (localValue.length >= COMMENT_SEARCH_SETTINGS.MIN_SEARCH_LENGTH || localValue.length === 0) {
        onSearch(localValue);
      }
    }, COMMENT_SEARCH_SETTINGS.DEBOUNCE_DELAY);

    return () => clearTimeout(timeoutId);
  }, [localValue, onSearch]);

  // Handle input change
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setLocalValue(newValue);
    // Only call onChange if it's different from onSearch (for immediate updates)
    if (onChange !== onSearch) {
      onChange(newValue);
    }
  }, [onChange, onSearch]);

  // Handle clear button click
  const handleClear = useCallback(() => {
    setLocalValue('');
    // Only call onChange if it's different from onSearch (for immediate updates)
    if (onChange !== onSearch) {
      onChange('');
    }
    onSearch('');
  }, [onChange, onSearch]);

  // Handle enter key press for immediate search
  const handleKeyPress = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onSearch(localValue);
    }
  }, [localValue, onSearch]);

  return (
    <div className="relative">
      {/* Search Input */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            style={{ color: loading ? 'var(--accent-from)' : 'var(--text-muted)' }}
          >
            {loading ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            )}
          </svg>
        </div>

        <input
          type="text"
          value={localValue}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          placeholder={placeholder}
          className="block w-full pl-10 pr-10 py-3 border rounded-lg focus:outline-none transition-all duration-200"
          style={{ backgroundColor: 'var(--input-bg)', color: 'var(--text-primary)', borderColor: 'var(--border-color)' }}
          onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--accent-from)'; e.currentTarget.style.boxShadow = '0 0 0 2px var(--accent-ring)'; }}
          onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--border-color)'; e.currentTarget.style.boxShadow = 'none'; }}
          disabled={loading}
        />

        {/* Clear Button */}
        {localValue && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute inset-y-0 right-0 pr-3 flex items-center transition-colors duration-200"
            style={{ color: 'var(--text-muted)' }}
            onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--text-secondary)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-muted)'; }}
            disabled={loading}
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>

      {/* Search Hint */}
      {localValue.length > 0 && localValue.length < COMMENT_SEARCH_SETTINGS.MIN_SEARCH_LENGTH && (
        <p className="mt-1 text-sm" style={{ color: 'var(--text-secondary)' }}>
          Type at least {COMMENT_SEARCH_SETTINGS.MIN_SEARCH_LENGTH} characters to search
        </p>
      )}
    </div>
  );
};

export default CommentSearchInput;
