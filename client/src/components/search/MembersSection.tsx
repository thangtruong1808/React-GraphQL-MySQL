import React from 'react';
import SearchSection from './SearchSection';

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
  members: Member[];
  loading: boolean;
  hasQuery: boolean;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

/**
 * MembersSection Component
 * Renders member search results with pagination
 */
const MembersSection: React.FC<MembersSectionProps> = ({
  members,
  loading,
  hasQuery,
  currentPage,
  totalPages,
  onPageChange
}) => {
  // Render individual member item
  const renderMember = (member: Member) => (
    <div key={member.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center space-x-4">
        {/* Member avatar */}
        <div className="flex-shrink-0">
          <div className="h-10 w-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
            <span className="text-white font-medium text-sm">
              {member.firstName.charAt(0)}{member.lastName.charAt(0)}
            </span>
          </div>
        </div>

        {/* Member information */}
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-medium text-gray-900">
            {member.firstName} {member.lastName}
          </h3>
          <p className="text-sm text-gray-500">{member.email}</p>
          <p className="text-sm text-gray-600 capitalize">{member.role.toLowerCase()}</p>
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
    />
  );
};

export default MembersSection;
