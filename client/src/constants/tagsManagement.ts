/**
 * Constants for Tags Management
 * Defines default values, configurations, and messages for tags management
 */

// Default pagination settings
export const DEFAULT_TAGS_PAGINATION = {
  limit: 10,
  offset: 0,
  sortBy: 'id',
  sortOrder: 'ASC' as const,
};

// Page size options for pagination
export const PAGE_SIZE_OPTIONS = [
  { value: 5, label: '5' },
  { value: 10, label: '10' },
  { value: 25, label: '25' },
  { value: 50, label: '50' },
];

// Tag type options
export const TAG_TYPE_OPTIONS = [
  { value: 'category', label: 'Category' },
  { value: 'priority', label: 'Priority' },
  { value: 'status', label: 'Status' },
  { value: 'feature', label: 'Feature' },
  { value: 'bug', label: 'Bug' },
  { value: 'enhancement', label: 'Enhancement' },
  { value: 'documentation', label: 'Documentation' },
  { value: 'other', label: 'Other' },
];

// Tag category options
export const TAG_CATEGORY_OPTIONS = [
  { value: 'general', label: 'General' },
  { value: 'technical', label: 'Technical' },
  { value: 'business', label: 'Business' },
  { value: 'design', label: 'Design' },
  { value: 'testing', label: 'Testing' },
  { value: 'deployment', label: 'Deployment' },
  { value: 'maintenance', label: 'Maintenance' },
  { value: 'other', label: 'Other' },
];

// Tag type colors for display
export const TAG_TYPE_COLORS = {
  category: 'bg-blue-100 text-blue-800',
  priority: 'bg-red-100 text-red-800',
  status: 'bg-green-100 text-green-800',
  feature: 'bg-purple-100 text-purple-800',
  bug: 'bg-orange-100 text-orange-800',
  enhancement: 'bg-yellow-100 text-yellow-800',
  documentation: 'bg-indigo-100 text-indigo-800',
  other: 'bg-gray-100 text-gray-800',
};

// Tag category colors for display
export const TAG_CATEGORY_COLORS = {
  general: 'bg-gray-100 text-gray-800',
  technical: 'bg-blue-100 text-blue-800',
  business: 'bg-green-100 text-green-800',
  design: 'bg-pink-100 text-pink-800',
  testing: 'bg-yellow-100 text-yellow-800',
  deployment: 'bg-purple-100 text-purple-800',
  maintenance: 'bg-orange-100 text-orange-800',
  other: 'bg-gray-100 text-gray-800',
};

// Tags table column configuration
export const TAGS_TABLE_COLUMNS = {
  ID: { width: 'w-16', sortable: true },
  NAME: { width: 'w-32', sortable: true },
  DESCRIPTION: { width: 'w-64', sortable: false },
  TYPE: { width: 'w-24', sortable: true },
  CATEGORY: { width: 'w-24', sortable: true },
  CREATED: { width: 'w-32', sortable: true },
  ACTIONS: { width: 'w-24', sortable: false },
};

// Tags form validation rules
export const TAGS_FORM_VALIDATION = {
  name: {
    required: true,
    minLength: 1,
    maxLength: 50,
  },
  description: {
    required: true,
    minLength: 1,
    maxLength: 500,
  },
  title: {
    required: false,
    maxLength: 255,
  },
  type: {
    required: false,
  },
  category: {
    required: false,
  },
};

// Tags limits
export const TAGS_LIMITS = {
  MIN_NAME_LENGTH: 1,
  MAX_NAME_LENGTH: 50,
  MIN_DESCRIPTION_LENGTH: 1,
  MAX_DESCRIPTION_LENGTH: 500,
  MAX_TITLE_LENGTH: 255,
};

// Success messages for tags operations
export const TAGS_SUCCESS_MESSAGES = {
  CREATE: 'Tag created successfully',
  UPDATE: 'Tag updated successfully',
  DELETE: 'Tag deleted successfully',
  FETCH: 'Tags loaded successfully',
};

// Error messages for tags operations
export const TAGS_ERROR_MESSAGES = {
  CREATE: 'Failed to create tag',
  UPDATE: 'Failed to update tag',
  DELETE: 'Failed to delete tag',
  FETCH: 'Failed to fetch tags',
  NOT_FOUND: 'Tag not found',
  VALIDATION: 'Please check your input and try again',
  NETWORK: 'Network error. Please try again.',
  UNAUTHORIZED: 'You are not authorized to perform this action',
  DUPLICATE_NAME: 'A tag with this name already exists',
};
