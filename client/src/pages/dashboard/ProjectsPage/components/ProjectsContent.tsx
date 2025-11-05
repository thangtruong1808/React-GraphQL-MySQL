import React from 'react';
import { ProjectSearchInput, ProjectsTable } from '../../../../components/projectManagement';
import { ProjectsPageState } from '../types';

/**
 * Projects Content Props
 */
export interface ProjectsContentProps {
  state: ProjectsPageState;
  sortBy: string;
  sortOrder: string;
  canEdit: boolean;
  canDelete: boolean;
  onSearchChange: (query: string) => void;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  onSort: (sortBy: string, sortOrder: string) => void;
  onEdit: (project: any) => void;
  onDelete: (project: any) => void;
  onViewMembers: (project: any) => void;
}

/**
 * Projects Content Component
 * Displays search input and projects table
 */
export const ProjectsContent: React.FC<ProjectsContentProps> = ({
  state,
  sortBy,
  sortOrder,
  canEdit,
  canDelete,
  onSearchChange,
  onPageChange,
  onPageSizeChange,
  onSort,
  onEdit,
  onDelete,
  onViewMembers,
}) => {
  return (
    <div className="space-y-6">
      {/* Search Input */}
      <ProjectSearchInput
        value={state.searchQuery}
        onChange={onSearchChange}
        loading={state.loading}
      />

      {/* Projects Table */}
      <ProjectsTable
        projects={state.projects}
        paginationInfo={state.paginationInfo}
        loading={state.loading}
        onEdit={canEdit ? onEdit : () => {}}
        onDelete={canDelete ? onDelete : async () => {}}
        onViewMembers={onViewMembers}
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
        currentPageSize={state.pageSize}
        onSort={onSort}
        currentSortBy={sortBy}
        currentSortOrder={sortOrder}
      />
    </div>
  );
};

