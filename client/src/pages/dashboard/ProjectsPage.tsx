import React, { useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { FaPlus } from 'react-icons/fa';
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
  DeleteProjectModal
} from '../../components/projectManagement';
import {
  GET_DASHBOARD_PROJECTS_QUERY,
  CREATE_PROJECT_MUTATION,
  UPDATE_PROJECT_MUTATION,
  DELETE_PROJECT_MUTATION
} from '../../services/graphql/projectQueries';
import {
  Project,
  ProjectInput,
  ProjectUpdateInput,
  ProjectManagementState
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
 * 
 * CALLED BY: AppRoutes component via ProtectedRoute
 * SCENARIOS: Project management for administrators and project managers
 */
const ProjectsPage: React.FC = () => {
  const navigate = useNavigate();
  const { isInitializing } = useAuth();
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

  // Sorting state
  const [sortBy, setSortBy] = useState<string>('createdAt');
  const [sortOrder, setSortOrder] = useState<string>('DESC');

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

  const [createProjectMutation] = useMutation(CREATE_PROJECT_MUTATION);
  const [updateProjectMutation] = useMutation(UPDATE_PROJECT_MUTATION);
  const [deleteProjectMutation] = useMutation(DELETE_PROJECT_MUTATION);

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
   */
  const handleCreateProject = useCallback(async (projectData: ProjectInput) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      await createProjectMutation({
        variables: { input: projectData }
      });

      setState(prev => ({ ...prev, createModalOpen: false, loading: false }));
      await refetch();
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: PROJECT_ERROR_MESSAGES.CREATE
      }));
    }
  }, [createProjectMutation, refetch]);

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
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: PROJECT_ERROR_MESSAGES.UPDATE
      }));
    }
  }, [updateProjectMutation, refetch]);

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
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: PROJECT_ERROR_MESSAGES.DELETE
      }));
    }
  }, [deleteProjectMutation, refetch]);

  /**
   * Clear error message
   * Removes error state from UI
   */
  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
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
          <div className="px-8 py-8 w-full">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Projects Management
                </h1>
                <p className="text-gray-600 mt-1">
                  Manage and track your projects
                </p>
              </div>
              {canCreate && (
                <button
                  type="button"
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                  onClick={() => setState(prev => ({ ...prev, createModalOpen: true }))}
                >
                  <FaPlus className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                  Create Project
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="w-full">
          <div className="px-8 py-8 w-full">
            {/* Error Display */}
            {state.error && (
              <div className="mb-6">
                <InlineError message={state.error} onDismiss={clearError} />
              </div>
            )}

            {/* Search and Table */}
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
                onEdit={canEdit ? (project) => setState(prev => ({
                  ...prev,
                  editModalOpen: true,
                  selectedProject: project
                })) : undefined}
                onDelete={canDelete ? (project) => setState(prev => ({
                  ...prev,
                  deleteModalOpen: true,
                  selectedProject: project
                })) : undefined}
                onPageChange={handlePageChange}
                onPageSizeChange={handlePageSizeChange}
                currentPageSize={state.pageSize}
                onSort={handleSort}
                currentSortBy={sortBy}
                currentSortOrder={sortOrder}
              />
            </div>
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
            onClose={() => setState(prev => ({ ...prev, deleteModalOpen: false, selectedProject: null }))}
            onConfirm={handleDeleteProject}
            loading={state.loading}
          />
        )}
      </div>
    </DashboardLayout>
  );
};

export default ProjectsPage;