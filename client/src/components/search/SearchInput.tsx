import React from 'react';

/** Description: Search field with submit/clear controls for the drawer; Data created: None, handlers rely on parent state; Author: thangtruong */
interface SearchInputProps {
  searchQuery: string;
  onSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onClearSearch: () => void;
  onSubmit: (event: React.FormEvent) => void;
  hasFilters: boolean;
}

const SearchInput: React.FC<SearchInputProps> = ({
  searchQuery,
  onSearchChange,
  onClearSearch,
  onSubmit,
  hasFilters
}) => {
  return (
    <div className="p-4 border-b theme-border" style={{ backgroundColor: 'var(--card-bg)' }}>
      <form onSubmit={onSubmit}>
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={onSearchChange}
            placeholder="Search by first name, last name, or email."
            className={`w-full px-4 py-3 pl-10 pr-20 rounded-lg border theme-border outline-none transition-all ${searchQuery ? 'pr-32' : 'pr-20'}`}
            style={{
              backgroundColor: 'var(--input-bg)',
              color: 'var(--text-primary)',
              borderColor: 'var(--border-color)',
              boxShadow: 'none'
            }}
            onFocus={(event) => {
              event.currentTarget.style.boxShadow = `0 0 0 2px var(--accent-ring)`;
              event.currentTarget.style.borderColor = 'var(--accent-ring)';
            }}
            onBlur={(event) => {
              event.currentTarget.style.boxShadow = 'none';
              event.currentTarget.style.borderColor = 'var(--border-color)';
            }}
          />
          {/* Search icon */}
          <svg
            className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            style={{ color: 'var(--text-muted)' }}
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          {/* Clear icon */}
          {searchQuery && (
            <button
              type="button"
              onClick={onClearSearch}
              className="absolute right-20 top-1/2 transform -translate-y-1/2 p-1.5 rounded-full transition-colors z-10 group"
              aria-label="Clear search"
              title="Clear search"
              style={{ backgroundColor: 'transparent' }}
              onMouseEnter={(event) => {
                event.currentTarget.style.backgroundColor = 'var(--tab-inactive-hover-bg)';
              }}
              onMouseLeave={(event) => {
                event.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <svg className="w-4 h-4 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'var(--text-secondary)' }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
          {/* Search button */}
          <button
            type="submit"
            disabled={!searchQuery.trim() && !hasFilters}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 px-3 py-1.5 text-sm rounded-md transition-colors z-10"
            style={{
              backgroundImage: 'linear-gradient(90deg, var(--accent-from), var(--accent-to))',
              color: 'var(--button-primary-text)',
              boxShadow: '0 12px 24px rgba(0, 0, 0, 0.12)',
              opacity: !searchQuery.trim() && !hasFilters ? 0.6 : 1,
              cursor: !searchQuery.trim() && !hasFilters ? 'not-allowed' : 'pointer'
            }}
            onMouseEnter={(event) => {
              if (!event.currentTarget.disabled) {
                event.currentTarget.style.backgroundImage = 'linear-gradient(90deg, var(--button-primary-hover-bg), var(--accent-to))';
              }
            }}
            onMouseLeave={(event) => {
              event.currentTarget.style.backgroundImage = 'linear-gradient(90deg, var(--accent-from), var(--accent-to))';
            }}
          >
            Search
          </button>
        </div>
      </form>
    </div>
  );
};

export default SearchInput;
