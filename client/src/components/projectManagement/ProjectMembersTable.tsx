import React, { memo } from 'react';
import { FaUserPlus, FaTrash, FaEdit } from 'react-icons/fa';
import { ProjectMembersTableProps } from '../../types/projectManagement';
import { PROJECT_MEMBER_ROLES } from '../../services/graphql/projectMemberQueries';
import { formatRoleForDisplay } from '../../utils/roleFormatter';
import ProjectMembersTableSkeleton from './ProjectMembersTableSkeleton';
import ProjectMembersPagination from './ProjectMembersPagination';

/**
 * ProjectMembersTable Component
 * Displays project members in a table with pagination, sorting, and member management actions
 * Includes responsive design with column visibility based on screen size
 * Memoized to prevent unnecessary re-renders when only sorting changes
 */
const ProjectMembersTable: React.FC<ProjectMembersTableProps> = memo(({
  members,
  loading,
  paginationInfo,
  onPageChange,
  onPageSizeChange,
  currentPageSize,
  onSort,
  currentSortBy,
  currentSortOrder,
  onAddMember,
  onRemoveMember,
  onUpdateRole
}) => {
  // Format date with error handling
  const formatDate = (dateString: string | null | undefined): string => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Invalid Date';
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      return 'N/A';
    }
  };

  // Get role badge color based on member role
  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'OWNER':
        return 'theme-badge-primary';
      case 'EDITOR':
        return 'theme-badge-secondary';
      case 'VIEWER':
        return 'theme-badge-neutral';
      default:
        return 'theme-badge-neutral';
    }
  };

  // Get member type badge color and text based on member type
  const getMemberTypeBadgeColor = (memberType: string) => {
    switch (memberType) {
      case 'OWNER':
        return { color: 'theme-badge-primary', text: 'Owner' };
      case 'EDITOR':
        return { color: 'theme-badge-secondary', text: 'Editor' };
      case 'VIEWER':
        return { color: 'theme-badge-success', text: 'Viewer' };
      case 'ASSIGNEE':
        return { color: 'theme-badge-warning', text: 'Task Assignee' };
      default:
        return { color: 'theme-badge-neutral', text: 'Member' };
    }
  };

  // Get sort icon for column headers
  const getSortIcon = (column: string) => {
    if (currentSortBy !== column) {
      return (
        <svg className="w-4 h-4 theme-sort-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
        </svg>
      );
    }

    return currentSortOrder === 'ASC' ? (
      <svg className="w-4 h-4 theme-sort-icon-active" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
      </svg>
    ) : (
      <svg className="w-4 h-4 theme-sort-icon-active" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    );
  };

  // Handle sort click
  const handleSort = (column: string) => {
    let newSortOrder = 'ASC';

    if (currentSortBy === column) {
      // If already sorting by this field, toggle order
      newSortOrder = currentSortOrder === 'ASC' ? 'DESC' : 'ASC';
    }

    onSort(column, newSortOrder);
  };

  if (loading) {
    return <ProjectMembersTableSkeleton />;
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full theme-table-divide">
          <thead className="theme-table-header-bg">
            <tr>
              {/* ID Column - Hidden on large screens */}
              <th
                className="hidden lg:table-cell px-4 py-3 text-left text-xs font-medium theme-table-text-secondary uppercase tracking-wider cursor-pointer table-row-hover transition-colors"
                onClick={() => handleSort('userId')}
              >
                <div className="flex items-center space-x-1">
                  <span>ID</span>
                  {getSortIcon('userId')}
                </div>
              </th>
              {/* User Column */}
              <th className="px-4 py-3 text-left text-xs font-medium theme-table-text-secondary uppercase tracking-wider">
                User
              </th>
              {/* Member Type Column */}
              <th
                className="px-4 py-3 text-left text-xs font-medium theme-table-text-secondary uppercase tracking-wider cursor-pointer table-row-hover transition-colors"
                onClick={() => handleSort('memberRole')}
              >
                <div className="flex items-center space-x-1">
                  <span>Type</span>
                  {getSortIcon('memberRole')}
                </div>
              </th>
              {/* Role Column */}
              <th
                className="px-4 py-3 text-left text-xs font-medium theme-table-text-secondary uppercase tracking-wider cursor-pointer table-row-hover transition-colors"
                onClick={() => handleSort('role')}
              >
                <div className="flex items-center space-x-1">
                  <span>Role</span>
                  {getSortIcon('role')}
                </div>
              </th>
              {/* User Role Column - Hidden on small screens */}
              <th className="hidden sm:table-cell px-4 py-3 text-left text-xs font-medium theme-table-text-secondary uppercase tracking-wider">
                User Role
              </th>
              {/* Joined Column - Hidden on extra small screens */}
              <th
                className="hidden xs:table-cell px-4 py-3 text-left text-xs font-medium theme-table-text-secondary uppercase tracking-wider cursor-pointer table-row-hover transition-colors"
                onClick={() => handleSort('createdAt')}
              >
                <div className="flex items-center space-x-1">
                  <span>Joined</span>
                  {getSortIcon('createdAt')}
                </div>
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium theme-table-text-secondary uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="theme-table-row-bg theme-table-divide">
            {members.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center theme-table-text-secondary">
                  <div className="flex flex-col items-center">
                    <svg className="w-12 h-12 theme-table-text-muted mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                    </svg>
                    <p className="text-lg font-medium theme-table-text-primary mb-1">No members found</p>
                    <p className="theme-table-text-secondary">Add members to this project to get started.</p>
                  </div>
                </td>
              </tr>
            ) : (
              members.map((member) => (
                <tr key={`${member.projectId}-${member.userId}`} className="table-row-hover transition-colors duration-200">
                  {/* ID Column - Hidden on large screens */}
                  <td className="hidden lg:table-cell px-4 py-4 whitespace-nowrap text-sm theme-table-text-primary text-left">
                    {member.userId}
                  </td>
                  {/* User */}
                  <td className="px-4 py-4 whitespace-nowrap text-sm theme-table-text-primary text-left">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-8 w-8">
                        <div className="h-8 w-8 rounded-full theme-avatar-bg flex items-center justify-center">
                          <span className="text-sm font-medium theme-avatar-text">
                            {member.user.firstName.charAt(0)}{member.user.lastName.charAt(0)}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <span className="inline-flex items-center px-2 py-1 rounded text-sm font-medium theme-badge-primary">
                          {member.user.firstName} {member.user.lastName}
                        </span>
                        <div className="mt-1">
                          <span className="inline-flex items-center px-2 py-1 rounded text-sm theme-badge-secondary">
                            {member.user.email}
                          </span>
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Member Type */}
                  <td className="px-4 py-4 whitespace-nowrap text-left">
                    {(() => {
                      const memberTypeInfo = getMemberTypeBadgeColor(member.memberType);
                      return (
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${memberTypeInfo.color}`}>
                          {memberTypeInfo.text}
                        </span>
                      );
                    })()}
                  </td>

                  {/* Role */}
                  <td className="px-4 py-4 whitespace-nowrap text-left">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleBadgeColor(member.role)}`}>
                      {member.role}
                    </span>
                  </td>

                  {/* User Role Column - Hidden on small screens */}
                  <td className="hidden sm:table-cell px-4 py-4 whitespace-nowrap text-sm theme-table-text-primary text-left">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium theme-badge-neutral">
                      {formatRoleForDisplay(member.user.role)}
                    </span>
                  </td>

                  {/* Joined Column - Hidden on extra small screens */}
                  <td className="hidden xs:table-cell px-4 py-4 whitespace-nowrap text-sm theme-table-text-secondary text-left">
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
                            onClick={() => onUpdateRole(member)}
                            className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-150"
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
                            onClick={() => onUpdateRole(member)}
                            className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-150"
                            title="Edit member role"
                          >
                            <FaEdit className="w-3 h-3 mr-1" />
                            Edit Role
                          </button>
                          {/* Remove button */}
                          <button
                            onClick={() => onRemoveMember(member)}
                            className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-150"
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
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <ProjectMembersPagination
        paginationInfo={paginationInfo}
        currentPageSize={currentPageSize}
        loading={loading}
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
      />
    </div>
  );
});

ProjectMembersTable.displayName = 'ProjectMembersTable';

export default ProjectMembersTable;
