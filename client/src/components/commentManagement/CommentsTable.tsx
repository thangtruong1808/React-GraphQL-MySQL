import React, { memo } from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { CommentsTableProps } from '../../types/commentManagement';
import { COMMENT_TABLE_COLUMNS, COMMENT_PRIORITY_THRESHOLDS, COMMENT_PRIORITY_COLORS, COMMENT_DISPLAY_SETTINGS, PAGE_SIZE_OPTIONS } from '../../constants/commentManagement';
import { formatRoleForDisplay } from '../../utils/roleFormatter';

/**
 * CommentsTable Component
 * Displays comments in a table with pagination, sorting, and CRUD actions
 * Includes word wrapping for content and proper date formatting
 * Memoized to prevent unnecessary re-renders when only sorting changes
 */
const CommentsTable: React.FC<CommentsTableProps> = memo(({
  comments,
  loading,
  paginationInfo,
  onPageChange,
  onPageSizeChange,
  onSort,
  currentSortBy,
  currentSortOrder,
  onEdit,
  onDelete,
}) => {
  // Format date with error handling
  const formatDate = (dateString: string | null | undefined): string => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Invalid Date';
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      return 'N/A';
    }
  };

  // Format content with word wrapping (max 8 words per line)
  const formatContentWithWordWrap = (content: string): string[] => {
    if (!content) return ['N/A'];

    const words = content.trim().split(/\s+/);
    const lines: string[] = [];
    const wordsPerLine = 8;

    for (let i = 0; i < words.length; i += wordsPerLine) {
      const line = words.slice(i, i + wordsPerLine).join(' ');
      lines.push(line);
    }

    return lines;
  };

  // Get comment priority based on likes count
  const getCommentPriority = (likesCount: number): 'low' | 'medium' | 'high' => {
    if (likesCount >= COMMENT_PRIORITY_THRESHOLDS.HIGH) return 'high';
    if (likesCount >= COMMENT_PRIORITY_THRESHOLDS.MEDIUM) return 'medium';
    return 'low';
  };

  // Get sort icon for column headers
  const getSortIcon = (column: string) => {
    // Map UI column names to database field names for icon display
    const fieldMapping: { [key: string]: string } = {
      'id': 'id',
      'author': 'createdAt',
      'task': 'createdAt',
      'project': 'createdAt',
      'likes': 'createdAt',
      'created': 'createdAt',
      'updated': 'updatedAt',
      'content': 'content'
    };

    const dbField = fieldMapping[column] || column;

    if (currentSortBy !== dbField) {
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

  // Handle sort click
  const handleSort = (column: string) => {
    // Map UI column names to database field names
    const fieldMapping: { [key: string]: string } = {
      'id': 'id',
      'author': 'createdAt',
      'task': 'createdAt',
      'project': 'createdAt',
      'likes': 'createdAt',
      'created': 'createdAt',
      'updated': 'updatedAt',
      'content': 'content'
    };

    const dbField = fieldMapping[column] || column;
    let newSortOrder = 'ASC';

    if (currentSortBy === dbField) {
      // If already sorting by this field, toggle order
      newSortOrder = currentSortOrder === 'ASC' ? 'DESC' : 'ASC';
    }

    onSort(dbField, newSortOrder);
  };

  // Loading skeleton rows
  const renderLoadingRows = () => {
    return Array.from({ length: 5 }).map((_, index) => (
      <tr key={index} className="animate-pulse">
        <td className={`px-4 py-4 whitespace-nowrap text-sm text-gray-900 text-left ${COMMENT_TABLE_COLUMNS.ID.width}`}>
          <div className="h-4 bg-gray-200 rounded w-8"></div>
        </td>
        <td className={`px-4 py-4 text-sm text-gray-900 text-left ${COMMENT_TABLE_COLUMNS.CONTENT.width}`}>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </td>
        <td className={`px-4 py-4 whitespace-nowrap text-sm text-gray-900 text-left ${COMMENT_TABLE_COLUMNS.AUTHOR.width}`}>
          <div className="h-4 bg-gray-200 rounded w-24"></div>
        </td>
        <td className={`px-4 py-4 whitespace-nowrap text-sm text-gray-900 text-left ${COMMENT_TABLE_COLUMNS.TASK.width}`}>
          <div className="h-4 bg-gray-200 rounded w-20"></div>
        </td>
        <td className={`px-4 py-4 whitespace-nowrap text-sm text-gray-900 text-left ${COMMENT_TABLE_COLUMNS.PROJECT.width}`}>
          <div className="h-4 bg-gray-200 rounded w-16"></div>
        </td>
        <td className={`px-4 py-4 whitespace-nowrap text-sm text-gray-900 text-left ${COMMENT_TABLE_COLUMNS.LIKES.width}`}>
          <div className="h-4 bg-gray-200 rounded w-8"></div>
        </td>
        <td className={`px-4 py-4 whitespace-nowrap text-sm text-gray-500 text-left ${COMMENT_TABLE_COLUMNS.CREATED.width}`}>
          <div className="h-4 bg-gray-200 rounded w-20"></div>
        </td>
        <td className={`px-4 py-4 whitespace-nowrap text-sm text-gray-500 text-left ${COMMENT_TABLE_COLUMNS.UPDATED.width}`}>
          <div className="h-4 bg-gray-200 rounded w-20"></div>
        </td>
        <td className={`px-4 py-4 whitespace-nowrap text-left ${COMMENT_TABLE_COLUMNS.ACTIONS.width}`}>
          <div className="flex justify-start space-x-2">
            <div className="h-6 bg-gray-200 rounded w-12"></div>
            <div className="h-6 bg-gray-200 rounded w-16"></div>
          </div>
        </td>
      </tr>
    ));
  };

  if (loading && comments.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 table-fixed">
            <thead className="bg-gray-50">
              <tr>
                <th
                  className={`px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors ${COMMENT_TABLE_COLUMNS.ID.width}`}
                  onClick={() => handleSort('id')}
                >
                  <div className="flex items-center space-x-1">
                    <span>ID</span>
                    {getSortIcon('id')}
                  </div>
                </th>
                <th className={`px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${COMMENT_TABLE_COLUMNS.CONTENT.width}`}>
                  Content
                </th>
                <th className={`px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${COMMENT_TABLE_COLUMNS.AUTHOR.width}`}>
                  Author
                </th>
                <th className={`px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${COMMENT_TABLE_COLUMNS.TASK.width}`}>
                  Task
                </th>
                <th className={`px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${COMMENT_TABLE_COLUMNS.PROJECT.width}`}>
                  Project
                </th>
                <th className={`px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${COMMENT_TABLE_COLUMNS.LIKES.width}`}>
                  Likes
                </th>
                <th className={`px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${COMMENT_TABLE_COLUMNS.CREATED.width}`}>
                  Created
                </th>
                <th className={`px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${COMMENT_TABLE_COLUMNS.UPDATED.width}`}>
                  Updated
                </th>
                <th className={`px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${COMMENT_TABLE_COLUMNS.ACTIONS.width}`}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {renderLoadingRows()}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 table-fixed">
          <thead className="bg-gray-50">
            <tr>
              <th
                className={`px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors ${COMMENT_TABLE_COLUMNS.ID.width}`}
                onClick={() => handleSort('id')}
              >
                <div className="flex items-center space-x-1">
                  <span>ID</span>
                  {getSortIcon('id')}
                </div>
              </th>
              <th className={`px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${COMMENT_TABLE_COLUMNS.CONTENT.width}`}>
                Content
              </th>
              <th
                className={`px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors duration-200 ${COMMENT_TABLE_COLUMNS.AUTHOR.width}`}
                onClick={() => handleSort('createdAt')}
              >
                <div className="flex items-center space-x-1">
                  <span>Author</span>
                  {getSortIcon('createdAt')}
                </div>
              </th>
              <th
                className={`px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors duration-200 ${COMMENT_TABLE_COLUMNS.TASK.width}`}
                onClick={() => handleSort('createdAt')}
              >
                <div className="flex items-center space-x-1">
                  <span>Task</span>
                  {getSortIcon('createdAt')}
                </div>
              </th>
              <th
                className={`px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors duration-200 ${COMMENT_TABLE_COLUMNS.PROJECT.width}`}
                onClick={() => handleSort('createdAt')}
              >
                <div className="flex items-center space-x-1">
                  <span>Project</span>
                  {getSortIcon('createdAt')}
                </div>
              </th>
              <th
                className={`px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors duration-200 ${COMMENT_TABLE_COLUMNS.LIKES.width}`}
                onClick={() => handleSort('createdAt')}
              >
                <div className="flex items-center space-x-1">
                  <span>Likes</span>
                  {getSortIcon('createdAt')}
                </div>
              </th>
              <th
                className={`px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors duration-200 ${COMMENT_TABLE_COLUMNS.CREATED.width}`}
                onClick={() => handleSort('createdAt')}
              >
                <div className="flex items-center space-x-1">
                  <span>Created</span>
                  {getSortIcon('createdAt')}
                </div>
              </th>
              <th
                className={`px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors duration-200 ${COMMENT_TABLE_COLUMNS.UPDATED.width}`}
                onClick={() => handleSort('updatedAt')}
              >
                <div className="flex items-center space-x-1">
                  <span>Updated</span>
                  {getSortIcon('updatedAt')}
                </div>
              </th>
              <th className={`px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${COMMENT_TABLE_COLUMNS.ACTIONS.width}`}>
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {comments.length === 0 ? (
              <tr>
                <td colSpan={9} className="px-6 py-12 text-center text-gray-500">
                  <div className="flex flex-col items-center">
                    <svg className="w-12 h-12 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <p className="text-lg font-medium text-gray-900 mb-1">No comments found</p>
                    <p className="text-gray-500">Try adjusting your search criteria or create a new comment.</p>
                  </div>
                </td>
              </tr>
            ) : (
              comments.map((comment) => {
                const contentLines = formatContentWithWordWrap(comment.content);
                const priority = getCommentPriority(comment.likesCount);

                return (
                  <tr key={comment.id} className="hover:bg-gray-50 transition-colors duration-200">
                    {/* ID */}
                    <td className={`px-4 py-4 whitespace-nowrap text-sm text-gray-900 text-left ${COMMENT_TABLE_COLUMNS.ID.width}`}>
                      {comment.id}
                    </td>

                    {/* Content */}
                    <td className={`px-4 py-4 text-sm text-gray-900 text-left ${COMMENT_TABLE_COLUMNS.CONTENT.width}`}>
                      <div className="space-y-1">
                        {contentLines.map((line, index) => (
                          <p key={index} className="leading-relaxed">
                            {line}
                          </p>
                        ))}
                      </div>
                    </td>

                    {/* Author */}
                    <td className={`px-4 py-4 whitespace-nowrap text-sm text-gray-900 text-left ${COMMENT_TABLE_COLUMNS.AUTHOR.width}`}>
                      <div className="flex flex-col">
                        <p className="font-medium">
                          {comment.author.firstName} {comment.author.lastName}
                        </p>
                        <p className="text-xs text-gray-500">{formatRoleForDisplay(comment.author.role)}</p>
                      </div>
                    </td>

                    {/* Task */}
                    <td className={`px-4 py-4 whitespace-nowrap text-sm text-gray-900 text-left ${COMMENT_TABLE_COLUMNS.TASK.width}`}>
                      <p className="truncate" title={comment.task.title}>
                        {comment.task.title}
                      </p>
                    </td>

                    {/* Project */}
                    <td className={`px-4 py-4 whitespace-nowrap text-sm text-gray-900 text-left ${COMMENT_TABLE_COLUMNS.PROJECT.width}`}>
                      <p className="truncate" title={comment.task.project.name}>
                        {comment.task.project.name}
                      </p>
                    </td>

                    {/* Likes */}
                    <td className={`px-4 py-4 whitespace-nowrap text-sm text-gray-900 text-left ${COMMENT_TABLE_COLUMNS.LIKES.width}`}>
                      <div className="flex items-center space-x-1">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                        <span className={`font-medium ${COMMENT_PRIORITY_COLORS[priority]}`}>
                          {comment.likesCount}
                        </span>
                      </div>
                    </td>

                    {/* Created */}
                    <td className={`px-4 py-4 whitespace-nowrap text-sm text-gray-500 text-left ${COMMENT_TABLE_COLUMNS.CREATED.width}`}>
                      {formatDate(comment.createdAt)}
                    </td>

                    {/* Updated */}
                    <td className={`px-4 py-4 whitespace-nowrap text-sm text-gray-500 text-left ${COMMENT_TABLE_COLUMNS.UPDATED.width}`}>
                      {formatDate(comment.updatedAt)}
                    </td>

                    {/* Actions */}
                    <td className={`px-4 py-4 whitespace-nowrap text-left ${COMMENT_TABLE_COLUMNS.ACTIONS.width}`}>
                      <div className="flex justify-start space-x-2">
                        <button
                          onClick={() => onEdit(comment)}
                          className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors duration-150"
                          title="Edit comment"
                        >
                          <FaEdit className="w-3 h-3 mr-1" />
                          Edit
                        </button>
                        <button
                          onClick={() => onDelete(comment)}
                          className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-150"
                          title="Delete comment"
                        >
                          <FaTrash className="w-3 h-3 mr-1" />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {paginationInfo.totalCount > 0 && (
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          {/* Mobile pagination */}
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={() => onPageChange(paginationInfo.currentPage - 1)}
              disabled={!paginationInfo.hasPreviousPage}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              onClick={() => onPageChange(paginationInfo.currentPage + 1)}
              disabled={!paginationInfo.hasNextPage}
              className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>

          {/* Desktop pagination */}
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            {/* Compact page info */}
            <div className="flex items-center space-x-4">
              <p className="text-sm text-gray-600">
                Showing <span className="font-medium">{paginationInfo.totalCount === 0 ? 0 : (paginationInfo.currentPage - 1) * 10 + 1}</span> to <span className="font-medium">{Math.min(paginationInfo.currentPage * 10, paginationInfo.totalCount)}</span> of <span className="font-medium">{paginationInfo.totalCount}</span>
              </p>

              {/* Compact page size selector */}
              <div className="flex items-center space-x-1">
                <span className="text-sm text-gray-600">Show</span>
                <select
                  id="page-size"
                  value={10}
                  onChange={(e) => onPageSizeChange(parseInt(e.target.value))}
                  disabled={loading}
                  className="px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500 disabled:opacity-50 disabled:cursor-not-allowed bg-white"
                >
                  {PAGE_SIZE_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <span className="text-sm text-gray-600">entries</span>
              </div>
            </div>

            {/* Navigation buttons */}
            <div className="flex items-center space-x-1">
              {/* First page button */}
              <button
                onClick={() => onPageChange(1)}
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
                onClick={() => onPageChange(paginationInfo.currentPage - 1)}
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
                onClick={() => onPageChange(paginationInfo.currentPage + 1)}
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
                onClick={() => onPageChange(paginationInfo.totalPages)}
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
      )}
    </div>
  );
});

CommentsTable.displayName = 'CommentsTable';

export default CommentsTable;
