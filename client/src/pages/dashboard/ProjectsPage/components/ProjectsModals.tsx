import React from 'react';
import {
  AddMemberModal,
  CreateProjectModal,
  DeleteProjectModal,
  EditProjectModal,
  RemoveMemberModal,
  UpdateMemberRoleModal,
} from '../../../../components/projectManagement';
import { ProjectDeletionCheck, ProjectMemberRole } from '../../../../types/projectManagement';
import { ProjectsPageState, MembersPageState } from '../types';

/**
 * Projects Modals Props
 */
export interface ProjectsModalsProps {
  canCreate: boolean;
  canEdit: boolean;
  canDelete: boolean;
  state: ProjectsPageState;
  memberState: MembersPageState;
  deletionCheck: ProjectDeletionCheck | null;
  onCreateProject: (projectData: any) => Promise<void>;
  onUpdateProject: (projectId: string, projectData: any) => Promise<void>;
  onDeleteProject: (projectId: string) => Promise<void>;
  onAddMember: (variables: any) => Promise<void>;
  onUpdateMemberRole: (projectId: string, userId: string, role: ProjectMemberRole) => Promise<void>;
  onRemoveMember: () => Promise<void>;
  onCloseCreateModal: () => void;
  onCloseEditModal: () => void;
  onCloseDeleteModal: () => void;
  onCloseAddMemberModal: () => void;
  onCloseUpdateRoleModal: () => void;
  onCloseRemoveMemberModal: () => void;
  onClearDeletionCheck: () => void;
}

/**
 * Projects Modals Component
 * Renders all modals for projects and members management
 */
export const ProjectsModals: React.FC<ProjectsModalsProps> = ({
  canCreate,
  canEdit,
  canDelete,
  state,
  memberState,
  deletionCheck,
  onCreateProject,
  onUpdateProject,
  onDeleteProject,
  onAddMember,
  onUpdateMemberRole,
  onRemoveMember,
  onCloseCreateModal,
  onCloseEditModal,
  onCloseDeleteModal,
  onCloseAddMemberModal,
  onCloseUpdateRoleModal,
  onCloseRemoveMemberModal,
  onClearDeletionCheck,
}) => {
  return (
    <>
      {/* Project Modals */}
      {canCreate && (
        <CreateProjectModal
          isOpen={state.createModalOpen}
          onClose={onCloseCreateModal}
          onSubmit={onCreateProject}
          loading={state.loading}
        />
      )}

      {canEdit && (
        <EditProjectModal
          isOpen={state.editModalOpen}
          project={state.selectedProject}
          onClose={onCloseEditModal}
          onSubmit={onUpdateProject}
          loading={state.loading}
        />
      )}

      {canDelete && (
        <DeleteProjectModal
          isOpen={state.deleteModalOpen}
          project={state.selectedProject}
          onClose={onCloseDeleteModal}
          onConfirm={onDeleteProject}
          loading={state.loading}
          deletionCheck={deletionCheck}
        />
      )}

      {/* Member Management Modals */}
      {canCreate && (
        <AddMemberModal
          isOpen={memberState.addModalOpen}
          onClose={onCloseAddMemberModal}
          onSubmit={onAddMember}
          projectId={state.selectedProject?.id || ''}
          projectName={state.selectedProject?.name || ''}
          loading={memberState.loading}
        />
      )}

      {canEdit && (
        <UpdateMemberRoleModal
          isOpen={memberState.updateRoleModalOpen}
          onClose={onCloseUpdateRoleModal}
          onSubmit={onUpdateMemberRole}
          member={memberState.selectedMember}
          loading={memberState.loading}
        />
      )}

      {canDelete && (
        <RemoveMemberModal
          isOpen={memberState.removeModalOpen}
          onClose={onCloseRemoveMemberModal}
          onConfirm={onRemoveMember}
          member={memberState.selectedMember}
          loading={memberState.loading}
        />
      )}
    </>
  );
};

