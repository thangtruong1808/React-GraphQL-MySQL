import React from 'react';

/**
 * Search Header Component
 * Displays page title and search results summary with enhanced styling
 * Follows React best practices with proper TypeScript interfaces
 */

interface SearchHeaderProps {
  totalResults: number;
  memberCount: number;
  projectCount: number;
  taskCount: number;
  searchType: {
    isUserSearch: boolean;
    isProjectStatusSearch: boolean;
    isTaskStatusSearch: boolean;
    isRoleSearch: boolean;
  };
}

/**
 * SearchHeader Component
 * Renders an enhanced page header with title, icons, and results summary
 */
const SearchHeader: React.FC<SearchHeaderProps> = ({
  totalResults,
  memberCount,
  projectCount,
  taskCount,
  searchType
}) => {
  return (
    <div className="px-4 sm:px-6 lg:px-8 mb-4">
      <div className="search-header max-w-7xl mx-auto rounded-2xl shadow-lg p-8 border" style={{
        backgroundColor: 'var(--card-bg)',
        borderColor: 'var(--border-color)',
        boxShadow: '0 10px 15px -3px var(--shadow-color)'
      }}>
        <div className="text-center">
          {/* Header with icon and title */}
          <div className="flex items-center justify-center mb-6">
            {/* Search icon */}
            <div className="mr-4 p-3 rounded-2xl shadow-lg theme-accent-gradient">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            {/* Title */}
            <div>
              <h1 className="text-4xl font-bold bg-clip-text text-transparent theme-accent-gradient" style={{
                WebkitBackgroundClip: 'text'
              }}>
                Search Results
              </h1>
              <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>Find what you're looking for</p>
            </div>
          </div>

          {/* Enhanced results summary */}
          {totalResults > 0 ? (
            <div className="mb-6">
              {/* Main results count with enhanced styling */}
              <div className="flex items-center justify-center mb-4">
                <div className="inline-flex items-center px-6 py-3 border rounded-2xl shadow-sm" style={{
                  backgroundColor: 'var(--card-bg)',
                  borderColor: 'var(--border-color)'
                }}>
                  <div className="mr-3 p-2 rounded-xl theme-accent-gradient">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold bg-clip-text text-transparent theme-accent-gradient" style={{
                      WebkitBackgroundClip: 'text'
                    }}>
                      {totalResults}
                    </div>
                    <div className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                      {totalResults === 1 ? 'Result' : 'Results'} Found
                    </div>
                  </div>
                </div>
              </div>

              {/* Detailed breakdown with individual counts */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 max-w-2xl mx-auto">
                {/* Members count */}
                {memberCount > 0 && (
                  <div className="flex items-center justify-center px-4 py-2 border rounded-xl" style={{
                    backgroundColor: 'var(--badge-secondary-bg)',
                    borderColor: 'var(--border-color)'
                  }}>
                    <div className="mr-2 p-1.5 rounded-lg" style={{
                      backgroundColor: 'var(--button-secondary-bg)'
                    }}>
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>{memberCount}</div>
                      <div className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>Member{memberCount !== 1 ? 's' : ''}</div>
                    </div>
                  </div>
                )}

                {/* Projects count */}
                {projectCount > 0 && (
                  <div className="flex items-center justify-center px-4 py-2 border rounded-xl" style={{
                    backgroundColor: 'var(--badge-success-bg)',
                    borderColor: 'var(--border-color)'
                  }}>
                    <div className="mr-2 p-1.5 rounded-lg" style={{
                      backgroundColor: 'var(--button-success-bg)'
                    }}>
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>{projectCount}</div>
                      <div className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>Project{projectCount !== 1 ? 's' : ''}</div>
                    </div>
                  </div>
                )}

                {/* Tasks count */}
                {taskCount > 0 && (
                  <div className="flex items-center justify-center px-4 py-2 border rounded-xl" style={{
                    backgroundColor: 'var(--badge-warning-bg)',
                    borderColor: 'var(--border-color)'
                  }}>
                    <div className="mr-2 p-1.5 rounded-lg" style={{
                      backgroundColor: '#f97316'
                    }}>
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                      </svg>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>{taskCount}</div>
                      <div className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>Task{taskCount !== 1 ? 's' : ''}</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* Enhanced empty state */
            <div className="text-center py-8">
              <div className="inline-flex flex-col items-center px-6 py-4 border rounded-2xl shadow-sm" style={{
                backgroundColor: 'var(--card-bg)',
                borderColor: 'var(--border-color)'
              }}>
                <div className="mb-3 p-3 rounded-xl" style={{
                  backgroundColor: 'var(--text-muted)'
                }}>
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                </div>
                <div className="text-lg font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>No results found</div>
                <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>Try adjusting your search criteria</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchHeader;
