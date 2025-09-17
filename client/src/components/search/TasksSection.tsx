import React from 'react';
import SearchSection from './SearchSection';

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
  tasks: Task[];
  loading: boolean;
  hasQuery: boolean;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

/**
 * TasksSection Component
 * Renders task search results with pagination
 */
const TasksSection: React.FC<TasksSectionProps> = ({
  tasks,
  loading,
  hasQuery,
  currentPage,
  totalPages,
  onPageChange
}) => {
  // Get status color classes
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'DONE':
        return 'bg-pink-100 text-pink-800';
      case 'IN_PROGRESS':
        return 'bg-cyan-100 text-cyan-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Get priority color classes
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'HIGH':
        return 'bg-red-100 text-red-800';
      case 'MEDIUM':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-green-100 text-green-800';
    }
  };

  // Render individual task item
  const renderTask = (task: Task) => (
    <div key={task.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          {/* Task title */}
          <h3 className="text-lg font-medium text-gray-900 mb-2">{task.title}</h3>

          {/* Task description */}
          <p className="text-gray-600 mb-3">{task.description}</p>

          {/* Task metadata */}
          <div className="flex items-center space-x-4">
            {/* Status badge */}
            <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(task.status)}`}>
              {task.status.replace('_', ' ')}
            </span>

            {/* Priority badge */}
            <span className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(task.priority)}`}>
              {task.priority}
            </span>

            {/* Project information */}
            {task.project && (
              <span className="text-sm text-gray-500">
                Project: {task.project.name}
              </span>
            )}

            {/* Assigned user information */}
            {task.assignedUser && (
              <span className="text-sm text-gray-500">
                Assigned to: {task.assignedUser.firstName} {task.assignedUser.lastName}
              </span>
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
    />
  );
};

export default TasksSection;
