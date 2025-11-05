import React from 'react';
import { FaUsers } from 'react-icons/fa';
import { ProjectSearchInput, ProjectMembersTable } from '../../../../components/projectManagement';
import { Project } from '../../../../types/projectManagement';
import { MembersPageState } from '../types';

/**
 * Members Content Props
 */
export interface MembersContentProps {
  selectedProject: Project | null;
  memberState: MembersPageState;
  sortBy: string;
  sortOrder: string;
  canEdit: boolean;
  canDelete: boolean;
  onSearchChange: (query: string) => void;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  onSort: (sortBy: string, sortOrder: string) => void;
  onAddMember: () => void;
  onRemoveMember: (member: any) => void;
  onUpdateRole: (member: any) => void;
  onSwitchToProjects: () => void;
  onChangeProject: () => void;
}

/**
 * Members Content Component
 * Displays project info, search input, and members table
 */
export const MembersContent: React.FC<MembersContentProps> = ({
  selectedProject,
  memberState,
  sortBy,
  sortOrder,
  canEdit,
  canDelete,
  onSearchChange,
  onPageChange,
  onPageSizeChange,
  onSort,
  onAddMember,
  onRemoveMember,
  onUpdateRole,
  onSwitchToProjects,
  onChangeProject,
}) => {
  if (!selectedProject) {
    return (
      <div className="text-center py-12">
        <FaUsers className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">No Project Selected</h3>
        <p className="mt-1 text-sm text-gray-500">
          Click on a project name or use the "Members" button in the Projects tab to view and manage project members.
        </p>
        <div className="mt-4">
          <button
            onClick={onSwitchToProjects}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md theme-button-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
          >
            View Projects
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Project Info */}
      <div className="theme-project-info-bg theme-project-info-border rounded-lg p-4">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
              <span className="text-sm font-medium text-purple-600">
                {selectedProject.name.charAt(0)}
              </span>
            </div>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium theme-project-info-text">
              {selectedProject.name}
            </h3>
            <p className="text-sm theme-project-info-text-secondary">
              {selectedProject.description}
            </p>
          </div>
          <div className="ml-auto">
            <button
              onClick={onChangeProject}
              className="text-sm text-purple-600 hover:text-purple-800"
            >
              Change Project
            </button>
          </div>
        </div>
      </div>

      {/* Search Input */}
      <ProjectSearchInput
        value={memberState.searchQuery}
        onChange={onSearchChange}
        loading={memberState.loading}
        placeholder="Search members by name or email..."
      />

      {/* Members Table */}
      <ProjectMembersTable
        members={memberState.members}
        paginationInfo={memberState.paginationInfo}
        loading={memberState.loading}
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
        currentPageSize={memberState.pageSize}
        onSort={onSort}
        currentSortBy={sortBy}
        currentSortOrder={sortOrder}
        onAddMember={onAddMember}
        onRemoveMember={onRemoveMember}
        onUpdateRole={onUpdateRole}
      />
    </div>
  );
};

