import React from 'react';
import { ActivitySearchInput, ActivitiesTable } from '../../../../components/activityManagement';
import { InlineError } from '../../../../components/ui';
import { ActivityManagementContentProps } from '../types';

/**
 * Activity Management Page Content Component
 * Displays search input, error messages, and activities table
 */
export const ActivityManagementContent: React.FC<ActivityManagementContentProps> = ({
  state,
  sortBy,
  sortOrder,
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
        {/* Error Display */}
        {state.error && (
          <div className="mb-6">
            <InlineError message={state.error} />
          </div>
        )}

        {/* Search Input */}
        <div className="mb-6">
          <ActivitySearchInput
            value={state.searchQuery}
            onChange={onSearch}
            placeholder="Search activities by action, type, or user..."
            loading={state.loading}
          />
        </div>

        {/* Activities Table */}
        <ActivitiesTable
          activities={state.activities}
          loading={state.loading}
          paginationInfo={state.paginationInfo}
          currentPage={state.currentPage}
          currentPageSize={state.pageSize}
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
  );
};

