import React from 'react';
import { SortOption } from './types';

/**
 * Team Sort Controls Component
 * Displays sorting options for team members
 */

interface TeamSortControlsProps {
  sortOption: SortOption;
  onSortChange: (field: SortOption['field']) => void;
}

/**
 * Sort controls component for team members
 * Allows users to sort by name, role, join date, project count, or task count
 */
const TeamSortControls: React.FC<TeamSortControlsProps> = ({ sortOption, onSortChange }) => {
  const sortOptions = [
    { field: 'name' as const, label: 'Name', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
    { field: 'role' as const, label: 'Role', icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' },
    { field: 'joinDate' as const, label: 'Join Date', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
    { field: 'projectCount' as const, label: 'Projects', icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' },
    { field: 'taskCount' as const, label: 'Tasks', icon: 'M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01' }
  ];

  return (
    <div className="flex flex-wrap gap-3 justify-center items-center">
      <span className="text-sm font-medium text-gray-700">Sort by:</span>
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

export default TeamSortControls;
