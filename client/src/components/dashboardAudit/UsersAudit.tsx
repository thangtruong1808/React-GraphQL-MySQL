/* eslint-disable */
export { };
import React, { useMemo } from 'react';
import { useQuery } from '../../services/graphql/hooks';
import { GET_USERS_QUERY, type GetUsersQueryResponse, type GetUsersQueryVariables } from '../../services/graphql/userQueries';
import { InlineError } from '../ui';

/**
 * UsersAudit
 * Fetches platform users and displays a simple list with roles from DB
 * Uses theme-friendly utility classes for consistent styling
 */
const UsersAudit: React.FC = () => {
  const variables: GetUsersQueryVariables = useMemo(() => ({
    limit: 4,
    offset: 0,
    sortBy: 'createdAt',
    sortOrder: 'DESC'
  }), []);

  const { data, loading, error } = useQuery<GetUsersQueryResponse, GetUsersQueryVariables>(
    GET_USERS_QUERY,
    { variables, fetchPolicy: 'cache-and-network', errorPolicy: 'all' }
  );

  if (loading && !data) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm hover:shadow-md dark:hover:shadow-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors border border-gray-100 dark:border-gray-800">
        <div className="p-4 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-emerald-100 dark:bg-emerald-900/40 rounded shadow-sm">
              <svg className="w-5 h-5 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">Users</h3>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-300">Latest registered users</p>
        </div>
        <div className="divide-y divide-gray-100">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="p-4 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gray-100" />
              <div className="flex-1">
                <div className="h-3 w-36 bg-gray-100 rounded mb-2" />
                <div className="h-3 w-20 bg-gray-100 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <InlineError message={error.message || 'Failed to load users'} />
      </div>
    );
  }

  const users = data?.users.users ?? [];

  return (
    <div
      className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm hover:shadow-md dark:hover:shadow-lg transition-colors border theme-border-light overflow-hidden"
      style={{ backgroundColor: 'var(--card-bg)' }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.backgroundColor = 'var(--card-hover-bg)'; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.backgroundColor = 'var(--card-bg)'; }}
    >
      <div className="p-4 border-b theme-border-light">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded shadow-sm" style={{ backgroundColor: 'var(--icon-users-bg)' }}>
            <svg className="w-5 h-5" style={{ color: 'var(--icon-users-fg)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h3 className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>Users</h3>
        </div>
        <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Latest registered users</p>
      </div>
      <div className="divide-y theme-table-divide">
        {users.map((u) => (
          <div
            key={u.id}
            className="p-4 flex items-center justify-between transition-colors"
            style={{ backgroundColor: 'var(--card-bg)', color: 'var(--text-primary)' }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.backgroundColor = 'var(--table-row-hover-bg)'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.backgroundColor = 'var(--card-bg)'; }}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold"
                style={{ backgroundColor: 'var(--badge-audit-bg)', color: 'var(--badge-audit-text)' }}
              >
                {u.firstName?.[0] || 'U'}
              </div>
              <div>
                <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{u.firstName} {u.lastName}</p>
                <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{u.email}</p>
              </div>
            </div>
            <span
              className="px-2.5 py-1 text-xs font-medium rounded-full"
              style={{ backgroundColor: 'var(--badge-primary-bg)', color: 'var(--badge-primary-text)' }}
            >
              {u.role}
            </span>
          </div>
        ))}
        {users.length === 0 && (
          <div className="p-6 text-center text-sm text-gray-500 dark:text-gray-300">No users found</div>
        )}
      </div>
    </div>
  );
};

export default UsersAudit;


