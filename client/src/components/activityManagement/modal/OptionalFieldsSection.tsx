import React from 'react';
import {
  GetUsersForDropdownResponse,
  GetProjectsForDropdownResponse,
  GetTasksForDropdownResponse
} from '../../../services/graphql/activityQueries';

interface OptionalFieldsSectionProps {
  targetUserId: string;
  projectId: string;
  taskId: string;
  loading: boolean;
  usersLoading: boolean;
  projectsLoading: boolean;
  tasksLoading: boolean;
  users: GetUsersForDropdownResponse['users']['users'];
  projects: GetProjectsForDropdownResponse['dashboardProjects']['projects'];
  tasks: GetTasksForDropdownResponse['dashboardTasks']['tasks'];
  onTargetUserIdChange: (value: string) => void;
  onProjectIdChange: (value: string) => void;
  onTaskIdChange: (value: string) => void;
}

/**
 * Optional Fields Section Component
 * Displays three optional dropdown fields: Target User, Project, and Task
 */
const OptionalFieldsSection: React.FC<OptionalFieldsSectionProps> = ({
  targetUserId,
  projectId,
  taskId,
  loading,
  usersLoading,
  projectsLoading,
  tasksLoading,
  users,
  projects,
  tasks,
  onTargetUserIdChange,
  onProjectIdChange,
  onTaskIdChange
}) => {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
      {/* Target User */}
      <div>
        <label htmlFor="targetUserId" className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
          Target User
        </label>
        <select
          id="targetUserId"
          value={targetUserId}
          onChange={(e) => onTargetUserIdChange(e.target.value)}
          className="block w-full px-4 py-3 border rounded-xl shadow-sm focus:outline-none sm:text-sm transition-colors"
          style={{ backgroundColor: 'var(--input-bg)', color: 'var(--text-primary)', border: '1px solid var(--border-color)' }}
          disabled={loading || usersLoading}
        >
          <option value="">Select user...</option>
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.firstName} {user.lastName} ({user.role})
            </option>
          ))}
        </select>
        <p className="mt-1 text-xs" style={{ color: 'var(--text-secondary)' }}>
          {usersLoading ? 'Loading users...' : 'Optional'}
        </p>
      </div>

      {/* Project */}
      <div>
        <label htmlFor="projectId" className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
          Project
        </label>
        <select
          id="projectId"
          value={projectId}
          onChange={(e) => onProjectIdChange(e.target.value)}
          className="block w-full px-4 py-3 border rounded-xl shadow-sm focus:outline-none sm:text-sm transition-colors"
          style={{ backgroundColor: 'var(--input-bg)', color: 'var(--text-primary)', border: '1px solid var(--border-color)' }}
          disabled={loading || projectsLoading}
        >
          <option value="">Select project...</option>
          {projects.map((project) => (
            <option key={project.id} value={project.id}>
              {project.name} ({project.status})
            </option>
          ))}
        </select>
        <p className="mt-1 text-xs" style={{ color: 'var(--text-secondary)' }}>
          {projectsLoading ? 'Loading projects...' : 'Optional'}
        </p>
      </div>

      {/* Task */}
      <div>
        <label htmlFor="taskId" className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
          Task
        </label>
        <select
          id="taskId"
          value={taskId}
          onChange={(e) => onTaskIdChange(e.target.value)}
          className="block w-full px-4 py-3 border rounded-xl shadow-sm focus:outline-none sm:text-sm transition-colors"
          style={{ backgroundColor: 'var(--input-bg)', color: 'var(--text-primary)', border: '1px solid var(--border-color)' }}
          disabled={loading || tasksLoading}
        >
          <option value="">Select task...</option>
          {tasks.map((task) => (
            <option key={task.id} value={task.id}>
              {task.title} ({task.project.name})
            </option>
          ))}
        </select>
        <p className="mt-1 text-xs" style={{ color: 'var(--text-secondary)' }}>
          {tasksLoading ? 'Loading tasks...' : 'Optional'}
        </p>
      </div>
    </div>
  );
};

export default OptionalFieldsSection;

