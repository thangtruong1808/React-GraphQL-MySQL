import React from 'react';
import { TaskSearchInput, TasksTable } from '../../../../components/taskManagement';
import { TaskManagementState } from '../../../../types/taskManagement';

/**
 * Tasks Content Props
 */
export interface TasksContentProps {
  state: TaskManagementState;
  sortBy: string;
  sortOrder: string;
  canEdit: boolean;
  canDelete: boolean;
  onSearchChange: (query: string) => void;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  onSort: (sortBy: string, sortOrder: string) => void;
  onEdit: (task: any) => void;
  onDelete: (task: any) => void;
}

/**
 * Tasks Content Component
 * Displays search input and tasks table
 */
export const TasksContent: React.FC<TasksContentProps> = ({
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
    <div className="w-full">
      <div className="px-8 py-8 w-full">
        {/* Search and Table */}
        <div className="space-y-6">
          {/* Search Input */}
          <TaskSearchInput
            value={state.searchQuery}
            onChange={onSearchChange}
            loading={state.loading}
          />

          {/* Tasks Table */}
          <TasksTable
            tasks={state.tasks}
            paginationInfo={state.paginationInfo}
            loading={state.loading}
            onEdit={canEdit ? onEdit : () => {}}
            onDelete={canDelete ? onDelete : async () => {}}
            onPageChange={onPageChange}
            onPageSizeChange={onPageSizeChange}
            currentPageSize={state.pageSize}
            onSort={onSort}
            currentSortBy={sortBy}
            currentSortOrder={sortOrder}
          />
        </div>
      </div>
    </div>
  );
};

