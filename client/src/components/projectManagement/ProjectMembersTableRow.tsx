import React from 'react';
import { FaEdit, FaTrash, FaUserPlus } from 'react-icons/fa';
import { ProjectMember } from '../../types/projectManagement';
import { formatDate, getMemberTypeBadgeColor } from './projectMembersUtils';
import { formatRoleForDisplay } from '../../utils/roleFormatter';

interface ProjectMembersTableRowProps {
  member: ProjectMember;
  onRemoveMember: (member: ProjectMember) => void;
  onUpdateRole: (member: ProjectMember) => void;
}

/**
 * Project Members Table Row Component
 * Displays individual member row with actions
 */
const ProjectMembersTableRow: React.FC<ProjectMembersTableRowProps> = ({
  member,
  onRemoveMember,
  onUpdateRole
}) => {
  // Handle remove member click
  const handleRemoveMember = () => {
    onRemoveMember(member);
  };

  // Handle update role click
  const handleUpdateRole = () => {
    onUpdateRole(member);
  };

  // Handle row hover enter
  const handleMouseEnter = (e: React.MouseEvent<HTMLTableRowElement>) => {
    e.currentTarget.style.backgroundColor = 'var(--table-row-hover-bg)';
  };

  // Handle row hover leave
  const handleMouseLeave = (e: React.MouseEvent<HTMLTableRowElement>) => {
    e.currentTarget.style.backgroundColor = 'var(--table-row-bg)';
  };

  // Get member type badge info
  const memberTypeInfo = getMemberTypeBadgeColor(member.memberType);

  return (
    <tr
      key={`${member.projectId}-${member.userId}`}
      className="transition-colors duration-200"
      style={{ backgroundColor: 'var(--table-row-bg)', borderBottomColor: 'var(--border-color)', borderBottomWidth: 1 }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* ID Column - Hidden on large screens */}
      <td className="hidden lg:table-cell px-4 py-4 whitespace-nowrap text-sm text-left" style={{ color: 'var(--table-text-primary)' }}>
        {member.userId}
      </td>
      {/* User */}
      <td className="px-4 py-4 whitespace-nowrap text-sm text-left" style={{ color: 'var(--table-text-primary)' }}>
        <div className="flex items-center">
          <div className="flex-shrink-0 h-8 w-8">
            <div className="h-8 w-8 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--accent-from)' }}>
              <span className="text-sm font-medium text-white">
                {member.user.firstName.charAt(0)}{member.user.lastName.charAt(0)}
              </span>
            </div>
          </div>
          <div className="ml-4">
            <span className="inline-flex items-center px-2 py-1 rounded text-sm font-medium" style={{ backgroundColor: 'var(--badge-primary-bg)', color: 'var(--badge-primary-text)' }}>
              {member.user.firstName} {member.user.lastName}
            </span>
            <div className="mt-1">
              <span className="inline-flex items-center px-2 py-1 rounded text-sm" style={{ backgroundColor: 'var(--badge-secondary-bg)', color: 'var(--badge-secondary-text)' }}>
                {member.user.email}
              </span>
            </div>
          </div>
        </div>
      </td>

      {/* Member Type */}
      <td className="px-4 py-4 whitespace-nowrap text-left">
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium" style={{ backgroundColor: 'var(--badge-neutral-bg)', color: 'var(--badge-neutral-text)' }}>
          {memberTypeInfo.text}
        </span>
      </td>

      {/* Role */}
      <td className="px-4 py-4 whitespace-nowrap text-left">
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium" style={{ backgroundColor: 'var(--badge-secondary-bg)', color: 'var(--badge-secondary-text)' }}>
          {member.role}
        </span>
      </td>

      {/* User Role Column - Hidden on small screens */}
      <td className="hidden sm:table-cell px-4 py-4 whitespace-nowrap text-sm text-left" style={{ color: 'var(--table-text-primary)' }}>
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium" style={{ backgroundColor: 'var(--badge-neutral-bg)', color: 'var(--badge-neutral-text)' }}>
          {formatRoleForDisplay(member.user.role)}
        </span>
      </td>

      {/* Joined Column - Hidden on extra small screens */}
      <td className="hidden xs:table-cell px-4 py-4 whitespace-nowrap text-sm text-left" style={{ color: 'var(--table-text-secondary)' }}>
        {formatDate(member.createdAt)}
      </td>

      {/* Actions */}
      <td className="px-4 py-4 whitespace-nowrap text-left">
        <div className="flex justify-start space-x-2">
          {/* Show different actions based on member type */}
          {member.memberType === 'OWNER' ? (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium theme-badge-primary">
              Project Owner
            </span>
          ) : member.memberType === 'ASSIGNEE' ? (
            <div className="flex space-x-2">
              <button
                onClick={handleUpdateRole}
                className="inline-flex items-center px-3 py-1.5 border text-xs font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-150"
                style={{ backgroundColor: 'var(--button-secondary-bg)', color: 'var(--button-primary-text)', borderColor: 'var(--button-secondary-bg)' }}
                title="Promote to project member"
              >
                <FaUserPlus className="w-3 h-3 mr-1" />
                Promote
              </button>
            </div>
          ) : (
            <div className="flex space-x-2">
              {/* Update Role button */}
              <button
                onClick={handleUpdateRole}
                className="inline-flex items-center px-3 py-1.5 border text-xs font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-150"
                style={{ backgroundColor: 'var(--button-secondary-bg)', color: 'var(--button-primary-text)', borderColor: 'var(--button-secondary-bg)' }}
                title="Edit member role"
              >
                <FaEdit className="w-3 h-3 mr-1" />
                Edit Role
              </button>
              {/* Remove button */}
              <button
                onClick={handleRemoveMember}
                className="inline-flex items-center px-3 py-1.5 border text-xs font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-150"
                style={{ backgroundColor: 'var(--button-danger-bg)', color: 'var(--button-primary-text)', borderColor: 'var(--button-danger-bg)' }}
                title="Remove member"
              >
                <FaTrash className="w-3 h-3 mr-1" />
                Remove
              </button>
            </div>
          )}
        </div>
      </td>
    </tr>
  );
};

export default ProjectMembersTableRow;

