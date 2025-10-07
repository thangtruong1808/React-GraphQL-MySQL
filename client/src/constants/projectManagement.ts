/**
 * Project Management Constants
 * Configuration values and options for project management functionality
 */

// Default pagination settings for projects
export const DEFAULT_PROJECTS_PAGINATION = {
  limit: 10,
  offset: 0
};

// Pagination options for projects table
export const PROJECTS_PAGINATION_OPTIONS = [
  { value: 5, label: '5' },
  { value: 10, label: '10' },
  { value: 25, label: '25' },
  { value: 50, label: '50' }
];

// Project status options for forms
export const PROJECT_STATUS_OPTIONS = [
  { value: 'PLANNING', label: 'Planning' },
  { value: 'IN_PROGRESS', label: 'In Progress' },
  { value: 'COMPLETED', label: 'Completed' }
];

// Success messages for project operations
export const PROJECT_SUCCESS_MESSAGES = {
  CREATE: 'Project created successfully!',
  UPDATE: 'Project updated successfully!',
  DELETE: 'Project deleted successfully!'
};

// Error messages for project operations
export const PROJECT_ERROR_MESSAGES = {
  CREATE: 'Failed to create project. Please try again.',
  UPDATE: 'Failed to update project. Please try again.',
  DELETE: 'Failed to delete project. Please try again.',
  FETCH: 'Failed to fetch projects. Please try again.',
  VALIDATION: 'Please fill in all required fields.',
  NETWORK: 'Network error. Please check your connection.'
};

// Form validation rules
export const PROJECT_VALIDATION_RULES = {
  NAME: {
    MIN_LENGTH: 2,
    MAX_LENGTH: 150,
    REQUIRED: true
  },
  DESCRIPTION: {
    MIN_LENGTH: 10,
    MAX_LENGTH: 1000,
    REQUIRED: true
  },
  STATUS: {
    REQUIRED: true
  }
};

// Table column configuration
export const PROJECTS_TABLE_COLUMNS = [
  { key: 'id', label: 'ID', sortable: true },
  { key: 'name', label: 'Name', sortable: true },
  { key: 'status', label: 'Status', sortable: true },
  { key: 'owner', label: 'Owner', sortable: false },
  { key: 'createdAt', label: 'Created', sortable: true },
  { key: 'updatedAt', label: 'Updated', sortable: true },
  { key: 'actions', label: 'Actions', sortable: false }
];

// Search placeholder text
export const PROJECT_SEARCH_PLACEHOLDER = 'Search projects by name or description...';

// Search debounce delay in milliseconds
export const PROJECT_SEARCH_DEBOUNCE_DELAY = 1000;

// Modal titles
export const PROJECT_MODAL_TITLES = {
  CREATE: 'Create New Project',
  EDIT: 'Edit Project',
  DELETE: 'Delete Project'
};

// Confirmation messages
export const PROJECT_CONFIRMATION_MESSAGES = {
  DELETE: 'Are you sure you want to delete this project? This action cannot be undone.'
};
