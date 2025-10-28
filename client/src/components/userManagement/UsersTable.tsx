import React from 'react';
import { FaChevronLeft, FaChevronRight, FaEdit, FaTrash } from 'react-icons/fa';
import { UsersTableProps } from '../../types/userManagement';
import { USERS_PAGINATION_OPTIONS } from '../../constants/userManagement';
import { formatRoleForDisplay } from '../../utils/roleFormatter';

/**
 * Users Table Component
 * Displays users in a table format with pagination and CRUD actions
 * Includes edit and delete buttons for each user
 * 
 * CALLED BY: UsersPage component
 * SCENARIOS: Displaying paginated user data with actions
 */
const UsersTable: React.FC<UsersTableProps> = ({
  users,
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
   * Handle first page navigation
   * Goes to the first page
   */
  const handleFirstPage = () => {
    if (paginationInfo.currentPage > 1) {
      onPageChange(1);
    }
  };

  /**
   * Handle last page navigation
   * Goes to the last page
   */
  const handleLastPage = () => {
    if (paginationInfo.currentPage < paginationInfo.totalPages) {
      onPageChange(paginationInfo.totalPages);
    }
  };

  return (
    <div className="bg-white shadow-sm rounded-lg theme-border">
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full theme-table-divide table-fixed">
          <thead className="theme-table-header-bg">
            <tr>
              {/* ID Column - Hidden on mobile */}
              <th
                className="hidden lg:table-cell w-16 px-4 py-3 text-left text-xs font-medium theme-table-text-secondary uppercase tracking-wider cursor-pointer table-row-hover transition-colors"
                onClick={() => handleSort('id')}
              >
                <div className="flex items-center space-x-1">
                  <span>ID</span>
                  {getSortIcon('id')}
                </div>
              </th>
              <th
                className="w-32 px-4 py-3 text-left text-xs font-medium theme-table-text-secondary uppercase tracking-wider cursor-pointer table-row-hover transition-colors"
                onClick={() => handleSort('firstName')}
              >
                <div className="flex items-center space-x-1">
                  <span>First Name</span>
                  {getSortIcon('firstName')}
                </div>
              </th>
              {/* Last Name Column - Hidden on small screens */}
              <th
                className="hidden sm:table-cell w-32 px-4 py-3 text-left text-xs font-medium theme-table-text-secondary uppercase tracking-wider cursor-pointer table-row-hover transition-colors"
                onClick={() => handleSort('lastName')}
              >
                <div className="flex items-center space-x-1">
                  <span>Last Name</span>
                  {getSortIcon('lastName')}
                </div>
              </th>
              <th
                className="w-48 px-4 py-3 text-left text-xs font-medium theme-table-text-secondary uppercase tracking-wider cursor-pointer table-row-hover transition-colors"
                onClick={() => handleSort('email')}
              >
                <div className="flex items-center space-x-1">
                  <span>Email</span>
                  {getSortIcon('email')}
                </div>
              </th>
              <th
                className="w-40 px-4 py-3 text-left text-xs font-medium theme-table-text-secondary uppercase tracking-wider cursor-pointer table-row-hover transition-colors"
                onClick={() => handleSort('role')}
              >
                <div className="flex items-center space-x-1">
                  <span>Role</span>
                  {getSortIcon('role')}
                </div>
              </th>
              {/* Created Date Column - Hidden on extra small screens */}
              <th
                className="hidden xs:table-cell w-24 px-4 py-3 text-left text-xs font-medium theme-table-text-secondary uppercase tracking-wider cursor-pointer table-row-hover transition-colors"
                onClick={() => handleSort('createdAt')}
              >
                <div className="flex items-center space-x-1">
                  <span>Created</span>
                  {getSortIcon('createdAt')}
                </div>
              </th>
              {/* Updated Date Column - Hidden on mobile and tablet */}
              <th
                className="hidden lg:table-cell w-24 px-4 py-3 text-left text-xs font-medium theme-table-text-secondary uppercase tracking-wider cursor-pointer table-row-hover transition-colors"
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
            {users.length === 0 ? (
              // Empty state
              <tr>
                <td colSpan={8} className="px-6 py-12 text-center">
                  <div className="text-gray-500">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No users found</h3>
                    <p className="mt-1 text-sm text-gray-500">Try adjusting your search criteria.</p>
                  </div>
                </td>
              </tr>
            ) : (
              // User rows
              users.map((user) => (
                <tr key={user.id} className="table-row-hover transition-colors duration-150">
                  {/* ID Column - Hidden on mobile */}
                  <td className="hidden lg:table-cell px-4 py-4 whitespace-nowrap text-sm theme-table-text-primary text-left">
                    {user.id}
                  </td>

                  {/* First Name Column */}
                  <td className="px-4 py-4 whitespace-nowrap text-sm theme-table-text-primary text-left">
                    {user.firstName}
                  </td>

                  {/* Last Name Column - Hidden on small screens */}
                  <td className="hidden sm:table-cell px-4 py-4 whitespace-nowrap text-sm theme-table-text-primary text-left">
                    {user.lastName}
                  </td>

                  {/* Email Column */}
                  <td className="px-4 py-4 whitespace-nowrap text-sm theme-table-text-primary text-left">
                    {user.email}
                  </td>

                  {/* Role Column */}
                  <td className="px-4 py-4 whitespace-nowrap text-left">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium theme-badge-neutral">
                      {formatRoleForDisplay(user.role)}
                    </span>
                  </td>

                  {/* Created Date Column - Hidden on extra small screens */}
                  <td className="hidden xs:table-cell px-4 py-4 whitespace-nowrap text-sm theme-table-text-secondary text-left">
                    {formatDate(user.createdAt)}
                  </td>

                  {/* Updated Date Column - Hidden on mobile and tablet */}
                  <td className="hidden lg:table-cell px-4 py-4 whitespace-nowrap text-sm theme-table-text-secondary text-left">
                    {formatDate(user.updatedAt)}
                  </td>

                  {/* Actions Column */}
                  <td className="px-4 py-4 whitespace-nowrap text-left">
                    <div className="flex justify-start space-x-2">
                      {/* Edit button */}
                      <button
                        onClick={() => onEdit(user)}
                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-150"
                        title="Edit user"
                      >
                        <FaEdit className="w-3 h-3 mr-1" />
                        Edit
                      </button>

                      {/* Delete button */}
                      <button
                        onClick={() => onDelete(user)}
                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-150"
                        title="Delete user"
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
                {USERS_PAGINATION_OPTIONS.map((option) => (
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

export default UsersTable;
