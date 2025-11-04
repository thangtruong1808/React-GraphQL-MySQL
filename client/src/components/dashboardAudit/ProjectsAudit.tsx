import React, { useMemo } from 'react';
import { useQuery } from '@apollo/client';
import { GET_DASHBOARD_PROJECTS_QUERY, type GetDashboardProjectsQueryResponse, type GetDashboardProjectsQueryVariables } from '../../services/graphql/projectQueries';
import { InlineError } from '../ui';
import { useAuth } from '../../contexts/AuthContext';
import { useRolePermissions } from '../../hooks/useRolePermissions';
import { useAuthDataReady } from '../../hooks/useAuthDataReady';

/**
 * ProjectsAudit
 * Fetches recent projects and displays a compact list
 * Uses theme-friendly utility classes for consistent styling
 */
const ProjectsAudit: React.FC = () => {
  const variables: GetDashboardProjectsQueryVariables = useMemo(() => ({
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

  const { data, loading, error } = useQuery<GetDashboardProjectsQueryResponse, GetDashboardProjectsQueryVariables>(
    GET_DASHBOARD_PROJECTS_QUERY,
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
      <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-gray-100">
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-blue-100 rounded shadow-sm">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="text-base font-semibold text-gray-900">Projects</h3>
          </div>
          <p className="text-xs text-gray-500">Latest operation projects</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="p-4 border border-gray-100 rounded-lg">
              <div className="h-4 w-2/3 bg-gray-100 rounded mb-2" />
              <div className="h-3 w-1/2 bg-gray-100 rounded mb-2" />
              <div className="h-3 w-24 bg-gray-100 rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error && !shouldSkip) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <InlineError message={error.message || 'Failed to load projects'} />
      </div>
    );
  }

  const projects = data?.dashboardProjects.projects ?? [];

  const statusBadge = (status?: string) => {
    const s = status || '';
    const map: Record<string, string> = {
      COMPLETED: 'bg-emerald-50 text-emerald-700',
      IN_PROGRESS: 'bg-blue-50 text-blue-700',
      PLANNING: 'bg-yellow-50 text-yellow-700'
    };
    const cls = map[s] || 'bg-gray-50 text-gray-700';
    return <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${cls}`}>{s || 'UNKNOWN'}</span>;
  };

  return (
    <div
      className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm hover:shadow-md dark:hover:shadow-lg transition-colors border border-gray-100 dark:border-gray-800"
      style={{ backgroundColor: 'var(--card-bg)' }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.backgroundColor = 'var(--card-hover-bg)'; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.backgroundColor = 'var(--card-bg)'; }}
    >
      <div className="p-4 border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded shadow-sm" style={{ backgroundColor: 'var(--icon-projects-bg)' }}>
            <svg className="w-5 h-5" style={{ color: 'var(--icon-projects-fg)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <h3 className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>Projects</h3>
        </div>
        <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Latest operation projects</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4">
        {projects.map((p) => (
          <div
            key={p.id}
            className="p-4 border border-gray-100 dark:border-gray-800 rounded-lg transition-colors"
            style={{ backgroundColor: 'var(--card-bg)', color: 'var(--text-primary)' }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.backgroundColor = 'var(--table-row-hover-bg)'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.backgroundColor = 'var(--card-bg)'; }}
          >
            <div className="flex items-start justify-between">
              <h4 className="text-sm font-medium mr-2 truncate" style={{ color: 'var(--text-primary)' }}>{p.name}</h4>
              {statusBadge(p.status)}
            </div>
            <p className="text-xs mt-1 line-clamp-2" style={{ color: 'var(--text-secondary)' }}>{p.description}</p>
            <div className="flex items-center justify-between mt-3">
              <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>Owner: {p.owner ? `${p.owner.firstName} ${p.owner.lastName}` : 'N/A'}</span>
              <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>{new Date(p.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        ))}
        {projects.length === 0 && (
          <div className="p-6 text-center text-sm text-gray-500 dark:text-gray-300 col-span-full">No projects found</div>
        )}
      </div>
    </div>
  );
};

export default ProjectsAudit;


