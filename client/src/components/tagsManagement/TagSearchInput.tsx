import React, { useState, useEffect, useCallback } from 'react';
import { TAGS_LIMITS, TAGS_SEARCH_DEBOUNCE_DELAY } from '../../constants/tagsManagement';

/**
 * Tag Search Input Component
 * Provides debounced search functionality for tags management
 * Features clear button and loading state indicators
 */
interface TagSearchInputProps {
  onSearch: (searchTerm: string) => void;
  placeholder?: string;
  loading?: boolean;
}

const TagSearchInput: React.FC<TagSearchInputProps> = ({
  onSearch,
  placeholder = 'Search tags...',
  loading = false,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  /**
   * Debounce search input to avoid excessive API calls
   * Updates parent component after 1 second of no typing
   */
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(searchTerm);
    }, TAGS_SEARCH_DEBOUNCE_DELAY);

    return () => clearTimeout(timer);
  }, [searchTerm, onSearch]);

  // Handle clear search
  const handleClear = useCallback(() => {
    setSearchTerm('');
  }, []);

  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <svg
          className="h-5 w-5 text-gray-400"
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
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder={placeholder}
        maxLength={TAGS_LIMITS.MAX_NAME_LENGTH}
        className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 bg-white text-gray-900 placeholder-gray-500 disabled:opacity-60 disabled:cursor-not-allowed"
        disabled={loading}
      />
      {searchTerm && (
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
          <button
            type="button"
            onClick={handleClear}
            className="text-gray-400 hover:text-gray-600 focus:outline-none focus:text-gray-600 transition-colors duration-200"
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
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600"></div>
        </div>
      )}
    </div>
  );
};

export default TagSearchInput;
