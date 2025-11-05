import React from 'react';
import { FaPlus, FaSync } from 'react-icons/fa';
import { ActivityManagementHeaderProps } from '../types';

/**
 * Activity Management Page Header Component
 * Displays page title, description, refresh button, and create button
 */
export const ActivityManagementHeader: React.FC<ActivityManagementHeaderProps> = ({
  canCreate,
  isLoading,
  onCreateClick,
  onRefresh,
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 [data-theme='brand']:bg-purple-50 border-b border-gray-200 dark:border-gray-700 [data-theme='brand']:border-purple-200 w-full">
      <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8 w-full">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white [data-theme='brand']:text-purple-900">
              Activity Management
            </h1>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 [data-theme='brand']:text-purple-700 mt-1">
              Manage and track user activities across the system
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <button
              onClick={onRefresh}
              disabled={isLoading}
              className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 [data-theme='brand']:border-purple-300 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 [data-theme='brand']:text-purple-800 bg-white dark:bg-gray-800 [data-theme='brand']:bg-purple-50 hover:bg-gray-50 dark:hover:bg-gray-700 [data-theme='brand']:hover:bg-purple-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
            >
              <FaSync className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              <span className="hidden xs:inline">Refresh</span>
              <span className="xs:hidden">Refresh</span>
            </button>
            {canCreate && (
              <button
                onClick={onCreateClick}
                className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors duration-200 w-full sm:w-auto"
              >
                <FaPlus className="h-4 w-4 mr-2" />
                <span className="hidden xs:inline">Create Activity</span>
                <span className="xs:hidden">Create</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

