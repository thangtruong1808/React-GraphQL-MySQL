import React from 'react';
import { TagSearchInput, TagsTable } from '../../../../components/tagsManagement';
import { TagsPageState } from '../types';

/**
 * Tags Content Props
 */
export interface TagsContentProps {
  state: TagsPageState;
  sortBy: string;
  sortOrder: 'ASC' | 'DESC';
  canEdit: boolean;
  canDelete: boolean;
  onSearchChange: (query: string) => void;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  onSort: (sortBy: string, sortOrder: string) => void;
  onEdit: (tag: any) => void;
  onDelete: (tag: any) => void;
}

/**
 * Tags Content Component
 * Displays search input and tags table
 */
export const TagsContent: React.FC<TagsContentProps> = ({
  state,
  sortBy,
  sortOrder,
  canEdit,
  canDelete,
  onSearchChange,
  onPageChange,
  onPageSizeChange,
  onSort,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="w-full min-h-screen" style={{ background: 'var(--bg-base)' }}>
      <div className="px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="space-y-6">
          {/* Search Section */}
          <div>
            <TagSearchInput
              onSearch={onSearchChange}
              placeholder="Search by name, description, type, or category..."
              loading={state.loading}
            />
          </div>

          {/* Table Section */}
          <div className="rounded-xl shadow-sm overflow-hidden" style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-color)' }}>
            <TagsTable
              tags={state.tags}
              loading={state.loading}
              paginationInfo={state.paginationInfo}
              pageSize={state.pageSize}
              onPageChange={onPageChange}
              onPageSizeChange={onPageSizeChange}
              onSort={onSort}
              currentSortBy={sortBy}
              currentSortOrder={sortOrder}
              onEdit={canEdit ? onEdit : undefined}
              onDelete={canDelete ? onDelete : undefined}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

