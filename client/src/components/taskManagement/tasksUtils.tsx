import React from 'react';

/**
 * Format date for display
 * Converts ISO date string to readable format with error handling
 */
export const formatDate = (dateString: string | undefined | null): string => {
  if (!dateString) return 'N/A';

  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return 'Invalid Date';
    }
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  } catch (error) {
    return 'Invalid Date';
  }
};

/**
 * Format task status for display
 * Converts enum values to user-friendly text
 */
export const formatTaskStatusForDisplay = (status: string): string => {
  const statusMap: { [key: string]: string } = {
    'TODO': 'To Do',
    'IN_PROGRESS': 'In Progress',
    'DONE': 'Done'
  };
  return statusMap[status] || status;
};

/**
 * Format task priority for display
 * Converts enum values to user-friendly text
 */
export const formatTaskPriorityForDisplay = (priority: string): string => {
  const priorityMap: { [key: string]: string } = {
    'LOW': 'Low',
    'MEDIUM': 'Medium',
    'HIGH': 'High'
  };
  return priorityMap[priority] || priority;
};

/**
 * Get sort icon for column header
 * Shows up/down arrow based on current sort state
 */
export const getSortIcon = (sortBy: string, currentSortBy: string, currentSortOrder: string): React.ReactElement => {
  if (currentSortBy !== sortBy) {
    return (
      <svg className="w-4 h-4 theme-sort-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
      </svg>
    );
  }
  return currentSortOrder === 'ASC'
    ? (
      <svg className="w-4 h-4 theme-sort-icon-active" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
      </svg>
    )
    : (
      <svg className="w-4 h-4 theme-sort-icon-active" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    );
};

