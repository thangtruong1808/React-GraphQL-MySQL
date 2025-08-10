/**
 * Error Log Stats Component
 * Displays error log statistics and analytics
 * Provides overview of error patterns and trends
 */

import React from 'react';
import { ErrorLogStats as ErrorLogStatsType } from '../../services/graphql/errorLogs';
import { ErrorLogLevelColors, ErrorLogCategoryColors, ErrorLogIcons } from '../../constants/errorLogs';

/**
 * Error Log Stats Props
 */
interface ErrorLogStatsProps {
  /** Error log statistics data */
  stats: ErrorLogStatsType;
}

/**
 * Error Log Stats Component
 * Displays comprehensive error log statistics
 */
export const ErrorLogStats: React.FC<ErrorLogStatsProps> = ({ stats }) => {
  // Calculate percentage for a value
  const calculatePercentage = (value: number, total: number) => {
    if (total === 0) return 0;
    return Math.round((value / total) * 100);
  };

  // Get level color classes
  const getLevelColorClasses = (level: string) => {
    const colors = ErrorLogLevelColors[level as keyof typeof ErrorLogLevelColors];
    return colors || ErrorLogLevelColors.INFO;
  };

  // Get category color classes
  const getCategoryColorClasses = (category: string) => {
    const colors = ErrorLogCategoryColors[category as keyof typeof ErrorLogCategoryColors];
    return colors || ErrorLogCategoryColors.SERVER;
  };

  // Sort categories by count (descending)
  const sortedCategories = Object.entries(stats.logsByCategory)
    .sort(([, a], [, b]) => b - a);

  // Sort levels by count (descending)
  const sortedLevels = Object.entries(stats.logsByLevel)
    .sort(([, a], [, b]) => b - a);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium text-gray-700 flex items-center">
          {ErrorLogIcons.SORT} Statistics
        </h4>
        <div className="text-xs text-gray-500">
          Last 24 hours
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {/* Total Logs */}
        <div className="bg-white p-3 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500">Total Logs</p>
              <p className="text-lg font-semibold text-gray-900">{stats.totalLogs}</p>
            </div>
            <div className="text-2xl text-gray-400">📊</div>
          </div>
        </div>

        {/* Recent Errors */}
        <div className="bg-white p-3 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500">Recent Errors</p>
              <p className="text-lg font-semibold text-red-600">{stats.recentErrors}</p>
            </div>
            <div className="text-2xl text-red-400">🚨</div>
          </div>
        </div>

        {/* Categories */}
        <div className="bg-white p-3 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500">Categories</p>
              <p className="text-lg font-semibold text-gray-900">
                {Object.keys(stats.logsByCategory).length}
              </p>
            </div>
            <div className="text-2xl text-blue-400">🏷️</div>
          </div>
        </div>

        {/* Error Rate */}
        <div className="bg-white p-3 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500">Error Rate</p>
              <p className="text-lg font-semibold text-orange-600">
                {calculatePercentage(stats.recentErrors, stats.totalLogs)}%
              </p>
            </div>
            <div className="text-2xl text-orange-400">📈</div>
          </div>
        </div>
      </div>

      {/* Detailed Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Logs by Level */}
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <h5 className="text-sm font-medium text-gray-700 mb-3">Logs by Level</h5>
          <div className="space-y-2">
            {sortedLevels.map(([level, count]) => {
              const percentage = calculatePercentage(count, stats.totalLogs);
              const colors = getLevelColorClasses(level);

              return (
                <div key={level} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${colors.bg} ${colors.text}`}>
                      {level}
                    </span>
                    <span className="text-xs text-gray-600">{count}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-16 bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${colors.bg.replace('bg-', 'bg-').replace('-50', '-500')}`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-500 w-8 text-right">{percentage}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Logs by Category */}
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <h5 className="text-sm font-medium text-gray-700 mb-3">Logs by Category</h5>
          <div className="space-y-2">
            {sortedCategories.map(([category, count]) => {
              const percentage = calculatePercentage(count, stats.totalLogs);
              const colors = getCategoryColorClasses(category);

              return (
                <div key={category} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${colors.bg} ${colors.text}`}>
                      {category}
                    </span>
                    <span className="text-xs text-gray-600">{count}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-16 bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${colors.bg.replace('bg-', 'bg-').replace('-50', '-500')}`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-500 w-8 text-right">{percentage}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Health Indicators */}
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <h5 className="text-sm font-medium text-gray-700 mb-3">System Health</h5>
        <div className="grid grid-cols-3 gap-4">
          {/* Error Rate Indicator */}
          <div className="text-center">
            <div className={`text-2xl font-bold ${stats.recentErrors === 0 ? 'text-green-600' :
                stats.recentErrors < 5 ? 'text-yellow-600' : 'text-red-600'
              }`}>
              {stats.recentErrors === 0 ? '🟢' : stats.recentErrors < 5 ? '🟡' : '🔴'}
            </div>
            <p className="text-xs text-gray-600 mt-1">Error Rate</p>
          </div>

          {/* Log Volume Indicator */}
          <div className="text-center">
            <div className={`text-2xl font-bold ${stats.totalLogs < 100 ? 'text-green-600' :
                stats.totalLogs < 500 ? 'text-yellow-600' : 'text-red-600'
              }`}>
              {stats.totalLogs < 100 ? '🟢' : stats.totalLogs < 500 ? '🟡' : '🔴'}
            </div>
            <p className="text-xs text-gray-600 mt-1">Log Volume</p>
          </div>

          {/* Category Diversity Indicator */}
          <div className="text-center">
            <div className={`text-2xl font-bold ${Object.keys(stats.logsByCategory).length <= 3 ? 'text-green-600' :
                Object.keys(stats.logsByCategory).length <= 5 ? 'text-yellow-600' : 'text-red-600'
              }`}>
              {Object.keys(stats.logsByCategory).length <= 3 ? '🟢' :
                Object.keys(stats.logsByCategory).length <= 5 ? '🟡' : '🔴'}
            </div>
            <p className="text-xs text-gray-600 mt-1">Categories</p>
          </div>
        </div>
      </div>
    </div>
  );
};
