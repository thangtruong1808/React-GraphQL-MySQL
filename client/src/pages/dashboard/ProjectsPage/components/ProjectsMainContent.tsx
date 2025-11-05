import React from 'react';
import { InlineError } from '../../../../components/ui';
import { ProjectsPageState, MembersPageState } from '../types';
import { ProjectsContent } from './ProjectsContent';
import { MembersContent } from './MembersContent';
import { ProjectsTabs } from './ProjectsTabs';

/**
 * Projects Main Content Props
 */
export interface ProjectsMainContentProps {
  activeTab: 'projects' | 'members';
  state: ProjectsPageState;
  memberState: MembersPageState;
  sortBy: string;
  sortOrder: string;
  memberSortBy: string;
  memberSortOrder: string;
  canEdit: boolean;
  canDelete: boolean;
  onTabChange: (tab: 'projects' | 'members') => void;
  onProjectsSearchChange: (query: string) => void;
  onProjectsPageChange: (page: number) => void;
  onProjectsPageSizeChange: (pageSize: number) => void;
  onProjectsSort: (sortBy: string, sortOrder: string) => void;
  onProjectsEdit: (project: any) => void;
  onProjectsDelete: (project: any) => void;
  onProjectsViewMembers: (project: any) => void;
  onMembersSearchChange: (query: string) => void;
  onMembersPageChange: (page: number) => void;
  onMembersPageSizeChange: (pageSize: number) => void;
  onMembersSort: (sortBy: string, sortOrder: string) => void;
  onAddMember: () => void;
  onRemoveMember: (member: any) => void;
  onUpdateRole: (member: any) => void;
  onSwitchToProjects: () => void;
  onChangeProject: () => void;
  onClearError: () => void;
  onClearMemberError: () => void;
}

/**
 * Projects Main Content Component
 * Displays tabs, error messages, and tab content
 */
export const ProjectsMainContent: React.FC<ProjectsMainContentProps> = ({
  activeTab,
  state,
  memberState,
  sortBy,
  sortOrder,
  memberSortBy,
  memberSortOrder,
  canEdit,
  canDelete,
  onTabChange,
  onProjectsSearchChange,
  onProjectsPageChange,
  onProjectsPageSizeChange,
  onProjectsSort,
  onProjectsEdit,
  onProjectsDelete,
  onProjectsViewMembers,
  onMembersSearchChange,
  onMembersPageChange,
  onMembersPageSizeChange,
  onMembersSort,
  onAddMember,
  onRemoveMember,
  onUpdateRole,
  onSwitchToProjects,
  onChangeProject,
  onClearError,
  onClearMemberError,
}) => {
  return (
    <div className="w-full">
      <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8 w-full">
        {/* Tabs Navigation */}
        <ProjectsTabs
          activeTab={activeTab}
          selectedProject={state.selectedProject}
          onTabChange={onTabChange}
        />

        {/* Error Display */}
        {(state.error || memberState.error) && (
          <div className="mb-6">
            <InlineError
              message={(activeTab === 'projects' ? state.error : memberState.error) || ''}
              onDismiss={activeTab === 'projects' ? onClearError : onClearMemberError}
            />
          </div>
        )}

        {/* Tab Content */}
        {activeTab === 'projects' && (
          <ProjectsContent
            state={state}
            sortBy={sortBy}
            sortOrder={sortOrder}
            canEdit={canEdit}
            canDelete={canDelete}
            onSearchChange={onProjectsSearchChange}
            onPageChange={onProjectsPageChange}
            onPageSizeChange={onProjectsPageSizeChange}
            onSort={onProjectsSort}
            onEdit={onProjectsEdit}
            onDelete={onProjectsDelete}
            onViewMembers={onProjectsViewMembers}
          />
        )}

        {activeTab === 'members' && (
          <MembersContent
            selectedProject={state.selectedProject}
            memberState={memberState}
            sortBy={memberSortBy}
            sortOrder={memberSortOrder}
            canEdit={canEdit}
            canDelete={canDelete}
            onSearchChange={onMembersSearchChange}
            onPageChange={onMembersPageChange}
            onPageSizeChange={onMembersPageSizeChange}
            onSort={onMembersSort}
            onAddMember={onAddMember}
            onRemoveMember={onRemoveMember}
            onUpdateRole={onUpdateRole}
            onSwitchToProjects={onSwitchToProjects}
            onChangeProject={onChangeProject}
          />
        )}
      </div>
    </div>
  );
};

