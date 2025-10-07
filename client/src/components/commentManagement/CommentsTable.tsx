import React from 'react';
import { CommentsTableProps } from '../../types/commentManagement';
import { COMMENT_TABLE_COLUMNS, COMMENT_PRIORITY_THRESHOLDS, COMMENT_PRIORITY_COLORS, COMMENT_DISPLAY_SETTINGS } from '../../constants/commentManagement';

/**
 * CommentsTable Component
 * Displays comments in a table with pagination, sorting, and CRUD actions
 * Includes word wrapping for content and proper date formatting
 */
const CommentsTable: React.FC<CommentsTableProps> = ({
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
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
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
    if (currentSortBy !== column) {
      return (
        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
        </svg>
      );
    }

    return currentSortOrder === 'ASC' ? (
      <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
      </svg>
    ) : (
      <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    );
  };

  // Handle sort click
  const handleSort = (column: string) => {
    if (!COMMENT_TABLE_COLUMNS[column as keyof typeof COMMENT_TABLE_COLUMNS]?.sortable) return;

    const newOrder = currentSortBy === column && currentSortOrder === 'ASC' ? 'DESC' : 'ASC';
    onSort(column, newOrder);
  };

  // Loading skeleton rows
  const renderLoadingRows = () => {
    return Array.from({ length: 5 }).map((_, index) => (
      <tr key={index} className="border-b border-gray-200 animate-pulse">
        <td className={`px-6 py-4 ${COMMENT_TABLE_COLUMNS.CONTENT.width}`}>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </td>
        <td className={`px-6 py-4 ${COMMENT_TABLE_COLUMNS.AUTHOR.width}`}>
          <div className="h-4 bg-gray-200 rounded w-24"></div>
        </td>
        <td className={`px-6 py-4 ${COMMENT_TABLE_COLUMNS.TASK.width}`}>
          <div className="h-4 bg-gray-200 rounded w-20"></div>
        </td>
        <td className={`px-6 py-4 ${COMMENT_TABLE_COLUMNS.PROJECT.width}`}>
          <div className="h-4 bg-gray-200 rounded w-16"></div>
        </td>
        <td className={`px-6 py-4 ${COMMENT_TABLE_COLUMNS.LIKES.width}`}>
          <div className="h-4 bg-gray-200 rounded w-8"></div>
        </td>
        <td className={`px-6 py-4 ${COMMENT_TABLE_COLUMNS.CREATED.width}`}>
          <div className="h-4 bg-gray-200 rounded w-20"></div>
        </td>
        <td className={`px-6 py-4 ${COMMENT_TABLE_COLUMNS.ACTIONS.width}`}>
          <div className="h-4 bg-gray-200 rounded w-16"></div>
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
                <th className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${COMMENT_TABLE_COLUMNS.CONTENT.width}`}>
                  Content
                </th>
                <th className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${COMMENT_TABLE_COLUMNS.AUTHOR.width}`}>
                  Author
                </th>
                <th className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${COMMENT_TABLE_COLUMNS.TASK.width}`}>
                  Task
                </th>
                <th className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${COMMENT_TABLE_COLUMNS.PROJECT.width}`}>
                  Project
                </th>
                <th className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${COMMENT_TABLE_COLUMNS.LIKES.width}`}>
                  Likes
                </th>
                <th className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${COMMENT_TABLE_COLUMNS.CREATED.width}`}>
                  Created
                </th>
                <th className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${COMMENT_TABLE_COLUMNS.ACTIONS.width}`}>
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
              <th className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${COMMENT_TABLE_COLUMNS.CONTENT.width}`}>
                Content
              </th>
              <th
                className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors duration-200 ${COMMENT_TABLE_COLUMNS.AUTHOR.width}`}
                onClick={() => handleSort('author')}
              >
                <div className="flex items-center space-x-1">
                  <span>Author</span>
                  {getSortIcon('author')}
                </div>
              </th>
              <th
                className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors duration-200 ${COMMENT_TABLE_COLUMNS.TASK.width}`}
                onClick={() => handleSort('task')}
              >
                <div className="flex items-center space-x-1">
                  <span>Task</span>
                  {getSortIcon('task')}
                </div>
              </th>
              <th
                className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors duration-200 ${COMMENT_TABLE_COLUMNS.PROJECT.width}`}
                onClick={() => handleSort('project')}
              >
                <div className="flex items-center space-x-1">
                  <span>Project</span>
                  {getSortIcon('project')}
                </div>
              </th>
              <th
                className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors duration-200 ${COMMENT_TABLE_COLUMNS.LIKES.width}`}
                onClick={() => handleSort('likesCount')}
              >
                <div className="flex items-center space-x-1">
                  <span>Likes</span>
                  {getSortIcon('likesCount')}
                </div>
              </th>
              <th
                className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors duration-200 ${COMMENT_TABLE_COLUMNS.CREATED.width}`}
                onClick={() => handleSort('createdAt')}
              >
                <div className="flex items-center space-x-1">
                  <span>Created</span>
                  {getSortIcon('createdAt')}
                </div>
              </th>
              <th className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${COMMENT_TABLE_COLUMNS.ACTIONS.width}`}>
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {comments.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
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
                    {/* Content */}
                    <td className={`px-6 py-4 ${COMMENT_TABLE_COLUMNS.CONTENT.width}`}>
                      <div className="space-y-1">
                        {contentLines.map((line, index) => (
                          <p key={index} className="text-sm text-gray-900 leading-relaxed">
                            {line}
                          </p>
                        ))}
                      </div>
                    </td>

                    {/* Author */}
                    <td className={`px-6 py-4 ${COMMENT_TABLE_COLUMNS.AUTHOR.width}`}>
                      <div className="flex flex-col">
                        <p className="text-sm font-medium text-gray-900">
                          {comment.author.firstName} {comment.author.lastName}
                        </p>
                        <p className="text-xs text-gray-500">{comment.author.role}</p>
                      </div>
                    </td>

                    {/* Task */}
                    <td className={`px-6 py-4 ${COMMENT_TABLE_COLUMNS.TASK.width}`}>
                      <p className="text-sm text-gray-900 truncate" title={comment.task.title}>
                        {comment.task.title}
                      </p>
                    </td>

                    {/* Project */}
                    <td className={`px-6 py-4 ${COMMENT_TABLE_COLUMNS.PROJECT.width}`}>
                      <p className="text-sm text-gray-900 truncate" title={comment.task.project.name}>
                        {comment.task.project.name}
                      </p>
                    </td>

                    {/* Likes */}
                    <td className={`px-6 py-4 ${COMMENT_TABLE_COLUMNS.LIKES.width}`}>
                      <div className="flex items-center space-x-1">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                        <span className={`text-sm font-medium ${COMMENT_PRIORITY_COLORS[priority]}`}>
                          {comment.likesCount}
                        </span>
                      </div>
                    </td>

                    {/* Created */}
                    <td className={`px-6 py-4 ${COMMENT_TABLE_COLUMNS.CREATED.width}`}>
                      <p className="text-sm text-gray-900">
                        {formatDate(comment.createdAt)}
                      </p>
                    </td>

                    {/* Actions */}
                    <td className={`px-6 py-4 ${COMMENT_TABLE_COLUMNS.ACTIONS.width}`}>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => onEdit(comment)}
                          className="text-blue-600 hover:text-blue-800 transition-colors duration-200"
                          title="Edit comment"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => onDelete(comment)}
                          className="text-red-600 hover:text-red-800 transition-colors duration-200"
                          title="Delete comment"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
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
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing{' '}
                <span className="font-medium">
                  {((paginationInfo.currentPage - 1) * 10) + 1}
                </span>{' '}
                to{' '}
                <span className="font-medium">
                  {Math.min(paginationInfo.currentPage * 10, paginationInfo.totalCount)}
                </span>{' '}
                of{' '}
                <span className="font-medium">{paginationInfo.totalCount}</span>{' '}
                results
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button
                  onClick={() => onPageChange(paginationInfo.currentPage - 1)}
                  disabled={!paginationInfo.hasPreviousPage}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="sr-only">Previous</span>
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </button>

                {/* Page numbers */}
                {Array.from({ length: Math.min(5, paginationInfo.totalPages) }, (_, i) => {
                  const pageNumber = i + 1;
                  const isCurrentPage = pageNumber === paginationInfo.currentPage;

                  return (
                    <button
                      key={pageNumber}
                      onClick={() => onPageChange(pageNumber)}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${isCurrentPage
                          ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                          : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                        }`}
                    >
                      {pageNumber}
                    </button>
                  );
                })}

                <button
                  onClick={() => onPageChange(paginationInfo.currentPage + 1)}
                  disabled={!paginationInfo.hasNextPage}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="sr-only">Next</span>
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommentsTable;
