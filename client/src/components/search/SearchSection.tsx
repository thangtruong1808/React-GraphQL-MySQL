import React from 'react';

/**
 * Search Section Component
 * Reusable component for displaying search results in different sections
 * Follows React best practices with proper TypeScript interfaces
 */

interface SearchSectionProps {
  title: string;
  results: any[];
  loading: boolean;
  hasQuery: boolean;
  emptyMessage: string;
  renderItem: (item: any) => React.ReactNode;
}

/**
 * SearchSection Component
 * Renders a section with title, loading state, and search results
 */
const SearchSection: React.FC<SearchSectionProps> = ({
  title,
  results,
  loading,
  hasQuery,
  emptyMessage,
  renderItem
}) => {
  // Show section only if there's a query or results
  if (!hasQuery && results.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      {/* Section title */}
      <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
        {title}
        {results.length > 0 && (
          <span className="ml-2 text-xs text-gray-500">({results.length})</span>
        )}
      </h3>

      {/* Loading state */}
      {loading && (
        <div className="flex items-center justify-center py-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600"></div>
          <span className="ml-2 text-sm text-gray-500">Searching...</span>
        </div>
      )}

      {/* Results */}
      {!loading && hasQuery && (
        <div className="space-y-1">
          {results.length > 0 ? (
            <div className="space-y-1">
              {results.map(renderItem)}
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-sm text-gray-500">{emptyMessage}</p>
            </div>
          )}
        </div>
      )}

      {/* No query state */}
      {!hasQuery && (
        <div className="text-center py-4">
          <p className="text-sm text-gray-400">
            Type at least 2 characters to search {title.toLowerCase()}
          </p>
        </div>
      )}
    </div>
  );
};

export default SearchSection;
