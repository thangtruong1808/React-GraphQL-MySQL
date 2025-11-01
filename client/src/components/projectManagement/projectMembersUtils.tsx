import React from 'react';

/**
 * Utility functions for Project Members Table
 * Provides helper functions for date formatting, badge colors, and sort icons
 */

/**
 * Format date with error handling
 * @param dateString - Date string to format
 * @returns Formatted date string or 'N/A' if invalid
 */
export const formatDate = (dateString: string | null | undefined): string => {
  if (!dateString) return 'N/A';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Invalid Date';
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  } catch (error) {
    return 'N/A';
  }
};

/**
 * Get role badge color based on member role
 * @param role - Member role
 * @returns Badge color class name
 */
export const getRoleBadgeColor = (role: string): string => {
  switch (role) {
    case 'OWNER':
      return 'theme-badge-primary';
    case 'EDITOR':
      return 'theme-badge-secondary';
    case 'VIEWER':
      return 'theme-badge-neutral';
    default:
      return 'theme-badge-neutral';
  }
};

/**
 * Get member type badge color and text based on member type
 * @param memberType - Member type
 * @returns Object with color class name and display text
 */
export const getMemberTypeBadgeColor = (memberType: string): { color: string; text: string } => {
  switch (memberType) {
    case 'OWNER':
      return { color: 'theme-badge-primary', text: 'Owner' };
    case 'EDITOR':
      return { color: 'theme-badge-secondary', text: 'Editor' };
    case 'VIEWER':
      return { color: 'theme-badge-success', text: 'Viewer' };
    case 'ASSIGNEE':
      return { color: 'theme-badge-warning', text: 'Task Assignee' };
    default:
      return { color: 'theme-badge-neutral', text: 'Member' };
  }
};

/**
 * Get sort icon for column headers
 * @param column - Column name
 * @param currentSortBy - Currently sorted column
 * @param currentSortOrder - Current sort order
 * @returns Sort icon JSX element
 */
export const getSortIcon = (
  column: string,
  currentSortBy: string,
  currentSortOrder: string
): React.ReactElement => {
  // Return default sort icon if column is not currently sorted
  if (currentSortBy !== column) {
    return (
      <svg className="w-4 h-4 theme-sort-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
      </svg>
    );
  }

  // Return ascending sort icon if sort order is ASC
  if (currentSortOrder === 'ASC') {
    return (
      <svg className="w-4 h-4 theme-sort-icon-active" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
      </svg>
    );
  }

  // Return descending sort icon (default case)
  return (
    <svg className="w-4 h-4 theme-sort-icon-active" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  );
};

