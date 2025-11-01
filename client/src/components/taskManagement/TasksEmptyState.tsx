import React from 'react';

/**
 * Tasks Empty State Component
 * Displays message when no tasks are found
 */
const TasksEmptyState: React.FC = () => {
  return (
    <tr>
      <td colSpan={4} className="px-4 py-8 text-center theme-table-text-secondary sm:hidden">
        No tasks found
      </td>
      <td colSpan={6} className="hidden sm:table-cell lg:hidden px-4 py-8 text-center theme-table-text-secondary">
        No tasks found
      </td>
      <td colSpan={12} className="hidden lg:table-cell px-4 py-8 text-center theme-table-text-secondary">
        No tasks found
      </td>
    </tr>
  );
};

export default TasksEmptyState;

