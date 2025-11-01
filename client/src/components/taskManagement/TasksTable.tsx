import React from 'react';
import { TasksTableProps } from '../../types/taskManagement';
import TasksTableHeader from './TasksTableHeader';
import TasksTableRow from './TasksTableRow';
import TasksLoadingRows from './TasksLoadingRows';
import TasksEmptyState from './TasksEmptyState';
import TasksTablePagination from './TasksTablePagination';

/**
 * Tasks Table Component
 * Displays tasks in a professional table with sorting, pagination, and CRUD actions
 * Features modern design with responsive layout and interactive elements
 */
const TasksTable: React.FC<TasksTableProps> = ({
  tasks,
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
  // Handle column sorting
  const handleSort = (sortBy: string) => {
    const newSortOrder = currentSortBy === sortBy && currentSortOrder === 'ASC' ? 'DESC' : 'ASC';
    onSort(sortBy, newSortOrder);
  };

  return (
    <div className="rounded-lg shadow-sm" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)', borderWidth: 1, borderStyle: 'solid', overflow: 'hidden' }}>
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full table-fixed">
          {/* Table Header */}
          <TasksTableHeader
            currentSortBy={currentSortBy}
            currentSortOrder={currentSortOrder}
            onSort={handleSort}
          />

          {/* Table Body */}
          <tbody style={{ backgroundColor: 'var(--table-row-bg)' }}>
            {loading ? (
              // Loading skeleton rows
              <TasksLoadingRows />
            ) : tasks.length === 0 ? (
              // No data row
              <TasksEmptyState />
            ) : (
              // Data rows
              tasks.map((task) => (
                <TasksTableRow
                  key={task.id}
                  task={task}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <TasksTablePagination
        paginationInfo={paginationInfo}
        currentPageSize={currentPageSize}
        loading={loading}
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
      />
    </div>
  );
};

export default TasksTable;
