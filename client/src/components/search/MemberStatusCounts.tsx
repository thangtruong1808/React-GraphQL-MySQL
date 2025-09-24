import React from 'react';
import { formatRoleForDisplay } from '../../utils/roleFormatter';
import { getRoleColorScheme } from '../../utils/roleColors';

/**
 * Member Status Counts Component
 * Displays the total count of members for each role
 * Provides better user experience by showing role breakdown
 */

interface MemberStatusCountsProps {
  members: any[]; // Current page members for role breakdown
  totalMembers: number; // Total count of all members for percentage calculation
}

/**
 * MemberStatusCounts Component
 * Shows count breakdown by member role
 */
const MemberStatusCounts: React.FC<MemberStatusCountsProps> = ({ members, totalMembers }) => {
  // Calculate counts for each role
  const roleCounts = members.reduce((acc, member) => {
    const role = member.role || 'Unknown';
    acc[role] = (acc[role] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Get all unique roles and sort them
  const roles = Object.keys(roleCounts).sort();

  // Don't render if no members
  if (members.length === 0) {
    return null;
  }

  return (
    <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
      <h3 className="text-sm font-semibold text-blue-800 mb-3 flex items-center">
        <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
        </svg>
        Member Role Breakdown
      </h3>
      <div className="flex flex-wrap gap-3">
        {roles.map((role) => {
          const count = roleCounts[role];
          const percentage = totalMembers > 0 ? Math.round((count / totalMembers) * 100) : 0;

          // Get role-specific styling using shared utility for consistency
          const style = getRoleColorScheme(role);

          return (
            <div
              key={role}
              className={`inline-flex items-center px-3 py-2 rounded-full border shadow-sm ${style.bg} ${style.border} ${style.text}`}
            >
              <div className={`w-1.5 h-1.5 mr-2 rounded-full ${style.dot}`}></div>
              <span className="font-medium">
                {formatRoleForDisplay(role)}
              </span>
              <span className="ml-2 text-sm font-bold">
                {count}
              </span>
              <span className="ml-1 text-xs opacity-75">
                ({percentage}%)
              </span>
            </div>
          );
        })}
      </div>
      <div className="mt-3 text-xs text-blue-700">
        Total: {totalMembers} member{totalMembers !== 1 ? 's' : ''}
      </div>
    </div>
  );
};

export default MemberStatusCounts;
