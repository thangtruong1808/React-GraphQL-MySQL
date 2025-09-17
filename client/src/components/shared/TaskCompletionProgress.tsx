import React from 'react';
import { SimpleChart } from '../charts';
import TaskLikesDisplay from './TaskLikesDisplay';

/**
 * Task Completion Progress Component
 * Displays task completion progress with charts and task likes information
 * Shows completed, in progress, and todo tasks with their individual like counts
 */

// Props interface for TaskCompletionProgress component
interface TaskCompletionProgressProps {
  stats: {
    totalTasks: number;
    completedTasks: number;
    inProgressTasks: number;
    todoTasks: number;
    likesOnCompletedTasks: number;
    likesOnInProgressTasks: number;
    likesOnTodoTasks: number;
    tasksWithLikesCompleted: Array<{ taskName: string; likeCount: number }>;
    tasksWithLikesInProgress: Array<{ taskName: string; likeCount: number }>;
    tasksWithLikesTodo: Array<{ taskName: string; likeCount: number }>;
  };
}

/**
 * TaskCompletionProgress Component
 * Renders task completion progress chart and task likes information
 * Uses bar chart to visualize task completion progress
 */
const TaskCompletionProgress: React.FC<TaskCompletionProgressProps> = ({ stats }) => {
  return (
    <div className="shadow-lg border border-pink-100 bg-white rounded-xl p-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-3">Task Completion Progress</h3>

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

      {/* Likes and User Information */}
      <div className="space-y-2">
        {/* Completed Tasks Likes */}
        <TaskLikesDisplay
          taskStatus="Completed"
          likeCount={stats.likesOnCompletedTasks}
          tasksWithLikes={stats.tasksWithLikesCompleted}
          colorScheme={{
            text: "text-green-600",
            bg: "bg-green-100 text-green-800",
            icon: "text-green-600"
          }}
        />

        {/* In Progress Tasks Likes */}
        <TaskLikesDisplay
          taskStatus="In Progress"
          likeCount={stats.likesOnInProgressTasks}
          tasksWithLikes={stats.tasksWithLikesInProgress}
          colorScheme={{
            text: "text-blue-600",
            bg: "bg-blue-100 text-blue-800",
            icon: "text-blue-600"
          }}
        />

        {/* Todo Tasks Likes */}
        <TaskLikesDisplay
          taskStatus="Todo"
          likeCount={stats.likesOnTodoTasks}
          tasksWithLikes={stats.tasksWithLikesTodo}
          colorScheme={{
            text: "text-gray-600",
            bg: "bg-gray-100 text-gray-800",
            icon: "text-gray-600"
          }}
        />
      </div>
    </div>
  );
};

export default TaskCompletionProgress;
