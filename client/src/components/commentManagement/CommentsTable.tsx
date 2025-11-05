import React, { memo } from 'react';
import { CommentsTableProps } from '../../types/commentManagement';
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
            {loading ? (
              // Loading skeleton rows
              <CommentLoadingSkeleton />
            ) : comments.length === 0 ? (
              // No data row
              <CommentEmptyState />
            ) : (
              // Data rows
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
