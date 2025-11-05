import React from 'react';
import { ActivitiesTable, ActivitySearchInput } from '../../../../components/activityManagement';
import { InlineError } from '../../../../components/ui';
import { ActivitiesContentProps } from '../types';

/**
 * Activities Page Content Component
 * Displays search input, error messages, and activities table
 */
export const ActivitiesContent: React.FC<ActivitiesContentProps> = ({
  state,
  sortBy,
  sortOrder,
  onSearch,
  onPageChange,
  onPageSizeChange,
  onSort,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="w-full">
      <div className="px-8 py-8 w-full">
        <div className="space-y-6">
          {/* Error Display */}
          {state.error && <InlineError message={state.error} />}

          {/* Search and Filters */}
          <div>
            <ActivitySearchInput
              value={state.searchQuery}
              onChange={onSearch}
              placeholder="Search activities by user, action, type, or content..."
              loading={state.loading}
            />
          </div>

          {/* Activities Table */}
          <div
            className="shadow rounded-lg"
            style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-color)', overflow: 'hidden' }}
          >
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
              onEdit={onEdit}
              onDelete={onDelete}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

