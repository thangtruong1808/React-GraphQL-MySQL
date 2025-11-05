import React from 'react';
import { CommentSearchInput, CommentsTable } from '../../../../components/commentManagement';
import { CommentsContentProps } from '../types';

/**
 * Comments Page Content Component
 * Displays search input and comments table
 */
export const CommentsContent: React.FC<CommentsContentProps> = ({
  state,
  sortBy,
  sortOrder,
  isSorting,
  canEdit,
  canDelete,
  onSearch,
  onPageChange,
  onPageSizeChange,
  onSort,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="w-full">
      <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8 w-full">
        <div className="space-y-6">
          {/* Search Input */}
          <CommentSearchInput
            value={state.searchTerm}
            onChange={onSearch}
            onSearch={onSearch}
            loading={state.loading && !isSorting}
          />

          {/* Comments Table */}
          <CommentsTable
            comments={state.comments}
            loading={state.loading || isSorting}
            paginationInfo={state.paginationInfo}
            onPageChange={onPageChange}
            onPageSizeChange={onPageSizeChange}
            currentPageSize={state.pageSize}
            onSort={onSort}
            currentSortBy={sortBy}
            currentSortOrder={sortOrder}
            onEdit={canEdit ? onEdit : undefined}
            onDelete={canDelete ? onDelete : undefined}
          />
        </div>
      </div>
    </div>
  );
};

