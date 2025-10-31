import React from 'react';
import { ActivitiesTableProps } from '../../types/activityManagement';
import { ACTIVITY_TABLE_COLUMNS } from '../../constants/activityManagement';
import ActivityTableHeader from './table/ActivityTableHeader';
import ActivityTableRow from './table/ActivityTableRow';
import ActivityLoadingSkeleton from './table/ActivityLoadingSkeleton';
import ActivityEmptyState from './table/ActivityEmptyState';
import ActivityPagination from './table/ActivityPagination';

/**
 * Activities Table Component
 * Displays activities in a paginated table with sorting and CRUD actions
 * Features responsive design and loading states
 */
const ActivitiesTable: React.FC<ActivitiesTableProps> = ({
  activities,
  loading,
  paginationInfo,
  currentPage,
  currentPageSize,
  onPageChange,
  onPageSizeChange,
  onSort,
  currentSortBy,
  currentSortOrder,
  onEdit,
  onDelete,
}) => {
  // Show loading state with skeleton rows
  if (loading && activities.length === 0) {
    return (
      <div className="rounded-lg shadow overflow-hidden" style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-color)' }}>
        <div className="overflow-x-auto">
          <table className="min-w-full theme-table-divide table-fixed">
            <thead className="theme-table-header-bg">
              <tr>
                <th className={`px-4 py-3 text-left text-xs font-medium theme-table-text-secondary uppercase tracking-wider ${ACTIVITY_TABLE_COLUMNS.ID.width}`}>
                  ID
                </th>
                <th className={`px-4 py-3 text-left text-xs font-medium theme-table-text-secondary uppercase tracking-wider ${ACTIVITY_TABLE_COLUMNS.USER.width}`}>
                  User
                </th>
                <th className={`px-4 py-3 text-left text-xs font-medium theme-table-text-secondary uppercase tracking-wider ${ACTIVITY_TABLE_COLUMNS.TYPE.width}`}>
                  Type
                </th>
                <th className={`px-4 py-3 text-left text-xs font-medium theme-table-text-secondary uppercase tracking-wider ${ACTIVITY_TABLE_COLUMNS.ACTION.width}`}>
                  Action
                </th>
                <th className={`px-4 py-3 text-left text-xs font-medium theme-table-text-secondary uppercase tracking-wider ${ACTIVITY_TABLE_COLUMNS.TARGET_USER.width}`}>
                  Target User
                </th>
                <th className={`px-4 py-3 text-left text-xs font-medium theme-table-text-secondary uppercase tracking-wider ${ACTIVITY_TABLE_COLUMNS.PROJECT.width}`}>
                  Project
                </th>
                <th className={`px-4 py-3 text-left text-xs font-medium theme-table-text-secondary uppercase tracking-wider ${ACTIVITY_TABLE_COLUMNS.TASK.width}`}>
                  Task
                </th>
                <th className={`px-4 py-3 text-left text-xs font-medium theme-table-text-secondary uppercase tracking-wider ${ACTIVITY_TABLE_COLUMNS.CREATED.width}`}>
                  Created
                </th>
                <th className={`px-4 py-3 text-left text-xs font-medium theme-table-text-secondary uppercase tracking-wider ${ACTIVITY_TABLE_COLUMNS.UPDATED.width}`}>
                  Updated
                </th>
                <th className={`px-4 py-3 text-left text-xs font-medium theme-table-text-secondary uppercase tracking-wider ${ACTIVITY_TABLE_COLUMNS.ACTIONS.width}`}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="theme-table-row-bg theme-table-divide">
              <ActivityLoadingSkeleton />
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg shadow overflow-hidden" style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-color)' }}>
      <div className="overflow-x-auto">
        <table className="min-w-full theme-table-divide table-fixed">
          <ActivityTableHeader
            currentSortBy={currentSortBy}
            currentSortOrder={currentSortOrder}
            onSort={onSort}
          />
          <tbody className="theme-table-row-bg theme-table-divide">
            {activities.length === 0 ? (
              <ActivityEmptyState />
            ) : (
              activities.map((activity) => (
                <ActivityTableRow
                  key={activity.id}
                  activity={activity}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <ActivityPagination
        currentPage={currentPage}
        currentPageSize={currentPageSize}
        paginationInfo={paginationInfo}
        loading={loading}
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
      />
    </div>
  );
};

export default ActivitiesTable;
