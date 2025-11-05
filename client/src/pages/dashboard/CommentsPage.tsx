import React, { useState, useCallback, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { DashboardLayout } from '../../components/layout';
import { useAuth } from '../../contexts/AuthContext';
import { DashboardSkeleton } from '../../components/ui';
import { useRolePermissions } from '../../hooks/useRolePermissions';
import { useAuthDataReady } from '../../hooks/useAuthDataReady';
import AccessDenied from '../../components/auth/AccessDenied';
import { FaPlus } from 'react-icons/fa';
import {
  CommentSearchInput,
  CommentsTable,
  CreateCommentModal,
  EditCommentModal,
  DeleteCommentModal,
} from '../../components/commentManagement';
import {
  GET_DASHBOARD_COMMENTS_QUERY,
  CREATE_COMMENT_MUTATION,
  UPDATE_COMMENT_MUTATION,
  DELETE_COMMENT_MUTATION,
  Comment,
  GetDashboardCommentsQueryVariables,
} from '../../services/graphql/commentQueries';
import { DEFAULT_COMMENTS_PAGINATION } from '../../constants/commentManagement';
import { CommentFormData } from '../../types/commentManagement';

/**
 * Comments Dashboard Page
 * Comprehensive management page for comments with search, table display, pagination, and CRUD operations
 * Accessible to all authenticated users
 * Features responsive design with improved mobile UX when sidebar is collapsed
 */
const CommentsPage: React.FC = () => {
  const { user, isInitializing, showNotification } = useAuth();
  const { canCreate, canEdit, canDelete, hasDashboardAccess } = useRolePermissions();
  const isAuthDataReady = useAuthDataReady();

  // Centralized state management
  const [state, setState] = useState({
    comments: [] as Comment[],
    paginationInfo: {
      hasNextPage: false,
      hasPreviousPage: false,
      totalCount: 0,
      currentPage: 1,
      totalPages: 0
    },
    loading: false,
    searchTerm: '',
    currentPage: 1,
    pageSize: DEFAULT_COMMENTS_PAGINATION.limit,
    createModalOpen: false,
    editModalOpen: false,
    deleteModalOpen: false,
    selectedComment: null as Comment | null,
    error: null as string | null
  });

  // Sorting state - separate to prevent unnecessary re-renders
  const [sortBy, setSortBy] = useState(DEFAULT_COMMENTS_PAGINATION.sortBy);
  const [sortOrder, setSortOrder] = useState<'ASC' | 'DESC'>(DEFAULT_COMMENTS_PAGINATION.sortOrder);
  const [isSorting, setIsSorting] = useState(false);

  // Loading states for mutations
  const [createLoading, setCreateLoading] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // GraphQL query variables
  const queryVariables: GetDashboardCommentsQueryVariables = {
    limit: state.pageSize,
    offset: (state.currentPage - 1) * state.pageSize,
    search: state.searchTerm || undefined,
    sortBy,
    sortOrder,
  };

  // Fetch comments
  // Wait for auth data to be ready to prevent race conditions during fast navigation
  const shouldSkip = isInitializing || !hasDashboardAccess || !user || !isAuthDataReady;
  const { data, loading: queryLoading, error, refetch } = useQuery(GET_DASHBOARD_COMMENTS_QUERY, {
    variables: queryVariables,
    errorPolicy: 'all',
    fetchPolicy: 'cache-and-network',
    notifyOnNetworkStatusChange: true,
    // Skip querying until auth is initialized, user has access, and auth data is ready
    skip: shouldSkip,
  });

  /**
   * Update state when GraphQL data changes
   * Handles loading states and data updates
   * Always updates loading state to prevent race conditions during fast navigation
   */
  useEffect(() => {
    if (data?.dashboardComments) {
      setState(prev => ({
        ...prev,
        comments: data.dashboardComments.comments,
        paginationInfo: data.dashboardComments.paginationInfo,
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
   * Clear error state when skip condition changes to prevent showing stale errors
   * This prevents cached errors from showing when navigating fast
   */
  useEffect(() => {
    if (shouldSkip) {
      setState(prev => ({
        ...prev,
        error: null
      }));
    }
  }, [shouldSkip]);

  /**
   * Handle GraphQL errors gracefully
   * Only show errors if not during auth initialization or when auth data is not ready
   */
  useEffect(() => {
    if (error && !shouldSkip) {
      setState(prev => ({
        ...prev,
        error: error.message || 'Failed to load comments'
      }));
    }
  }, [error, shouldSkip]);

  /**
   * Fetch comments with current parameters
   * Refetches data when pagination or search changes
   */
  const fetchComments = useCallback(async (page: number, pageSize: number, search: string) => {
    // Only fetch if user is authenticated and has access
    if (!user || !hasDashboardAccess || isInitializing) {
      return;
    }

    try {
      await refetch({
        limit: pageSize,
        offset: (page - 1) * pageSize,
        search: search || undefined,
        sortBy,
        sortOrder
      });
    } catch (error) {
      // Only show error if not during auth initialization
      if (!isInitializing) {
        setState(prev => ({
          ...prev,
          error: 'Failed to fetch comments'
        }));
      }
    }
  }, [refetch, sortBy, sortOrder, user, hasDashboardAccess, isInitializing]);

  /**
   * Handle search and pagination changes
   * Triggers refetch when search term or page changes
   */
  useEffect(() => {
    if (isSorting) return; // avoid duplicate refetch when sorting already refetched
    fetchComments(state.currentPage, state.pageSize, state.searchTerm);
  }, [state.currentPage, state.searchTerm, fetchComments, isSorting]);

  // Mutations
  const [createCommentMutation] = useMutation(CREATE_COMMENT_MUTATION);
  const [updateCommentMutation] = useMutation(UPDATE_COMMENT_MUTATION);
  const [deleteCommentMutation] = useMutation(DELETE_COMMENT_MUTATION);

  // Handle search
  const handleSearch = useCallback((search: string) => {
    setState(prev => ({ ...prev, searchTerm: search, currentPage: 1 }));
  }, []);

  // Handle sort - optimized to prevent unnecessary re-renders
  const handleSort = useCallback(async (newSortBy: string, newSortOrder: string) => {
    setIsSorting(true);
    setSortBy(newSortBy);
    // Cast to 'ASC' | 'DESC' to match state type - values are validated by CommentsTable component
    setSortOrder(newSortOrder as 'ASC' | 'DESC');
    setState(prev => ({ ...prev, currentPage: 1 }));

    try {
      await refetch({
        limit: state.pageSize,
        offset: 0,
        search: state.searchTerm || undefined,
        sortBy: newSortBy,
        sortOrder: newSortOrder
      });
    } catch {
      // errors handled by error effect
    } finally {
      setIsSorting(false);
    }
  }, [refetch, state.pageSize, state.searchTerm]);

  // Handle page change
  const handlePageChange = useCallback((page: number) => {
    setState(prev => ({ ...prev, currentPage: page }));
  }, []);

  // Handle page size change
  const handlePageSizeChange = useCallback((newPageSize: number) => {
    setState(prev => ({ ...prev, pageSize: newPageSize, currentPage: 1 }));
    fetchComments(1, newPageSize, state.searchTerm);
  }, [fetchComments, state.searchTerm]);

  // Handle edit comment
  const handleEdit = useCallback((comment: Comment) => {
    setState(prev => ({
      ...prev,
      selectedComment: comment,
      editModalOpen: true
    }));
  }, []);

  // Handle delete comment
  const handleDelete = useCallback((comment: Comment) => {
    setState(prev => ({
      ...prev,
      selectedComment: comment,
      deleteModalOpen: true
    }));
  }, []);

  // Handle create comment
  const handleCreateComment = useCallback(async (formData: CommentFormData) => {
    setCreateLoading(true);
    try {
      await createCommentMutation({
        variables: {
          input: {
            content: formData.content,
            projectId: formData.projectId,
          },
        },
      });

      showNotification('Comment created successfully', 'success');
      setState(prev => ({ ...prev, createModalOpen: false }));
      refetch();
    } catch (error: any) {
      showNotification(error.message || 'Failed to create comment', 'error');
    } finally {
      setCreateLoading(false);
    }
  }, [createCommentMutation, showNotification, refetch]);

  // Handle update comment
  const handleUpdateComment = useCallback(async (formData: CommentFormData) => {
    if (!state.selectedComment) return;

    setUpdateLoading(true);
    try {
      await updateCommentMutation({
        variables: {
          id: state.selectedComment.id,
          input: {
            content: formData.content,
          },
        },
      });

      showNotification('Comment updated successfully', 'success');
      setState(prev => ({ ...prev, editModalOpen: false, selectedComment: null }));
      refetch();
    } catch (error: any) {
      showNotification(error.message || 'Failed to update comment', 'error');
    } finally {
      setUpdateLoading(false);
    }
  }, [state.selectedComment, updateCommentMutation, showNotification, refetch]);

  // Handle delete comment
  const handleDeleteComment = useCallback(async () => {
    if (!state.selectedComment) return;

    setDeleteLoading(true);
    try {
      await deleteCommentMutation({
        variables: {
          id: state.selectedComment.id,
        },
      });

      showNotification('Comment deleted successfully', 'success');
      setState(prev => ({ ...prev, deleteModalOpen: false, selectedComment: null }));
      refetch();
    } catch (error: any) {
      showNotification(error.message || 'Failed to delete comment', 'error');
    } finally {
      setDeleteLoading(false);
    }
  }, [state.selectedComment, deleteCommentMutation, showNotification, refetch]);

  // Handle modal close
  const handleCloseModals = useCallback(() => {
    setState(prev => ({
      ...prev,
      createModalOpen: false,
      editModalOpen: false,
      deleteModalOpen: false,
      selectedComment: null
    }));
  }, []);

  // During auth initialization, show skeleton instead of AccessDenied to avoid flash
  if (isInitializing) {
    return <DashboardSkeleton />;
  }

  // Check if user has dashboard access (after initialization)
  if (!hasDashboardAccess) {
    return <AccessDenied feature="Comments Management" />;
  }

  // Show skeleton only during initial data loading (not during auth init)
  if (queryLoading && (!state.comments || state.comments.length === 0)) {
    return <DashboardSkeleton />;
  }

  return (
    <DashboardLayout showSidebarSkeleton={false}>
      <div className="w-full h-full dashboard-content">
        {/* Header Section (Users-style with theme variables) */}
        <div className="w-full" style={{ backgroundColor: 'var(--bg-base)', borderBottomColor: 'var(--border-color)', borderBottomWidth: 1 }}>
          <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8 w-full">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex-1">
                <h1 className="text-2xl sm:text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>
                  Comments Management
                </h1>
                <p className="text-sm sm:text-base mt-1" style={{ color: 'var(--text-secondary)' }}>
                  Manage comments and discussions across all tasks and projects
                </p>
              </div>
              {canCreate && (
                <button
                  type="button"
                  className="inline-flex items-center justify-center px-4 py-2 border shadow-sm text-sm font-medium rounded-md w-full sm:w-auto sm:flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-offset-2"
                  style={{ color: 'var(--button-primary-text)', backgroundColor: 'var(--button-primary-bg)', borderColor: 'var(--button-primary-bg)' }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--button-primary-hover-bg)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'var(--button-primary-bg)'; }}
                  onClick={() => setState(prev => ({ ...prev, createModalOpen: true }))}
                >
                  <FaPlus className="h-5 w-5" aria-hidden="true" />
                  <span className="hidden xs:inline ml-2">Create Comment</span>
                  <span className="xs:hidden ml-2">Create</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="w-full">
          <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8 w-full">
            <div className="space-y-6">
              {/* Search Input */}
              <CommentSearchInput
                value={state.searchTerm}
                onChange={handleSearch}
                onSearch={handleSearch}
                loading={state.loading && !isSorting}
              />

              {/* Comments Table */}
              <CommentsTable
                comments={state.comments}
                loading={state.loading || isSorting}
                paginationInfo={state.paginationInfo}
                onPageChange={handlePageChange}
                onPageSizeChange={handlePageSizeChange}
                currentPageSize={state.pageSize}
                onSort={handleSort}
                currentSortBy={sortBy}
                currentSortOrder={sortOrder}
                onEdit={canEdit ? handleEdit : undefined}
                onDelete={canDelete ? handleDelete : undefined}
              />
            </div>
          </div>
        </div>

        {/* Modals - Only show for users with CRUD permissions */}
        {canCreate && (
          <CreateCommentModal
            isOpen={state.createModalOpen}
            onClose={handleCloseModals}
            onSubmit={handleCreateComment}
            loading={createLoading}
          />
        )}

        {canEdit && (
          <EditCommentModal
            isOpen={state.editModalOpen}
            onClose={handleCloseModals}
            onSubmit={handleUpdateComment}
            comment={state.selectedComment}
            loading={updateLoading}
          />
        )}

        {canDelete && (
          <DeleteCommentModal
            isOpen={state.deleteModalOpen}
            onClose={handleCloseModals}
            onConfirm={handleDeleteComment}
            comment={state.selectedComment}
            loading={deleteLoading}
          />
        )}
      </div>
    </DashboardLayout>
  );
};

export default CommentsPage;
