/**
 * Utility functions for Notification Management components
 * Provides helper functions for date formatting and field mapping
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
 * Map UI column names to database field names
 */
const FIELD_MAPPING: { [key: string]: string } = {
  'id': 'id',
  'user': 'createdAt',
  'status': 'isRead',
  'created': 'createdAt',
  'message': 'message'
};

/**
 * Get database field name from UI column name
 * @param column - UI column name
 * @returns Database field name
 */
export const getDbField = (column: string): string => {
  return FIELD_MAPPING[column] || column;
};

