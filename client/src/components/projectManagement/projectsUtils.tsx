import React from 'react';
import { getProjectStatusColor } from '../../constants/projectManagement';

/**
 * Utility functions for Projects Table
 * Provides helper functions for date formatting, status formatting, and sort icons
 */

/**
 * Format date for display
 * Converts ISO string to readable format
 * @param dateString - Date string to format
 * @returns Formatted date string
 */
export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

/**
 * Format project status for display
 * Converts enum values to user-friendly labels
 * @param status - Project status
 * @returns Formatted status label
 */
export const formatStatus = (status: string): string => {
  const statusMap: { [key: string]: string } = {
    'PLANNING': 'Planning',
    'IN_PROGRESS': 'In Progress',
    'COMPLETED': 'Completed'
  };
  return statusMap[status] || status;
};

/**
 * Get status badge color based on project status with theme-aware styling
 * Returns appropriate Tailwind classes for styling
 * @param status - Project status
 * @returns Badge color class name
 */
export const getStatusBadgeColor = (status: string): string => {
  // Check if we're in brand theme by looking for data-theme attribute
  const isBrandTheme = document.documentElement.getAttribute('data-theme') === 'brand';
  const isDarkTheme = document.documentElement.classList.contains('dark');

  const theme = isBrandTheme ? 'brand' : isDarkTheme ? 'dark' : 'light';
  return getProjectStatusColor(status, theme);
};

/**
 * Get sort icon for column header
 * Shows up/down arrow based on current sort state
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
  if (currentSortBy !== column) {
    return (
      <svg className="w-4 h-4 theme-sort-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
      </svg>
    );
  }

  return currentSortOrder === 'ASC' ? (
    <svg className="w-4 h-4 theme-sort-icon-active" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
    </svg>
  ) : (
    <svg className="w-4 h-4 theme-sort-icon-active" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  );
};

