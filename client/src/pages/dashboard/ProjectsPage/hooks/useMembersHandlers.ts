import { useCallback } from 'react';
import { ProjectMemberRole } from '../../../../types/projectManagement';
import { AddProjectMemberMutationVariables } from '../../../../services/graphql/projectMemberQueries';
import { UseMembersHandlersDependencies } from '../types';

/**
 * Custom hook for managing event handlers for members
 * Handles all user interactions and CRUD operations for project members
 */
export const useMembersHandlers = ({
  memberState,
  selectedProject,
  sortBy,
  sortOrder,
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
}: UseMembersHandlersDependencies) => {
  /**
   * Fetch project members for selected project
   * Handles pagination and search for member data
   */
  const fetchMembers = useCallback(async (projectId: string, page: number, pageSize: number, search: string) => {
    try {
      setMemberState(prev => ({
        ...prev,
        loading: true,
        error: null
      }));

      await fetchProjectMembers(projectId, page, pageSize, search);
    } catch (error) {
      setMemberState(prev => ({
        ...prev,
        error: 'Failed to fetch project members',
        loading: false
      }));
    }
  }, [fetchProjectMembers, setMemberState]);

  /**
   * Fetch project members with specific sorting parameters
   * Used for immediate sorting without waiting for state update
   */
  const fetchMembersWithSort = useCallback(async (projectId: string, page: number, pageSize: number, search: string, sortBy: string, sortOrder: string) => {
    try {
      setMemberState(prev => ({
        ...prev,
        loading: true,
        error: null
      }));

      await fetchProjectMembersWithSort(projectId, page, pageSize, search, sortBy, sortOrder);
    } catch (error) {
      setMemberState(prev => ({
        ...prev,
        error: 'Failed to fetch project members',
        loading: false
      }));
    }
  }, [fetchProjectMembersWithSort, setMemberState]);

  /**
   * Handle member search query change
   * Debounced search with pagination reset
   */
  const handleMemberSearchChange = useCallback((query: string) => {
    setMemberState(prev => ({ ...prev, searchQuery: query, currentPage: 1 }));
    if (selectedProject) {
      fetchMembers(selectedProject.id, 1, memberState.pageSize, query);
    }
  }, [selectedProject, memberState.pageSize, fetchMembers, setMemberState]);

  /**
   * Handle member page size change
   * Resets to first page when changing page size
   */
  const handleMemberPageSizeChange = useCallback((pageSize: number) => {
    setMemberState(prev => ({ ...prev, pageSize, currentPage: 1 }));
    if (selectedProject) {
      fetchMembers(selectedProject.id, 1, pageSize, memberState.searchQuery);
    }
  }, [selectedProject, memberState.searchQuery, fetchMembers, setMemberState]);

  /**
   * Handle member column sorting
   * Updates sort parameters and resets to first page
   */
  const handleMemberSort = useCallback((newSortBy: string, newSortOrder: string) => {
    setMemberSortBy(newSortBy);
    setMemberSortOrder(newSortOrder);
    setMemberState(prev => ({ ...prev, currentPage: 1 }));
    if (selectedProject) {
      // Fetch with new sorting parameters immediately
      fetchMembersWithSort(selectedProject.id, 1, memberState.pageSize, memberState.searchQuery, newSortBy, newSortOrder);
    }
  }, [selectedProject, memberState.pageSize, memberState.searchQuery, setMemberSortBy, setMemberSortOrder, setMemberState, fetchMembersWithSort]);

  /**
   * Handle member page change
   * Navigates to specified page
   */
  const handleMemberPageChange = useCallback((page: number) => {
    setMemberState(prev => ({ ...prev, currentPage: page }));
    if (selectedProject) {
      fetchMembers(selectedProject.id, page, memberState.pageSize, memberState.searchQuery);
    }
  }, [selectedProject, memberState.pageSize, memberState.searchQuery, fetchMembers, setMemberState]);

  /**
   * Add a member to the selected project
   * Handles form submission and success/error states
   */
  const handleAddMember = useCallback(async (variables: AddProjectMemberMutationVariables) => {
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
      if (selectedProject) {
        await fetchMembers(selectedProject.id, memberState.currentPage, memberState.pageSize, memberState.searchQuery);
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
  }, [addMemberMutation, showNotification, selectedProject, memberState.currentPage, memberState.pageSize, memberState.searchQuery, fetchMembers, setMemberState]);

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
      if (selectedProject) {
        await fetchMembers(selectedProject.id, memberState.currentPage, memberState.pageSize, memberState.searchQuery);
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
  }, [updateMemberRoleMutation, showNotification, selectedProject, memberState.currentPage, memberState.pageSize, memberState.searchQuery, fetchMembers, setMemberState]);

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
      if (selectedProject) {
        await fetchMembers(selectedProject.id, memberState.currentPage, memberState.pageSize, memberState.searchQuery);
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
  }, [removeMemberMutation, showNotification, memberState.selectedMember, selectedProject, memberState.currentPage, memberState.pageSize, memberState.searchQuery, fetchMembers, setMemberState]);

  /**
   * Handle view members click
   * Switches to members tab and fetches members
   */
  const handleViewMembers = useCallback((project: any) => {
    setState(prev => ({
      ...prev,
      selectedProject: project
    }));
    // Switch to members tab and fetch members when a project is selected
    setActiveTab('members');
    fetchMembers(project.id, 1, memberState.pageSize, '');
  }, [setState, setActiveTab, fetchMembers, memberState.pageSize]);

  /**
   * Clear member error message
   * Removes error state from UI
   */
  const clearMemberError = useCallback(() => {
    setMemberState(prev => ({ ...prev, error: null }));
  }, [setMemberState]);

  return {
    handleMemberSearchChange,
    handleMemberPageSizeChange,
    handleMemberSort,
    handleMemberPageChange,
    handleAddMember,
    handleUpdateMemberRole,
    handleRemoveMember,
    handleViewMembers,
    clearMemberError,
    fetchMembers,
  };
};

