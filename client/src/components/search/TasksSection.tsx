import React from 'react';
import SearchSection from './SearchSection';
import TaskStatusCounts from './TaskStatusCounts';
import { getProjectStatusColor } from '../../constants/projectManagement';

/**
 * Tasks Section Component
 * Displays search results for tasks with pagination
 * Follows React best practices with proper TypeScript interfaces
 */

interface ProjectOwner {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

interface Project {
  id: string;
  name: string;
  description: string;
  status: string;
  owner?: ProjectOwner;
}

interface AssignedUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

interface Task {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  project?: Project;
  assignedUser?: AssignedUser;
}

interface TasksSectionProps {
  tasks: Task[]; // Current page tasks for display
  allTasks: Task[]; // All filtered tasks for status breakdown calculation
  loading: boolean;
  hasQuery: boolean;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems: number;
  itemsPerPage: number;
  onTaskClick?: (task: Task) => void;
}

/**
 * TasksSection Component
 * Renders task search results with pagination
 */
const TasksSection: React.FC<TasksSectionProps> = ({
  tasks,
  allTasks,
  loading,
  hasQuery,
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  itemsPerPage,
  onTaskClick
}) => {
  // Get status color classes with theme awareness
  const getStatusColor = (status: string) => {
    const isBrandTheme = document.documentElement.getAttribute('data-theme') === 'brand';
    const isDarkTheme = document.documentElement.classList.contains('dark');
    const theme = isBrandTheme ? 'brand' : isDarkTheme ? 'dark' : 'light';

    // Map task statuses to project statuses for consistency
    const statusMap: { [key: string]: string } = {
      'IN_PROGRESS': 'IN_PROGRESS',
      'DONE': 'COMPLETED',
      'TODO': 'PLANNING'
    };

    const mappedStatus = statusMap[status] || 'PLANNING';
    return getProjectStatusColor(mappedStatus, theme);
  };

  // Get priority color classes with theme awareness
  const getPriorityColor = (priority: string) => {
    const isBrandTheme = document.documentElement.getAttribute('data-theme') === 'brand';
    const isDarkTheme = document.documentElement.classList.contains('dark');
    const theme = isBrandTheme ? 'brand' : isDarkTheme ? 'dark' : 'light';

    switch (priority) {
      case 'HIGH':
        return isDarkTheme ? 'bg-red-900 text-red-200' : isBrandTheme ? 'bg-red-100 text-red-800' : 'bg-red-100 text-red-800';
      case 'MEDIUM':
        return isDarkTheme ? 'bg-yellow-900 text-yellow-200' : isBrandTheme ? 'bg-yellow-100 text-yellow-800' : 'bg-yellow-100 text-yellow-800';
      default:
        return isDarkTheme ? 'bg-green-900 text-green-200' : isBrandTheme ? 'bg-green-100 text-green-800' : 'bg-green-100 text-green-800';
    }
  };

  // Handle task card click
  const handleTaskClick = (task: Task) => {
    if (onTaskClick) {
      onTaskClick(task);
    }
  };

  // Render individual task item with enhanced styling and labels
  const renderTask = (task: Task) => (
    <div
      key={task.id}
      className="group bg-white dark:bg-gray-700 [data-theme='brand']:bg-gradient-to-br [data-theme='brand']:from-white [data-theme='brand']:to-purple-50 rounded-lg shadow-md border border-gray-100 dark:border-gray-600 [data-theme='brand']:border-purple-200 p-6 hover:shadow-lg dark:hover:shadow-gray-900/30 [data-theme='brand']:hover:shadow-purple-200/30 transition-shadow duration-200 cursor-pointer"
      onClick={() => handleTaskClick(task)}
    >
      <div className="space-y-4">
        {/* Task title */}
        <div>
          <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 [data-theme='brand']:text-purple-800 uppercase tracking-wide mb-1">
            Task Title
          </label>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white [data-theme='brand']:text-purple-900 group-hover:text-orange-700 dark:group-hover:text-orange-400 [data-theme='brand']:group-hover:text-purple-700 transition-colors duration-200">{task.title}</h3>
        </div>

        {/* Task description */}
        <div>
          <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 [data-theme='brand']:text-purple-800 uppercase tracking-wide mb-1">
            Description
          </label>
          <p className="text-gray-700 dark:text-gray-300 [data-theme='brand']:text-purple-800 leading-relaxed group-hover:text-orange-600 dark:group-hover:text-orange-400 [data-theme='brand']:group-hover:text-purple-700 transition-colors duration-200">{task.description}</p>
        </div>

        {/* Task metadata with enhanced layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-gray-100 dark:border-gray-600">
          {/* Status and Priority */}
          <div className="space-y-3">
            {/* Status */}
            <div>
              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 [data-theme='brand']:text-purple-800 uppercase tracking-wide mb-2">
                Status
              </label>
              <div className="flex items-center space-x-2">
                <svg className="h-4 w-4 text-gray-400 dark:text-gray-500 [data-theme='brand']:text-purple-600 group-hover:text-orange-500 dark:group-hover:text-orange-400 [data-theme='brand']:group-hover:text-purple-700 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className={`inline-flex items-center px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(task.status)} group-hover:shadow-md transition-shadow duration-200`}>
                  {task.status.replace('_', ' ')}
                </span>
              </div>
            </div>

            {/* Priority */}
            <div>
              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 [data-theme='brand']:text-purple-600 uppercase tracking-wide mb-2">
                Priority
              </label>
              <div className="flex items-center space-x-2">
                <svg className="h-4 w-4 text-gray-400 dark:text-gray-500 [data-theme='brand']:text-purple-500 group-hover:text-orange-500 dark:group-hover:text-orange-400 [data-theme='brand']:group-hover:text-orange-500 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span className={`inline-flex items-center px-3 py-1 text-sm font-medium rounded-full ${getPriorityColor(task.priority)} group-hover:shadow-md transition-shadow duration-200`}>
                  {task.priority}
                </span>
              </div>
            </div>
          </div>

          {/* Project and Assignment Info */}
          <div className="space-y-3">
            {/* Project information */}
            {task.project && (
              <div>
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 [data-theme='brand']:text-purple-600 uppercase tracking-wide mb-2">
                  Project
                </label>
                <div className="flex items-center space-x-2">
                  <svg className="h-4 w-4 text-gray-400 dark:text-gray-500 [data-theme='brand']:text-purple-500 group-hover:text-orange-500 dark:group-hover:text-orange-400 [data-theme='brand']:group-hover:text-orange-500 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300 [data-theme='brand']:text-purple-700 group-hover:text-orange-600 dark:group-hover:text-orange-400 [data-theme='brand']:group-hover:text-orange-600 transition-colors duration-200">{task.project.name}</span>
                </div>
              </div>
            )}

            {/* Assigned user information */}
            {task.assignedUser && (
              <div>
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 [data-theme='brand']:text-purple-600 uppercase tracking-wide mb-2">
                  Assigned To
                </label>
                <div className="flex items-center space-x-2">
                  <svg className="h-4 w-4 text-gray-400 dark:text-gray-500 [data-theme='brand']:text-purple-500 group-hover:text-orange-500 dark:group-hover:text-orange-400 [data-theme='brand']:group-hover:text-orange-500 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300 [data-theme='brand']:text-purple-700 group-hover:text-orange-600 dark:group-hover:text-orange-400 [data-theme='brand']:group-hover:text-orange-600 transition-colors duration-200">
                    {task.assignedUser.firstName} {task.assignedUser.lastName}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <SearchSection
      title="Tasks"
      results={tasks}
      loading={loading}
      hasQuery={hasQuery}
      emptyMessage="No tasks found"
      renderItem={renderTask}
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={onPageChange}
      totalItems={totalItems}
      itemsPerPage={itemsPerPage}
      headerContent={<TaskStatusCounts tasks={allTasks} totalTasks={totalItems} />}
    />
  );
};

export default TasksSection;
