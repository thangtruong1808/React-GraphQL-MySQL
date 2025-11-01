import React, { useState } from 'react';
import { FaEdit, FaTrash, FaHeading, FaAlignLeft, FaTag, FaProjectDiagram, FaUser, FaCalendarAlt } from 'react-icons/fa';
import { Task } from '../../types/taskManagement';
import { formatDate, formatTaskStatusForDisplay, formatTaskPriorityForDisplay } from './tasksUtils';
import { TASK_STATUS_COLORS, TASK_PRIORITY_COLORS } from '../../constants/taskManagement';

interface TasksTableRowProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}

/**
 * Tasks Table Row Component
 * Displays a single task row with all columns and actions
 */
const TasksTableRow: React.FC<TasksTableRowProps> = ({ task, onEdit, onDelete }) => {
  // State for tracking expanded text for each task
  const [expandedTasks, setExpandedTasks] = useState<Set<string>>(new Set());

  // Toggle expanded state for task text
  const toggleExpanded = (taskId: string) => {
    setExpandedTasks(prev => {
      const newSet = new Set(prev);
      if (newSet.has(taskId)) {
        newSet.delete(taskId);
      } else {
        newSet.add(taskId);
      }
      return newSet;
    });
  };

  // Format text with truncation and toggle functionality
  const formatTextWithToggle = (text: string, taskId: string, type: 'title' | 'description') => {
    if (!text) return '';

    const words = text.split(' ');
    const isExpanded = expandedTasks.has(`${taskId}-${type}`);

    if (words.length <= 4 || isExpanded) {
      return (
        <div className="space-y-1">
          <span>{text}</span>
          {words.length > 4 && (
            <button
              onClick={() => toggleExpanded(`${taskId}-${type}`)}
              className="text-xs font-medium transition-colors"
              style={{ color: 'var(--accent-from)' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = 'var(--accent-to)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'var(--accent-from)';
              }}
            >
              less
            </button>
          )}
        </div>
      );
    }

    const truncatedText = words.slice(0, 4).join(' ');
    return (
      <div className="space-y-1">
        <span>{truncatedText}...</span>
        <button
          onClick={() => toggleExpanded(`${taskId}-${type}`)}
          className="text-xs font-medium transition-colors"
          style={{ color: 'var(--accent-from)' }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = 'var(--accent-to)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = 'var(--accent-from)';
          }}
        >
          more
        </button>
      </div>
    );
  };

  // Handle edit click
  const handleEdit = () => {
    onEdit(task);
  };

  // Handle delete click
  const handleDelete = () => {
    onDelete(task);
  };

  return (
    <tr
      key={task.id}
      className="transition-colors"
      style={{ backgroundColor: 'var(--table-row-bg)', borderBottomColor: 'var(--border-color)', borderBottomWidth: 1 }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLTableRowElement).style.backgroundColor = 'var(--table-row-hover-bg)'; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLTableRowElement).style.backgroundColor = 'var(--table-row-bg)'; }}
    >
      {/* ID Column - Hidden on mobile and tablet */}
      <td className="hidden lg:table-cell px-4 py-4 whitespace-nowrap text-sm text-left" style={{ color: 'var(--table-text-primary)' }}>
        {task.id}
      </td>
      {/* Title Column - Always visible */}
      <td className="px-4 py-4 text-sm text-left" style={{ color: 'var(--table-text-primary)' }}>
        <div className="flex items-center space-x-2">
          <FaHeading className="w-3 h-3" style={{ color: 'var(--text-muted)' }} />
          <span>{formatTextWithToggle(task.title, task.id, 'title')}</span>
        </div>
      </td>
      {/* Description Column - Hidden on mobile */}
      <td className="hidden sm:table-cell px-4 py-4 text-sm text-left" style={{ color: 'var(--table-text-primary)' }}>
        <div className="flex items-center space-x-2">
          <FaAlignLeft className="w-3 h-3" style={{ color: 'var(--text-muted)' }} />
          <span>{formatTextWithToggle(task.description, task.id, 'description')}</span>
        </div>
      </td>
      {/* Status Column - Always visible */}
      <td className="px-4 py-4 whitespace-nowrap text-sm text-left" style={{ color: 'var(--table-text-primary)' }}>
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium" style={TASK_STATUS_COLORS[task.status]}>
          {formatTaskStatusForDisplay(task.status)}
        </span>
      </td>
      {/* Priority Column - Hidden on mobile */}
      <td className="hidden sm:table-cell px-4 py-4 whitespace-nowrap text-sm text-left" style={{ color: 'var(--table-text-primary)' }}>
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium" style={TASK_PRIORITY_COLORS[task.priority]}>
          {formatTaskPriorityForDisplay(task.priority)}
        </span>
      </td>
      {/* Project Column - Hidden on mobile and tablet */}
      <td className="hidden lg:table-cell px-4 py-4 whitespace-nowrap text-sm text-left" style={{ color: 'var(--table-text-primary)' }}>
        <div className="truncate flex items-center space-x-2" title={task.project.name}>
          <FaProjectDiagram className="w-3 h-3" style={{ color: 'var(--text-muted)' }} />
          <span>{task.project.name}</span>
        </div>
      </td>
      {/* Assigned To Column - Hidden on mobile and tablet */}
      <td className="hidden lg:table-cell px-4 py-4 whitespace-nowrap text-sm text-left" style={{ color: 'var(--table-text-primary)' }}>
        <div className="truncate flex items-center space-x-2" title={task.assignedUser ? `${task.assignedUser.firstName} ${task.assignedUser.lastName}` : 'Unassigned'}>
          <FaUser className="w-3 h-3" style={{ color: 'var(--text-muted)' }} />
          <span>{task.assignedUser ? `${task.assignedUser.firstName} ${task.assignedUser.lastName}` : 'Unassigned'}</span>
        </div>
      </td>
      {/* Tags Column - Hidden on mobile and tablet */}
      <td className="hidden lg:table-cell px-4 py-4 text-sm text-left" style={{ color: 'var(--table-text-primary)' }}>
        <div className="flex flex-wrap gap-1">
          {task.tags && task.tags.length > 0 ? (
            task.tags.map((tag) => (
              <span
                key={tag.id}
                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium theme-badge-secondary"
                title={tag.description}
              >
                <FaTag className="w-3 h-3 mr-1" />
                <span>{tag.name}</span>
              </span>
            ))
          ) : (
            <span className="theme-table-text-muted text-xs">No tags</span>
          )}
        </div>
      </td>
      {/* Due Date Column - Hidden on mobile and tablet */}
      <td className="hidden lg:table-cell px-4 py-4 whitespace-nowrap text-sm text-left" style={{ color: 'var(--table-text-secondary)' }}>
        <div className="flex items-center space-x-2">
          <FaCalendarAlt className="w-3 h-3" style={{ color: 'var(--text-muted)' }} />
          <span>{formatDate(task.dueDate)}</span>
        </div>
      </td>
      {/* Created Date Column - Hidden on mobile and tablet */}
      <td className="hidden lg:table-cell px-4 py-4 whitespace-nowrap text-sm text-left" style={{ color: 'var(--table-text-secondary)' }}>
        <div className="flex items-center space-x-2">
          <FaCalendarAlt className="w-3 h-3" style={{ color: 'var(--text-muted)' }} />
          <span>{formatDate(task.createdAt)}</span>
        </div>
      </td>
      {/* Updated Date Column - Hidden on mobile and tablet */}
      <td className="hidden lg:table-cell px-4 py-4 whitespace-nowrap text-sm text-left" style={{ color: 'var(--table-text-secondary)' }}>
        <div className="flex items-center space-x-2">
          <FaCalendarAlt className="w-3 h-3" style={{ color: 'var(--text-muted)' }} />
          <span>{formatDate(task.updatedAt)}</span>
        </div>
      </td>
      {/* Actions Column - Always visible */}
      <td className="px-4 py-4 whitespace-nowrap text-sm text-left" style={{ color: 'var(--table-text-secondary)' }}>
        <div className="flex items-center space-x-2">
          <button
            onClick={handleEdit}
            className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-150"
          >
            <FaEdit className="w-3 h-3 mr-1" />
            Edit
          </button>
          <button
            onClick={handleDelete}
            className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-150"
          >
            <FaTrash className="w-3 h-3 mr-1" />
            Delete
          </button>
        </div>
      </td>
    </tr>
  );
};

export default TasksTableRow;

