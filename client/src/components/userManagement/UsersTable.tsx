import React from 'react';
import { UsersTableProps } from '../../types/userManagement';
import UsersTableHeader from './UsersTableHeader';
import UsersTableRow from './UsersTableRow';
import UsersLoadingRows from './UsersLoadingRows';
import UsersEmptyState from './UsersEmptyState';
import UsersTablePagination from './UsersTablePagination';

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

  return (
    <div className="shadow-sm rounded-lg" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)', borderWidth: 1, borderStyle: 'solid', overflow: 'hidden' }}>
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full table-fixed">
          {/* Table Header */}
          <UsersTableHeader
            currentSortBy={currentSortBy}
            currentSortOrder={currentSortOrder}
            onSort={handleSort}
          />

          {/* Table Body */}
          <tbody style={{ backgroundColor: 'var(--table-row-bg)', color: 'var(--table-text-primary)' }}>
            {loading ? (
              // Loading skeleton rows
              <UsersLoadingRows pageSize={currentPageSize} />
            ) : users.length === 0 ? (
              // Empty state
              <UsersEmptyState />
            ) : (
              // User rows
              users.map((user) => (
                <UsersTableRow
                  key={user.id}
                  user={user}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <UsersTablePagination
        paginationInfo={paginationInfo}
        currentPageSize={currentPageSize}
        loading={loading}
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
      />
    </div>
  );
};

export default UsersTable;
