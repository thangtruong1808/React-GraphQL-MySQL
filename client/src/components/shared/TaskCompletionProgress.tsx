import React from 'react';
import { SimpleChart } from '../charts';

/**
 * Description: Renders task completion distribution with themed styling inside the public dashboard content grid.
 * Data created: Forwards supplied task statistics into the chart component without persisting new state.
 * Author: thangtruong
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
    <div
      className="shadow-lg border theme-border rounded-2xl p-4"
      style={{
        backgroundColor: 'var(--card-bg)',
        backgroundImage: 'var(--card-surface-overlay)',
        borderColor: 'var(--border-color)'
      }}
    >
      <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>Task Completion Progress</h3>

      {/* Description */}
      <p className="text-sm mb-4 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
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
