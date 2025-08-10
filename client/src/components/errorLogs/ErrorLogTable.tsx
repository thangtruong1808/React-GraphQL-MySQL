/**
 * Error Log Table Component
 * Displays error logs in a table format with pagination and sorting
 * Provides detailed view of server error logs
 */

import React, { useState } from 'react';
import { ApolloError } from '@apollo/client';
import { ErrorLog } from '../../services/graphql/errorLogs';
import {
  ErrorLogLevelColors,
  ErrorLogCategoryColors,
  ErrorLogIcons,
  ErrorLogMessages,
  ErrorLogTableConfig
} from '../../constants/errorLogs';

/**
 * Error Log Table Props
 */
interface ErrorLogTableProps {
  /** Array of error log entries */
  logs: ErrorLog[];
  /** Whether the table is in loading state */
  loading?: boolean;
  /** Apollo error object */
  error?: ApolloError;
  /** Current filter values */
  filters: {
    category?: string;
    level?: string;
    userId: string;
    limit: number;
    offset: number;
  };
  /** Callback when pagination changes */
  onPageChange: (offset: number) => void;
}

/**
 * Error Log Table Component
 * Displays error logs in a structured table format
 */
export const ErrorLogTable: React.FC<ErrorLogTableProps> = ({
  logs,
  loading = false,
  error,
  filters,
  onPageChange
}) => {
  // State for expanded rows
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  // Handle row expansion toggle
  const handleRowToggle = (logId: string) => {
    const newExpandedRows = new Set(expandedRows);
    if (newExpandedRows.has(logId)) {
      newExpandedRows.delete(logId);
    } else {
      newExpandedRows.add(logId);
    }
    setExpandedRows(newExpandedRows);
  };

  // Handle pagination
  const handlePreviousPage = () => {
    const newOffset = Math.max(0, filters.offset - filters.limit);
    onPageChange(newOffset);
  };

  const handleNextPage = () => {
    const newOffset = filters.offset + filters.limit;
    onPageChange(newOffset);
  };

  // Format timestamp
  const formatTimestamp = (timestamp: string) => {
    try {
      const date = new Date(timestamp);
      return date.toLocaleTimeString('en-US', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
    } catch {
      return timestamp;
    }
  };

  // Truncate message
  const truncateMessage = (message: string, maxLength: number = 50) => {
    if (message.length <= maxLength) return message;
    return message.substring(0, maxLength) + '...';
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

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="text-gray-500 text-sm">
          {ErrorLogMessages.LOADING_LOGS}
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="text-red-500 text-sm">
          {ErrorLogMessages.FAILED_TO_LOAD}
        </div>
      </div>
    );
  }

  // Empty state
  if (logs.length === 0) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="text-gray-500 text-sm">
          {ErrorLogMessages.NO_LOGS}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Time
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Level
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Message
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                User
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Operation
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Details
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {logs.map((log) => {
              const isExpanded = expandedRows.has(log.id);
              const levelColors = getLevelColorClasses(log.level);
              const categoryColors = getCategoryColorClasses(log.category);

              return (
                <React.Fragment key={log.id}>
                  {/* Main Row */}
                  <tr className="hover:bg-gray-50 cursor-pointer" onClick={() => handleRowToggle(log.id)}>
                    <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">
                      {formatTimestamp(log.timestamp)}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${levelColors.bg} ${levelColors.text}`}>
                        {log.level}
                      </span>
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${categoryColors.bg} ${categoryColors.text}`}>
                        {log.category}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-xs text-gray-900">
                      {truncateMessage(log.message)}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-500">
                      {log.userId || '-'}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-500">
                      {log.operation || '-'}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-500">
                      <button className="text-blue-600 hover:text-blue-800">
                        {isExpanded ? 'Hide' : 'Show'}
                      </button>
                    </td>
                  </tr>

                  {/* Expanded Details Row */}
                  {isExpanded && (
                    <tr>
                      <td colSpan={7} className="px-3 py-2 bg-gray-50">
                        <div className="space-y-2">
                          {/* Full Message */}
                          <div>
                            <span className="text-xs font-medium text-gray-700">Message:</span>
                            <p className="text-xs text-gray-900 mt-1">{log.message}</p>
                          </div>

                          {/* Details */}
                          {log.details && (
                            <div>
                              <span className="text-xs font-medium text-gray-700">Details:</span>
                              <pre className="text-xs text-gray-900 mt-1 bg-gray-100 p-2 rounded overflow-x-auto">
                                {log.details}
                              </pre>
                            </div>
                          )}

                          {/* Additional Info */}
                          <div className="grid grid-cols-2 gap-4 text-xs">
                            <div>
                              <span className="font-medium text-gray-700">Request ID:</span>
                              <span className="text-gray-900 ml-1">{log.requestId || '-'}</span>
                            </div>
                            <div>
                              <span className="font-medium text-gray-700">Timestamp:</span>
                              <span className="text-gray-900 ml-1">{log.timestamp}</span>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between px-3 py-2 bg-gray-50 border-t border-gray-200">
        <div className="text-xs text-gray-500">
          Showing {filters.offset + 1} to {Math.min(filters.offset + filters.limit, filters.offset + logs.length)} of {logs.length} logs
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={handlePreviousPage}
            disabled={filters.offset === 0}
            className="px-2 py-1 text-xs text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <button
            onClick={handleNextPage}
            disabled={logs.length < filters.limit}
            className="px-2 py-1 text-xs text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};
