import React from 'react';

/**
 * Utility functions for Tags Table
 * Contains helper functions for date formatting, sorting, and field mapping
 */

// Field mapping from UI column names to database field names
const FIELD_MAPPING: { [key: string]: string } = {
  'id': 'id',
  'name': 'name',
  'type': 'type',
  'category': 'category',
  'created': 'createdAt',
  'updated': 'updatedAt'
};

/**
 * Format date string to readable format
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
 * Get database field name from UI column name
 * @param column - UI column name
 * @returns Database field name
 */
export const getDbField = (column: string): string => {
  return FIELD_MAPPING[column] || column;
};

/**
 * Get sort icon for column headers
 * @param column - Column name
 * @param currentSortBy - Current sort field
 * @param currentSortOrder - Current sort order
 * @returns Sort icon React element
 */
export const getSortIcon = (column: string, currentSortBy: string, currentSortOrder: string): React.ReactElement => {
  const dbField = getDbField(column);

  if (currentSortBy !== dbField) {
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

