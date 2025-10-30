import React, { useState } from 'react';
import { FaEdit, FaTrash, FaChevronUp, FaChevronDown, FaHashtag, FaHeading, FaAlignLeft, FaTag, FaExclamationTriangle, FaProjectDiagram, FaUser, FaCalendarAlt, FaCog } from 'react-icons/fa';
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
  // State for tracking expanded text for each task
  const [expandedTasks, setExpandedTasks] = useState<Set<string>>(new Set());
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
      return (
        <svg className="w-4 h-4 theme-sort-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
        </svg>
      );
    }
    return currentSortOrder === 'ASC'
      ? (
        <svg className="w-4 h-4 theme-sort-icon-active" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
        </svg>
      )
      : (
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
    onPageSizeChange(parseInt(e.target.value));
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
   * Goes to the last page
   */
  const handleLastPage = () => {
    onPageChange(paginationInfo.totalPages);
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
   * Toggle expanded state for task text
   * Manages which tasks have their text expanded
   */
  const toggleExpanded = (taskId: string) => {
    setExpandedTasks(prev => {
      const newSet = new Set(prev);
      if (newSet.has(taskId)) {
        newSet.delete(taskId);
      } else {
        newSet.add(taskId);
      }
      return newSet;
    });
  };

  /**
   * Format text with truncation and toggle functionality
   * Shows first 4 words with more/less toggle
   */
  const formatTextWithToggle = (text: string, taskId: string, type: 'title' | 'description') => {
    if (!text) return '';

    const words = text.split(' ');
    const isExpanded = expandedTasks.has(`${taskId}-${type}`);

    if (words.length <= 4 || isExpanded) {
      return (
        <div className="space-y-1">
          <span>{text}</span>
          {words.length > 4 && (
            <button
              onClick={() => toggleExpanded(`${taskId}-${type}`)}
              className="text-xs text-purple-600 hover:text-purple-800 font-medium transition-colors"
            >
              less
            </button>
          )}
        </div>
      );
    }

    const truncatedText = words.slice(0, 4).join(' ');
    return (
      <div className="space-y-1">
        <span>{truncatedText}...</span>
        <button
          onClick={() => toggleExpanded(`${taskId}-${type}`)}
          className="text-xs text-purple-600 hover:text-purple-800 font-medium transition-colors"
        >
          more
        </button>
      </div>
    );
  };

  return (
    <div className="rounded-lg shadow-sm" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)', borderWidth: 1, borderStyle: 'solid', overflow: 'hidden' }}>
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full table-fixed">
          {/* Table Header */}
          <thead style={{ backgroundColor: 'var(--table-header-bg)', borderBottomColor: 'var(--border-color)', borderBottomWidth: 1 }}>
            <tr>
              {/* ID Column - Hidden on mobile and tablet */}
              <th
                className="hidden lg:table-cell w-16 px-4 py-4 text-left text-xs font-medium uppercase tracking-wider cursor-pointer transition-colors"
                style={{ color: 'var(--table-text-secondary)' }}
                onClick={() => handleSort('id')}
              >
                <div className="flex items-center space-x-1">
                  <FaHashtag className="w-3 h-3" style={{ color: 'var(--text-muted)' }} />
                  <span>ID</span>
                  {getSortIcon('id')}
                </div>
              </th>
              {/* Title Column - Always visible */}
              <th
                className="w-48 px-4 py-4 text-left text-xs font-medium uppercase tracking-wider cursor-pointer transition-colors"
                style={{ color: 'var(--table-text-secondary)' }}
                onClick={() => handleSort('title')}
              >
                <div className="flex items-center space-x-1">
                  <FaHeading className="w-3 h-3" style={{ color: 'var(--text-muted)' }} />
                  <span>Title</span>
                  {getSortIcon('title')}
                </div>
              </th>
              {/* Description Column - Hidden on mobile */}
              <th className="hidden sm:table-cell w-64 px-4 py-4 text-left text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--table-text-secondary)' }}>
                <div className="flex items-center space-x-1">
                  <FaAlignLeft className="w-3 h-3" style={{ color: 'var(--text-muted)' }} />
                  <span>Description</span>
                </div>
              </th>
              {/* Status Column - Always visible */}
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
              {/* Priority Column - Hidden on mobile */}
              <th
                className="hidden sm:table-cell w-24 px-4 py-4 text-left text-xs font-medium uppercase tracking-wider cursor-pointer transition-colors"
                style={{ color: 'var(--table-text-secondary)' }}
                onClick={() => handleSort('priority')}
              >
                <div className="flex items-center space-x-1">
                  <FaExclamationTriangle className="w-3 h-3" style={{ color: 'var(--text-muted)' }} />
                  <span>Priority</span>
                  {getSortIcon('priority')}
                </div>
              </th>
              {/* Project Column - Hidden on mobile and tablet */}
              <th className="hidden lg:table-cell w-40 px-4 py-4 text-left text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--table-text-secondary)' }}>
                <div className="flex items-center space-x-1">
                  <FaProjectDiagram className="w-3 h-3" style={{ color: 'var(--text-muted)' }} />
                  <span>Project</span>
                </div>
              </th>
              {/* Assigned To Column - Hidden on mobile and tablet */}
              <th className="hidden lg:table-cell w-40 px-4 py-4 text-left text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--table-text-secondary)' }}>
                <div className="flex items-center space-x-1">
                  <FaUser className="w-3 h-3" style={{ color: 'var(--text-muted)' }} />
                  <span>Assigned To</span>
                </div>
              </th>
              {/* Tags Column - Hidden on mobile and tablet */}
              <th className="hidden lg:table-cell w-48 px-4 py-4 text-left text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--table-text-secondary)' }}>
                <div className="flex items-center space-x-1">
                  <FaTag className="w-3 h-3" style={{ color: 'var(--text-muted)' }} />
                  <span>Tags</span>
                </div>
              </th>
              {/* Due Date Column - Hidden on mobile and tablet */}
              <th
                className="hidden lg:table-cell w-32 px-4 py-4 text-left text-xs font-medium uppercase tracking-wider cursor-pointer transition-colors"
                style={{ color: 'var(--table-text-secondary)' }}
                onClick={() => handleSort('dueDate')}
              >
                <div className="flex items-center space-x-1">
                  <FaCalendarAlt className="w-3 h-3" style={{ color: 'var(--text-muted)' }} />
                  <span>Due Date</span>
                  {getSortIcon('dueDate')}
                </div>
              </th>
              {/* Created Date Column - Hidden on mobile and tablet */}
              <th
                className="hidden lg:table-cell w-32 px-4 py-4 text-left text-xs font-medium uppercase tracking-wider cursor-pointer transition-colors"
                style={{ color: 'var(--table-text-secondary)' }}
                onClick={() => handleSort('createdAt')}
              >
                <div className="flex items-center space-x-1">
                  <FaCalendarAlt className="w-3 h-3" style={{ color: 'var(--text-muted)' }} />
                  <span>Created</span>
                  {getSortIcon('createdAt')}
                </div>
              </th>
              {/* Updated Date Column - Hidden on mobile and tablet */}
              <th
                className="hidden lg:table-cell w-32 px-4 py-4 text-left text-xs font-medium uppercase tracking-wider cursor-pointer transition-colors"
                style={{ color: 'var(--table-text-secondary)' }}
                onClick={() => handleSort('updatedAt')}
              >
                <div className="flex items-center space-x-1">
                  <FaCalendarAlt className="w-3 h-3" style={{ color: 'var(--text-muted)' }} />
                  <span>Updated</span>
                  {getSortIcon('updatedAt')}
                </div>
              </th>
              {/* Actions Column - Always visible */}
              <th className="w-40 px-4 py-4 text-left text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--table-text-secondary)' }}>
                <div className="flex items-center space-x-1">
                  <FaCog className="w-3 h-3" style={{ color: 'var(--text-muted)' }} />
                  <span>Actions</span>
                </div>
              </th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody style={{ backgroundColor: 'var(--table-row-bg)' }}>
            {loading ? (
              // Loading skeleton rows
              Array.from({ length: 5 }).map((_, index) => (
                <tr key={index} className="animate-pulse">
                  {/* ID Column - Hidden on mobile and tablet */}
                  <td className="hidden lg:table-cell px-4 py-4 whitespace-nowrap">
                    <div className="h-4 bg-gray-200 rounded w-8"></div>
                  </td>
                  {/* Title Column - Always visible */}
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="h-4 bg-gray-200 rounded w-32"></div>
                  </td>
                  {/* Description Column - Hidden on mobile */}
                  <td className="hidden sm:table-cell px-4 py-4">
                    <div className="space-y-1">
                      <div className="h-4 bg-gray-200 rounded w-48"></div>
                      <div className="h-4 bg-gray-200 rounded w-32"></div>
                    </div>
                  </td>
                  {/* Status Column - Always visible */}
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="h-6 bg-gray-200 rounded-full w-16"></div>
                  </td>
                  {/* Priority Column - Hidden on mobile */}
                  <td className="hidden sm:table-cell px-4 py-4 whitespace-nowrap">
                    <div className="h-6 bg-gray-200 rounded-full w-12"></div>
                  </td>
                  {/* Project Column - Hidden on mobile and tablet */}
                  <td className="hidden lg:table-cell px-4 py-4 whitespace-nowrap">
                    <div className="h-4 bg-gray-200 rounded w-24"></div>
                  </td>
                  {/* Assigned To Column - Hidden on mobile and tablet */}
                  <td className="hidden lg:table-cell px-4 py-4 whitespace-nowrap">
                    <div className="h-4 bg-gray-200 rounded w-20"></div>
                  </td>
                  {/* Due Date Column - Hidden on mobile and tablet */}
                  <td className="hidden lg:table-cell px-4 py-4 whitespace-nowrap">
                    <div className="h-4 bg-gray-200 rounded w-20"></div>
                  </td>
                  {/* Created Date Column - Hidden on mobile and tablet */}
                  <td className="hidden lg:table-cell px-4 py-4 whitespace-nowrap">
                    <div className="h-4 bg-gray-200 rounded w-20"></div>
                  </td>
                  {/* Updated Date Column - Hidden on mobile and tablet */}
                  <td className="hidden lg:table-cell px-4 py-4 whitespace-nowrap">
                    <div className="h-4 bg-gray-200 rounded w-20"></div>
                  </td>
                  {/* Actions Column - Always visible */}
                  <td className="px-4 py-4 whitespace-nowrap">
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
                <td colSpan={4} className="px-4 py-8 text-center theme-table-text-secondary sm:hidden">
                  No tasks found
                </td>
                <td colSpan={6} className="hidden sm:table-cell lg:hidden px-4 py-8 text-center theme-table-text-secondary">
                  No tasks found
                </td>
                <td colSpan={12} className="hidden lg:table-cell px-4 py-8 text-center theme-table-text-secondary">
                  No tasks found
                </td>
              </tr>
            ) : (
              // Data rows
              tasks.map((task) => (
                <tr
                  key={task.id}
                  className="transition-colors"
                  style={{ backgroundColor: 'var(--table-row-bg)', borderBottomColor: 'var(--border-color)', borderBottomWidth: 1 }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLTableRowElement).style.backgroundColor = 'var(--table-row-hover-bg)'; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLTableRowElement).style.backgroundColor = 'var(--table-row-bg)'; }}
                >
                  {/* ID Column - Hidden on mobile and tablet */}
                  <td className="hidden lg:table-cell px-4 py-4 whitespace-nowrap text-sm text-left" style={{ color: 'var(--table-text-primary)' }}>
                    {task.id}
                  </td>
                  {/* Title Column - Always visible */}
                  <td className="px-4 py-4 text-sm text-left" style={{ color: 'var(--table-text-primary)' }}>
                    <div className="flex items-center space-x-2">
                      <FaHeading className="w-3 h-3" style={{ color: 'var(--text-muted)' }} />
                      <span>{formatTextWithToggle(task.title, task.id, 'title')}</span>
                    </div>
                  </td>
                  {/* Description Column - Hidden on mobile */}
                  <td className="hidden sm:table-cell px-4 py-4 text-sm text-left" style={{ color: 'var(--table-text-primary)' }}>
                    <div className="flex items-center space-x-2">
                      <FaAlignLeft className="w-3 h-3" style={{ color: 'var(--text-muted)' }} />
                      <span>{formatTextWithToggle(task.description, task.id, 'description')}</span>
                    </div>
                  </td>
                  {/* Status Column - Always visible */}
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-left" style={{ color: 'var(--table-text-primary)' }}>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${TASK_STATUS_COLORS[task.status]}`}>
                      {formatTaskStatusForDisplay(task.status)}
                    </span>
                  </td>
                  {/* Priority Column - Hidden on mobile */}
                  <td className="hidden sm:table-cell px-4 py-4 whitespace-nowrap text-sm text-left" style={{ color: 'var(--table-text-primary)' }}>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${TASK_PRIORITY_COLORS[task.priority]}`}>
                      {formatTaskPriorityForDisplay(task.priority)}
                    </span>
                  </td>
                  {/* Project Column - Hidden on mobile and tablet */}
                  <td className="hidden lg:table-cell px-4 py-4 whitespace-nowrap text-sm text-left" style={{ color: 'var(--table-text-primary)' }}>
                    <div className="truncate flex items-center space-x-2" title={task.project.name}>
                      <FaProjectDiagram className="w-3 h-3" style={{ color: 'var(--text-muted)' }} />
                      <span>{task.project.name}</span>
                    </div>
                  </td>
                  {/* Assigned To Column - Hidden on mobile and tablet */}
                  <td className="hidden lg:table-cell px-4 py-4 whitespace-nowrap text-sm text-left" style={{ color: 'var(--table-text-primary)' }}>
                    <div className="truncate flex items-center space-x-2" title={task.assignedUser ? `${task.assignedUser.firstName} ${task.assignedUser.lastName}` : 'Unassigned'}>
                      <FaUser className="w-3 h-3" style={{ color: 'var(--text-muted)' }} />
                      <span>{task.assignedUser ? `${task.assignedUser.firstName} ${task.assignedUser.lastName}` : 'Unassigned'}</span>
                    </div>
                  </td>
                  {/* Tags Column - Hidden on mobile and tablet */}
                  <td className="hidden lg:table-cell px-4 py-4 text-sm text-left" style={{ color: 'var(--table-text-primary)' }}>
                    <div className="flex flex-wrap gap-1">
                      {task.tags && task.tags.length > 0 ? (
                        task.tags.map((tag) => (
                          <span
                            key={tag.id}
                            className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium theme-badge-secondary"
                            title={tag.description}
                          >
                            <FaTag className="w-3 h-3 mr-1" />
                            <span>{tag.name}</span>
                          </span>
                        ))
                      ) : (
                        <span className="theme-table-text-muted text-xs">No tags</span>
                      )}
                    </div>
                  </td>
                  {/* Due Date Column - Hidden on mobile and tablet */}
                  <td className="hidden lg:table-cell px-4 py-4 whitespace-nowrap text-sm text-left" style={{ color: 'var(--table-text-secondary)' }}>
                    <div className="flex items-center space-x-2">
                      <FaCalendarAlt className="w-3 h-3" style={{ color: 'var(--text-muted)' }} />
                      <span>{formatDate(task.dueDate)}</span>
                    </div>
                  </td>
                  {/* Created Date Column - Hidden on mobile and tablet */}
                  <td className="hidden lg:table-cell px-4 py-4 whitespace-nowrap text-sm text-left" style={{ color: 'var(--table-text-secondary)' }}>
                    <div className="flex items-center space-x-2">
                      <FaCalendarAlt className="w-3 h-3" style={{ color: 'var(--text-muted)' }} />
                      <span>{formatDate(task.createdAt)}</span>
                    </div>
                  </td>
                  {/* Updated Date Column - Hidden on mobile and tablet */}
                  <td className="hidden lg:table-cell px-4 py-4 whitespace-nowrap text-sm text-left" style={{ color: 'var(--table-text-secondary)' }}>
                    <div className="flex items-center space-x-2">
                      <FaCalendarAlt className="w-3 h-3" style={{ color: 'var(--text-muted)' }} />
                      <span>{formatDate(task.updatedAt)}</span>
                    </div>
                  </td>
                  {/* Actions Column - Always visible */}
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-left" style={{ color: 'var(--table-text-secondary)' }}>
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
                {TASKS_PAGINATION_OPTIONS.map((option) => (
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

export default TasksTable;
