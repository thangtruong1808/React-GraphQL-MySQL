import React from 'react';
import { SearchSectionSkeleton } from '../ui/DashboardSkeletons';

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
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  totalItems?: number;
  itemsPerPage?: number;
  headerContent?: React.ReactNode; // Optional header content to display before results
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
  renderItem,
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  totalItems = 0,
  itemsPerPage = 3,
  headerContent
}) => {
  // Show section only if there's a query or results
  if (!hasQuery && results.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Enhanced Section Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg shadow-sm">
            <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
            {totalPages > 1 && (
              <p className="text-sm text-gray-600">
                Page {currentPage} of {totalPages}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Loading state with elegant skeleton */}
      {loading && (
        <SearchSectionSkeleton title={title} />
      )}

      {/* Results with enhanced layout */}
      {!loading && hasQuery && (
        <div className="space-y-4">
          {results.length > 0 ? (
            <>
              {/* Optional header content (e.g., status counts) */}
              {headerContent && (
                <div className="mb-4">
                  {headerContent}
                </div>
              )}

              {/* Results grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                {results.map(renderItem)}
              </div>

              {/* Pagination controls */}
              {totalPages > 1 && onPageChange && (
                <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <span>Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} {totalItems === 1 ? 'result' : 'results'}</span>
                  </div>

                  <div className="flex items-center space-x-1">
                    {/* First page button */}
                    <button
                      onClick={() => onPageChange(1)}
                      disabled={currentPage === 1}
                      className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-1"
                      title="Go to first page"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                      </svg>
                      <span className="hidden sm:inline">First</span>
                    </button>

                    {/* Previous button */}
                    <button
                      onClick={() => onPageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-1"
                      title="Go to previous page"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                      <span className="hidden sm:inline">Previous</span>
                    </button>

                    {/* Page numbers with enhanced spacing */}
                    <div className="flex items-center space-x-1 mx-2">
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        const pageNum = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
                        if (pageNum > totalPages) return null;

                        return (
                          <button
                            key={pageNum}
                            onClick={() => onPageChange(pageNum)}
                            className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors min-w-[2.5rem] ${pageNum === currentPage
                              ? 'bg-purple-600 text-white shadow-md'
                              : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 hover:border-purple-300'
                              }`}
                            title={`Go to page ${pageNum}`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                    </div>

                    {/* Next button */}
                    <button
                      onClick={() => onPageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-1"
                      title="Go to next page"
                    >
                      <span className="hidden sm:inline">Next</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>

                    {/* Last page button */}
                    <button
                      onClick={() => onPageChange(totalPages)}
                      disabled={currentPage === totalPages}
                      className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-1"
                      title="Go to last page"
                    >
                      <span className="hidden sm:inline">Last</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <svg className="h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No {title.toLowerCase()} found</h3>
              <p className="text-sm text-gray-500">{emptyMessage}</p>
            </div>
          )}
        </div>
      )}

      {/* No query state with enhanced design */}
      {!hasQuery && (
        <div className="text-center py-12">
          <div className="mx-auto w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
            <svg className="h-8 w-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Search {title.toLowerCase()}</h3>
          <p className="text-sm text-gray-500">
            Type at least 2 characters to search {title.toLowerCase()}
          </p>
        </div>
      )}
    </div>
  );
};

export default SearchSection;
