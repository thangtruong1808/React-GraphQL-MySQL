import React, { useEffect, useState } from 'react';
import AccessDenied from '../../components/auth/AccessDenied';
import { DashboardLayout } from '../../components/layout';
import { DashboardSkeleton } from '../../components/ui';
import { DEFAULT_PROJECTS_PAGINATION } from '../../constants/projectManagement';
import { useAuth } from '../../contexts/AuthContext';
import { useAuthDataReady } from '../../hooks/useAuthDataReady';
import { useRolePermissions } from '../../hooks/useRolePermissions';
import { ProjectDeletionCheck } from '../../types/projectManagement';
import { ProjectsHeader, ProjectsMainContent, ProjectsModals } from './ProjectsPage/components';
import {
  useMembersFetch,
  useMembersHandlers,
  useMembersMutations,
  useMembersQueries,
  useMembersState,
  useProjectsHandlers,
  useProjectsMutations,
  useProjectsQueries,
  useProjectsState,
} from './ProjectsPage/hooks';

/**
 * Projects Dashboard Page
 * Complete project management interface with search, table, and CRUD operations
 * Features modern, professional layout with pagination and real-time search
 * Features responsive design with improved mobile UX when sidebar is collapsed
 * 
 * CALLED BY: AppRoutes component via ProtectedRoute
 * SCENARIOS: Project management for administrators and project managers
 */
const ProjectsPage: React.FC = () => {
  const { isInitializing, showNotification } = useAuth();
  const { canCreate, canEdit, canDelete, hasDashboardAccess } = useRolePermissions();
  const isAuthDataReady = useAuthDataReady();

  // Tab state
  const [activeTab, setActiveTab] = useState<'projects' | 'members'>('projects');

  // Project deletion check state
  const [deletionCheck, setDeletionCheck] = useState<ProjectDeletionCheck | null>(null);

  // Projects state management
  const { state, setState, sortBy, setSortBy, sortOrder, setSortOrder } = useProjectsState({
    initialPageSize: DEFAULT_PROJECTS_PAGINATION.limit,
  });

  // Members state management
  const { state: memberState, setState: setMemberState, sortBy: memberSortBy, setSortBy: setMemberSortBy, sortOrder: memberSortOrder, setSortOrder: setMemberSortOrder } = useMembersState({
    initialPageSize: 10,
  });

  // Projects GraphQL queries
  const { queryLoading, refetch } = useProjectsQueries({
    pageSize: state.pageSize,
    currentPage: state.currentPage,
    searchQuery: state.searchQuery,
    sortBy,
    sortOrder,
    isInitializing,
    hasDashboardAccess,
    isAuthDataReady,
    setState,
  });

  // Members GraphQL queries
  const { getProjectMembers, memberQueryLoading } = useMembersQueries({
    projectId: state.selectedProject?.id || null,
    pageSize: memberState.pageSize,
    currentPage: memberState.currentPage,
    searchQuery: memberState.searchQuery,
    sortBy: memberSortBy,
    sortOrder: memberSortOrder,
    isInitializing,
    hasDashboardAccess,
    isAuthDataReady,
    setState: setMemberState,
  });

  // Members fetch functions
  const { fetchProjectMembers, fetchProjectMembersWithSort } = useMembersFetch({
    getProjectMembers,
    memberSortBy,
    memberSortOrder,
    setMemberState,
  });

  // Projects GraphQL mutations
  const { createProjectMutation, updateProjectMutation, deleteProjectMutation, checkProjectDeletion } = useProjectsMutations();

  // Members GraphQL mutations
  const { addMemberMutation, updateMemberRoleMutation, removeMemberMutation } = useMembersMutations();

  /**
   * Handle project selection change for members
   * Refetches member data when a new project is selected
   */
  useEffect(() => {
    if (state.selectedProject && activeTab === 'members') {
      setMemberState(prev => ({
        ...prev,
        loading: true,
        error: null
      }));
      // The query will automatically refetch due to the projectId change
    }
  }, [state.selectedProject, activeTab, setMemberState]);

  // Projects event handlers
  const {
    handleSearchChange,
    handlePageSizeChange,
    handleSort,
    handlePageChange,
    handleCreateProject,
    handleUpdateProject,
    handleDeleteProject,
    handleEdit,
    handleDelete,
    clearError,
  } = useProjectsHandlers({
    state,
    sortBy,
    sortOrder,
    setState,
    setSortBy,
    setSortOrder,
    refetch,
    createProjectMutation,
    updateProjectMutation,
    deleteProjectMutation,
    checkProjectDeletion,
    setDeletionCheck,
    showNotification,
  });

  // Members event handlers
  const {
    handleMemberSearchChange,
    handleMemberPageSizeChange,
    handleMemberSort,
    handleMemberPageChange,
    handleAddMember,
    handleUpdateMemberRole,
    handleRemoveMember,
    handleViewMembers,
    clearMemberError,
  } = useMembersHandlers({
    memberState,
    selectedProject: state.selectedProject,
    sortBy: memberSortBy,
    sortOrder: memberSortOrder,
    setState,
    setMemberState,
    setSortBy,
    setSortOrder,
    setMemberSortBy,
    setMemberSortOrder,
    fetchProjectMembers,
    fetchProjectMembersWithSort,
    addMemberMutation,
    updateMemberRoleMutation,
    removeMemberMutation,
    showNotification,
    setActiveTab,
  });

  // During auth initialization, show skeleton to avoid Access Denied flash
  if (isInitializing) {
    return <DashboardSkeleton />;
  }

  // Check if user has dashboard access
  if (!hasDashboardAccess) {
    return <AccessDenied feature="Projects Management" />;
  }

  // Show unified skeleton during loading (both sidebar and content)
  if (queryLoading && (!state.projects || state.projects.length === 0)) {
    return <DashboardSkeleton />;
  }

  return (
    <DashboardLayout showSidebarSkeleton={false}>
      <div className="w-full h-full dashboard-content">
        {/* Header Section */}
        <ProjectsHeader
          canCreate={canCreate}
          activeTab={activeTab}
          selectedProject={state.selectedProject}
          onCreateProjectClick={() => setState(prev => ({ ...prev, createModalOpen: true }))}
          onAddMemberClick={() => setMemberState(prev => ({ ...prev, addModalOpen: true }))}
        />

        {/* Main Content */}
        <ProjectsMainContent
          activeTab={activeTab}
          state={state}
          memberState={memberState}
          sortBy={sortBy}
          sortOrder={sortOrder}
          memberSortBy={memberSortBy}
          memberSortOrder={memberSortOrder}
          canEdit={canEdit}
          canDelete={canDelete}
          onTabChange={setActiveTab}
          onProjectsSearchChange={handleSearchChange}
          onProjectsPageChange={handlePageChange}
          onProjectsPageSizeChange={handlePageSizeChange}
          onProjectsSort={handleSort}
          onProjectsEdit={handleEdit}
          onProjectsDelete={handleDelete}
          onProjectsViewMembers={handleViewMembers}
          onMembersSearchChange={handleMemberSearchChange}
          onMembersPageChange={handleMemberPageChange}
          onMembersPageSizeChange={handleMemberPageSizeChange}
          onMembersSort={handleMemberSort}
          onAddMember={() => setMemberState(prev => ({ ...prev, addModalOpen: true }))}
          onRemoveMember={(member) => setMemberState(prev => ({
            ...prev,
            removeModalOpen: true,
            selectedMember: member
          }))}
          onUpdateRole={(member) => setMemberState(prev => ({
            ...prev,
            updateRoleModalOpen: true,
            selectedMember: member
          }))}
          onSwitchToProjects={() => setActiveTab('projects')}
          onChangeProject={() => {
            setActiveTab('projects');
            setState(prev => ({ ...prev, selectedProject: null }));
            setMemberState(prev => ({
              ...prev,
              members: [],
              selectedMember: null,
              searchQuery: '',
              currentPage: 1
            }));
          }}
          onClearError={clearError}
          onClearMemberError={clearMemberError}
        />

        {/* Modals */}
        <ProjectsModals
          canCreate={canCreate}
          canEdit={canEdit}
          canDelete={canDelete}
          state={state}
          memberState={memberState}
          deletionCheck={deletionCheck}
          onCreateProject={handleCreateProject}
          onUpdateProject={handleUpdateProject}
          onDeleteProject={handleDeleteProject}
          onAddMember={handleAddMember}
          onUpdateMemberRole={handleUpdateMemberRole}
          onRemoveMember={handleRemoveMember}
          onCloseCreateModal={() => setState(prev => ({ ...prev, createModalOpen: false }))}
          onCloseEditModal={() => setState(prev => ({ ...prev, editModalOpen: false, selectedProject: null }))}
          onCloseDeleteModal={() => {
            setState(prev => ({ ...prev, deleteModalOpen: false, selectedProject: null }));
            setDeletionCheck(null);
          }}
          onCloseAddMemberModal={() => setMemberState(prev => ({ ...prev, addModalOpen: false }))}
          onCloseUpdateRoleModal={() => setMemberState(prev => ({ ...prev, updateRoleModalOpen: false, selectedMember: null }))}
          onCloseRemoveMemberModal={() => setMemberState(prev => ({ ...prev, removeModalOpen: false, selectedMember: null }))}
          onClearDeletionCheck={() => setDeletionCheck(null)}
        />
      </div>
    </DashboardLayout>
  );
};

export default ProjectsPage;
