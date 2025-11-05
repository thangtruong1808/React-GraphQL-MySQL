import React from 'react';
import { formatRoleForDisplay } from '../../../../utils/roleFormatter';
import { ProjectDetails } from '../types';

/**
 * Members Section Props
 */
export interface MembersSectionProps {
  project: ProjectDetails;
  formatMemberRoleForDisplay: (memberRole: string) => string;
}

/**
 * Members Section Component
 * Displays project team members in a grid layout
 */
export const MembersSection: React.FC<MembersSectionProps> = ({ project, formatMemberRoleForDisplay }) => {
  return (
    <div
      className="rounded-lg shadow-lg p-6 mt-6"
      style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)', borderWidth: '1px', borderStyle: 'solid' }}
    >
      <h2 className="text-xl font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
        Team Members
      </h2>
      {project.members.length === 0 ? (
        <div className="text-center py-8" style={{ color: 'var(--text-secondary)' }}>
          <svg
            className="w-12 h-12 mx-auto mb-4"
            style={{ color: 'var(--text-muted)' }}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
          No team members found for this project.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {project.members.map((member) => {
            const isOwner = member.memberRole === 'OWNER';
            const isAssignee = member.memberRole === 'ASSIGNEE';

            // Determine styling based on member role using theme variables
            let avatarBgColor, borderColor, cardBgColor, badgeBgColor, badgeTextColor, badgeText;
            if (isOwner) {
              avatarBgColor = 'var(--accent-from)';
              borderColor = 'var(--border-color)';
              cardBgColor = 'var(--table-row-bg)';
              badgeBgColor = 'var(--badge-primary-bg)';
              badgeTextColor = 'var(--badge-primary-text)';
              badgeText = 'Owner';
            } else if (isAssignee) {
              avatarBgColor = 'var(--button-secondary-bg)';
              borderColor = 'var(--border-color)';
              cardBgColor = 'var(--table-row-bg)';
              badgeBgColor = 'var(--badge-secondary-bg)';
              badgeTextColor = 'var(--badge-secondary-text)';
              badgeText = 'Task Assignee';
            } else {
              avatarBgColor = 'var(--button-primary-bg)';
              borderColor = 'var(--border-color)';
              cardBgColor = 'var(--table-row-bg)';
              badgeBgColor = 'var(--badge-neutral-bg)';
              badgeTextColor = 'var(--badge-neutral-text)';
              badgeText = formatMemberRoleForDisplay(member.memberRole);
            }

            return (
              <div
                key={member.id}
                className="flex items-center space-x-3 p-3 border rounded-lg transition-colors duration-200"
                style={{
                  backgroundColor: cardBgColor,
                  borderColor: borderColor,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--table-row-hover-bg)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = cardBgColor;
                }}
              >
                <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: avatarBgColor }}>
                  <span className="text-white font-semibold text-sm">
                    {member.firstName.charAt(0)}
                    {member.lastName.charAt(0)}
                  </span>
                </div>
                <div className="flex-1">
                  <div className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>
                    {member.firstName} {member.lastName}
                    <span
                      className="ml-2 text-xs px-2 py-1 rounded-full inline-block"
                      style={{ backgroundColor: badgeBgColor, color: badgeTextColor }}
                    >
                      {badgeText}
                    </span>
                  </div>
                  <div className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
                    {member.email}
                  </div>
                  <div className="text-xs font-medium mt-1" style={{ color: 'var(--text-secondary)' }}>
                    {formatRoleForDisplay(member.role)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

