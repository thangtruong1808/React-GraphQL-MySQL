import React from 'react';
import { ProjectsTableProps } from '../../types/projectManagement';
import { PROJECTS_PAGINATION_OPTIONS } from '../../constants/projectManagement';

/**
 * Projects Table Component
 * Displays projects in a table format with pagination and CRUD actions
 * Includes edit and delete buttons for each project
 * 
 * CALLED BY: ProjectsPage component
 * SCENARIOS: Displaying paginated project data with actions
 */
const ProjectsTable: React.FC<ProjectsTableProps> = ({
  projects,
  paginationInfo,
  loading,
  onEdit,
  onDelete,
  onPageChange,
  onPageSizeChange,
  currentPageSize,
  onSort,
  currentSortBy,
  currentSortOrder
}) => {
  /**
   * Format date for display
   * Converts ISO string to readable format
   */
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  /**
   * Format project status for display
   * Converts enum values to user-friendly labels
   */
  const formatStatus = (status: string) => {
    const statusMap: { [key: string]: string } = {
      'PLANNING': 'Planning',
      'IN_PROGRESS': 'In Progress',
      'COMPLETED': 'Completed'
    };
    return statusMap[status] || status;
  };

  /**
   * Get status badge color based on project status
   * Returns appropriate Tailwind classes for styling
   */
  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'PLANNING':
        return 'bg-yellow-100 text-yellow-800';
      case 'IN_PROGRESS':
        return 'bg-blue-100 text-blue-800';
      case 'COMPLETED':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  /**
   * Handle column sorting
   * Toggles between ASC, DESC, and no sort
   */
  const handleSort = (column: string) => {
    let newSortOrder = 'ASC';

    if (currentSortBy === column) {
      // If already sorting by this column, toggle order
      newSortOrder = currentSortOrder === 'ASC' ? 'DESC' : 'ASC';
    }

    onSort(column, newSortOrder);
  };

  /**
   * Get sort icon for column header
   * Shows up/down arrow based on current sort state
   */
  const getSortIcon = (column: string) => {
    if (currentSortBy !== column) {
      return (
        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
        </svg>
      );
    }

    return currentSortOrder === 'ASC' ? (
      <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
      </svg>
    ) : (
      <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    );
  };

  /**
   * Handle page size change
   * Resets to first page when changing page size
   */
  const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newPageSize = parseInt(e.target.value);
    onPageSizeChange(newPageSize);
  };

  /**
   * Handle first page navigation
   * Goes to page 1
   */
  const handleFirstPage = () => {
    onPageChange(1);
  };

  /**
   * Handle previous page navigation
   * Goes to previous page if available
   */
  const handlePreviousPage = () => {
    if (paginationInfo.hasPreviousPage) {
      onPageChange(paginationInfo.currentPage - 1);
    }
  };

  /**
   * Handle next page navigation
   * Goes to next page if available
   */
  const handleNextPage = () => {
    if (paginationInfo.hasNextPage) {
      onPageChange(paginationInfo.currentPage + 1);
    }
  };

  /**
   * Handle last page navigation
   * Goes to last page
   */
  const handleLastPage = () => {
    onPageChange(paginationInfo.totalPages);
  };

  return (
    <div className="bg-white shadow-sm rounded-lg border border-gray-200">
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 table-fixed">
          <thead className="bg-gray-50">
            <tr>
              <th
                className="w-16 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => handleSort('id')}
              >
                <div className="flex items-center space-x-1">
                  <span>ID</span>
                  {getSortIcon('id')}
                </div>
              </th>
              <th
                className="w-48 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => handleSort('name')}
              >
                <div className="flex items-center space-x-1">
                  <span>Name</span>
                  {getSortIcon('name')}
                </div>
              </th>
              <th
                className="w-32 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => handleSort('status')}
              >
                <div className="flex items-center space-x-1">
                  <span>Status</span>
                  {getSortIcon('status')}
                </div>
              </th>
              <th className="w-40 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Owner
              </th>
              <th
                className="w-24 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => handleSort('createdAt')}
              >
                <div className="flex items-center space-x-1">
                  <span>Created</span>
                  {getSortIcon('createdAt')}
                </div>
              </th>
              <th className="w-32 px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              // Loading skeleton
              Array.from({ length: currentPageSize }).map((_, index) => (
                <tr key={index} className="animate-pulse">
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 text-left">
                    <div className="h-4 bg-gray-200 rounded w-8"></div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 text-left">
                    <div className="h-4 bg-gray-200 rounded w-32"></div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-left">
                    <div className="h-6 bg-gray-200 rounded-full w-20"></div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 text-left">
                    <div className="h-4 bg-gray-200 rounded w-24"></div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 text-left">
                    <div className="h-4 bg-gray-200 rounded w-16"></div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-center">
                    <div className="flex justify-center space-x-2">
                      <div className="h-6 bg-gray-200 rounded w-12"></div>
                      <div className="h-6 bg-gray-200 rounded w-16"></div>
                    </div>
                  </td>
                </tr>
              ))
            ) : projects.length === 0 ? (
              // Empty state
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center text-sm text-gray-500">
                  <div className="flex flex-col items-center">
                    <svg className="w-12 h-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                    <p className="text-lg font-medium text-gray-900 mb-2">No projects found</p>
                    <p className="text-gray-500">Get started by creating a new project.</p>
                  </div>
                </td>
              </tr>
            ) : (
              // Project rows
              projects.map((project) => (
                <tr key={project.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 text-left">{project.id}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 text-left">
                    <div className="max-w-xs truncate" title={project.name}>
                      {project.name}
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-left">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeColor(project.status)}`}>
                      {formatStatus(project.status)}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 text-left">
                    {project.owner ? `${project.owner.firstName} ${project.owner.lastName}` : 'No owner'}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 text-left">{formatDate(project.createdAt)}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-center">
                    <div className="flex justify-center space-x-2">
                      <button
                        onClick={() => onEdit(project)}
                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors duration-150"
                        title="Edit project"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => onDelete(project)}
                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-150"
                        title="Delete project"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
        <div className="flex-1 flex justify-between sm:hidden">
          {/* Mobile pagination */}
          <div className="flex space-x-2">
            <button
              onClick={handleFirstPage}
              disabled={paginationInfo.currentPage === 1 || loading}
              className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-1"
              title="First"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={handlePreviousPage}
              disabled={!paginationInfo.hasPreviousPage || loading}
              className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-1"
              title="Previous"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={handleNextPage}
              disabled={!paginationInfo.hasNextPage || loading}
              className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-1"
              title="Next"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
            <button
              onClick={handleLastPage}
              disabled={paginationInfo.currentPage === paginationInfo.totalPages || loading}
              className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-1"
              title="Last"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          {/* Compact page info */}
          <div className="flex items-center space-x-4">
            <p className="text-sm text-gray-600">
              Showing <span className="font-medium">{paginationInfo.totalCount === 0 ? 0 : (paginationInfo.currentPage - 1) * currentPageSize + 1}</span> to <span className="font-medium">{Math.min(paginationInfo.currentPage * currentPageSize, paginationInfo.totalCount)}</span> of <span className="font-medium">{paginationInfo.totalCount}</span>
            </p>

            {/* Compact page size selector */}
            <div className="flex items-center space-x-1">
              <span className="text-sm text-gray-600">Show</span>
              <select
                id="page-size"
                value={currentPageSize}
                onChange={handlePageSizeChange}
                disabled={loading}
                className="px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500 disabled:opacity-50 disabled:cursor-not-allowed bg-white"
              >
                {PROJECTS_PAGINATION_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Navigation buttons */}
          <div className="flex items-center space-x-1">
            {/* First page button */}
            <button
              onClick={handleFirstPage}
              disabled={paginationInfo.currentPage === 1 || loading}
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
              onClick={handlePreviousPage}
              disabled={!paginationInfo.hasPreviousPage || loading}
              className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-1"
              title="Go to previous page"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="hidden sm:inline">Previous</span>
            </button>

            {/* Page numbers */}
            <div className="flex items-center space-x-1">
              {Array.from({ length: Math.min(5, paginationInfo.totalPages) }, (_, i) => {
                const pageNum = Math.max(1, Math.min(paginationInfo.totalPages - 4, paginationInfo.currentPage - 2)) + i;
                if (pageNum > paginationInfo.totalPages) return null;

                return (
                  <button
                    key={pageNum}
                    onClick={() => onPageChange(pageNum)}
                    disabled={loading}
                    className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${pageNum === paginationInfo.currentPage
                        ? 'bg-purple-600 text-white shadow-md'
                        : 'text-gray-500 bg-white border border-gray-300 hover:border-purple-300'
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            {/* Next button */}
            <button
              onClick={handleNextPage}
              disabled={!paginationInfo.hasNextPage || loading}
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
              onClick={handleLastPage}
              disabled={paginationInfo.currentPage === paginationInfo.totalPages || loading}
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
      </div>
    </div>
  );
};

export default ProjectsTable;
