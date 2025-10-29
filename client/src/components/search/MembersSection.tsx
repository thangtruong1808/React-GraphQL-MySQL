import React from 'react';
import SearchSection from './SearchSection';
import MemberStatusCounts from './MemberStatusCounts';
import { formatRoleForDisplay } from '../../utils/roleFormatter';
import { getRoleColorScheme } from '../../utils/roleColors';

/**
 * Members Section Component
 * Displays search results for members with pagination
 * Follows React best practices with proper TypeScript interfaces
 */

interface Member {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

interface MembersSectionProps {
  members: Member[]; // Current page members for display
  allMembers: Member[]; // All filtered members for role breakdown calculation
  loading: boolean;
  hasQuery: boolean;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems: number;
  itemsPerPage: number;
  onMemberClick?: (member: Member) => void;
}

/**
 * MembersSection Component
 * Renders member search results with pagination
 */
const MembersSection: React.FC<MembersSectionProps> = ({
  members,
  allMembers,
  loading,
  hasQuery,
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  itemsPerPage,
  onMemberClick
}) => {

  // Handle member card click
  const handleMemberClick = (member: Member) => {
    if (onMemberClick) {
      onMemberClick(member);
    }
  };

  // Render individual member item with enhanced styling and labels
  const renderMember = (member: Member) => (
    <div
      key={member.id}
      className="group bg-white dark:bg-gray-700 [data-theme='brand']:bg-gradient-to-br [data-theme='brand']:from-white [data-theme='brand']:to-purple-50 rounded-lg shadow-md border border-gray-100 dark:border-gray-600 [data-theme='brand']:border-purple-200 p-6 hover:shadow-lg dark:hover:shadow-gray-900/30 [data-theme='brand']:hover:shadow-purple-200/30 transition-shadow duration-200 cursor-pointer"
      onClick={() => handleMemberClick(member)}
    >
      <div className="flex items-start space-x-5">
        {/* Enhanced Member avatar with status indicator */}
        <div className="flex-shrink-0 relative">
          <div className="h-16 w-16 bg-gradient-to-br from-blue-500 to-indigo-500 dark:from-blue-600 dark:to-indigo-600 [data-theme='brand']:from-purple-500 [data-theme='brand']:to-pink-500 rounded-full flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-300">
            <span className="text-white font-semibold text-lg">
              {member.firstName?.charAt(0) || 'U'}{member.lastName?.charAt(0) || 'N'}
            </span>
          </div>
          {/* Online status indicator */}
          <div className="absolute -bottom-1 -right-1 h-5 w-5 bg-green-400 border-2 border-white rounded-full"></div>
        </div>

        {/* Enhanced Member information with clear labels */}
        <div className="flex-1 min-w-0">
          {/* Full Name with enhanced styling */}
          <div className="mb-4">
            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 [data-theme='brand']:text-purple-800 uppercase tracking-wider mb-2 flex items-center">
              <svg className="h-3 w-3 mr-1 text-blue-500 dark:text-blue-400 [data-theme='brand']:text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Full Name
            </label>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white [data-theme='brand']:text-purple-900 group-hover:text-blue-700 dark:group-hover:text-blue-400 [data-theme='brand']:group-hover:text-purple-700 transition-colors duration-200">
              {member.firstName || 'Unknown'} {member.lastName || 'User'}
            </h3>
          </div>

          {/* Email Address with enhanced styling */}
          <div className="mb-4">
            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 [data-theme='brand']:text-purple-800 uppercase tracking-wider mb-2 flex items-center">
              <svg className="h-3 w-3 mr-1 text-blue-500 dark:text-blue-400 [data-theme='brand']:text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Email Address
            </label>
            <div className="flex items-center space-x-3 p-3 group-hover:bg-blue-50 dark:group-hover:bg-blue-600/20 [data-theme='brand']:group-hover:bg-purple-100 transition-colors duration-200">
              <svg className="h-5 w-5 text-gray-400 dark:text-gray-500 [data-theme='brand']:text-purple-600 group-hover:text-blue-500 dark:group-hover:text-blue-400 [data-theme='brand']:group-hover:text-purple-700 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <p className="text-sm text-gray-700 dark:text-gray-300 [data-theme='brand']:text-purple-800 font-medium group-hover:text-blue-700 dark:group-hover:text-blue-300 [data-theme='brand']:group-hover:text-purple-700 transition-colors duration-200">{member.email || 'No email provided'}</p>
            </div>
          </div>

          {/* Role with enhanced styling */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 [data-theme='brand']:text-purple-800 uppercase tracking-wider mb-2 flex items-center">
              <svg className="h-3 w-3 mr-1 text-blue-500 dark:text-blue-400 [data-theme='brand']:text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              Role & Permissions
            </label>
            <div className="flex items-center space-x-3">
              <svg className="h-5 w-5 text-gray-400 dark:text-gray-500 [data-theme='brand']:text-purple-600 group-hover:text-blue-500 dark:group-hover:text-blue-400 [data-theme='brand']:group-hover:text-purple-700 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              {(() => {
                const roleStyle = getRoleColorScheme(member.role);
                return (
                  <span className={`inline-flex items-center px-3 py-2 rounded-full text-sm font-semibold border shadow-sm group-hover:shadow-md transition-shadow duration-200 ${roleStyle.bg} ${roleStyle.border} ${roleStyle.text}`}>
                    <div className={`w-1.5 h-1.5 mr-2 rounded-full ${roleStyle.dot}`}></div>
                    {formatRoleForDisplay(member.role)}
                  </span>
                );
              })()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <SearchSection
      title="Members"
      results={members}
      loading={loading}
      hasQuery={hasQuery}
      emptyMessage="No members found"
      renderItem={renderMember}
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={onPageChange}
      totalItems={totalItems}
      itemsPerPage={itemsPerPage}
      headerContent={<MemberStatusCounts members={allMembers} totalMembers={totalItems} />}
    />
  );
};

export default MembersSection;
