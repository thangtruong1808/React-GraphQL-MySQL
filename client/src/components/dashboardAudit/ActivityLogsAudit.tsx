import React, { useMemo } from 'react';
import { useQuery } from '@apollo/client';
import { GET_DASHBOARD_ACTIVITIES_QUERY, type GetDashboardActivitiesQueryResponse, type GetDashboardActivitiesQueryVariables } from '../../services/graphql/activityQueries';
import { InlineError } from '../ui';
import { useAuth } from '../../contexts/AuthContext';
import { useRolePermissions } from '../../hooks/useRolePermissions';
import { useAuthDataReady } from '../../hooks/useAuthDataReady';

/**
 * ActivityLogsAudit
 * Fetches recent activity logs for auditing and displays them in a compact list
 * Uses theme-friendly utility classes for consistent styling
 */
const ActivityLogsAudit: React.FC = () => {
  const variables: GetDashboardActivitiesQueryVariables = useMemo(() => ({
    limit: 4,
    offset: 0,
    sortBy: 'createdAt',
    sortOrder: 'DESC'
  }), []);

  const { isInitializing, user } = useAuth();
  const { hasDashboardAccess } = useRolePermissions();
  const isAuthDataReady = useAuthDataReady();
  // Wait for auth data to be ready to prevent race conditions during fast navigation
  const shouldSkip = isInitializing || !hasDashboardAccess || !user || !isAuthDataReady;

  const { data, loading, error } = useQuery<GetDashboardActivitiesQueryResponse, GetDashboardActivitiesQueryVariables>(
    GET_DASHBOARD_ACTIVITIES_QUERY,
    {
      variables,
      fetchPolicy: 'cache-and-network',
      errorPolicy: 'all',
      notifyOnNetworkStatusChange: true,
      skip: shouldSkip,
    }
  );

  // Render loading skeleton rows
  if ((loading && !data) || shouldSkip) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm hover:shadow-md dark:hover:shadow-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors border border-gray-100 dark:border-gray-800">
        <div className="p-4 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-indigo-100 dark:bg-indigo-900/40 rounded shadow-sm">
              <svg className="w-5 h-5 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">Recent Activity</h3>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-300">Latest actions across the platform</p>
        </div>
        <div className="divide-y divide-gray-100 dark:divide-gray-800">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="p-4 flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-gray-100" />
              <div className="flex-1">
                <div className="h-3 w-40 bg-gray-100 rounded mb-2" />
                <div className="h-3 w-24 bg-gray-100 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error && !shouldSkip) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <InlineError message={error.message || 'Failed to load activity logs'} />
      </div>
    );
  }

  const activities = data?.dashboardActivities.activities ?? [];

  return (
    <div
      className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm hover:shadow-md dark:hover:shadow-lg transition-colors border theme-border-light overflow-hidden"
      style={{ backgroundColor: 'var(--card-bg)' }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.backgroundColor = 'var(--card-hover-bg)'; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.backgroundColor = 'var(--card-bg)'; }}
    >
      <div className="p-4 border-b theme-border-light">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded shadow-sm" style={{ backgroundColor: 'var(--icon-activity-bg)' }}>
            <svg className="w-5 h-5" style={{ color: 'var(--icon-activity-fg)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h3 className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>Recent Activity</h3>
        </div>
        <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Latest actions across the platform</p>
      </div>
      <div className="divide-y theme-table-divide">
        {activities.map((a) => (
          <div
            key={a.id}
            className="p-4 flex items-start gap-3 transition-colors"
            style={{ backgroundColor: 'var(--card-bg)', color: 'var(--text-primary)' }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.backgroundColor = 'var(--table-row-hover-bg)'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.backgroundColor = 'var(--card-bg)'; }}
          >
            <div
              className="w-8 h-8 flex items-center justify-center rounded-full text-xs font-semibold"
              style={{ backgroundColor: 'var(--badge-audit-bg)', color: 'var(--badge-audit-text)' }}
            >
              {a.type?.[0] || 'A'}
            </div>
            <div className="flex-1">
              <p className="text-sm">
                <span className="font-medium" style={{ color: 'var(--text-primary)' }}>{a.user?.firstName} {a.user?.lastName}</span>
                <span style={{ color: 'var(--text-secondary)' }}> {a.action?.toLowerCase()} </span>
                {a.project?.name && (
                  <span style={{ color: 'var(--text-primary)' }}>project “{a.project.name}”</span>
                )}
                {a.task?.title && !a.project?.name && (
                  <span style={{ color: 'var(--text-primary)' }}>task “{a.task.title}”</span>
                )}
                {a.targetUser && !a.project?.name && !a.task?.title && (
                  <span style={{ color: 'var(--text-primary)' }}>user “{a.targetUser.firstName} {a.targetUser.lastName}”</span>
                )}
              </p>
              <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>{new Date(a.createdAt).toLocaleString()}</p>
            </div>
          </div>
        ))}
        {activities.length === 0 && (
          <div className="p-6 text-center text-sm text-gray-500 dark:text-gray-300">No recent activity</div>
        )}
      </div>
    </div>
  );
};

export default ActivityLogsAudit;


