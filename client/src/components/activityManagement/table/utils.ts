/**
 * Table Utility Functions
 * Helper functions for ActivitiesTable component
 */

/**
 * Format date string to locale format
 * @param dateString - Date string to format
 * @returns Formatted date string or 'N/A'
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
  'type': 'type',
  'targetUser': 'createdAt',
  'project': 'createdAt',
  'task': 'createdAt',
  'created': 'createdAt',
  'updated': 'updatedAt',
  'action': 'action'
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
 * Calculate new sort order when toggling sort
 * @param currentSortBy - Current sort field
 * @param currentSortOrder - Current sort order
 * @param column - Column being sorted
 * @returns New sort order ('ASC' | 'DESC')
 */
export const getNewSortOrder = (
  currentSortBy: string,
  currentSortOrder: 'ASC' | 'DESC',
  column: string
): 'ASC' | 'DESC' => {
  const dbField = getDbField(column);
  if (currentSortBy === dbField) {
    return currentSortOrder === 'ASC' ? 'DESC' : 'ASC';
  }
  return 'ASC';
};

