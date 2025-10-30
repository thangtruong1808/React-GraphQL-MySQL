import React, { useMemo } from 'react';
import { useQuery } from '@apollo/client';
import { GET_DASHBOARD_COMMENTS_QUERY, type GetDashboardCommentsQueryData, type GetDashboardCommentsQueryVariables } from '../../services/graphql/commentQueries';
import { InlineError } from '../ui';
import { useAuth } from '../../contexts/AuthContext';
import { useRolePermissions } from '../../hooks/useRolePermissions';

/**
 * CommentsAudit
 * Fetches recent comments and displays a compact list
 * Uses theme-friendly utility classes for consistent styling
 */
const CommentsAudit: React.FC = () => {
  const variables: GetDashboardCommentsQueryVariables = useMemo(() => ({
    limit: 4,
    offset: 0,
    sortBy: 'createdAt',
    sortOrder: 'DESC'
  }), []);

  const { isInitializing, user } = useAuth();
  const { hasDashboardAccess } = useRolePermissions();
  const shouldSkip = isInitializing || !hasDashboardAccess || !user;

  const { data, loading, error } = useQuery<GetDashboardCommentsQueryData, GetDashboardCommentsQueryVariables>(
    GET_DASHBOARD_COMMENTS_QUERY,
    {
      variables,
      fetchPolicy: 'cache-and-network',
      errorPolicy: 'all',
      notifyOnNetworkStatusChange: true,
      skip: shouldSkip,
    }
  );

  if (loading && !data) {
    return (
      <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-gray-100">
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-orange-100 rounded shadow-sm">
              <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h3 className="text-base font-semibold text-gray-900">Comments</h3>
          </div>
          <p className="text-xs text-gray-500">Latest operation comments</p>
        </div>
        <div className="divide-y divide-gray-100">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="p-4">
              <div className="h-3 w-3/4 bg-gray-100 rounded mb-2" />
              <div className="h-3 w-20 bg-gray-100 rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error && !shouldSkip) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <InlineError message={error.message || 'Failed to load comments'} />
      </div>
    );
  }

  const comments = data?.dashboardComments.comments ?? [];

  return (
    <div
      className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm hover:shadow-md dark:hover:shadow-lg transition-colors border theme-border-light overflow-hidden"
      style={{ backgroundColor: 'var(--card-bg)' }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.backgroundColor = 'var(--card-hover-bg)'; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.backgroundColor = 'var(--card-bg)'; }}
    >
      <div className="p-4 border-b theme-border-light">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded shadow-sm" style={{ backgroundColor: 'var(--icon-comments-bg)' }}>
            <svg className="w-5 h-5" style={{ color: 'var(--icon-comments-fg)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <h3 className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>Comments</h3>
        </div>
        <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Latest operation comments</p>
      </div>
      <div className="divide-y theme-table-divide">
        {comments.map((c) => (
          <div
            key={c.id}
            className="p-4 transition-colors"
            style={{ backgroundColor: 'var(--card-bg)', color: 'var(--text-primary)' }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.backgroundColor = 'var(--table-row-hover-bg)'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.backgroundColor = 'var(--card-bg)'; }}
          >
            <p className="text-sm line-clamp-2" style={{ color: 'var(--text-primary)' }}>{c.content}</p>
            <div className="flex items-center justify-between mt-2">
              <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>By {c.author.firstName} {c.author.lastName} • {c.author.role}</span>
              <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>{new Date(c.createdAt).toLocaleString()}</span>
            </div>
          </div>
        ))}
        {comments.length === 0 && (
          <div className="p-6 text-center text-sm text-gray-500 dark:text-gray-300">No comments found</div>
        )}
      </div>
    </div>
  );
};

export default CommentsAudit;


