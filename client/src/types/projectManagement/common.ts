/**
 * Common Types for Project Management
 * Shared types used across project and member management
 */

/**
 * Pagination info interface
 * Represents pagination metadata for queries
 */
export interface PaginationInfo {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  totalCount: number;
  currentPage: number;
  totalPages: number;
}

/**
 * Table column interface
 * Represents a table column configuration
 */
export interface TableColumn {
  key: string;
  label: string;
  sortable: boolean;
}

/**
 * Pagination option interface
 * Represents a pagination size option
 */
export interface PaginationOption {
  value: number;
  label: string;
}

