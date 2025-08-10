/**
 * Error Logger Component
 * Displays server error logs in the UI for better debugging and user experience
 * Replaces terminal console.log with structured error display
 */

import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import {
  GET_ERROR_LOGS,
  GET_ERROR_LOG_STATS,
  CLEAR_ERROR_LOGS,
  ErrorLog,
  ErrorLogStats,
  ErrorLogLevel,
  ErrorLogCategory
} from '../../services/graphql/errorLogs';
import { ErrorLogFilters } from './ErrorLogFilters';
import { ErrorLogTable } from './ErrorLogTable';
import { ErrorLogStats as ErrorLogStatsComponent } from './ErrorLogStats';
import { ErrorLogConstants } from '../../constants/errorLogs';

/**
 * Error Logger Component Props
 */
interface ErrorLoggerProps {
  /** Whether the error logger is visible */
  isVisible?: boolean;
  /** Callback when the error logger is closed */
  onClose?: () => void;
  /** Whether to auto-refresh logs */
  autoRefresh?: boolean;
  /** Refresh interval in milliseconds */
  refreshInterval?: number;
}

/**
 * Error Logger Component
 * Main component for displaying and managing server error logs
 */
export const ErrorLogger: React.FC<ErrorLoggerProps> = ({
  isVisible = false,
  onClose,
  autoRefresh = true,
  refreshInterval = 5000 // 5 seconds
}) => {
  // State for filters and pagination
  const [filters, setFilters] = useState({
    category: undefined as ErrorLogCategory | undefined,
    level: undefined as ErrorLogLevel | undefined,
    userId: '',
    limit: ErrorLogConstants.DEFAULT_LIMIT,
    offset: 0
  });

  // State for component visibility
  const [isExpanded, setIsExpanded] = useState(false);

  // GraphQL queries
  const {
    data: logsData,
    loading: logsLoading,
    error: logsError,
    refetch: refetchLogs
  } = useQuery(GET_ERROR_LOGS, {
    variables: filters,
    pollInterval: autoRefresh ? refreshInterval : 0,
    fetchPolicy: 'cache-and-network'
  });

  const {
    data: statsData,
    loading: statsLoading,
    refetch: refetchStats
  } = useQuery(GET_ERROR_LOG_STATS, {
    pollInterval: autoRefresh ? refreshInterval : 0,
    fetchPolicy: 'cache-and-network'
  });

  // GraphQL mutations
  const [clearLogs, { loading: clearLoading }] = useMutation(CLEAR_ERROR_LOGS, {
    onCompleted: () => {
      // Refetch data after clearing
      refetchLogs();
      refetchStats();
    }
  });

  // Handle filter changes
  const handleFilterChange = (newFilters: Partial<typeof filters>) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters,
      offset: 0 // Reset pagination when filters change
    }));
  };

  // Handle pagination
  const handlePageChange = (newOffset: number) => {
    setFilters(prev => ({
      ...prev,
      offset: newOffset
    }));
  };

  // Handle clear logs
  const handleClearLogs = async () => {
    try {
      await clearLogs();
    } catch (error) {
      // Error handling is done by the mutation
    }
  };

  // Handle refresh
  const handleRefresh = () => {
    refetchLogs();
    refetchStats();
  };

  // Handle toggle expanded view
  const handleToggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  // Handle close
  const handleClose = () => {
    setIsExpanded(false);
    onClose?.();
  };

  // Extract data
  const logs = logsData?.errorLogs || [];
  const stats = statsData?.errorLogStats;

  // Don't render if not visible
  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 max-w-4xl">
      {/* Collapsed View */}
      {!isExpanded && (
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-gray-800">
              Server Error Logger
            </h3>
            <div className="flex items-center space-x-2">
              {/* Error count badge */}
              {stats && (
                <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                  {stats.recentErrors} Recent Errors
                </span>
              )}

              {/* Expand button */}
              <button
                onClick={handleToggleExpanded}
                className="text-gray-500 hover:text-gray-700 transition-colors"
                title="Expand error logger"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
          </div>

          {/* Quick stats */}
          {stats && (
            <div className="grid grid-cols-3 gap-2 text-sm">
              <div className="text-center">
                <div className="font-semibold text-gray-800">{stats.totalLogs}</div>
                <div className="text-gray-500">Total Logs</div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-red-600">{stats.recentErrors}</div>
                <div className="text-gray-500">Recent Errors</div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-blue-600">
                  {Object.keys(stats.logsByCategory).length}
                </div>
                <div className="text-gray-500">Categories</div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Expanded View */}
      {isExpanded && (
        <div className="bg-white rounded-lg shadow-xl border border-gray-200 w-full max-w-4xl max-h-96 overflow-hidden">
          {/* Header */}
          <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-800">
                Server Error Logger
              </h3>
              <div className="flex items-center space-x-2">
                {/* Refresh button */}
                <button
                  onClick={handleRefresh}
                  disabled={logsLoading || statsLoading}
                  className="text-gray-500 hover:text-gray-700 transition-colors disabled:opacity-50"
                  title="Refresh logs"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </button>

                {/* Clear logs button */}
                <button
                  onClick={handleClearLogs}
                  disabled={clearLoading}
                  className="text-red-500 hover:text-red-700 transition-colors disabled:opacity-50"
                  title="Clear all logs"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>

                {/* Collapse button */}
                <button
                  onClick={handleToggleExpanded}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                  title="Collapse error logger"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                  </svg>
                </button>

                {/* Close button */}
                <button
                  onClick={handleClose}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                  title="Close error logger"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex flex-col h-80">
            {/* Filters */}
            <div className="p-4 border-b border-gray-200">
              <ErrorLogFilters
                filters={filters}
                onFilterChange={handleFilterChange}
                loading={logsLoading}
              />
            </div>

            {/* Stats */}
            {stats && (
              <div className="p-4 border-b border-gray-200">
                <ErrorLogStatsComponent stats={stats} />
              </div>
            )}

            {/* Logs Table */}
            <div className="flex-1 overflow-auto">
              <ErrorLogTable
                logs={logs}
                loading={logsLoading}
                error={logsError}
                filters={filters}
                onPageChange={handlePageChange}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
