/**
 * Client Error Log Table Component
 * Displays client error logs in a table format
 */

import React, { useState } from 'react';
import { ClientErrorLogEntry, ClientErrorLogLevel } from '../../utils/errorLogger';

/**
 * Client Error Log Table Props
 */
interface ClientErrorLogTableProps {
  /** Array of error log entries */
  logs: ClientErrorLogEntry[];
  /** Current filter values */
  filters: {
    category?: string;
    level?: ClientErrorLogLevel;
    limit: number;
    offset: number;
  };
  /** Callback when page changes */
  onPageChange: (offset: number) => void;
  /** Total number of logs */
  totalLogs: number;
}

/**
 * Client Error Log Table Component
 * Displays client error logs in a table format
 */
export const ClientErrorLogTable: React.FC<ClientErrorLogTableProps> = ({
  logs,
  filters,
  onPageChange,
  totalLogs
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

  // Get level color and icon
  const getLevelDisplay = (level: ClientErrorLogLevel) => {
    switch (level) {
      case ClientErrorLogLevel.DEBUG:
        return { color: 'text-blue-600', bgColor: 'bg-blue-100', icon: '🔍' };
      case ClientErrorLogLevel.INFO:
        return { color: 'text-green-600', bgColor: 'bg-green-100', icon: 'ℹ️' };
      case ClientErrorLogLevel.WARN:
        return { color: 'text-yellow-600', bgColor: 'bg-yellow-100', icon: '⚠️' };
      case ClientErrorLogLevel.ERROR:
        return { color: 'text-red-600', bgColor: 'bg-red-100', icon: '❌' };
      case ClientErrorLogLevel.CRITICAL:
        return { color: 'text-purple-600', bgColor: 'bg-purple-100', icon: '🚨' };
      default:
        return { color: 'text-gray-600', bgColor: 'bg-gray-100', icon: '📝' };
    }
  };

  // Format timestamp
  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  // Calculate pagination
  const totalPages = Math.ceil(totalLogs / filters.limit);
  const currentPage = Math.floor(filters.offset / filters.limit) + 1;

  // Handle page navigation
  const handlePageChange = (newOffset: number) => {
    if (newOffset >= 0 && newOffset < totalLogs) {
      onPageChange(newOffset);
    }
  };

  return (
    <div className="space-y-4">
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
                Operation
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {logs.map((log) => {
              const levelDisplay = getLevelDisplay(log.level);
              const isExpanded = expandedRows.has(log.id);

              return (
                <React.Fragment key={log.id}>
                  <tr className="hover:bg-gray-50">
                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                      {formatTimestamp(log.timestamp)}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${levelDisplay.bgColor} ${levelDisplay.color}`}>
                        {levelDisplay.icon} {log.level}
                      </span>
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                      {log.category}
                    </td>
                    <td className="px-3 py-2 text-sm text-gray-900 max-w-xs truncate">
                      {log.message}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                      {log.operation || '-'}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                      <button
                        onClick={() => handleRowToggle(log.id)}
                        className="text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        {isExpanded ? 'Hide' : 'Show'} Details
                      </button>
                    </td>
                  </tr>
                  {/* Expanded Details Row */}
                  {isExpanded && (
                    <tr>
                      <td colSpan={6} className="px-3 py-2 bg-gray-50">
                        <div className="space-y-2">
                          <div>
                            <span className="font-medium text-gray-700">Message:</span>
                            <p className="text-sm text-gray-900 mt-1">{log.message}</p>
                          </div>
                          {log.details && (
                            <div>
                              <span className="font-medium text-gray-700">Details:</span>
                              <pre className="text-sm text-gray-900 mt-1 bg-gray-100 p-2 rounded overflow-x-auto">
                                {JSON.stringify(log.details, null, 2)}
                              </pre>
                            </div>
                          )}
                          {log.source && (
                            <div>
                              <span className="font-medium text-gray-700">Source:</span>
                              <p className="text-sm text-gray-900 mt-1">{log.source}</p>
                            </div>
                          )}
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="font-medium text-gray-700">Operation:</span>
                              <p className="text-gray-900">{log.operation || 'N/A'}</p>
                            </div>
                            <div>
                              <span className="font-medium text-gray-700">Timestamp:</span>
                              <p className="text-gray-900">{log.timestamp}</p>
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
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Showing {filters.offset + 1} to {Math.min(filters.offset + filters.limit, totalLogs)} of {totalLogs} logs
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => handlePageChange(filters.offset - filters.limit)}
              disabled={filters.offset === 0}
              className="px-3 py-1 text-sm border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Previous
            </button>
            <span className="px-3 py-1 text-sm text-gray-700">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => handlePageChange(filters.offset + filters.limit)}
              disabled={filters.offset + filters.limit >= totalLogs}
              className="px-3 py-1 text-sm border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Empty State */}
      {logs.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">No logs found matching the current filters.</p>
        </div>
      )}
    </div>
  );
};
