import React from 'react';
import { Link } from 'react-router-dom';
import { ROUTE_PATHS } from '../../../constants/routingConstants';
import { TeamMember, FilterType, SortOption } from './types';
import { useMemo } from 'react';
import { TeamMembersGridSkeleton } from '../../../components/ui';
import { formatRoleForDisplay } from '../../../utils/roleFormatter';

/**
 * Description: Renders the team members grid with filtering, sorting, and themed presentation.
 * Data created: Derived sorted member list via memoization.
 * Author: thangtruong
 */

interface TeamMembersGridProps {
  filteredMembers: TeamMember[];
  filter: FilterType;
  setFilter: (filter: FilterType) => void;
  sortOption: SortOption;
  formatJoinDate: (date: string) => string;
  loading: boolean;
}

/**
 * Description: Outputs sorted team members with themed styling and empty-state handling.
 * Data created: None; relies on props and derived memoized sorting.
 * Author: thangtruong
 */
const TeamMembersGrid: React.FC<TeamMembersGridProps> = ({
  filteredMembers,
  filter,
  setFilter,
  sortOption,
  formatJoinDate,
  loading
}) => {

  // Client-side sorting logic for filtered team members
  const sortedMembers = useMemo(() => {
    return [...filteredMembers].sort((a, b) => {
      let aVal: any, bVal: any;

      switch (sortOption.field) {
        case 'name':
          aVal = `${a.firstName} ${a.lastName}`.toLowerCase();
          bVal = `${b.firstName} ${b.lastName}`.toLowerCase();
          break;
        case 'role':
          aVal = a.role.toLowerCase();
          bVal = b.role.toLowerCase();
          break;
        case 'joinDate':
          aVal = new Date(a.joinDate).getTime();
          bVal = new Date(b.joinDate).getTime();
          break;
        case 'projectCount':
          aVal = a.projectCount;
          bVal = b.projectCount;
          break;
        case 'taskCount':
          aVal = a.taskCount;
          bVal = b.taskCount;
          break;
        default:
          return 0;
      }

      if (aVal < bVal) return sortOption.direction === 'ASC' ? -1 : 1;
      if (aVal > bVal) return sortOption.direction === 'ASC' ? 1 : -1;
      return 0;
    });
  }, [filteredMembers, sortOption.field, sortOption.direction]);

  // Get role color for team members based on database role values with theme support
  const getRoleColor = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 [data-theme="brand"]:bg-red-100 [data-theme="brand"]:text-red-800';
      case 'Project Manager':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 [data-theme="brand"]:bg-purple-100 [data-theme="brand"]:text-purple-800';
      case 'Software Architect':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 [data-theme="brand"]:bg-purple-100 [data-theme="brand"]:text-purple-800';
      case 'Frontend Developer':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 [data-theme="brand"]:bg-pink-100 [data-theme="brand"]:text-pink-800';
      case 'Backend Developer':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 [data-theme="brand"]:bg-pink-100 [data-theme="brand"]:text-pink-800';
      case 'Full-Stack Developer':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 [data-theme="brand"]:bg-pink-100 [data-theme="brand"]:text-pink-800';
      case 'DevOps Engineer':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 [data-theme="brand"]:bg-orange-100 [data-theme="brand"]:text-orange-800';
      case 'QA Engineer':
        return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200 [data-theme="brand"]:bg-purple-100 [data-theme="brand"]:text-purple-800';
      case 'QC Engineer':
        return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200 [data-theme="brand"]:bg-purple-100 [data-theme="brand"]:text-purple-800';
      case 'UX/UI Designer':
        return 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200 [data-theme="brand"]:bg-pink-100 [data-theme="brand"]:text-pink-800';
      case 'Business Analyst':
        return 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200 [data-theme="brand"]:bg-cyan-100 [data-theme="brand"]:text-cyan-800';
      case 'Database Administrator':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200 [data-theme="brand"]:bg-orange-100 [data-theme="brand"]:text-orange-800';
      case 'Technical Writer':
        return 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200 [data-theme="brand"]:bg-teal-100 [data-theme="brand"]:text-teal-800';
      case 'Support Engineer':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200 [data-theme="brand"]:bg-gray-100 [data-theme="brand"]:text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200 [data-theme="brand"]:bg-gray-100 [data-theme="brand"]:text-gray-800';
    }
  };

  // Show skeleton when loading
  if (loading) {
    return <TeamMembersGridSkeleton />;
  }

  return (
    <div className="px-6 py-8">
      {/* Team Members Grid - 4 items per row with client-side sorting */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {sortedMembers.length > 0 ? (
          sortedMembers.map((member: TeamMember) => (
            <div
              key={member.id}
              className="rounded-xl shadow-lg border theme-border hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 group"
              style={{
                backgroundColor: 'var(--card-bg)',
                backgroundImage: 'var(--card-surface-overlay)',
                borderColor: 'var(--border-color)',
                boxShadow: '0 24px 48px var(--shadow-color)'
              }}
              onMouseEnter={(e) => {
                const target = e.currentTarget as HTMLDivElement;
                target.style.backgroundColor = 'var(--card-hover-bg)';
                target.style.boxShadow = '0 28px 56px var(--shadow-color)';
              }}
              onMouseLeave={(e) => {
                const target = e.currentTarget as HTMLDivElement;
                target.style.backgroundColor = 'var(--card-bg)';
                target.style.boxShadow = '0 24px 48px var(--shadow-color)';
              }}
            >
              <div className="p-6 text-center">
                {/* Avatar */}
                <div
                  className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg"
                  style={{ backgroundColor: 'var(--avatar-bg)' }}
                >
                  <span className="font-bold text-xl" style={{ color: 'var(--avatar-text)' }}>
                    {member.firstName[0]}{member.lastName[0]}
                  </span>
                </div>

                {/* Name and Role */}
                <h3 className="font-semibold text-lg mb-2" style={{ color: 'var(--text-primary)' }}>
                  {member.firstName} {member.lastName}
                </h3>

                <span
                  className="inline-block px-3 py-1 text-xs font-medium rounded-full mb-4"
                  style={{ backgroundColor: 'var(--badge-primary-bg)', color: 'var(--badge-primary-text)' }}
                >
                  {formatRoleForDisplay(member.role)}
                </span>

                {/* Stats */}
                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center" style={{ color: 'var(--text-secondary)' }}>
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'var(--icon-projects-fg)' }}>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                      {member.projectCount === 1 ? 'Project' : 'Projects'}
                    </div>
                    <span className="font-semibold px-2 py-1 rounded-full text-xs" style={{ backgroundColor: 'var(--badge-secondary-bg)', color: 'var(--badge-secondary-text)' }}>{member.projectCount}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center" style={{ color: 'var(--text-secondary)' }}>
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'var(--icon-tasks-fg)' }}>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                      </svg>
                      {member.taskCount === 1 ? 'Task' : 'Tasks'}
                    </div>
                    <span className="font-semibold px-2 py-1 rounded-full text-xs" style={{ backgroundColor: 'var(--badge-success-bg)', color: 'var(--badge-success-text)' }}>{member.taskCount}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center" style={{ color: 'var(--text-secondary)' }}>
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'var(--icon-activity-fg)' }}>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      Joined
                    </div>
                    <span className="font-medium text-xs" style={{ color: 'var(--text-primary)' }}>
                      {formatJoinDate(member.joinDate)}
                    </span>
                  </div>
                </div>

                {/* Action Button */}
                <Link
                  to={ROUTE_PATHS.LOGIN}
                  className="w-full inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 transform hover:scale-105 shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                  style={{
                    backgroundImage: 'linear-gradient(120deg, var(--accent-from), var(--accent-to))',
                    color: 'var(--button-primary-text)',
                    boxShadow: '0 16px 32px rgba(124, 58, 237, 0.22)'
                  }}
                  onMouseEnter={(event) => {
                    event.currentTarget.style.boxShadow = '0 20px 40px rgba(124, 58, 237, 0.3)';
                  }}
                  onMouseLeave={(event) => {
                    event.currentTarget.style.boxShadow = '0 16px 32px rgba(124, 58, 237, 0.22)';
                  }}
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'var(--button-primary-text)' }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Connect
                </Link>
              </div>
            </div>
          ))
        ) : (
          /* Empty State for Filtered Results */
          <div className="col-span-full flex flex-col items-center justify-center py-3 px-4">
            <div className="text-center max-w-md">
              <div
                className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6"
                style={{
                  backgroundColor: 'var(--card-bg)',
                  backgroundImage: 'var(--card-surface-overlay)',
                  boxShadow: '0 24px 48px var(--shadow-color)'
                }}
              >
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'var(--icon-users-fg)' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
                No {filter === 'ALL' ? 'team members' : formatRoleForDisplay(filter).toLowerCase()} found
              </h3>
              <p className="mb-6" style={{ color: 'var(--text-secondary)' }}>
                {filter === 'ALL'
                  ? "We're still building our amazing team. Check back soon for new members!"
                  : `No team members with the role "${formatRoleForDisplay(filter)}" are currently loaded. Scroll down to load more members or select a different filter.`
                }
              </p>
              {filter !== 'ALL' && (
                <button
                  onClick={() => setFilter('ALL')}
                  className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                  style={{
                    backgroundImage: 'linear-gradient(120deg, var(--accent-from), var(--accent-to))',
                    color: 'var(--button-primary-text)',
                    boxShadow: '0 16px 32px rgba(124, 58, 237, 0.22)'
                  }}
                  onMouseEnter={(event) => {
                    event.currentTarget.style.boxShadow = '0 20px 40px rgba(124, 58, 237, 0.3)';
                  }}
                  onMouseLeave={(event) => {
                    event.currentTarget.style.boxShadow = '0 16px 32px rgba(124, 58, 237, 0.22)';
                  }}
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'var(--button-primary-text)' }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  View All Members
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeamMembersGrid;
