import React, { memo } from 'react';
import { CommentsTableProps } from '../../types/commentManagement';
import { COMMENT_TABLE_COLUMNS } from '../../constants/commentManagement';
import CommentTableHeader from './table/CommentTableHeader';
import CommentTableRow from './table/CommentTableRow';
import CommentLoadingSkeleton from './table/CommentLoadingSkeleton';
import CommentEmptyState from './table/CommentEmptyState';
import CommentPagination from './table/CommentPagination';

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
  currentPageSize,
  onSort,
  currentSortBy,
  currentSortOrder,
  onEdit,
  onDelete,
}) => {
  // Show loading state with skeleton rows
  if (loading && comments.length === 0) {
    return (
      <div className="rounded-lg shadow overflow-hidden" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)', borderWidth: 1, borderStyle: 'solid' }}>
        <div className="overflow-x-auto">
          <table className="min-w-full table-fixed">
            <thead style={{ backgroundColor: 'var(--table-header-bg)', borderBottomColor: 'var(--border-color)', borderBottomWidth: 1 }}>
              <tr>
                <th className={`hidden lg:table-cell px-4 py-3 text-left text-xs font-medium theme-table-text-secondary uppercase tracking-wider cursor-pointer table-row-hover transition-colors ${COMMENT_TABLE_COLUMNS.ID.width}`}>
                  ID
                </th>
                <th className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider ${COMMENT_TABLE_COLUMNS.CONTENT.width}`} style={{ color: 'var(--table-text-secondary)' }}>
                  Content
                </th>
                <th className={`hidden sm:table-cell px-4 py-3 text-left text-xs font-medium theme-table-text-secondary uppercase tracking-wider ${COMMENT_TABLE_COLUMNS.AUTHOR.width}`}>
                  Author
                </th>
                <th className={`hidden xs:table-cell px-4 py-3 text-left text-xs font-medium theme-table-text-secondary uppercase tracking-wider ${COMMENT_TABLE_COLUMNS.TASK.width}`}>
                  Task
                </th>
                <th className={`hidden lg:table-cell px-4 py-3 text-left text-xs font-medium theme-table-text-secondary uppercase tracking-wider ${COMMENT_TABLE_COLUMNS.PROJECT.width}`}>
                  Project
                </th>
                <th className={`hidden sm:table-cell px-4 py-3 text-left text-xs font-medium theme-table-text-secondary uppercase tracking-wider ${COMMENT_TABLE_COLUMNS.LIKES.width}`}>
                  Likes
                </th>
                <th className={`hidden xs:table-cell px-4 py-3 text-left text-xs font-medium theme-table-text-secondary uppercase tracking-wider ${COMMENT_TABLE_COLUMNS.CREATED.width}`}>
                  Created
                </th>
                <th className={`hidden lg:table-cell px-4 py-3 text-left text-xs font-medium theme-table-text-secondary uppercase tracking-wider ${COMMENT_TABLE_COLUMNS.UPDATED.width}`}>
                  Updated
                </th>
                <th className={`px-4 py-3 text-left text-xs font-medium theme-table-text-secondary uppercase tracking-wider ${COMMENT_TABLE_COLUMNS.ACTIONS.width}`}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody style={{ backgroundColor: 'var(--table-row-bg)' }}>
              <CommentLoadingSkeleton />
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg shadow overflow-hidden" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)', borderWidth: 1, borderStyle: 'solid' }}>
      <div className="overflow-x-auto">
        <table className="min-w-full table-fixed">
          <CommentTableHeader
            currentSortBy={currentSortBy}
            currentSortOrder={currentSortOrder}
            onSort={onSort}
          />
          <tbody style={{ backgroundColor: 'var(--table-row-bg)' }}>
            {comments.length === 0 ? (
              <CommentEmptyState />
            ) : (
              comments.map((comment) => (
                <CommentTableRow
                  key={comment.id}
                  comment={comment}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <CommentPagination
        currentPage={paginationInfo.currentPage}
        currentPageSize={currentPageSize}
        paginationInfo={paginationInfo}
        loading={loading}
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
      />
    </div>
  );
});

CommentsTable.displayName = 'CommentsTable';

export default CommentsTable;
