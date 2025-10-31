/**
 * Table Utility Functions
 * Helper functions for CommentsTable component
 */

import { COMMENT_PRIORITY_THRESHOLDS } from '../../../constants/commentManagement';

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
 * Format content with word wrapping (max 8 words per line)
 * @param content - Content string to format
 * @returns Array of formatted lines
 */
export const formatContentWithWordWrap = (content: string): string[] => {
  if (!content) return ['N/A'];

  const words = content.trim().split(/\s+/);
  const lines: string[] = [];
  const wordsPerLine = 8;

  for (let i = 0; i < words.length; i += wordsPerLine) {
    const line = words.slice(i, i + wordsPerLine).join(' ');
    lines.push(line);
  }

  return lines;
};

/**
 * Get comment priority based on likes count
 * @param likesCount - Number of likes
 * @returns Priority level ('low' | 'medium' | 'high')
 */
export const getCommentPriority = (likesCount: number): 'low' | 'medium' | 'high' => {
  if (likesCount >= COMMENT_PRIORITY_THRESHOLDS.HIGH) return 'high';
  if (likesCount >= COMMENT_PRIORITY_THRESHOLDS.MEDIUM) return 'medium';
  return 'low';
};

/**
 * Map UI column names to database field names
 */
const FIELD_MAPPING: { [key: string]: string } = {
  'id': 'id',
  'author': 'createdAt',
  'task': 'createdAt',
  'project': 'createdAt',
  'likes': 'createdAt',
  'created': 'createdAt',
  'updated': 'updatedAt',
  'content': 'content'
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

