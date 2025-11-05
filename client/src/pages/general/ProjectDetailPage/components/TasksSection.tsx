import React from 'react';
import { Task } from '../../../../services/graphql/taskSubscriptions';

/**
 * Tasks Section Props
 */
export interface TasksSectionProps {
  tasks: Task[];
  loading: boolean;
  getTaskStatusColor: (status: string) => string;
  getTaskPriorityColor: (priority: string) => string;
  formatDueDate: (dateString: string) => string;
}

/**
 * Tasks Section Component
 * Displays project tasks in a grid layout
 */
export const TasksSection: React.FC<TasksSectionProps> = ({
  tasks,
  loading,
  getTaskStatusColor,
  getTaskPriorityColor,
  formatDueDate,
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 [data-theme='brand']:bg-gradient-to-br [data-theme='brand']:from-purple-50 [data-theme='brand']:to-pink-50 rounded-lg shadow-lg dark:shadow-gray-900/20 [data-theme='brand']:shadow-purple-200/20 p-6 mt-6 border border-gray-200 dark:border-gray-700 [data-theme='brand']:border-purple-200">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white [data-theme='brand']:text-purple-900">
          Project Tasks
        </h2>
        {loading && (
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 [data-theme='brand']:text-purple-700">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600 dark:border-purple-400 [data-theme='brand']:border-purple-600 mr-2"></div>
            Updating tasks...
          </div>
        )}
      </div>
      {tasks.length === 0 ? (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400 [data-theme='brand']:text-purple-700">
          <svg
            className="w-12 h-12 mx-auto mb-4 text-gray-400 dark:text-gray-500 [data-theme='brand']:text-purple-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
            />
          </svg>
          No tasks found for this project.
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {tasks.map((task, index) => (
            <div
              key={task.id}
              className="bg-white dark:bg-gray-800 [data-theme='brand']:bg-white border border-gray-200 dark:border-gray-600 [data-theme='brand']:border-purple-200 rounded-lg p-5 transition-all duration-500 transform hover:-translate-y-1 hover:shadow-xl hover:border-gray-300 dark:hover:border-gray-500 [data-theme='brand']:hover:border-purple-300 dark:hover:shadow-gray-900/30 [data-theme='brand']:hover:shadow-purple-200/30"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  {/* Task Number and Title */}
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-purple-600 dark:bg-purple-600 [data-theme='brand']:bg-purple-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold text-sm">{index + 1}</span>
                    </div>
                    <h3 className="font-semibold text-gray-900 dark:text-white [data-theme='brand']:text-purple-900 text-lg">
                      {task.title}
                    </h3>
                  </div>

                  {/* Task Description */}
                  {task.description && (
                    <p className="text-gray-600 dark:text-gray-300 [data-theme='brand']:text-purple-800 mb-3 text-sm leading-relaxed">
                      {task.description}
                    </p>
                  )}

                  {/* Status and Priority Row */}
                  <div className="flex items-center space-x-3 mb-3">
                    <span className={`px-3 py-1.5 rounded-full text-xs font-semibold ${getTaskStatusColor(task.status)}`}>
                      {task.status === 'DONE'
                        ? '✅ Done'
                        : task.status === 'IN_PROGRESS'
                          ? '🔄 In Progress'
                          : '📋 To Do'}
                    </span>
                    <span className={`px-3 py-1.5 rounded-full text-xs font-semibold ${getTaskPriorityColor(task.priority)}`}>
                      {task.priority === 'HIGH'
                        ? '🔴 High Priority'
                        : task.priority === 'MEDIUM'
                          ? '🟡 Medium Priority'
                          : '⚪ Low Priority'}
                    </span>
                  </div>

                  {/* Task Details Row */}
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400 [data-theme='brand']:text-purple-800">
                    {task.assignedUser && (
                      <div className="flex items-center space-x-2">
                        <svg
                          className="w-4 h-4 text-gray-400 dark:text-gray-500 [data-theme='brand']:text-purple-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                        <span className="font-medium text-gray-700 dark:text-gray-300 [data-theme='brand']:text-purple-900">
                          {task.assignedUser.firstName} {task.assignedUser.lastName}
                        </span>
                      </div>
                    )}
                    {task.dueDate && (
                      <div className="flex items-center space-x-2">
                        <svg
                          className="w-4 h-4 text-gray-400 dark:text-gray-500 [data-theme='brand']:text-purple-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        <span>Due: {formatDueDate(task.dueDate)}</span>
                      </div>
                    )}
                  </div>

                  {/* Tags Row */}
                  {task.tags && task.tags.length > 0 && (
                    <div className="mt-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm text-gray-500 dark:text-gray-400 [data-theme='brand']:text-purple-700 font-medium">
                          Tags:
                        </span>
                        {task.tags.map((tag) => (
                          <span
                            key={tag.id}
                            className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-500 dark:to-blue-600 [data-theme='brand']:from-purple-500 [data-theme='brand']:to-purple-600 text-white shadow-sm hover:from-blue-600 hover:to-blue-700 dark:hover:from-blue-600 dark:hover:to-blue-700 [data-theme='brand']:hover:from-purple-600 [data-theme='brand']:hover:to-purple-700 transition-all duration-200 transform hover:scale-105"
                          >
                            <span className="font-semibold">{tag.name}</span>
                            {tag.description && (
                              <span className="ml-2 text-blue-100 dark:text-blue-100 [data-theme='brand']:text-purple-100 text-xs">
                                - {tag.description}
                              </span>
                            )}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

