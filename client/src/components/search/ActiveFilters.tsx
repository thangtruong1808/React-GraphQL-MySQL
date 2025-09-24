import React from 'react';
import { formatRoleForFilter } from '../../utils/roleFormatter';
import { getRoleColorScheme } from '../../utils/roleColors';

/**
 * Active Filters Component
 * Displays currently active project and task status filters
 * Follows React best practices with proper TypeScript interfaces
 */

interface ActiveFiltersProps {
  projectStatusFilter: string[];
  taskStatusFilter: string[];
  searchQuery: string;
  searchType: {
    isUserSearch: boolean;
    isProjectStatusSearch: boolean;
    isTaskStatusSearch: boolean;
    isRoleSearch: boolean;
  };
  roleFilter: string[];
}

/**
 * ActiveFilters Component
 * Renders active filters with appropriate color coding
 */
const ActiveFilters: React.FC<ActiveFiltersProps> = ({
  projectStatusFilter,
  taskStatusFilter,
  searchQuery,
  searchType,
  roleFilter
}) => {
  // Don't render if no filters are active
  if (projectStatusFilter.length === 0 && taskStatusFilter.length === 0 && !searchType.isUserSearch && !searchType.isRoleSearch) {
    return null;
  }

  return (
    <div className="relative">
      {/* Background decoration matching SearchSectionsContainer */}
      <div className="absolute inset-0 bg-gradient-to-r from-slate-50 via-blue-50 to-slate-50 rounded-2xl opacity-50"></div>

      {/* Main container with exact SearchSectionsContainer styling */}
      <div className="relative bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-300 p-6">
        {/* Header section with icon and title */}
        <div className="flex items-center mb-6">
          <div className="mr-3 p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-md">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.414A1 1 0 013 6.707V4z" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800">Active Filters</h3>
            <p className="text-sm text-gray-500">Current search and filter criteria</p>
          </div>
        </div>

        {/* Compact filter sections in single row */}
        <div className="flex flex-wrap gap-4">
          {/* Member search filter */}
          {searchType.isUserSearch && searchQuery && (
            <div className="flex items-center bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200 p-3">
              <div className="mr-2 p-1.5 bg-blue-500 rounded-lg">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-blue-700">Member:</span>
                <span className="inline-flex items-center px-3 py-1 text-sm font-medium bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 rounded-full border border-blue-200 shadow-sm">
                  <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  "{searchQuery}"
                </span>
              </div>
            </div>
          )}

          {/* Role filters */}
          {searchType.isRoleSearch && roleFilter.length > 0 && (
            <div className="flex items-center bg-gradient-to-r from-purple-50 to-violet-50 rounded-xl border border-purple-200 p-3">
              <div className="mr-2 p-1.5 bg-purple-500 rounded-lg">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-purple-700">Roles:</span>
                <div className="flex flex-wrap gap-1">
                  {roleFilter.map((role) => {
                    const roleStyle = getRoleColorScheme(role);
                    return (
                      <span
                        key={role}
                        className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full border shadow-sm ${roleStyle.bg} ${roleStyle.border} ${roleStyle.text}`}
                      >
                        <div className={`w-1.5 h-1.5 mr-1 rounded-full ${roleStyle.dot}`}></div>
                        {formatRoleForFilter(role)}
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Project status filters */}
          {projectStatusFilter.length > 0 && (
            <div className="flex items-center bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200 p-3">
              <div className="mr-2 p-1.5 bg-green-500 rounded-lg">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-green-700">Projects:</span>
                <div className="flex flex-wrap gap-1">
                  {projectStatusFilter.map((status) => (
                    <span
                      key={status}
                      className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full border shadow-sm ${status === 'COMPLETED'
                        ? 'bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800 border-purple-300' :
                        status === 'IN_PROGRESS'
                          ? 'bg-gradient-to-r from-orange-100 to-orange-200 text-orange-800 border-orange-300' :
                          'bg-gradient-to-r from-indigo-100 to-indigo-200 text-indigo-800 border-indigo-300'
                        }`}
                    >
                      <div className={`w-1.5 h-1.5 mr-1 rounded-full ${status === 'COMPLETED' ? 'bg-purple-500' :
                        status === 'IN_PROGRESS' ? 'bg-orange-500' :
                          'bg-indigo-500'
                        }`}></div>
                      {status.replace('_', ' ')}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Task status filters */}
          {taskStatusFilter.length > 0 && (
            <div className="flex items-center bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl border border-orange-200 p-3">
              <div className="mr-2 p-1.5 bg-orange-500 rounded-lg">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-orange-700">Tasks:</span>
                <div className="flex flex-wrap gap-1">
                  {taskStatusFilter.map((status) => (
                    <span
                      key={status}
                      className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full border shadow-sm ${status === 'DONE'
                        ? 'bg-gradient-to-r from-pink-100 to-pink-200 text-pink-800 border-pink-300' :
                        status === 'IN_PROGRESS'
                          ? 'bg-gradient-to-r from-cyan-100 to-cyan-200 text-cyan-800 border-cyan-300' :
                          'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 border-gray-300'
                        }`}
                    >
                      <div className={`w-1.5 h-1.5 mr-1 rounded-full ${status === 'DONE' ? 'bg-pink-500' :
                        status === 'IN_PROGRESS' ? 'bg-cyan-500' :
                          'bg-gray-500'
                        }`}></div>
                      {status.replace('_', ' ')}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ActiveFilters;
