import React from 'react';
import { FaEdit, FaTrash, FaChevronUp, FaChevronDown } from 'react-icons/fa';
import { TasksTableProps } from '../../types/taskManagement';
import { TASKS_PAGINATION_OPTIONS, TASK_STATUS_COLORS, TASK_PRIORITY_COLORS } from '../../constants/taskManagement';

/**
 * Tasks Table Component
 * Displays tasks in a professional table with sorting, pagination, and CRUD actions
 * Features modern design with responsive layout and interactive elements
 */
const TasksTable: React.FC<TasksTableProps> = ({
  tasks,
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
   * Handle column sorting
   * Toggles between ASC and DESC order
   */
  const handleSort = (sortBy: string) => {
    const newSortOrder = currentSortBy === sortBy && currentSortOrder === 'ASC' ? 'DESC' : 'ASC';
    onSort(sortBy, newSortOrder);
  };

  /**
   * Get sort icon for column header
   * Shows up/down arrow based on current sort state
   */
  const getSortIcon = (sortBy: string) => {
    if (currentSortBy !== sortBy) {
      return <FaChevronUp className="w-3 h-3 text-gray-400" />;
    }
    return currentSortOrder === 'ASC'
      ? <FaChevronUp className="w-3 h-3 text-purple-600" />
      : <FaChevronDown className="w-3 h-3 text-purple-600" />;
  };

  /**
   * Handle page size change
   * Resets to first page when changing page size
   */
  const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onPageSizeChange(parseInt(e.target.value));
  };

  /**
   * Format date for display
   * Converts ISO date string to readable format with error handling
   */
  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';

    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return 'Invalid Date';
      }
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      return 'Invalid Date';
    }
  };

  /**
   * Format task status for display
   * Converts enum values to user-friendly text
   */
  const formatTaskStatusForDisplay = (status: string) => {
    const statusMap: { [key: string]: string } = {
      'TODO': 'To Do',
      'IN_PROGRESS': 'In Progress',
      'DONE': 'Done'
    };
    return statusMap[status] || status;
  };

  /**
   * Format task priority for display
   * Converts enum values to user-friendly text
   */
  const formatTaskPriorityForDisplay = (priority: string) => {
    const priorityMap: { [key: string]: string } = {
      'LOW': 'Low',
      'MEDIUM': 'Medium',
      'HIGH': 'High'
    };
    return priorityMap[priority] || priority;
  };

  /**
   * Format description with word wrapping
   * Breaks description into lines with maximum 8 words per line
   */
  const formatDescriptionWithWordWrap = (description: string) => {
    if (!description) return '';

    const words = description.split(' ');
    const lines = [];

    for (let i = 0; i < words.length; i += 8) {
      lines.push(words.slice(i, i + 8).join(' '));
    }

    return lines;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 table-fixed">
          {/* Table Header */}
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
                onClick={() => handleSort('title')}
              >
                <div className="flex items-center space-x-1">
                  <span>Title</span>
                  {getSortIcon('title')}
                </div>
              </th>
              <th className="w-64 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Description
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
              <th
                className="w-24 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => handleSort('priority')}
              >
                <div className="flex items-center space-x-1">
                  <span>Priority</span>
                  {getSortIcon('priority')}
                </div>
              </th>
              <th className="w-40 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Project
              </th>
              <th className="w-40 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Assigned To
              </th>
              <th
                className="w-32 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => handleSort('createdAt')}
              >
                <div className="flex items-center space-x-1">
                  <span>Created</span>
                  {getSortIcon('createdAt')}
                </div>
              </th>
              <th className="w-40 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              // Loading skeleton rows
              Array.from({ length: 5 }).map((_, index) => (
                <tr key={index} className="animate-pulse">
                  <td className="w-16 px-4 py-4 whitespace-nowrap">
                    <div className="h-4 bg-gray-200 rounded w-8"></div>
                  </td>
                  <td className="w-48 px-4 py-4 whitespace-nowrap">
                    <div className="h-4 bg-gray-200 rounded w-32"></div>
                  </td>
                  <td className="w-64 px-4 py-4">
                    <div className="space-y-1">
                      <div className="h-4 bg-gray-200 rounded w-48"></div>
                      <div className="h-4 bg-gray-200 rounded w-32"></div>
                    </div>
                  </td>
                  <td className="w-32 px-4 py-4 whitespace-nowrap">
                    <div className="h-6 bg-gray-200 rounded-full w-16"></div>
                  </td>
                  <td className="w-24 px-4 py-4 whitespace-nowrap">
                    <div className="h-6 bg-gray-200 rounded-full w-12"></div>
                  </td>
                  <td className="w-40 px-4 py-4 whitespace-nowrap">
                    <div className="h-4 bg-gray-200 rounded w-24"></div>
                  </td>
                  <td className="w-40 px-4 py-4 whitespace-nowrap">
                    <div className="h-4 bg-gray-200 rounded w-20"></div>
                  </td>
                  <td className="w-32 px-4 py-4 whitespace-nowrap">
                    <div className="h-4 bg-gray-200 rounded w-20"></div>
                  </td>
                  <td className="w-40 px-4 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <div className="h-8 bg-gray-200 rounded w-16"></div>
                      <div className="h-8 bg-gray-200 rounded w-16"></div>
                    </div>
                  </td>
                </tr>
              ))
            ) : tasks.length === 0 ? (
              // No data row
              <tr>
                <td colSpan={9} className="px-4 py-8 text-center text-gray-500">
                  No tasks found
                </td>
              </tr>
            ) : (
              // Data rows
              tasks.map((task) => (
                <tr key={task.id} className="hover:bg-gray-50">
                  <td className="w-16 px-4 py-4 whitespace-nowrap text-sm text-gray-900 text-left">
                    {task.id}
                  </td>
                  <td className="w-48 px-4 py-4 whitespace-nowrap text-sm text-gray-900 text-left">
                    <div className="truncate" title={task.title}>
                      {task.title}
                    </div>
                  </td>
                  <td className="w-64 px-4 py-4 text-sm text-gray-900 text-left">
                    <div className="space-y-1" title={task.description}>
                      {formatDescriptionWithWordWrap(task.description).map((line, index) => (
                        <div key={index} className="leading-tight">
                          {line}
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="w-32 px-4 py-4 whitespace-nowrap text-sm text-gray-900 text-left">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${TASK_STATUS_COLORS[task.status]}`}>
                      {formatTaskStatusForDisplay(task.status)}
                    </span>
                  </td>
                  <td className="w-24 px-4 py-4 whitespace-nowrap text-sm text-gray-900 text-left">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${TASK_PRIORITY_COLORS[task.priority]}`}>
                      {formatTaskPriorityForDisplay(task.priority)}
                    </span>
                  </td>
                  <td className="w-40 px-4 py-4 whitespace-nowrap text-sm text-gray-900 text-left">
                    <div className="truncate" title={task.project.name}>
                      {task.project.name}
                    </div>
                  </td>
                  <td className="w-40 px-4 py-4 whitespace-nowrap text-sm text-gray-900 text-left">
                    <div className="truncate" title={task.assignedUser ? `${task.assignedUser.firstName} ${task.assignedUser.lastName}` : 'Unassigned'}>
                      {task.assignedUser ? `${task.assignedUser.firstName} ${task.assignedUser.lastName}` : 'Unassigned'}
                    </div>
                  </td>
                  <td className="w-32 px-4 py-4 whitespace-nowrap text-sm text-gray-500 text-left">
                    {formatDate(task.createdAt)}
                  </td>
                  <td className="w-40 px-4 py-4 whitespace-nowrap text-sm text-gray-500 text-left">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => onEdit(task)}
                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-150"
                      >
                        <FaEdit className="w-3 h-3 mr-1" />
                        Edit
                      </button>
                      <button
                        onClick={() => onDelete(task)}
                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-150"
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
      <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
        <div className="flex-1 flex justify-between sm:hidden">
          <button
            onClick={() => onPageChange(paginationInfo.currentPage - 1)}
            disabled={!paginationInfo.hasPreviousPage || loading}
            className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <button
            onClick={() => onPageChange(paginationInfo.currentPage + 1)}
            disabled={!paginationInfo.hasNextPage || loading}
            className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center space-x-1">
              <span className="text-sm text-gray-600">Show</span>
              <select
                id="page-size"
                value={currentPageSize}
                onChange={handlePageSizeChange}
                disabled={loading}
                className="px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500 disabled:opacity-50 disabled:cursor-not-allowed bg-white"
              >
                {TASKS_PAGINATION_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <span className="text-sm text-gray-600">
                Showing {((paginationInfo.currentPage - 1) * currentPageSize) + 1} to {Math.min(paginationInfo.currentPage * currentPageSize, paginationInfo.totalCount)} of {paginationInfo.totalCount} results
              </span>
            </div>
          </div>
          <div>
            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
              <button
                onClick={() => onPageChange(1)}
                disabled={!paginationInfo.hasPreviousPage || loading}
                className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-1"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                </svg>
                <span>First</span>
              </button>
              <button
                onClick={() => onPageChange(paginationInfo.currentPage - 1)}
                disabled={!paginationInfo.hasPreviousPage || loading}
                className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-1"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span>Previous</span>
              </button>
              <button
                onClick={() => onPageChange(paginationInfo.currentPage + 1)}
                disabled={!paginationInfo.hasNextPage || loading}
                className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-1"
              >
                <span>Next</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
              <button
                onClick={() => onPageChange(paginationInfo.totalPages)}
                disabled={!paginationInfo.hasNextPage || loading}
                className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-1"
              >
                <span>Last</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                </svg>
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TasksTable;
