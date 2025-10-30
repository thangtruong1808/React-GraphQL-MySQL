import React from 'react';
import { FaEdit, FaTrash, FaUsers, FaFolder, FaAlignLeft, FaTag, FaUser, FaCalendarAlt, FaCog, FaHashtag } from 'react-icons/fa';
import { ProjectsTableProps } from '../../types/projectManagement';
import { PROJECTS_PAGINATION_OPTIONS, getProjectStatusColor } from '../../constants/projectManagement';

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
   * Get status badge color based on project status with theme-aware styling
   * Returns appropriate Tailwind classes for styling
   */
  const getStatusBadgeColor = (status: string) => {
    // Check if we're in brand theme by looking for data-theme attribute
    const isBrandTheme = document.documentElement.getAttribute('data-theme') === 'brand';
    const isDarkTheme = document.documentElement.classList.contains('dark');

    const theme = isBrandTheme ? 'brand' : isDarkTheme ? 'dark' : 'light';
    return getProjectStatusColor(status, theme);
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
    <div className="shadow-sm rounded-lg" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)', borderWidth: 1, borderStyle: 'solid', overflow: 'hidden' }}>
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full table-fixed">
          <thead style={{ backgroundColor: 'var(--table-header-bg)', borderBottomColor: 'var(--border-color)', borderBottomWidth: 1 }}>
            <tr>
              <th
                className="w-16 px-4 py-4 text-left text-xs font-medium uppercase tracking-wider cursor-pointer transition-colors hidden lg:table-cell"
                style={{ color: 'var(--table-text-secondary)' }}
                onClick={() => handleSort('id')}
              >
                <div className="flex items-center space-x-1">
                  <FaHashtag className="w-3 h-3" style={{ color: 'var(--text-muted)' }} />
                  <span>ID</span>
                  {getSortIcon('id')}
                </div>
              </th>
              <th
                className="w-48 px-4 py-4 text-left text-xs font-medium uppercase tracking-wider cursor-pointer transition-colors"
                style={{ color: 'var(--table-text-secondary)' }}
                onClick={() => handleSort('name')}
              >
                <div className="flex items-center space-x-1">
                  <FaFolder className="w-3 h-3" style={{ color: 'var(--text-muted)' }} />
                  <span>Name</span>
                  {getSortIcon('name')}
                </div>
              </th>
              <th className="w-64 px-4 py-4 text-left text-xs font-medium uppercase tracking-wider hidden md:table-cell" style={{ color: 'var(--table-text-secondary)' }}>
                <div className="flex items-center space-x-1">
                  <FaAlignLeft className="w-3 h-3" style={{ color: 'var(--text-muted)' }} />
                  <span>Description</span>
                </div>
              </th>
              <th
                className="w-32 px-4 py-4 text-left text-xs font-medium uppercase tracking-wider cursor-pointer transition-colors"
                style={{ color: 'var(--table-text-secondary)' }}
                onClick={() => handleSort('status')}
              >
                <div className="flex items-center space-x-1">
                  <FaTag className="w-3 h-3" style={{ color: 'var(--text-muted)' }} />
                  <span>Status</span>
                  {getSortIcon('status')}
                </div>
              </th>
              <th className="w-40 px-4 py-4 text-left text-xs font-medium uppercase tracking-wider hidden sm:table-cell" style={{ color: 'var(--table-text-secondary)' }}>
                <div className="flex items-center space-x-1">
                  <FaUser className="w-3 h-3" style={{ color: 'var(--text-muted)' }} />
                  <span>Owner</span>
                </div>
              </th>
              <th
                className="w-24 px-4 py-4 text-left text-xs font-medium uppercase tracking-wider cursor-pointer transition-colors hidden xs:table-cell"
                style={{ color: 'var(--table-text-secondary)' }}
                onClick={() => handleSort('createdAt')}
              >
                <div className="flex items-center space-x-1">
                  <FaCalendarAlt className="w-3 h-3" style={{ color: 'var(--text-muted)' }} />
                  <span>Created</span>
                  {getSortIcon('createdAt')}
                </div>
              </th>
              <th
                className="w-24 px-4 py-4 text-left text-xs font-medium uppercase tracking-wider cursor-pointer transition-colors hidden lg:table-cell"
                style={{ color: 'var(--table-text-secondary)' }}
                onClick={() => handleSort('updatedAt')}
              >
                <div className="flex items-center space-x-1">
                  <FaCalendarAlt className="w-3 h-3" style={{ color: 'var(--text-muted)' }} />
                  <span>Updated</span>
                  {getSortIcon('updatedAt')}
                </div>
              </th>
              <th className="w-32 px-4 py-4 text-left text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--table-text-secondary)' }}>
                <div className="flex items-center space-x-1">
                  <FaCog className="w-3 h-3" style={{ color: 'var(--text-muted)' }} />
                  <span>Actions</span>
                </div>
              </th>
            </tr>
          </thead>
          <tbody style={{ backgroundColor: 'var(--table-row-bg)' }}>
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
                <td colSpan={8} className="px-4 py-12 text-center text-sm" style={{ color: 'var(--text-secondary)' }}>
                  <div className="flex flex-col items-center">
                    <svg className="w-12 h-12 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'var(--text-muted)' }}>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                    <p className="text-lg font-medium mb-2" style={{ color: 'var(--text-primary)' }}>No projects found</p>
                    <p style={{ color: 'var(--text-secondary)' }}>Get started by creating a new project.</p>
                  </div>
                </td>
              </tr>
            ) : (
              // Project rows
              projects.map((project) => (
                <tr
                  key={project.id}
                  className="transition-colors"
                  style={{ backgroundColor: 'var(--table-row-bg)', borderBottomColor: 'var(--border-color)', borderBottomWidth: 1 }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLTableRowElement).style.backgroundColor = 'var(--table-row-hover-bg)'; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLTableRowElement).style.backgroundColor = 'var(--table-row-bg)'; }}
                >
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-left hidden lg:table-cell" style={{ color: 'var(--table-text-primary)' }}>{project.id}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-left" style={{ color: 'var(--table-text-primary)' }}>
                    <div className="max-w-xs truncate flex items-center space-x-2" title={project.name}>
                      <FaFolder className="w-3 h-3" style={{ color: 'var(--text-muted)' }} />
                      {onViewMembers ? (
                        <button
                          onClick={() => onViewMembers(project)}
                          className="text-left focus:outline-none focus:underline transition-colors"
                          style={{ color: 'var(--accent-from)' }}
                        >
                          {project.name}
                        </button>
                      ) : (
                        <span>{project.name}</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-left hidden md:table-cell" style={{ color: 'var(--table-text-secondary)' }}>
                    <div className="max-w-xs truncate flex items-center space-x-2" title={project.description}>
                      <FaAlignLeft className="w-3 h-3" style={{ color: 'var(--text-muted)' }} />
                      <span>{project.description || 'No description'}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-left">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeColor(project.status)}`}>
                      {formatStatus(project.status)}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-left hidden sm:table-cell" style={{ color: 'var(--table-text-primary)' }}>
                    <div className="flex items-center space-x-2">
                      <FaUser className="w-3 h-3" style={{ color: 'var(--text-muted)' }} />
                      <span>{project.owner ? `${project.owner.firstName} ${project.owner.lastName}` : 'No owner'}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-left hidden xs:table-cell" style={{ color: 'var(--table-text-secondary)' }}>
                    <div className="flex items-center space-x-2">
                      <FaCalendarAlt className="w-3 h-3" style={{ color: 'var(--text-muted)' }} />
                      <span>{formatDate(project.createdAt)}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-left hidden lg:table-cell" style={{ color: 'var(--table-text-secondary)' }}>
                    <div className="flex items-center space-x-2">
                      <FaCalendarAlt className="w-3 h-3" style={{ color: 'var(--text-muted)' }} />
                      <span>{formatDate(project.updatedAt)}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-left">
                    <div className="flex justify-start space-x-2">
                      {onViewMembers && (
                        <button
                          onClick={() => onViewMembers(project)}
                          className="inline-flex items-center px-3 py-1.5 border text-xs font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-150"
                          style={{ backgroundColor: 'var(--button-secondary-bg)', color: 'var(--button-primary-text)', borderColor: 'var(--button-secondary-bg)' }}
                          title="View project members"
                        >
                          <FaUsers className="w-3 h-3 mr-1" />
                          Members
                        </button>
                      )}
                      <button
                        onClick={() => onEdit(project)}
                        className="inline-flex items-center px-3 py-1.5 border text-xs font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-150"
                        style={{ backgroundColor: 'var(--button-secondary-bg)', color: 'var(--button-primary-text)', borderColor: 'var(--button-secondary-bg)' }}
                        title="Edit project"
                      >
                        <FaEdit className="w-3 h-3 mr-1" />
                        Edit
                      </button>
                      <button
                        onClick={() => onDelete(project)}
                        className="inline-flex items-center px-3 py-1.5 border text-xs font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-150"
                        style={{ backgroundColor: 'var(--button-danger-bg)', color: 'var(--button-primary-text)', borderColor: 'var(--button-danger-bg)' }}
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
      <div className="px-3 sm:px-4 lg:px-6 py-3 flex items-center justify-between" style={{ backgroundColor: 'var(--card-bg)', borderTopColor: 'var(--border-color)', borderTopWidth: 1 }}>
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
            <p className="text-xs lg:text-sm" style={{ color: 'var(--text-secondary)' }}>
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
              <span className="text-xs lg:text-sm" style={{ color: 'var(--text-secondary)' }}>Show</span>
              <select
                id="page-size"
                value={currentPageSize}
                onChange={handlePageSizeChange}
                disabled={loading}
                className="px-2 py-1 text-xs lg:text-sm rounded focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ backgroundColor: 'var(--input-bg)', color: 'var(--text-primary)', borderColor: 'var(--border-color)', borderWidth: 1 }}
              >
                {PROJECTS_PAGINATION_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <span className="text-xs lg:text-sm" style={{ color: 'var(--text-secondary)' }}>entries</span>
            </div>
          </div>

          {/* Navigation buttons */}
          <div className="flex items-center space-x-1">
            {/* First page button - hidden on small screens */}
            <button
              onClick={handleFirstPage}
              disabled={paginationInfo.currentPage === 1 || loading}
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
              onClick={handlePreviousPage}
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
              {Array.from({ length: Math.min(3, paginationInfo.totalPages) }, (_, i) => {
                const pageNum = Math.max(1, Math.min(paginationInfo.totalPages - 2, paginationInfo.currentPage - 1)) + i;
                if (pageNum > paginationInfo.totalPages) return null;

                return (
                  <button
                    key={pageNum}
                    onClick={() => onPageChange(pageNum)}
                    disabled={loading}
                    className={`px-2 lg:px-3 py-2 text-xs lg:text-sm font-medium rounded-lg transition-colors min-w-[2rem] lg:min-w-[2.5rem] disabled:opacity-50 disabled:cursor-not-allowed`}
                    style={pageNum === paginationInfo.currentPage ? {
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
