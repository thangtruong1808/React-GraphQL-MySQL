import React from 'react';

/**
 * Search Input Component
 * Handles search input with clear functionality and submit button
 * Provides search input field with search and clear icons
 */

// Props interface for SearchInput component
interface SearchInputProps {
  searchQuery: string;
  onSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onClearSearch: () => void;
  onSubmit: (event: React.FormEvent) => void;
  hasFilters: boolean;
}

/**
 * SearchInput Component
 * Renders search input field with search and clear functionality
 * Includes search icon, clear button, and submit button
 */
const SearchInput: React.FC<SearchInputProps> = ({
  searchQuery,
  onSearchChange,
  onClearSearch,
  onSubmit,
  hasFilters
}) => {
  return (
    <div className="p-4 border-b border-gray-200">
      <form onSubmit={onSubmit}>
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={onSearchChange}
            placeholder="Search by member name ."
            className={`w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all  ${searchQuery ? 'pr-32' : 'pr-20'
              }`}
          />
          {/* Search icon */}
          <svg
            className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          {/* Clear icon */}
          {searchQuery && (
            <button
              type="button"
              onClick={onClearSearch}
              className="absolute right-20 top-1/2 transform -translate-y-1/2 p-1.5 hover:bg-gray-100 rounded-full transition-colors z-10 group"
              aria-label="Clear search"
              title="Clear search"
            >
              <svg className="w-4 h-4 text-gray-500 group-hover:text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
          {/* Search button */}
          <button
            type="submit"
            disabled={!searchQuery.trim() && !hasFilters}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 px-3 py-1.5 bg-purple-600 text-white text-sm rounded-md hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors z-10"
          >
            Search
          </button>
        </div>
      </form>
    </div>
  );
};

export default SearchInput;
