import React from 'react';
import { PaginationInfo } from '../../types/tagsManagement';
import { PAGE_SIZE_OPTIONS } from '../../constants/tagsManagement';

interface TagsTablePaginationProps {
  paginationInfo: PaginationInfo;
  pageSize: number;
  loading: boolean;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
}

/**
 * Tags Table Pagination Component
 * Displays pagination controls with mobile and desktop views
 */
const TagsTablePagination: React.FC<TagsTablePaginationProps> = ({
  paginationInfo,
  pageSize,
  loading,
  onPageChange,
  onPageSizeChange,
}) => {
  // Handle page change
  const handlePageChange = (page: number) => {
    onPageChange(page);
  };

  // Handle page size change
  const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onPageSizeChange(Number(e.target.value));
  };

  // Handle mouse enter for button
  const handleButtonMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!e.currentTarget.disabled) {
      e.currentTarget.style.backgroundColor = 'var(--table-row-hover-bg)';
    }
  };

  // Handle mouse leave for button
  const handleButtonMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!e.currentTarget.disabled) {
      e.currentTarget.style.backgroundColor = 'var(--card-bg)';
    }
  };

  return (
    <div className="px-6 py-4" style={{ backgroundColor: 'var(--table-header-bg)', borderTop: '1px solid var(--border-color)' }}>
      {/* Mobile pagination - show on small screens */}
      <div className="flex-1 flex justify-between sm:hidden">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handlePageChange(paginationInfo.currentPage - 1)}
            disabled={!paginationInfo.hasPreviousPage || loading}
            className="px-3 py-2 text-xs font-medium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-1 shadow-sm"
            style={{ backgroundColor: 'var(--card-bg)', color: 'var(--text-primary)', border: '1px solid var(--border-color)' }}
            onMouseEnter={handleButtonMouseEnter}
            onMouseLeave={handleButtonMouseLeave}
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="hidden xs:inline">Previous</span>
          </button>
          <span className="px-3 py-2 text-xs font-medium rounded-lg" style={{ backgroundColor: 'var(--badge-primary-bg)', color: 'var(--badge-primary-text)', border: '1px solid var(--border-color)' }}>
            {paginationInfo.currentPage} / {paginationInfo.totalPages}
          </span>
          <button
            onClick={() => handlePageChange(paginationInfo.currentPage + 1)}
            disabled={!paginationInfo.hasNextPage || loading}
            className="px-3 py-2 text-xs font-medium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-1 shadow-sm"
            style={{ backgroundColor: 'var(--card-bg)', color: 'var(--text-primary)', border: '1px solid var(--border-color)' }}
            onMouseEnter={handleButtonMouseEnter}
            onMouseLeave={handleButtonMouseLeave}
          >
            <span className="hidden xs:inline">Next</span>
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Desktop pagination - show on sm and larger screens */}
      <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
        {/* Page info and size selector */}
        <div className="flex flex-col lg:flex-row lg:items-center space-y-2 lg:space-y-0 lg:space-x-6">
          {/* Enhanced page info */}
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-purple-500 dark:bg-purple-400 [data-theme='brand']:bg-purple-600 rounded-full"></div>
            <p className="text-sm text-gray-600 dark:text-gray-300 [data-theme='brand']:text-purple-700">
              <span className="hidden md:inline">Showing </span>
              <span className="font-semibold text-gray-900 dark:text-gray-100 [data-theme='brand']:text-purple-900">{paginationInfo.totalCount === 0 ? 0 : (paginationInfo.currentPage - 1) * pageSize + 1}</span>
              <span className="hidden md:inline"> to </span>
              <span className="md:hidden">-</span>
              <span className="font-semibold text-gray-900 dark:text-gray-100 [data-theme='brand']:text-purple-900">{Math.min(paginationInfo.currentPage * pageSize, paginationInfo.totalCount)}</span>
              <span className="hidden md:inline"> of </span>
              <span className="md:hidden">/</span>
              <span className="font-semibold text-gray-900 dark:text-gray-100 [data-theme='brand']:text-purple-900">{paginationInfo.totalCount}</span>
              <span className="hidden md:inline"> results</span>
            </p>
          </div>

          {/* Enhanced page size selector */}
          <div className="flex items-center space-x-2">
            <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Show</span>
            <select
              id="page-size"
              value={pageSize}
              onChange={handlePageSizeChange}
              disabled={loading}
              className="px-3 py-1.5 text-sm rounded-lg focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
              style={{ backgroundColor: 'var(--input-bg)', color: 'var(--text-primary)', border: '1px solid var(--border-color)' }}
            >
              {PAGE_SIZE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>entries</span>
          </div>
        </div>

        {/* Enhanced Navigation buttons */}
        <div className="flex items-center space-x-2">
          {/* First page button - hidden on small screens */}
          <button
            onClick={() => handlePageChange(1)}
            disabled={paginationInfo.currentPage === 1 || loading}
            className="hidden md:flex px-3 py-2 text-sm font-medium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 items-center space-x-1 shadow-sm"
            style={{ backgroundColor: 'var(--card-bg)', color: 'var(--text-primary)', border: '1px solid var(--border-color)' }}
            title="Go to first page"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
            </svg>
            <span className="hidden lg:inline">First</span>
          </button>

          {/* Previous button */}
          <button
            onClick={() => handlePageChange(paginationInfo.currentPage - 1)}
            disabled={!paginationInfo.hasPreviousPage || loading}
            className="px-3 py-2 text-sm font-medium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center space-x-1 shadow-sm"
            style={{ backgroundColor: 'var(--card-bg)', color: 'var(--text-primary)', border: '1px solid var(--border-color)' }}
            onMouseEnter={handleButtonMouseEnter}
            onMouseLeave={handleButtonMouseLeave}
            title="Go to previous page"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="hidden lg:inline">Previous</span>
          </button>

          {/* Page numbers - responsive spacing */}
          <div className="flex items-center space-x-1 mx-2">
            {Array.from({ length: Math.min(3, paginationInfo.totalPages) }, (_, i) => {
              const pageNum = Math.max(1, Math.min(paginationInfo.totalPages - 2, paginationInfo.currentPage - 1)) + i;
              if (pageNum > paginationInfo.totalPages) return null;

              return (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  disabled={loading}
                  className={`px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 min-w-[2.5rem] disabled:opacity-50 disabled:cursor-not-allowed`}
                  style={pageNum === paginationInfo.currentPage
                    ? { backgroundColor: 'var(--button-primary-bg)', color: 'var(--button-primary-text)' }
                    : { backgroundColor: 'var(--card-bg)', color: 'var(--text-primary)', border: '1px solid var(--border-color)' }}
                  title={`Go to page ${pageNum}`}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>

          {/* Next button */}
          <button
            onClick={() => handlePageChange(paginationInfo.currentPage + 1)}
            disabled={!paginationInfo.hasNextPage || loading}
            className="px-3 py-2 text-sm font-medium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center space-x-1 shadow-sm"
            style={{ backgroundColor: 'var(--card-bg)', color: 'var(--text-primary)', border: '1px solid var(--border-color)' }}
            onMouseEnter={handleButtonMouseEnter}
            onMouseLeave={handleButtonMouseLeave}
            title="Go to next page"
          >
            <span className="hidden lg:inline">Next</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Last page button - hidden on small screens */}
          <button
            onClick={() => handlePageChange(paginationInfo.totalPages)}
            disabled={paginationInfo.currentPage === paginationInfo.totalPages || loading}
            className="hidden md:flex px-3 py-2 text-sm font-medium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 items-center space-x-1 shadow-sm"
            style={{ backgroundColor: 'var(--card-bg)', color: 'var(--text-primary)', border: '1px solid var(--border-color)' }}
            title="Go to last page"
          >
            <span className="hidden lg:inline">Last</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TagsTablePagination;

