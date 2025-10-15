import React from 'react';

interface PaginationProps {
  paginationInfo: {
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    totalCount: number;
    currentPage: number;
    totalPages: number;
  };
  currentPageSize: number;
  loading: boolean;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
}

/**
 * ProjectMembersPagination Component
 * Handles pagination controls for project members table
 * Includes mobile and desktop pagination layouts
 */
const ProjectMembersPagination: React.FC<PaginationProps> = ({
  paginationInfo,
  currentPageSize,
  loading,
  onPageChange,
  onPageSizeChange
}) => {
  if (paginationInfo.totalCount === 0) return null;

  return (
    <div className="bg-white px-3 sm:px-4 lg:px-6 py-3 flex items-center justify-between border-t border-gray-200">
      {/* Mobile pagination - show on small screens */}
      <div className="flex-1 flex justify-between sm:hidden">
        <div className="flex items-center space-x-1">
          <button
            onClick={() => onPageChange(paginationInfo.currentPage - 1)}
            disabled={!paginationInfo.hasPreviousPage || loading}
            className="px-2 py-1.5 text-xs font-medium text-gray-500 bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-1"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="hidden xs:inline">Previous</span>
          </button>
          <span className="px-2 py-1.5 text-xs text-gray-700 bg-gray-50 border border-gray-300 rounded">
            {paginationInfo.currentPage} / {paginationInfo.totalPages}
          </span>
          <button
            onClick={() => onPageChange(paginationInfo.currentPage + 1)}
            disabled={!paginationInfo.hasNextPage || loading}
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
          <p className="text-xs lg:text-sm text-gray-600">
            <span className="hidden md:inline">Showing </span>
            <span className="font-medium">{paginationInfo.totalCount === 0 ? 0 : (paginationInfo.currentPage - 1) * currentPageSize + 1}</span>
            <span className="hidden md:inline"> to </span>
            <span className="md:hidden">-</span>
            <span className="font-medium">{Math.min(paginationInfo.currentPage * currentPageSize, paginationInfo.totalCount)}</span>
            <span className="hidden md:inline"> of </span>
            <span className="md:hidden">/</span>
            <span className="font-medium">{paginationInfo.totalCount}</span>
          </p>

          {/* Page size selector */}
          <div className="flex items-center space-x-1">
            <span className="text-xs lg:text-sm text-gray-600">Show</span>
            <select
              id="page-size"
              value={currentPageSize}
              onChange={(e) => onPageSizeChange(parseInt(e.target.value))}
              disabled={loading}
              className="px-2 py-1 text-xs lg:text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500 disabled:opacity-50 disabled:cursor-not-allowed bg-white"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
            <span className="text-xs lg:text-sm text-gray-600">entries</span>
          </div>
        </div>

        {/* Navigation buttons */}
        <div className="flex items-center space-x-1">
          {/* First page button - hidden on small screens */}
          <button
            onClick={() => onPageChange(1)}
            disabled={paginationInfo.currentPage === 1 || loading}
            className="hidden md:flex px-2 lg:px-3 py-2 text-xs lg:text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors items-center space-x-1"
            title="Go to first page"
          >
            <svg className="w-3 h-3 lg:w-4 lg:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
            </svg>
            <span className="hidden lg:inline">First</span>
          </button>

          {/* Previous button */}
          <button
            onClick={() => onPageChange(paginationInfo.currentPage - 1)}
            disabled={!paginationInfo.hasPreviousPage || loading}
            className="px-2 lg:px-3 py-2 text-xs lg:text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-1"
            title="Go to previous page"
          >
            <svg className="w-3 h-3 lg:w-4 lg:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="hidden lg:inline">Previous</span>
          </button>

          {/* Page numbers - responsive spacing */}
          <div className="flex items-center space-x-1 mx-1 lg:mx-2">
            {Array.from({ length: Math.min(3, paginationInfo.totalPages) }, (_, i) => {
              const pageNum = Math.max(1, Math.min(paginationInfo.totalPages - 2, paginationInfo.currentPage - 1)) + i;
              if (pageNum > paginationInfo.totalPages) return null;

              return (
                <button
                  key={pageNum}
                  onClick={() => onPageChange(pageNum)}
                  disabled={loading}
                  className={`px-2 lg:px-3 py-2 text-xs lg:text-sm font-medium rounded-lg transition-colors min-w-[2rem] lg:min-w-[2.5rem] ${pageNum === paginationInfo.currentPage
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 hover:border-purple-300'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  title={`Go to page ${pageNum}`}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>

          {/* Next button */}
          <button
            onClick={() => onPageChange(paginationInfo.currentPage + 1)}
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
            onClick={() => onPageChange(paginationInfo.totalPages)}
            disabled={paginationInfo.currentPage === paginationInfo.totalPages || loading}
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

export default ProjectMembersPagination;
