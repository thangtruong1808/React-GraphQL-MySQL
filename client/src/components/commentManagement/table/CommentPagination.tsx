import React from 'react';
import { PAGE_SIZE_OPTIONS } from '../../../constants/commentManagement';
import { PaginationInfo } from '../../../types/commentManagement';

interface CommentPaginationProps {
  currentPage: number;
  currentPageSize: number;
  paginationInfo: PaginationInfo;
  loading: boolean;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}

/**
 * Comment Pagination Component
 * Handles pagination controls for comments table with mobile and desktop views
 */
const CommentPagination: React.FC<CommentPaginationProps> = ({
  currentPage,
  currentPageSize,
  paginationInfo,
  loading,
  onPageChange,
  onPageSizeChange
}) => {
  // Ensure all values are valid numbers
  const safeCurrentPage = Math.max(1, Number(currentPage) || 1);
  const safePageSize = Math.max(1, Number(currentPageSize) || 10);
  const safeTotalCount = Math.max(0, Number(paginationInfo.totalCount) || 0);
  const safeTotalPages = Math.max(1, Number(paginationInfo.totalPages) || 1);

  if (safeTotalCount === 0) return null;

  return (
    <div className="px-3 sm:px-4 lg:px-6 py-3 flex items-center justify-between" style={{ backgroundColor: 'var(--card-bg)', borderTopColor: 'var(--border-color)', borderTopWidth: 1 }}>
      {/* Mobile pagination - show on small screens */}
      <div className="flex-1 flex justify-between sm:hidden">
        <div className="flex items-center space-x-1">
          <button
            onClick={() => onPageChange(safeCurrentPage - 1)}
            disabled={!paginationInfo.hasPreviousPage || loading || safeCurrentPage <= 1}
            className="px-2 py-1.5 text-xs font-medium text-gray-500 bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-1"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="hidden xs:inline">Previous</span>
          </button>
          <span className="px-2 py-1.5 text-xs text-gray-700 bg-gray-50 border border-gray-300 rounded">
            {safeCurrentPage} / {safeTotalPages}
          </span>
          <button
            onClick={() => onPageChange(safeCurrentPage + 1)}
            disabled={!paginationInfo.hasNextPage || loading || safeCurrentPage >= safeTotalPages}
            className="px-2 py-1.5 text-xs font-medium text-gray-500 bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-1"
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
        <div className="flex flex-col lg:flex-row lg:items-center space-y-2 lg:space-y-0 lg:space-x-4">
          {/* Compact page info */}
          <p className="text-xs lg:text-sm" style={{ color: 'var(--text-secondary)' }}>
            <span className="hidden md:inline">Showing </span>
            <span className="font-medium">{safeTotalCount === 0 ? 0 : (safeCurrentPage - 1) * safePageSize + 1}</span>
            <span className="hidden md:inline"> to </span>
            <span className="md:hidden">-</span>
            <span className="font-medium">{Math.min(safeCurrentPage * safePageSize, safeTotalCount)}</span>
            <span className="hidden md:inline"> of </span>
            <span className="md:hidden">/</span>
            <span className="font-medium">{safeTotalCount}</span>
          </p>

          {/* Page size selector */}
          <div className="flex items-center space-x-1">
            <span className="text-xs lg:text-sm" style={{ color: 'var(--text-secondary)' }}>Show</span>
            <select
              id="page-size"
              value={safePageSize}
              onChange={(e) => onPageSizeChange(parseInt(e.target.value))}
              disabled={loading}
              className="px-2 py-1 text-xs lg:text-sm rounded focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundColor: 'var(--input-bg)', color: 'var(--text-primary)', borderColor: 'var(--border-color)', borderWidth: 1 }}
            >
              {PAGE_SIZE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <span className="text-xs lg:text-sm" style={{ color: 'var(--text-secondary)' }}>entries</span>
          </div>
        </div>

        {/* Desktop pagination buttons */}
        <div className="flex items-center space-x-1">
          {/* First page button - hidden on small screens */}
          <button
            onClick={() => onPageChange(1)}
            disabled={safeCurrentPage === 1 || loading}
            className="hidden md:flex px-2 lg:px-3 py-2 text-xs lg:text-sm font-medium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors items-center space-x-1"
            style={{ backgroundColor: 'var(--card-bg)', color: 'var(--text-primary)', borderColor: 'var(--border-color)', borderWidth: 1 }}
            title="Go to first page"
          >
            <svg className="w-3 h-3 lg:w-4 lg:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
            </svg>
            <span className="hidden lg:inline">First</span>
          </button>

          {/* Previous button */}
          <button
            onClick={() => onPageChange(safeCurrentPage - 1)}
            disabled={!paginationInfo.hasPreviousPage || loading}
            className="px-2 lg:px-3 py-2 text-xs lg:text-sm font-medium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-1"
            style={{ backgroundColor: 'var(--card-bg)', color: 'var(--text-primary)', borderColor: 'var(--border-color)', borderWidth: 1 }}
            title="Go to previous page"
          >
            <svg className="w-3 h-3 lg:w-4 lg:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="hidden lg:inline">Previous</span>
          </button>

          {/* Page numbers - responsive spacing */}
          <div className="flex items-center space-x-1 mx-1 lg:mx-2">
            {Array.from({ length: Math.min(3, safeTotalPages) }, (_, i) => {
              const pageNum = Math.max(1, Math.min(safeTotalPages - 2, safeCurrentPage - 1)) + i;
              if (pageNum > safeTotalPages) return null;

              return (
                <button
                  key={pageNum}
                  onClick={() => onPageChange(pageNum)}
                  disabled={loading}
                  className={`px-2 lg:px-3 py-2 text-xs lg:text-sm font-medium rounded-lg transition-colors min-w-[2rem] lg:min-w-[2.5rem] disabled:opacity-50 disabled:cursor-not-allowed`}
                  style={pageNum === safeCurrentPage ? {
                    backgroundColor: 'var(--button-primary-bg)',
                    color: 'var(--button-primary-text)',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.15)'
                  } : {
                    backgroundColor: 'var(--card-bg)',
                    color: 'var(--text-primary)',
                    borderColor: 'var(--border-color)',
                    borderWidth: 1
                  }}
                  title={`Go to page ${pageNum}`}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>

          {/* Next button */}
          <button
            onClick={() => onPageChange(safeCurrentPage + 1)}
            disabled={!paginationInfo.hasNextPage || loading}
            className="px-2 lg:px-3 py-2 text-xs lg:text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-1"
            title="Go to next page"
          >
            <span className="hidden lg:inline">Next</span>
            <svg className="w-3 h-3 lg:w-4 lg:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Last page button - hidden on small screens */}
          <button
            onClick={() => onPageChange(safeTotalPages)}
            disabled={safeCurrentPage === safeTotalPages || loading}
            className="hidden md:flex px-2 lg:px-3 py-2 text-xs lg:text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors items-center space-x-1"
            title="Go to last page"
          >
            <span className="hidden lg:inline">Last</span>
            <svg className="w-3 h-3 lg:w-4 lg:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CommentPagination;

