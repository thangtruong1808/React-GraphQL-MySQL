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
    <div className="relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-100 via-pink-50 to-purple-100 rounded-3xl opacity-50"></div>

      {/* Main content */}
      <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-purple-200 p-8 mb-8">
        {/* Header with icon and title */}
        <div className="flex items-center justify-center mb-6">
          {/* Search icon */}
          <div className="mr-4 p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl shadow-lg">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          {/* Title */}
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Search Results
            </h1>
            <p className="text-sm text-gray-500 mt-1">Find what you're looking for</p>
          </div>
        </div>

        {/* Results summary with enhanced styling */}
        {totalResults > 0 ? (
          <div className="space-y-4">
            {/* Total results badge - Only show when multiple search types are active */}
            {((searchType.isUserSearch ? 1 : 0) +
              (searchType.isProjectStatusSearch ? 1 : 0) +
              (searchType.isTaskStatusSearch ? 1 : 0)) > 1 && (
                <div className="flex justify-center">
                  <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full shadow-lg">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    <span className="font-semibold text-lg">{totalResults} Total {totalResults === 1 ? 'Result' : 'Results'}</span>
                  </div>
                </div>
              )}

            {/* Dynamic category breakdown based on search filters */}
            <div className={`grid gap-4 ${
              // Dynamic grid columns based on number of active search types
              (searchType.isUserSearch ? 1 : 0) +
                (searchType.isProjectStatusSearch ? 1 : 0) +
                (searchType.isTaskStatusSearch ? 1 : 0) === 1
                ? 'grid-cols-1'
                : (searchType.isUserSearch ? 1 : 0) +
                  (searchType.isProjectStatusSearch ? 1 : 0) +
                  (searchType.isTaskStatusSearch ? 1 : 0) === 2
                  ? 'grid-cols-1 md:grid-cols-2'
                  : 'grid-cols-1 md:grid-cols-3'
              }`}>
              {/* Members count - Show only when searching by user name */}
              {searchType.isUserSearch && memberCount > 0 && (
                <div className="flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl border border-blue-200">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-500 rounded-xl">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-blue-700">{memberCount}</p>
                      <p className="text-sm text-blue-600 font-medium">{memberCount === 1 ? 'Member' : 'Members'}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Projects count - Show only when searching by project status */}
              {searchType.isProjectStatusSearch && projectCount > 0 && (
                <div className="flex items-center justify-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-2xl border border-green-200">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-green-500 rounded-xl">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-green-700">{projectCount}</p>
                      <p className="text-sm text-green-600 font-medium">{projectCount === 1 ? 'Project' : 'Projects'}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Tasks count - Show only when searching by task status */}
              {searchType.isTaskStatusSearch && taskCount > 0 && (
                <div className="flex items-center justify-center p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl border border-orange-200">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-orange-500 rounded-xl">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-orange-700">{taskCount}</p>
                      <p className="text-sm text-orange-600 font-medium">{taskCount === 1 ? 'Task' : 'Tasks'}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Empty state */
          <div className="text-center py-8">
            <div className="inline-flex items-center px-6 py-3 bg-gray-100 text-gray-600 rounded-full">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
              <span className="font-medium">No results found</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchHeader;
