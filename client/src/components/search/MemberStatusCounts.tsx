import React from 'react';

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

          // Get role-specific styling
          const getRoleStyle = (role: string) => {
            switch (role.toLowerCase()) {
              case 'admin':
                return {
                  bg: 'bg-red-100',
                  text: 'text-red-800',
                  border: 'border-red-200'
                };
              case 'manager':
                return {
                  bg: 'bg-purple-100',
                  text: 'text-purple-800',
                  border: 'border-purple-200'
                };
              case 'developer':
                return {
                  bg: 'bg-blue-100',
                  text: 'text-blue-800',
                  border: 'border-blue-200'
                };
              case 'designer':
                return {
                  bg: 'bg-pink-100',
                  text: 'text-pink-800',
                  border: 'border-pink-200'
                };
              case 'tester':
                return {
                  bg: 'bg-yellow-100',
                  text: 'text-yellow-800',
                  border: 'border-yellow-200'
                };
              case 'user':
                return {
                  bg: 'bg-green-100',
                  text: 'text-green-800',
                  border: 'border-green-200'
                };
              default:
                return {
                  bg: 'bg-gray-100',
                  text: 'text-gray-800',
                  border: 'border-gray-200'
                };
            }
          };

          const style = getRoleStyle(role);

          return (
            <div
              key={role}
              className={`px-3 py-2 rounded-lg border ${style.bg} ${style.border} ${style.text} flex items-center space-x-2`}
            >
              <span className="font-medium capitalize">
                {role}
              </span>
              <span className="text-sm font-bold">
                {count}
              </span>
              <span className="text-xs opacity-75">
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
