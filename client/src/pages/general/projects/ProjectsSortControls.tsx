import React from 'react';

/**
 * Projects Sort Controls Component
 * Displays sorting options for projects
 */

interface SortOption {
  field: 'name' | 'createdAt' | 'taskCount' | 'memberCount';
  direction: 'ASC' | 'DESC';
}

interface ProjectsSortControlsProps {
  sortOption: SortOption;
  onSortChange: (field: SortOption['field']) => void;
}

/**
 * Sort controls component for projects page displaying sorting options
 * Handles client-side sorting of filtered projects
 */
const ProjectsSortControls: React.FC<ProjectsSortControlsProps> = ({ sortOption, onSortChange }) => {
  const sortOptions = [
    {
      field: 'name' as const,
      label: 'Name',
      icon: 'M7 20l4-16m2 16l4-16M6 9h14M4 15h14'
    },
    {
      field: 'createdAt' as const,
      label: 'Date Created',
      icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z'
    },
    {
      field: 'taskCount' as const,
      label: 'Tasks',
      icon: 'M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01'
    },
    {
      field: 'memberCount' as const,
      label: 'Members',
      icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z'
    },
  ];

  return (
    <div className="flex flex-wrap gap-3 justify-center items-center">
      <span className="text-sm font-medium text-gray-700 mr-2">Sort by:</span>
      {sortOptions.map((sortButton) => (
        <button
          key={sortButton.field}
          onClick={() => onSortChange(sortButton.field)}
          className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${sortButton.field === sortOption.field
            ? 'bg-indigo-600 text-white shadow-md'
            : 'bg-white text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 border border-gray-200 hover:border-indigo-500'
            }`}
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={sortButton.icon} />
          </svg>
          {sortButton.label}
          {sortButton.field === sortOption.field && (
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={sortOption.direction === 'ASC' ? 'M5 15l7-7 7 7' : 'M19 9l-7 7-7-7'} />
            </svg>
          )}
        </button>
      ))}
    </div>
  );
};

export default ProjectsSortControls;
