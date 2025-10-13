/**
 * User Management Constants
 * Defines constants for user management functionality
 * Follows the pattern of other constants files in the project
 */

// User roles mapping from database to display names
export const USER_ROLES = {
  ADMIN: 'Admin',
  'Project Manager': 'Project Manager',
  'Software Architect': 'Software Architect',
  'Frontend Developer': 'Frontend Developer',
  'Backend Developer': 'Backend Developer',
  'Full-Stack Developer': 'Full-Stack Developer',
  'DevOps Engineer': 'DevOps Engineer',
  'QA Engineer': 'QA Engineer',
  'QC Engineer': 'QC Engineer',
  'UX/UI Designer': 'UX/UI Designer',
  'Business Analyst': 'Business Analyst',
  'Database Administrator': 'Database Administrator',
  'Technical Writer': 'Technical Writer',
  'Support Engineer': 'Support Engineer'
} as const;

// User role options for dropdowns
export const USER_ROLE_OPTIONS = Object.entries(USER_ROLES).map(([value, label]) => ({
  value,
  label
}));

// Pagination options for users table
export const USERS_PAGINATION_OPTIONS = [
  { value: 5, label: '5' },
  { value: 10, label: '10' },
  { value: 25, label: '25' },
  { value: 50, label: '50' }
] as const;

// Default pagination settings
export const DEFAULT_USERS_PAGINATION = {
  limit: 10,
  offset: 0
} as const;

// Search debounce delay in milliseconds
export const USER_SEARCH_DEBOUNCE_DELAY = 1000;

// Table column configuration
export const USERS_TABLE_COLUMNS = [
  { key: 'firstName', label: 'First Name', sortable: true },
  { key: 'lastName', label: 'Last Name', sortable: true },
  { key: 'email', label: 'Email', sortable: true },
  { key: 'role', label: 'Role', sortable: true },
  { key: 'createdAt', label: 'Created', sortable: true },
  { key: 'actions', label: 'Actions', sortable: false }
] as const;

// Form validation rules
export const USER_FORM_VALIDATION = {
  email: {
    required: 'Email is required',
    pattern: 'Please enter a valid email address'
  },
  password: {
    required: 'Password is required',
    minLength: 'Password must be at least 8 characters long'
  },
  firstName: {
    required: 'First name is required',
    maxLength: 'First name must be less than 100 characters'
  },
  lastName: {
    required: 'Last name is required',
    maxLength: 'Last name must be less than 100 characters'
  },
  role: {
    required: 'Role is required'
  }
} as const;

// Modal configuration
export const USER_MODAL_CONFIG = {
  create: {
    title: 'Create New User',
    submitText: 'Create User',
    submitVariant: 'primary' as const
  },
  edit: {
    title: 'Edit User',
    submitText: 'Update User',
    submitVariant: 'primary' as const
  },
  delete: {
    title: 'Delete User',
    submitText: 'Delete User',
    submitVariant: 'danger' as const
  }
} as const;

// Success messages
export const USER_SUCCESS_MESSAGES = {
  CREATE: 'User created successfully',
  UPDATE: 'User updated successfully',
  DELETE: 'User deleted successfully'
} as const;

// Error messages
export const USER_ERROR_MESSAGES = {
  FETCH: 'Failed to fetch users',
  CREATE: 'Failed to create user',
  UPDATE: 'Failed to update user',
  DELETE: 'Failed to delete user',
  userNotFound: 'User not found',
  emailExists: 'User with this email already exists'
} as const;
