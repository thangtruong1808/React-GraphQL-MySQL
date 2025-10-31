import React from 'react';

interface SortIconProps {
  column: string;
  currentSortBy: string;
  currentSortOrder: string;
  getDbField: (column: string) => string;
}

/**
 * Sort Icon Component
 * Displays sort icon based on current sort state
 */
const SortIcon: React.FC<SortIconProps> = ({
  column,
  currentSortBy,
  currentSortOrder,
  getDbField
}) => {
  const dbField = getDbField(column);

  // Show default sort icon if not currently sorting by this column
  if (currentSortBy !== dbField) {
    return (
      <svg className="w-4 h-4 theme-sort-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
      </svg>
    );
  }

  // Show ascending or descending icon based on sort order
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

export default SortIcon;

