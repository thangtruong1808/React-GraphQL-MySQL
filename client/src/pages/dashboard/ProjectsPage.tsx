import React, { useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation, useLazyQuery } from '@apollo/client';
import { FaPlus, FaUsers } from 'react-icons/fa';
import { DashboardLayout } from '../../components/layout';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { ROUTE_PATHS } from '../../constants/routingConstants';
import { DashboardSkeleton } from '../../components/ui';
import { useRolePermissions } from '../../hooks/useRolePermissions';
import AccessDenied from '../../components/auth/AccessDenied';
import {
  ProjectSearchInput,
  ProjectsTable,
  CreateProjectModal,
  EditProjectModal,
  DeleteProjectModal,
  ProjectMembersTable,
  AddMemberModal,
  RemoveMemberModal,
  UpdateMemberRoleModal
} from '../../components/projectManagement';
import {
  GET_DASHBOARD_PROJECTS_QUERY,
  CREATE_PROJECT_MUTATION,
  UPDATE_PROJECT_MUTATION,
  DELETE_PROJECT_MUTATION,
  CHECK_PROJECT_DELETION_QUERY
} from '../../services/graphql/projectQueries';
import {
  GET_PROJECT_MEMBERS_QUERY,
  ADD_PROJECT_MEMBER_MUTATION,
  UPDATE_PROJECT_MEMBER_ROLE_MUTATION,
  REMOVE_PROJECT_MEMBER_MUTATION
} from '../../services/graphql/projectMemberQueries';
import {
  Project,
  ProjectInput,
  ProjectUpdateInput,
  ProjectManagementState,
  ProjectMember,
  ProjectMemberInput,
  ProjectMemberRole,
  ProjectDeletionCheck
} from '../../types/projectManagement';
import {
  DEFAULT_PROJECTS_PAGINATION,
  PROJECT_SUCCESS_MESSAGES,
  PROJECT_ERROR_MESSAGES
} from '../../constants/projectManagement';
import { InlineError } from '../../components/ui';

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
  const navigate = useNavigate();
  const { isInitializing, showNotification } = useAuth();
  const { canCreate, canEdit, canDelete, hasDashboardAccess } = useRolePermissions();

  // State management
  const [state, setState] = useState<ProjectManagementState>({
    projects: [],
    paginationInfo: {
      hasNextPage: false,
      hasPreviousPage: false,
      totalCount: 0,
      currentPage: 1,
      totalPages: 0
    },
    loading: false,
    searchQuery: '',
    currentPage: 1,
    pageSize: DEFAULT_PROJECTS_PAGINATION.limit,
    createModalOpen: false,
    editModalOpen: false,
    deleteModalOpen: false,
    selectedProject: null,
    error: null
  });

  // Tab state
  const [activeTab, setActiveTab] = useState<'projects' | 'members'>('projects');

  // Member management state
  const [memberState, setMemberState] = useState({
    members: [] as ProjectMember[],
    paginationInfo: {
      hasNextPage: false,
      hasPreviousPage: false,
      totalCount: 0,
      currentPage: 1,
      totalPages: 0
    },
    loading: false,
    searchQuery: '',
    currentPage: 1,
    pageSize: 10,
    addModalOpen: false,
    removeModalOpen: false,
    updateRoleModalOpen: false,
    selectedMember: null as ProjectMember | null,
    error: null as string | null
  });

  // Sorting state - Sort by ID ASC so new projects appear at bottom
  const [sortBy, setSortBy] = useState<string>('id');
  const [sortOrder, setSortOrder] = useState<string>('ASC');

  // Member sorting state
  const [memberSortBy, setMemberSortBy] = useState<string>('createdAt');
  const [memberSortOrder, setMemberSortOrder] = useState<string>('DESC');

  // Project deletion check state
  const [deletionCheck, setDeletionCheck] = useState<ProjectDeletionCheck | null>(null);

  // GraphQL queries and mutations
  const { data, loading: queryLoading, refetch } = useQuery(GET_DASHBOARD_PROJECTS_QUERY, {
    variables: {
      limit: state.pageSize,
      offset: (state.currentPage - 1) * state.pageSize,
      search: state.searchQuery || undefined,
      sortBy,
      sortOrder
    },
    errorPolicy: 'all',
    notifyOnNetworkStatusChange: true,
    skip: isInitializing || !hasDashboardAccess
  });

  // Project members query - only fetch when a project is selected
  const { data: memberData, loading: memberQueryLoading, refetch: refetchMembers } = useQuery(GET_PROJECT_MEMBERS_QUERY, {
    variables: {
      projectId: state.selectedProject?.id || '',
      limit: memberState.pageSize,
      offset: (memberState.currentPage - 1) * memberState.pageSize,
      search: memberState.searchQuery || undefined,
      sortBy: memberSortBy,
      sortOrder: memberSortOrder
    },
    errorPolicy: 'all',
    notifyOnNetworkStatusChange: true,
    skip: !state.selectedProject || isInitializing || !hasDashboardAccess
  });

  const [createProjectMutation] = useMutation(CREATE_PROJECT_MUTATION);
  const [updateProjectMutation] = useMutation(UPDATE_PROJECT_MUTATION);
  const [deleteProjectMutation] = useMutation(DELETE_PROJECT_MUTATION);
  const [checkProjectDeletion] = useLazyQuery(CHECK_PROJECT_DELETION_QUERY);

  // Member management mutations
  const [addMemberMutation] = useMutation(ADD_PROJECT_MEMBER_MUTATION);
  const [updateMemberRoleMutation] = useMutation(UPDATE_PROJECT_MEMBER_ROLE_MUTATION);
  const [removeMemberMutation] = useMutation(REMOVE_PROJECT_MEMBER_MUTATION);

  /**
   * Update state when GraphQL data changes
   * Handles loading states and data updates
   */
  useEffect(() => {
    if (data?.dashboardProjects) {
      setState(prev => ({
        ...prev,
        projects: data.dashboardProjects.projects,
        paginationInfo: data.dashboardProjects.paginationInfo,
        loading: queryLoading
      }));
    } else {
      setState(prev => ({
        ...prev,
        loading: queryLoading
      }));
    }
  }, [data, queryLoading]);

  /**
   * Update member state when GraphQL member data changes
   * Handles loading states and member data updates
   */
  useEffect(() => {
    if (memberData?.projectMembers) {
      setMemberState(prev => ({
        ...prev,
        members: memberData.projectMembers.members,
        paginationInfo: memberData.projectMembers.paginationInfo,
        loading: memberQueryLoading
      }));
    } else {
      setMemberState(prev => ({
        ...prev,
        loading: memberQueryLoading
      }));
    }
  }, [memberData, memberQueryLoading]);

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
  }, [state.selectedProject, activeTab]);

  /**
   * Fetch projects with current parameters
   * Refetches data when pagination or search changes
   */
  const fetchProjects = useCallback(async (page: number, pageSize: number, search: string) => {
    try {
      await refetch({
        limit: pageSize,
        offset: (page - 1) * pageSize,
        search: search || undefined,
        sortBy,
        sortOrder
      });
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: PROJECT_ERROR_MESSAGES.FETCH
      }));
    }
  }, [refetch, sortBy, sortOrder]);

  /**
   * Handle search query change
   * Debounced search with pagination reset
   */
  const handleSearchChange = useCallback((query: string) => {
    setState(prev => ({ ...prev, searchQuery: query, currentPage: 1 }));
  }, []);

  /**
   * Handle page size change
   * Resets to first page when changing page size
   */
  const handlePageSizeChange = useCallback((pageSize: number) => {
    setState(prev => ({ ...prev, pageSize, currentPage: 1 }));
    fetchProjects(1, pageSize, state.searchQuery);
  }, [fetchProjects, state.searchQuery]);

  /**
   * Handle column sorting
   * Updates sort parameters and resets to first page
   */
  const handleSort = useCallback((newSortBy: string, newSortOrder: string) => {
    setSortBy(newSortBy);
    setSortOrder(newSortOrder);
    setState(prev => ({ ...prev, currentPage: 1 }));
  }, []);

  /**
   * Handle page change
   * Navigates to specified page
   */
  const handlePageChange = useCallback((page: number) => {
    setState(prev => ({ ...prev, currentPage: page }));
    fetchProjects(page, state.pageSize, state.searchQuery);
  }, [fetchProjects, state.pageSize, state.searchQuery]);

  /**
   * Create a new project
   * Handles form submission and success/error states
   * Navigates to last page to show newly created project
   */
  const handleCreateProject = useCallback(async (projectData: ProjectInput) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      await createProjectMutation({
        variables: { input: projectData }
      });

      setState(prev => ({ ...prev, createModalOpen: false, loading: false }));

      // Refetch data to get updated pagination info
      const { data: updatedData } = await refetch();

      // Navigate to last page to show the newly created project
      if (updatedData?.dashboardProjects?.paginationInfo) {
        const { totalPages } = updatedData.dashboardProjects.paginationInfo;
        if (totalPages > 0) {
          setState(prev => ({ ...prev, currentPage: totalPages }));
          await fetchProjects(totalPages, state.pageSize, state.searchQuery);
        }
      } else {
        // Fallback: refetch current page if pagination info is not available
        await refetch();
      }

      showNotification(PROJECT_SUCCESS_MESSAGES.CREATE, 'success');
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: PROJECT_ERROR_MESSAGES.CREATE
      }));
      showNotification(error.message || PROJECT_ERROR_MESSAGES.CREATE, 'error');
    }
  }, [createProjectMutation, refetch, showNotification, fetchProjects, state.pageSize, state.searchQuery]);

  /**
   * Update an existing project
   * Handles form submission and success/error states
   */
  const handleUpdateProject = useCallback(async (projectId: string, projectData: ProjectUpdateInput) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      await updateProjectMutation({
        variables: { id: projectId, input: projectData }
      });

      setState(prev => ({ ...prev, editModalOpen: false, loading: false }));
      await refetch();
      showNotification(PROJECT_SUCCESS_MESSAGES.UPDATE, 'success');
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: PROJECT_ERROR_MESSAGES.UPDATE
      }));
      showNotification(error.message || PROJECT_ERROR_MESSAGES.UPDATE, 'error');
    }
  }, [updateProjectMutation, refetch, showNotification]);

  /**
   * Delete a project
   * Handles confirmation and success/error states
   */
  const handleDeleteProject = useCallback(async (projectId: string) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      await deleteProjectMutation({
        variables: { id: projectId }
      });

      setState(prev => ({ ...prev, deleteModalOpen: false, loading: false }));
      await refetch();
      showNotification(PROJECT_SUCCESS_MESSAGES.DELETE, 'success');
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: PROJECT_ERROR_MESSAGES.DELETE
      }));
      showNotification(error.message || PROJECT_ERROR_MESSAGES.DELETE, 'error');
    }
  }, [deleteProjectMutation, refetch, showNotification]);

  /**
   * Clear error message
   * Removes error state from UI
   */
  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  // Member Management Functions

  /**
   * Fetch project members for selected project
   * Handles pagination and search for member data
   */
  const fetchProjectMembers = useCallback(async (projectId: string, page: number, pageSize: number, search: string) => {
    try {
      setMemberState(prev => ({
        ...prev,
        loading: true,
        error: null
      }));

      await refetchMembers({
        projectId,
        limit: pageSize,
        offset: (page - 1) * pageSize,
        search: search || undefined,
        sortBy: memberSortBy,
        sortOrder: memberSortOrder
      });
    } catch (error) {
      setMemberState(prev => ({
        ...prev,
        error: 'Failed to fetch project members',
        loading: false
      }));
    }
  }, [memberSortBy, memberSortOrder, refetchMembers]);

  /**
   * Handle member search query change
   * Debounced search with pagination reset
   */
  const handleMemberSearchChange = useCallback((query: string) => {
    setMemberState(prev => ({ ...prev, searchQuery: query, currentPage: 1 }));
    if (state.selectedProject) {
      fetchProjectMembers(state.selectedProject.id, 1, memberState.pageSize, query);
    }
  }, [state.selectedProject, memberState.pageSize, fetchProjectMembers]);

  /**
   * Handle member page size change
   * Resets to first page when changing page size
   */
  const handleMemberPageSizeChange = useCallback((pageSize: number) => {
    setMemberState(prev => ({ ...prev, pageSize, currentPage: 1 }));
    if (state.selectedProject) {
      fetchProjectMembers(state.selectedProject.id, 1, pageSize, memberState.searchQuery);
    }
  }, [state.selectedProject, memberState.searchQuery, fetchProjectMembers]);

  /**
   * Handle member column sorting
   * Updates sort parameters and resets to first page
   */
  const handleMemberSort = useCallback((newSortBy: string, newSortOrder: string) => {
    setMemberSortBy(newSortBy);
    setMemberSortOrder(newSortOrder);
    setMemberState(prev => ({ ...prev, currentPage: 1 }));
    if (state.selectedProject) {
      fetchProjectMembers(state.selectedProject.id, 1, memberState.pageSize, memberState.searchQuery);
    }
  }, [state.selectedProject, memberState.pageSize, memberState.searchQuery, fetchProjectMembers]);

  /**
   * Handle member page change
   * Navigates to specified page
   */
  const handleMemberPageChange = useCallback((page: number) => {
    setMemberState(prev => ({ ...prev, currentPage: page }));
    if (state.selectedProject) {
      fetchProjectMembers(state.selectedProject.id, page, memberState.pageSize, memberState.searchQuery);
    }
  }, [state.selectedProject, memberState.pageSize, memberState.searchQuery, fetchProjectMembers]);

  /**
   * Add a member to the selected project
   * Handles form submission and success/error states
   */
  const handleAddMember = useCallback(async (variables: ProjectMemberInput) => {
    try {
      setMemberState(prev => ({ ...prev, loading: true, error: null }));

      await addMemberMutation({
        variables: {
          projectId: variables.projectId,
          userId: variables.userId,
          role: variables.role
        }
      });

      setMemberState(prev => ({ ...prev, addModalOpen: false, loading: false }));

      // Refetch members data
      if (state.selectedProject) {
        await fetchProjectMembers(state.selectedProject.id, memberState.currentPage, memberState.pageSize, memberState.searchQuery);
      }

      showNotification('Member added successfully', 'success');
    } catch (error: any) {
      setMemberState(prev => ({
        ...prev,
        loading: false,
        error: 'Failed to add member'
      }));
      showNotification(error.message || 'Failed to add member', 'error');
    }
  }, [addMemberMutation, showNotification, state.selectedProject, memberState.currentPage, memberState.pageSize, memberState.searchQuery, fetchProjectMembers]);

  /**
   * Update a member's role
   * Handles form submission and success/error states
   */
  const handleUpdateMemberRole = useCallback(async (projectId: string, userId: string, role: ProjectMemberRole) => {
    try {
      setMemberState(prev => ({ ...prev, loading: true, error: null }));

      await updateMemberRoleMutation({
        variables: { projectId, userId, role }
      });

      setMemberState(prev => ({ ...prev, updateRoleModalOpen: false, loading: false }));

      // Refetch members data
      if (state.selectedProject) {
        await fetchProjectMembers(state.selectedProject.id, memberState.currentPage, memberState.pageSize, memberState.searchQuery);
      }

      showNotification('Member role updated successfully', 'success');
    } catch (error: any) {
      setMemberState(prev => ({
        ...prev,
        loading: false,
        error: 'Failed to update member role'
      }));
      showNotification(error.message || 'Failed to update member role', 'error');
    }
  }, [updateMemberRoleMutation, showNotification, state.selectedProject, memberState.currentPage, memberState.pageSize, memberState.searchQuery, fetchProjectMembers]);

  /**
   * Remove a member from the project
   * Handles confirmation and success/error states
   */
  const handleRemoveMember = useCallback(async () => {
    if (!memberState.selectedMember) return;

    try {
      setMemberState(prev => ({ ...prev, loading: true, error: null }));

      await removeMemberMutation({
        variables: {
          projectId: memberState.selectedMember.projectId,
          userId: memberState.selectedMember.userId
        }
      });

      setMemberState(prev => ({ ...prev, removeModalOpen: false, loading: false }));

      // Refetch members data
      if (state.selectedProject) {
        await fetchProjectMembers(state.selectedProject.id, memberState.currentPage, memberState.pageSize, memberState.searchQuery);
      }

      showNotification('Member removed successfully', 'success');
    } catch (error: any) {
      setMemberState(prev => ({
        ...prev,
        loading: false,
        error: 'Failed to remove member'
      }));
      showNotification(error.message || 'Failed to remove member', 'error');
    }
  }, [removeMemberMutation, showNotification, memberState.selectedMember, state.selectedProject, memberState.currentPage, memberState.pageSize, memberState.searchQuery, fetchProjectMembers]);

  /**
   * Clear member error message
   * Removes error state from UI
   */
  const clearMemberError = useCallback(() => {
    setMemberState(prev => ({ ...prev, error: null }));
  }, []);

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
        <div className="bg-white border-b border-gray-200 w-full">
          <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8 w-full">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex-1">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                  Projects Management
                </h1>
                <p className="text-sm sm:text-base text-gray-600 mt-1">
                  Manage and track your projects
                </p>
              </div>
              {canCreate && activeTab === 'projects' && (
                /* Create Project Button - Centered icon and text for better mobile UX when sidebar is collapsed */
                <button
                  type="button"
                  className="inline-flex items-center justify-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 w-full sm:w-auto sm:flex-shrink-0"
                  onClick={() => setState(prev => ({ ...prev, createModalOpen: true }))}
                >
                  <FaPlus className="h-5 w-5" aria-hidden="true" />
                  <span className="hidden xs:inline ml-2">Create Project</span>
                  <span className="xs:hidden ml-2">Create</span>
                </button>
              )}
              {canCreate && activeTab === 'members' && state.selectedProject && (
                /* Add Member Button - Centered icon and text for better mobile UX when sidebar is collapsed */
                <button
                  type="button"
                  className="inline-flex items-center justify-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 w-full sm:w-auto sm:flex-shrink-0"
                  onClick={() => setMemberState(prev => ({ ...prev, addModalOpen: true }))}
                >
                  <FaUsers className="h-5 w-5" aria-hidden="true" />
                  <span className="hidden xs:inline ml-2">Add Member</span>
                  <span className="xs:hidden ml-2">Add</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="w-full">
          <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8 w-full">
            {/* Tabs Navigation */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
              <nav className="flex">
                <button
                  onClick={() => setActiveTab('projects')}
                  className={`flex-1 py-4 px-6 text-center font-medium text-sm transition-all duration-200 ${activeTab === 'projects'
                    ? 'bg-purple-50 text-purple-700 border-r border-purple-200'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50 border-r border-gray-200'
                    }`}
                >
                  <div className="flex items-center justify-center space-x-2">
                    <span>Projects</span>
                  </div>
                </button>
                <button
                  onClick={() => setActiveTab('members')}
                  className={`flex-1 py-4 px-6 text-center font-medium text-sm transition-all duration-200 ${activeTab === 'members'
                    ? 'bg-purple-50 text-purple-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                >
                  <div className="flex items-center justify-center space-x-2">
                    <FaUsers className="w-4 h-4" />
                    <span>Members</span>
                    {state.selectedProject && (
                      <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-xs">
                        {state.selectedProject.name}
                      </span>
                    )}
                  </div>
                </button>
              </nav>
            </div>

            {/* Error Display */}
            {(state.error || memberState.error) && (
              <div className="mb-6">
                <InlineError
                  message={activeTab === 'projects' ? state.error : memberState.error}
                  onDismiss={activeTab === 'projects' ? clearError : clearMemberError}
                />
              </div>
            )}

            {/* Tab Content */}
            {activeTab === 'projects' && (
              <div className="space-y-6">
                {/* Search Input */}
                <ProjectSearchInput
                  value={state.searchQuery}
                  onChange={handleSearchChange}
                  loading={state.loading}
                />

                {/* Projects Table */}
                <ProjectsTable
                  projects={state.projects}
                  paginationInfo={state.paginationInfo}
                  loading={state.loading}
                  onEdit={canEdit ? (project) => {
                    setState(prev => ({
                      ...prev,
                      editModalOpen: true,
                      selectedProject: project
                    }));
                  } : undefined}
                  onDelete={canDelete ? async (project) => {
                    try {
                      // Check project deletion impact first
                      const { data } = await checkProjectDeletion({
                        variables: { projectId: project.id }
                      });

                      setDeletionCheck(data?.checkProjectDeletion || null);
                      setState(prev => ({
                        ...prev,
                        deleteModalOpen: true,
                        selectedProject: project
                      }));
                    } catch (error) {
                      // If check fails, still show modal but without validation
                      setDeletionCheck(null);
                      setState(prev => ({
                        ...prev,
                        deleteModalOpen: true,
                        selectedProject: project
                      }));
                    }
                  } : undefined}
                  onViewMembers={(project) => {
                    setState(prev => ({
                      ...prev,
                      selectedProject: project
                    }));
                    // Switch to members tab and fetch members when a project is selected
                    setActiveTab('members');
                    fetchProjectMembers(project.id, 1, memberState.pageSize, '');
                  }}
                  onPageChange={handlePageChange}
                  onPageSizeChange={handlePageSizeChange}
                  currentPageSize={state.pageSize}
                  onSort={handleSort}
                  currentSortBy={sortBy}
                  currentSortOrder={sortOrder}
                />
              </div>
            )}

            {activeTab === 'members' && (
              <div className="space-y-6">
                {!state.selectedProject ? (
                  <div className="text-center py-12">
                    <FaUsers className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No Project Selected</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Click on a project name or use the "Members" button in the Projects tab to view and manage project members.
                    </p>
                    <div className="mt-4">
                      <button
                        onClick={() => setActiveTab('projects')}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                      >
                        View Projects
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* Project Info */}
                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
                            <span className="text-sm font-medium text-purple-600">
                              {state.selectedProject.name.charAt(0)}
                            </span>
                          </div>
                        </div>
                        <div className="ml-3">
                          <h3 className="text-sm font-medium text-purple-900">
                            {state.selectedProject.name}
                          </h3>
                          <p className="text-sm text-purple-700">
                            {state.selectedProject.description}
                          </p>
                        </div>
                        <div className="ml-auto">
                          <button
                            onClick={() => {
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
                      onChange={handleMemberSearchChange}
                      loading={memberState.loading}
                      placeholder="Search members by name or email..."
                    />

                    {/* Members Table */}
                    <ProjectMembersTable
                      members={memberState.members}
                      paginationInfo={memberState.paginationInfo}
                      loading={memberState.loading}
                      onPageChange={handleMemberPageChange}
                      onPageSizeChange={handleMemberPageSizeChange}
                      currentPageSize={memberState.pageSize}
                      onSort={handleMemberSort}
                      currentSortBy={memberSortBy}
                      currentSortOrder={memberSortOrder}
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
                    />
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Modals - Only show for users with CRUD permissions */}
        {canCreate && (
          <CreateProjectModal
            isOpen={state.createModalOpen}
            onClose={() => setState(prev => ({ ...prev, createModalOpen: false }))}
            onSubmit={handleCreateProject}
            loading={state.loading}
          />
        )}

        {canEdit && (
          <EditProjectModal
            isOpen={state.editModalOpen}
            project={state.selectedProject}
            onClose={() => setState(prev => ({ ...prev, editModalOpen: false, selectedProject: null }))}
            onSubmit={handleUpdateProject}
            loading={state.loading}
          />
        )}

        {canDelete && (
          <DeleteProjectModal
            isOpen={state.deleteModalOpen}
            project={state.selectedProject}
            onClose={() => {
              setState(prev => ({ ...prev, deleteModalOpen: false, selectedProject: null }));
              setDeletionCheck(null); // Clear deletion check state on close
            }}
            onConfirm={handleDeleteProject}
            loading={state.loading}
            deletionCheck={deletionCheck}
          />
        )}

        {/* Member Management Modals */}
        {canCreate && (
          <AddMemberModal
            isOpen={memberState.addModalOpen}
            onClose={() => setMemberState(prev => ({ ...prev, addModalOpen: false }))}
            onSubmit={handleAddMember}
            projectId={state.selectedProject?.id || ''}
            projectName={state.selectedProject?.name || ''}
            loading={memberState.loading}
          />
        )}

        {canEdit && (
          <UpdateMemberRoleModal
            isOpen={memberState.updateRoleModalOpen}
            onClose={() => setMemberState(prev => ({ ...prev, updateRoleModalOpen: false, selectedMember: null }))}
            onSubmit={handleUpdateMemberRole}
            member={memberState.selectedMember}
            loading={memberState.loading}
          />
        )}

        {canDelete && (
          <RemoveMemberModal
            isOpen={memberState.removeModalOpen}
            onClose={() => setMemberState(prev => ({ ...prev, removeModalOpen: false, selectedMember: null }))}
            onConfirm={handleRemoveMember}
            member={memberState.selectedMember}
            loading={memberState.loading}
          />
        )}
      </div>
    </DashboardLayout>
  );
};

export default ProjectsPage;