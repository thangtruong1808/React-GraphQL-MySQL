import React from 'react';
import { Link } from 'react-router-dom';
import { ROUTE_PATHS } from '../../../constants/routingConstants';
import { TeamMember, FilterType, SortOption } from './types';
import { useMemo } from 'react';
import { TeamMembersGridSkeleton } from '../../../components/ui';
import { formatRoleForDisplay } from '../../../utils/roleFormatter';

/**
 * Team Members Grid Component
 * Displays team members in a grid layout with role filtering and client-side sorting
 * Updated to support sortOption prop for sorting functionality
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
 * Team members grid component displaying filtered and sorted team members
 * Includes empty state handling for filtered results
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

  // Get role color for team members based on database role values
  const getRoleColor = (role: string) => {
    switch (role) {
      case 'ADMIN': return 'bg-red-100 text-red-800';
      case 'Project Manager': return 'bg-blue-100 text-blue-800';
      case 'Software Architect': return 'bg-purple-100 text-purple-800';
      case 'Frontend Developer': return 'bg-green-100 text-green-800';
      case 'Backend Developer': return 'bg-green-100 text-green-800';
      case 'Full-Stack Developer': return 'bg-green-100 text-green-800';
      case 'DevOps Engineer': return 'bg-yellow-100 text-yellow-800';
      case 'QA Engineer': return 'bg-indigo-100 text-indigo-800';
      case 'QC Engineer': return 'bg-indigo-100 text-indigo-800';
      case 'UX/UI Designer': return 'bg-pink-100 text-pink-800';
      case 'Business Analyst': return 'bg-cyan-100 text-cyan-800';
      case 'Database Administrator': return 'bg-orange-100 text-orange-800';
      case 'Technical Writer': return 'bg-teal-100 text-teal-800';
      case 'Support Engineer': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
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
            <div key={member.id} className="bg-white rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 hover:shadow-indigo-500/20 group">
              <div className="p-6 text-center">
                {/* Avatar */}
                <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <span className="text-white font-bold text-xl">
                    {member.firstName[0]}{member.lastName[0]}
                  </span>
                </div>

                {/* Name and Role */}
                <h3 className="font-semibold text-gray-900 text-lg mb-2">
                  {member.firstName} {member.lastName}
                </h3>

                <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${getRoleColor(member.role)} mb-4`}>
                  {formatRoleForDisplay(member.role)}
                </span>

                {/* Stats */}
                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center text-gray-600">
                      <svg className="w-4 h-4 mr-2 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                      Projects
                    </div>
                    <span className="font-semibold text-gray-900 bg-indigo-50 px-2 py-1 rounded-full text-xs">{member.projectCount}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center text-gray-600">
                      <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                      </svg>
                      Tasks
                    </div>
                    <span className="font-semibold text-gray-900 bg-green-50 px-2 py-1 rounded-full text-xs">{member.taskCount}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center text-gray-600">
                      <svg className="w-4 h-4 mr-2 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      Joined
                    </div>
                    <span className="font-medium text-gray-900 text-xs">{formatJoinDate(member.joinDate)}</span>
                  </div>
                </div>

                {/* Action Button */}
                <Link
                  to={ROUTE_PATHS.LOGIN}
                  className="w-full inline-flex items-center justify-center px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-sm font-medium rounded-lg transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
              <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                No {filter === 'ALL' ? 'team members' : formatRoleForDisplay(filter).toLowerCase()} found
              </h3>
              <p className="text-gray-600 mb-6">
                {filter === 'ALL'
                  ? "We're still building our amazing team. Check back soon for new members!"
                  : `No team members with the role "${formatRoleForDisplay(filter)}" are currently loaded. Scroll down to load more members or select a different filter.`
                }
              </p>
              {filter !== 'ALL' && (
                <button
                  onClick={() => setFilter('ALL')}
                  className="inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-all duration-300 transform hover:scale-105"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
