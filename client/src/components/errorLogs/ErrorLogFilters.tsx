/**
 * Error Log Filters Component
 * Provides filtering options for error logs display
 * Allows filtering by category, level, user, and pagination
 */

import React from 'react';
import { ErrorLogLevel, ErrorLogCategory } from '../../services/graphql/errorLogs';
import { ErrorLogConstants, ErrorLogIcons } from '../../constants/errorLogs';

/**
 * Error Log Filters Props
 */
interface ErrorLogFiltersProps {
  /** Current filter values */
  filters: {
    category?: ErrorLogCategory;
    level?: ErrorLogLevel;
    userId: string;
    limit: number;
    offset: number;
  };
  /** Callback when filters change */
  onFilterChange: (filters: Partial<ErrorLogFiltersProps['filters']>) => void;
  /** Whether the component is in loading state */
  loading?: boolean;
}

/**
 * Error Log Filters Component
 * Provides filtering interface for error logs
 */
export const ErrorLogFilters: React.FC<ErrorLogFiltersProps> = ({
  filters,
  onFilterChange,
  loading = false
}) => {
  // Handle category filter change
  const handleCategoryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    onFilterChange({
      category: value ? (value as ErrorLogCategory) : undefined
    });
  };

  // Handle level filter change
  const handleLevelChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    onFilterChange({
      level: value ? (value as ErrorLogLevel) : undefined
    });
  };

  // Handle user ID filter change
  const handleUserIdChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({
      userId: event.target.value
    });
  };

  // Handle limit change
  const handleLimitChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = parseInt(event.target.value);
    onFilterChange({
      limit: value
    });
  };

  // Handle clear filters
  const handleClearFilters = () => {
    onFilterChange({
      category: undefined,
      level: undefined,
      userId: '',
      offset: 0
    });
  };

  return (
    <div className="space-y-3">
      {/* Filter Header */}
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium text-gray-700 flex items-center">
          {ErrorLogIcons.FILTER} Filters
        </h4>
        <button
          onClick={handleClearFilters}
          disabled={loading}
          className="text-xs text-gray-500 hover:text-gray-700 transition-colors disabled:opacity-50"
        >
          Clear All
        </button>
      </div>

      {/* Filter Controls */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {/* Category Filter */}
        <div>
          <label htmlFor="category-filter" className="block text-xs font-medium text-gray-600 mb-1">
            Category
          </label>
          <select
            id="category-filter"
            value={filters.category || ''}
            onChange={handleCategoryChange}
            disabled={loading}
            className="w-full px-2 py-1 text-xs border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
          >
            <option value="">All Categories</option>
            {ErrorLogConstants.CATEGORIES.map(category => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {/* Level Filter */}
        <div>
          <label htmlFor="level-filter" className="block text-xs font-medium text-gray-600 mb-1">
            Level
          </label>
          <select
            id="level-filter"
            value={filters.level || ''}
            onChange={handleLevelChange}
            disabled={loading}
            className="w-full px-2 py-1 text-xs border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
          >
            <option value="">All Levels</option>
            {ErrorLogConstants.LEVELS.map(level => (
              <option key={level} value={level}>
                {level}
              </option>
            ))}
          </select>
        </div>

        {/* User ID Filter */}
        <div>
          <label htmlFor="user-filter" className="block text-xs font-medium text-gray-600 mb-1">
            User ID
          </label>
          <input
            id="user-filter"
            type="text"
            value={filters.userId}
            onChange={handleUserIdChange}
            disabled={loading}
            placeholder="Filter by user..."
            className="w-full px-2 py-1 text-xs border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
          />
        </div>

        {/* Limit Filter */}
        <div>
          <label htmlFor="limit-filter" className="block text-xs font-medium text-gray-600 mb-1">
            Limit
          </label>
          <select
            id="limit-filter"
            value={filters.limit}
            onChange={handleLimitChange}
            disabled={loading}
            className="w-full px-2 py-1 text-xs border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
            <option value={200}>200</option>
          </select>
        </div>
      </div>

      {/* Active Filters Display */}
      {(filters.category || filters.level || filters.userId) && (
        <div className="flex flex-wrap gap-2">
          {filters.category && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              Category: {filters.category}
              <button
                onClick={() => onFilterChange({ category: undefined })}
                className="ml-1 text-blue-600 hover:text-blue-800"
              >
                ×
              </button>
            </span>
          )}
          {filters.level && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
              Level: {filters.level}
              <button
                onClick={() => onFilterChange({ level: undefined })}
                className="ml-1 text-green-600 hover:text-green-800"
              >
                ×
              </button>
            </span>
          )}
          {filters.userId && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
              User: {filters.userId}
              <button
                onClick={() => onFilterChange({ userId: '' })}
                className="ml-1 text-yellow-600 hover:text-yellow-800"
              >
                ×
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  );
};
