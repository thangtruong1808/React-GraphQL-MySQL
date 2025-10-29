import React from 'react';
import { SimpleChart } from '../charts';

/**
 * Task Completion Progress Component
 * Displays task completion progress with charts
 * Shows completed, in progress, and todo tasks counts from database
 */

// Props interface for TaskCompletionProgress component
interface TaskCompletionProgressProps {
  stats: {
    totalTasks: number;
    completedTasks: number;
    inProgressTasks: number;
    todoTasks: number;
  };
}

/**
 * TaskCompletionProgress Component
 * Renders task completion progress chart
 * Uses bar chart to visualize task completion progress
 */
const TaskCompletionProgress: React.FC<TaskCompletionProgressProps> = ({ stats }) => {
  return (
    <div className="bg-white shadow-lg border border-gray-200 rounded-2xl p-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-2">Task Completion Progress</h3>

      {/* Description */}
      <p className="text-sm text-gray-600 mb-4 leading-relaxed">
        Monitor your task completion rates and workflow efficiency. Keep track of pending, ongoing, and finished tasks to maintain optimal productivity across all projects.
      </p>

      {/* Chart */}
      <SimpleChart
        title=""
        type="bar"
        data={[
          { label: 'Completed', value: stats.completedTasks, color: '#ec4899' },
          { label: 'In Progress', value: stats.inProgressTasks, color: '#06b6d4' },
          { label: 'Todo', value: stats.todoTasks, color: '#6b7280' },
        ]}
        maxValue={stats.totalTasks}
        className="mb-4"
      />
    </div>
  );
};

export default TaskCompletionProgress;
