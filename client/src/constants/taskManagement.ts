/**
 * Task Management Constants
 * Defines constants for task management functionality
 */

// Default pagination settings for tasks
export const DEFAULT_TASKS_PAGINATION = {
  limit: 10,
  offset: 0,
};

// Pagination options for tasks table
export const TASKS_PAGINATION_OPTIONS = [
  { value: 5, label: '5' },
  { value: 10, label: '10' },
  { value: 25, label: '25' },
  { value: 50, label: '50' },
];

// Task status options for forms
export const TASK_STATUS_OPTIONS = [
  { value: 'TODO', label: 'To Do' },
  { value: 'IN_PROGRESS', label: 'In Progress' },
  { value: 'DONE', label: 'Done' },
];

// Task priority options for forms
export const TASK_PRIORITY_OPTIONS = [
  { value: 'LOW', label: 'Low' },
  { value: 'MEDIUM', label: 'Medium' },
  { value: 'HIGH', label: 'High' },
];

// Success messages for task operations
export const TASK_SUCCESS_MESSAGES = {
  CREATE: 'Task created successfully',
  UPDATE: 'Task updated successfully',
  DELETE: 'Task deleted successfully',
  FETCH: 'Tasks loaded successfully',
};

// Error messages for task operations
export const TASK_ERROR_MESSAGES = {
  CREATE: 'Failed to create task',
  UPDATE: 'Failed to update task',
  DELETE: 'Failed to delete task',
  FETCH: 'Failed to fetch tasks',
  VALIDATION: 'Please fill in all required fields',
  NETWORK: 'Network error. Please try again.',
  UNAUTHORIZED: 'You are not authorized to perform this action',
};

// Task status display mapping
export const TASK_STATUS_DISPLAY = {
  TODO: 'To Do',
  IN_PROGRESS: 'In Progress',
  DONE: 'Done',
};

// Task priority display mapping
export const TASK_PRIORITY_DISPLAY = {
  LOW: 'Low',
  MEDIUM: 'Medium',
  HIGH: 'High',
};

// Task priority color mapping for UI
export const TASK_PRIORITY_COLORS = {
  LOW: 'bg-green-100 text-green-800',
  MEDIUM: 'bg-yellow-100 text-yellow-800',
  HIGH: 'bg-red-100 text-red-800',
};

// Task status color mapping for UI
export const TASK_STATUS_COLORS = {
  TODO: 'bg-gray-100 text-gray-800',
  IN_PROGRESS: 'bg-blue-100 text-blue-800',
  DONE: 'bg-green-100 text-green-800',
};
