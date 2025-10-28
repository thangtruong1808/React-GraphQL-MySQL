import React from 'react';
import { FaEdit, FaTrash, FaUsers } from 'react-icons/fa';
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
  onViewMembers,
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
        <svg className="w-4 h-4 theme-sort-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
        </svg>
      );
    }

    return currentSortOrder === 'ASC' ? (
      <svg className="w-4 h-4 theme-sort-icon-active" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
      </svg>
    ) : (
      <svg className="w-4 h-4 theme-sort-icon-active" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
    onPageChange(1); // Reset to first page
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
    <div className="bg-white shadow-sm rounded-lg theme-border">
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full theme-table-divide table-fixed">
          <thead className="theme-table-header-bg">
            <tr>
              <th
                className="w-16 px-4 py-3 text-left text-xs font-medium theme-table-text-secondary uppercase tracking-wider cursor-pointer table-row-hover transition-colors hidden lg:table-cell"
                onClick={() => handleSort('id')}
              >
                <div className="flex items-center space-x-1">
                  <span>ID</span>
                  {getSortIcon('id')}
                </div>
              </th>
              <th
                className="w-48 px-4 py-3 text-left text-xs font-medium theme-table-text-secondary uppercase tracking-wider cursor-pointer table-row-hover transition-colors"
                onClick={() => handleSort('name')}
              >
                <div className="flex items-center space-x-1">
                  <span>Name</span>
                  {getSortIcon('name')}
                </div>
              </th>
              <th className="w-64 px-4 py-3 text-left text-xs font-medium theme-table-text-secondary uppercase tracking-wider hidden md:table-cell">
                Description
              </th>
              <th
                className="w-32 px-4 py-3 text-left text-xs font-medium theme-table-text-secondary uppercase tracking-wider cursor-pointer table-row-hover transition-colors"
                onClick={() => handleSort('status')}
              >
                <div className="flex items-center space-x-1">
                  <span>Status</span>
                  {getSortIcon('status')}
                </div>
              </th>
              <th className="w-40 px-4 py-3 text-left text-xs font-medium theme-table-text-secondary uppercase tracking-wider hidden sm:table-cell">
                Owner
              </th>
              <th
                className="w-24 px-4 py-3 text-left text-xs font-medium theme-table-text-secondary uppercase tracking-wider cursor-pointer table-row-hover transition-colors hidden xs:table-cell"
                onClick={() => handleSort('createdAt')}
              >
                <div className="flex items-center space-x-1">
                  <span>Created</span>
                  {getSortIcon('createdAt')}
                </div>
              </th>
              <th
                className="w-24 px-4 py-3 text-left text-xs font-medium theme-table-text-secondary uppercase tracking-wider cursor-pointer table-row-hover transition-colors hidden lg:table-cell"
                onClick={() => handleSort('updatedAt')}
              >
                <div className="flex items-center space-x-1">
                  <span>Updated</span>
                  {getSortIcon('updatedAt')}
                </div>
              </th>
              <th className="w-32 px-4 py-3 text-left text-xs font-medium theme-table-text-secondary uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="theme-table-row-bg theme-table-divide">
            {loading ? (
              // Loading skeleton
              Array.from({ length: currentPageSize }).map((_, index) => (
                <tr key={index} className="animate-pulse">
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 text-left hidden lg:table-cell">
                    <div className="h-4 bg-gray-200 rounded w-8"></div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 text-left">
                    <div className="h-4 bg-gray-200 rounded w-32"></div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 text-left hidden md:table-cell">
                    <div className="h-4 bg-gray-200 rounded w-48"></div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-left">
                    <div className="h-6 bg-gray-200 rounded-full w-20"></div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 text-left hidden sm:table-cell">
                    <div className="h-4 bg-gray-200 rounded w-24"></div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 text-left hidden xs:table-cell">
                    <div className="h-4 bg-gray-200 rounded w-16"></div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 text-left hidden lg:table-cell">
                    <div className="h-4 bg-gray-200 rounded w-16"></div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-left">
                    <div className="flex justify-start space-x-2">
                      <div className="h-6 bg-gray-200 rounded w-12"></div>
                      <div className="h-6 bg-gray-200 rounded w-16"></div>
                    </div>
                  </td>
                </tr>
              ))
            ) : projects.length === 0 ? (
              // Empty state
              <tr>
                <td colSpan={8} className="px-4 py-12 text-center text-sm text-gray-500">
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
                <tr key={project.id} className="table-row-hover">
                  <td className="px-4 py-4 whitespace-nowrap text-sm theme-table-text-primary text-left hidden lg:table-cell">{project.id}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm theme-table-text-primary text-left">
                    <div className="max-w-xs truncate" title={project.name}>
                      {onViewMembers ? (
                        <button
                          onClick={() => onViewMembers(project)}
                          className="text-left text-blue-600 hover:text-blue-800 hover:underline focus:outline-none focus:underline transition-colors"
                        >
                          {project.name}
                        </button>
                      ) : (
                        project.name
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm theme-table-text-secondary text-left hidden md:table-cell">
                    <div className="max-w-xs truncate" title={project.description}>
                      {project.description || 'No description'}
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-left">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeColor(project.status)}`}>
                      {formatStatus(project.status)}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm theme-table-text-primary text-left hidden sm:table-cell">
                    {project.owner ? `${project.owner.firstName} ${project.owner.lastName}` : 'No owner'}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm theme-table-text-secondary text-left hidden xs:table-cell">{formatDate(project.createdAt)}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm theme-table-text-secondary text-left hidden lg:table-cell">{formatDate(project.updatedAt)}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-left">
                    <div className="flex justify-start space-x-2">
                      {onViewMembers && (
                        <button
                          onClick={() => onViewMembers(project)}
                          className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-150"
                          title="View project members"
                        >
                          <FaUsers className="w-3 h-3 mr-1" />
                          Members
                        </button>
                      )}
                      <button
                        onClick={() => onEdit(project)}
                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-150"
                        title="Edit project"
                      >
                        <FaEdit className="w-3 h-3 mr-1" />
                        Edit
                      </button>
                      <button
                        onClick={() => onDelete(project)}
                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-150"
                        title="Delete project"
                      >
                        <FaTrash className="w-3 h-3 mr-1" />
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
      <div className="bg-white px-3 sm:px-4 lg:px-6 py-3 flex items-center justify-between theme-border-medium">
        {/* Mobile pagination - show on small screens */}
        <div className="flex-1 flex justify-between sm:hidden">
          <div className="flex items-center space-x-1">
            <button
              onClick={handlePreviousPage}
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
              onClick={handleNextPage}
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
                onChange={handlePageSizeChange}
                disabled={loading}
                className="px-2 py-1 text-xs lg:text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500 disabled:opacity-50 disabled:cursor-not-allowed bg-white"
              >
                {PROJECTS_PAGINATION_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <span className="text-xs lg:text-sm text-gray-600">entries</span>
            </div>
          </div>

          {/* Navigation buttons */}
          <div className="flex items-center space-x-1">
            {/* First page button - hidden on small screens */}
            <button
              onClick={handleFirstPage}
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
              onClick={handlePreviousPage}
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
              onClick={handleNextPage}
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
              onClick={handleLastPage}
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
    </div>
  );
};

export default ProjectsTable;
