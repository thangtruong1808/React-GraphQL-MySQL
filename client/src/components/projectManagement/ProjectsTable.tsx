import React from 'react';
import { ProjectsTableProps } from '../../types/projectManagement';
import ProjectsTableHeader from './ProjectsTableHeader';
import ProjectsTableRow from './ProjectsTableRow';
import ProjectsLoadingRows from './ProjectsLoadingRows';
import ProjectsEmptyState from './ProjectsEmptyState';
import ProjectsTablePagination from './ProjectsTablePagination';

/**
 * Projects Table Component
 * Displays projects in a table format with pagination and CRUD actions
 * Includes edit and delete buttons for each project
 */
const ProjectsTable: React.FC<ProjectsTableProps> = ({
  projects,
  paginationInfo,
  loading,
  onEdit,
  onDelete,
  onViewMembers,
  onPageChange,
  onPageSizeChange,
  currentPageSize,
  onSort,
  currentSortBy,
  currentSortOrder
}) => {
  // Handle sort click
  const handleSort = (column: string) => {
    let newSortOrder = 'ASC';

    if (currentSortBy === column) {
      // If already sorting by this column, toggle order
      newSortOrder = currentSortOrder === 'ASC' ? 'DESC' : 'ASC';
    }

    onSort(column, newSortOrder);
  };

  return (
    <div className="shadow-sm rounded-lg" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)', borderWidth: 1, borderStyle: 'solid', overflow: 'hidden' }}>
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full table-fixed">
          <ProjectsTableHeader
            currentSortBy={currentSortBy}
            currentSortOrder={currentSortOrder}
            onSort={handleSort}
          />
          <tbody style={{ backgroundColor: 'var(--table-row-bg)' }}>
            {loading ? (
              <ProjectsLoadingRows pageSize={currentPageSize} />
            ) : projects.length === 0 ? (
              <ProjectsEmptyState />
            ) : (
              projects.map((project) => (
                <ProjectsTableRow
                  key={project.id}
                  project={project}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onViewMembers={onViewMembers}
                />
              ))
            )}
          </tbody>
        </table>
      </div>

      <ProjectsTablePagination
        paginationInfo={paginationInfo}
        currentPageSize={currentPageSize}
        loading={loading}
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
      />
    </div>
  );
};

export default ProjectsTable;
