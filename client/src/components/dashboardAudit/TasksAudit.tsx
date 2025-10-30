import React, { useMemo } from 'react';
import { useQuery } from '@apollo/client';
import { GET_DASHBOARD_TASKS_QUERY, type GetDashboardTasksQueryResponse, type GetDashboardTasksQueryVariables } from '../../services/graphql/taskQueries';
import { InlineError } from '../ui';

/**
 * TasksAudit
 * Fetches recent tasks and displays a compact list
 * Uses theme-friendly utility classes for consistent styling
 */
const TasksAudit: React.FC = () => {
  const variables: GetDashboardTasksQueryVariables = useMemo(() => ({
    limit: 4,
    offset: 0,
    sortBy: 'createdAt',
    sortOrder: 'DESC'
  }), []);

  const { data, loading, error } = useQuery<GetDashboardTasksQueryResponse, GetDashboardTasksQueryVariables>(
    GET_DASHBOARD_TASKS_QUERY,
    { variables, fetchPolicy: 'cache-and-network', errorPolicy: 'all' }
  );

  if (loading && !data) {
    return (
      <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-gray-100">
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-purple-100 rounded shadow-sm">
              <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="text-base font-semibold text-gray-900">Tasks</h3>
          </div>
          <p className="text-xs text-gray-500">Latest operation tasks</p>
        </div>
        <div className="divide-y divide-gray-100">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="p-4">
              <div className="h-4 w-2/3 bg-gray-100 rounded mb-2" />
              <div className="h-3 w-32 bg-gray-100 rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <InlineError message={error.message || 'Failed to load tasks'} />
      </div>
    );
  }

  const tasks = data?.dashboardTasks.tasks ?? [];

  const statusBadge = (status?: string) => {
    const s = status || '';
    const map: Record<string, string> = {
      DONE: 'bg-emerald-50 text-emerald-700',
      IN_PROGRESS: 'bg-blue-50 text-blue-700',
      TODO: 'bg-gray-50 text-gray-700'
    };
    const cls = map[s] || 'bg-gray-50 text-gray-700';
    return <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${cls}`}>{s || 'UNKNOWN'}</span>;
  };

  return (
    <div
      className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm hover:shadow-md dark:hover:shadow-lg transition-colors border theme-border-light overflow-hidden"
      style={{ backgroundColor: 'var(--card-bg)' }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.backgroundColor = 'var(--card-hover-bg)'; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.backgroundColor = 'var(--card-bg)'; }}
    >
      <div className="p-4 border-b theme-border-light">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded shadow-sm" style={{ backgroundColor: 'var(--icon-tasks-bg)' }}>
            <svg className="w-5 h-5" style={{ color: 'var(--icon-tasks-fg)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h3 className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>Tasks</h3>
        </div>
        <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Latest operation tasks</p>
      </div>
      <div className="divide-y theme-table-divide">
        {tasks.map((t) => (
          <div
            key={t.id}
            className="p-4 transition-colors"
            style={{ backgroundColor: 'var(--card-bg)', color: 'var(--text-primary)' }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.backgroundColor = 'var(--table-row-hover-bg)'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.backgroundColor = 'var(--card-bg)'; }}
          >
            <div className="flex items-start justify-between">
              <h4 className="text-sm font-medium mr-2 truncate" style={{ color: 'var(--text-primary)' }}>{t.title}</h4>
              {statusBadge(t.status)}
            </div>
            <div className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
              <span className="mr-2">Project: {t.project?.name || 'N/A'}</span>
              {t.assignedUser && (
                <span>Assignee: {t.assignedUser.firstName} {t.assignedUser.lastName}</span>
              )}
            </div>
          </div>
        ))}
        {tasks.length === 0 && (
          <div className="p-6 text-center text-sm text-gray-500">No tasks found</div>
        )}
      </div>
    </div>
  );
};

export default TasksAudit;


