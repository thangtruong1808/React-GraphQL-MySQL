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
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
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
        className="block w-full pl-12 pr-12 py-4 border rounded-xl focus:outline-none transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
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
        disabled={loading}
      />
      {searchTerm && !loading && (
        <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
          <button
            type="button"
            onClick={handleClear}
            className="p-1 rounded-full transition-colors duration-200"
            style={{ color: 'var(--text-muted)' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = 'var(--text-secondary)';
              e.currentTarget.style.backgroundColor = 'var(--table-row-hover-bg)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'var(--text-muted)';
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
            disabled={loading}
            title="Clear search"
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
        <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
          <div className="animate-spin rounded-full h-5 w-5 border-2 border-t-transparent" style={{ borderColor: 'var(--accent-from)', borderTopColor: 'transparent' }}></div>
        </div>
      )}
    </div>
  );
};

export default TagSearchInput;
