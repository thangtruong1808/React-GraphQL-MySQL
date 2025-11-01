import React, { memo } from 'react';
import { ProjectMembersTableProps } from '../../types/projectManagement';
import ProjectMembersPagination from './ProjectMembersPagination';
import ProjectMembersTableSkeleton from './ProjectMembersTableSkeleton';
import ProjectMembersTableHeader from './ProjectMembersTableHeader';
import ProjectMembersTableRow from './ProjectMembersTableRow';
import ProjectMembersEmptyState from './ProjectMembersEmptyState';

/**
 * Project Members Table Component
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
  onRemoveMember,
  onUpdateRole
}) => {
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
    <div className="rounded-lg shadow overflow-hidden" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)', borderWidth: 1, borderStyle: 'solid' }}>
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <ProjectMembersTableHeader
            currentSortBy={currentSortBy}
            currentSortOrder={currentSortOrder}
            onSort={handleSort}
          />
          <tbody style={{ backgroundColor: 'var(--table-row-bg)' }}>
            {members.length === 0 ? (
              <ProjectMembersEmptyState />
            ) : (
              members.map((member) => (
                <ProjectMembersTableRow
                  key={`${member.projectId}-${member.userId}`}
                  member={member}
                  onRemoveMember={onRemoveMember}
                  onUpdateRole={onUpdateRole}
                />
              ))
            )}
          </tbody>
        </table>
      </div>

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
