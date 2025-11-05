import { useCallback } from 'react';
import { ProjectInput, ProjectUpdateInput } from '../../../../types/projectManagement';
import { PROJECT_SUCCESS_MESSAGES, PROJECT_ERROR_MESSAGES } from '../../../../constants/projectManagement';
import { UseProjectsHandlersDependencies } from '../types';

/**
 * Custom hook for managing event handlers for projects
 * Handles all user interactions and CRUD operations
 */
export const useProjectsHandlers = ({
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
  fetchProjects,
}: UseProjectsHandlersDependencies) => {
  /**
   * Fetch projects with current parameters
   * Refetches data when pagination or search changes
   */
  const fetchProjectsHandler = useCallback(async (page: number, pageSize: number, search: string) => {
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
  }, [refetch, sortBy, sortOrder, setState]);
  /**
   * Handle search query change
   * Debounced search with pagination reset
   */
  const handleSearchChange = useCallback((query: string) => {
    setState(prev => ({ ...prev, searchQuery: query, currentPage: 1 }));
  }, [setState]);

  /**
   * Handle page size change
   * Resets to first page when changing page size
   */
  const handlePageSizeChange = useCallback((pageSize: number) => {
    setState(prev => ({ ...prev, pageSize, currentPage: 1 }));
    fetchProjectsHandler(1, pageSize, state.searchQuery);
  }, [fetchProjectsHandler, state.searchQuery, setState]);

  /**
   * Handle column sorting
   * Updates sort parameters and resets to first page
   */
  const handleSort = useCallback((newSortBy: string, newSortOrder: string) => {
    setSortBy(newSortBy);
    setSortOrder(newSortOrder);
    setState(prev => ({ ...prev, currentPage: 1 }));
  }, [setSortBy, setSortOrder, setState]);

  /**
   * Handle page change
   * Navigates to specified page
   */
  const handlePageChange = useCallback((page: number) => {
    setState(prev => ({ ...prev, currentPage: page }));
    fetchProjectsHandler(page, state.pageSize, state.searchQuery);
  }, [fetchProjectsHandler, state.pageSize, state.searchQuery, setState]);

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
          await fetchProjectsHandler(totalPages, state.pageSize, state.searchQuery);
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
  }, [createProjectMutation, refetch, showNotification, fetchProjectsHandler, state.pageSize, state.searchQuery, setState]);

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
  }, [updateProjectMutation, refetch, showNotification, setState]);

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
  }, [deleteProjectMutation, refetch, showNotification, setState]);

  /**
   * Handle edit click
   * Opens edit modal with selected project
   */
  const handleEdit = useCallback((project: any) => {
    setState(prev => ({
      ...prev,
      editModalOpen: true,
      selectedProject: project
    }));
  }, [setState]);

  /**
   * Handle delete click
   * Checks project deletion impact and opens delete modal
   */
  const handleDelete = useCallback(async (project: any) => {
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
  }, [checkProjectDeletion, setDeletionCheck, setState]);

  /**
   * Clear error message
   * Removes error state from UI
   */
  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, [setState]);

  return {
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
  };
};

