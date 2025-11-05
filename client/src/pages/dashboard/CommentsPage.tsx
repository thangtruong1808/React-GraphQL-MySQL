import React from 'react';
import {
  CreateCommentModal,
  DeleteCommentModal,
  EditCommentModal,
} from '../../components/commentManagement';
import AccessDenied from '../../components/auth/AccessDenied';
import { DashboardLayout } from '../../components/layout';
import { DashboardSkeleton } from '../../components/ui';
import { DEFAULT_COMMENTS_PAGINATION } from '../../constants/commentManagement';
import { useAuth } from '../../contexts/AuthContext';
import { useRolePermissions } from '../../hooks/useRolePermissions';
import { useAuthDataReady } from '../../hooks/useAuthDataReady';
import {
  useCommentsState,
  useCommentsQueries,
  useCommentsMutations,
  useCommentsHandlers,
} from './CommentsPage/hooks';
import { CommentsHeader, CommentsContent } from './CommentsPage/components';

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

  // State management
  const {
    state,
    setState,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    isSorting,
    setIsSorting,
    createLoading,
    setCreateLoading,
    updateLoading,
    setUpdateLoading,
    deleteLoading,
    setDeleteLoading,
  } = useCommentsState({
    initialPageSize: DEFAULT_COMMENTS_PAGINATION.limit,
  });

  // GraphQL queries
  const { queryLoading, refetch } = useCommentsQueries({
    pageSize: state.pageSize,
    currentPage: state.currentPage,
    searchTerm: state.searchTerm,
    sortBy,
    sortOrder,
    isInitializing,
    hasDashboardAccess,
    user,
    isAuthDataReady,
    setState,
  });

  // GraphQL mutations
  const { createCommentMutation, updateCommentMutation, deleteCommentMutation } = useCommentsMutations();

  // Event handlers
  const {
    handleSearch,
    handleSort,
    handlePageChange,
    handlePageSizeChange,
    handleEdit,
    handleDelete,
    handleCreateComment,
    handleUpdateComment,
    handleDeleteComment,
    handleCloseModals,
    handleCreateClick,
  } = useCommentsHandlers({
    state,
    sortBy,
    sortOrder,
    isSorting,
    setState,
    setSortBy,
    setSortOrder,
    setIsSorting,
    setCreateLoading,
    setUpdateLoading,
    setDeleteLoading,
    refetch,
    createCommentMutation,
    updateCommentMutation,
    deleteCommentMutation,
    showNotification,
    user,
    hasDashboardAccess,
    isInitializing,
  });

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
        {/* Header Section */}
        <CommentsHeader canCreate={canCreate} onCreateClick={handleCreateClick} />

        {/* Main Content */}
        <CommentsContent
          state={state}
          sortBy={sortBy}
          sortOrder={sortOrder}
          isSorting={isSorting}
          canEdit={canEdit}
          canDelete={canDelete}
          onSearch={handleSearch}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          onSort={handleSort}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

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
