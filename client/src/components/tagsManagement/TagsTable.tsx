import React from 'react';
import { TagsTableProps } from '../../types/tagsManagement';
import { getDbField } from './tagsUtils';
import TagsTableHeader from './TagsTableHeader';
import TagsTableStaticHeader from './TagsTableStaticHeader';
import TagsTableRow from './TagsTableRow';
import TagsLoadingRows from './TagsLoadingRows';
import TagsEmptyState from './TagsEmptyState';
import TagsTablePagination from './TagsTablePagination';

/**
 * Tags Table Component
 * Displays tags in a paginated table with sorting and CRUD actions
 * Features responsive design and loading states
 */
const TagsTable: React.FC<TagsTableProps> = ({
  tags,
  loading,
  paginationInfo,
  pageSize,
  onPageChange,
  onPageSizeChange,
  onSort,
  currentSortBy,
  currentSortOrder,
  onEdit,
  onDelete,
}) => {
  // Handle sort click
  const handleSort = (column: string) => {
    const dbField = getDbField(column);
    let newSortOrder = 'ASC';

    if (currentSortBy === dbField) {
      // If already sorting by this field, toggle order
      newSortOrder = currentSortOrder === 'ASC' ? 'DESC' : 'ASC';
    }

    onSort(dbField, newSortOrder);
  };

  // Loading state with no tags
  if (loading && tags.length === 0) {
    return (
      <div className="rounded-lg shadow overflow-hidden" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)', borderStyle: 'solid', borderWidth: 1, overflow: 'hidden' }}>
        <div className="overflow-x-auto">
          <table className="min-w-full theme-table-divide table-fixed">
            <TagsTableStaticHeader />
            <tbody className="theme-table-row-bg theme-table-divide">
              <TagsLoadingRows />
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl shadow-lg overflow-hidden" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)', borderStyle: 'solid', borderWidth: 1, overflow: 'hidden' }}>
      <div className="overflow-x-auto">
        <table className="min-w-full" style={{ borderColor: 'var(--border-color)' }}>
          <TagsTableHeader
            currentSortBy={currentSortBy}
            currentSortOrder={currentSortOrder}
            onSort={handleSort}
          />
          <tbody style={{ backgroundColor: 'var(--table-row-bg)' }}>
            {loading ? (
              <TagsLoadingRows />
            ) : tags.length === 0 ? (
              <TagsEmptyState />
            ) : (
              tags.map((tag) => (
                <TagsTableRow
                  key={tag.id}
                  tag={tag}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <TagsTablePagination
        paginationInfo={paginationInfo}
        pageSize={pageSize}
        loading={loading}
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
      />
    </div>
  );
};

export default TagsTable;
