/**
 * Client Error Log Filters Component
 * Provides filtering options for client error logs
 */

import React from 'react';
import { ClientErrorLogLevel } from '../../utils/errorLogger';

/**
 * Client Error Log Filters Props
 */
interface ClientErrorLogFiltersProps {
  /** Current filter values */
  filters: {
    category?: string;
    level?: ClientErrorLogLevel;
    limit: number;
    offset: number;
  };
  /** Callback when filters change */
  onFilterChange: (filters: Partial<ClientErrorLogFiltersProps['filters']>) => void;
  /** Available categories */
  categories: string[];
}

/**
 * Client Error Log Filters Component
 * Provides filtering options for client error logs
 */
export const ClientErrorLogFilters: React.FC<ClientErrorLogFiltersProps> = ({
  filters,
  onFilterChange,
  categories
}) => {
  // Handle category filter change
  const handleCategoryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    onFilterChange({
      category: value === 'all' ? undefined : value
    });
  };

  // Handle level filter change
  const handleLevelChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    onFilterChange({
      level: value === 'all' ? undefined : value as ClientErrorLogLevel
    });
  };

  // Handle clear all filters
  const handleClearAll = () => {
    onFilterChange({
      category: undefined,
      level: undefined
    });
  };

  return (
    <div className="flex flex-wrap items-center gap-4">
      {/* Category Filter */}
      <div className="flex items-center space-x-2">
        <label className="text-sm font-medium text-gray-700">Category:</label>
        <select
          value={filters.category || 'all'}
          onChange={handleCategoryChange}
          className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Categories</option>
          {categories.map(category => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      {/* Level Filter */}
      <div className="flex items-center space-x-2">
        <label className="text-sm font-medium text-gray-700">Level:</label>
        <select
          value={filters.level || 'all'}
          onChange={handleLevelChange}
          className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Levels</option>
          <option value={ClientErrorLogLevel.DEBUG}>Debug</option>
          <option value={ClientErrorLogLevel.INFO}>Info</option>
          <option value={ClientErrorLogLevel.WARN}>Warning</option>
          <option value={ClientErrorLogLevel.ERROR}>Error</option>
          <option value={ClientErrorLogLevel.CRITICAL}>Critical</option>
        </select>
      </div>

      {/* Clear All Button */}
      <button
        onClick={handleClearAll}
        className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md transition-colors"
      >
        Clear All
      </button>
    </div>
  );
};
