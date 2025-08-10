/**
 * Client Error Log Stats Component
 * Displays statistics for client error logs
 */

import React from 'react';
import { ClientErrorLogLevel } from '../../utils/errorLogger';

/**
 * Client Error Log Stats Props
 */
interface ClientErrorLogStatsProps {
  /** Statistics data */
  stats: {
    totalLogs: number;
    recentErrors: number;
    logsByCategory: { [key: string]: number };
    logsByLevel: { [key: string]: number };
  };
}

/**
 * Client Error Log Stats Component
 * Displays statistics for client error logs
 */
export const ClientErrorLogStats: React.FC<ClientErrorLogStatsProps> = ({ stats }) => {
  // Calculate percentages
  const getPercentage = (count: number, total: number) => {
    return total > 0 ? Math.round((count / total) * 100) : 0;
  };

  // Get level color
  const getLevelColor = (level: string) => {
    switch (level) {
      case ClientErrorLogLevel.DEBUG:
        return 'text-blue-600';
      case ClientErrorLogLevel.INFO:
        return 'text-green-600';
      case ClientErrorLogLevel.WARN:
        return 'text-yellow-600';
      case ClientErrorLogLevel.ERROR:
        return 'text-red-600';
      case ClientErrorLogLevel.CRITICAL:
        return 'text-purple-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-4">
      {/* Summary Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <div className="text-2xl font-bold text-gray-800">{stats.totalLogs}</div>
          <div className="text-sm text-gray-600">Total Logs</div>
        </div>
        <div className="text-center p-3 bg-red-50 rounded-lg">
          <div className="text-2xl font-bold text-red-600">{stats.recentErrors}</div>
          <div className="text-sm text-red-600">Recent Errors</div>
        </div>
        <div className="text-center p-3 bg-blue-50 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">
            {Object.keys(stats.logsByCategory).length}
          </div>
          <div className="text-sm text-blue-600">Categories</div>
        </div>
        <div className="text-center p-3 bg-green-50 rounded-lg">
          <div className="text-2xl font-bold text-green-600">
            {Object.keys(stats.logsByLevel).length}
          </div>
          <div className="text-sm text-green-600">Levels</div>
        </div>
      </div>

      {/* Logs by Level */}
      <div>
        <h4 className="text-sm font-semibold text-gray-700 mb-2">Logs by Level</h4>
        <div className="space-y-2">
          {Object.entries(stats.logsByLevel).map(([level, count]) => (
            <div key={level} className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className={`text-sm font-medium ${getLevelColor(level)}`}>
                  {level}
                </span>
                <div className="w-20 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${getPercentage(count, stats.totalLogs)}%` }}
                  />
                </div>
              </div>
              <div className="text-sm text-gray-600">
                {count} ({getPercentage(count, stats.totalLogs)}%)
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Logs by Category */}
      <div>
        <h4 className="text-sm font-semibold text-gray-700 mb-2">Logs by Category</h4>
        <div className="space-y-2">
          {Object.entries(stats.logsByCategory).map(([category, count]) => (
            <div key={category} className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-700">
                  {category}
                </span>
                <div className="w-20 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-600 h-2 rounded-full"
                    style={{ width: `${getPercentage(count, stats.totalLogs)}%` }}
                  />
                </div>
              </div>
              <div className="text-sm text-gray-600">
                {count} ({getPercentage(count, stats.totalLogs)}%)
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
