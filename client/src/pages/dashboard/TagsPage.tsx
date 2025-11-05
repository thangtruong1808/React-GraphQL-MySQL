import React from 'react';
import AccessDenied from '../../components/auth/AccessDenied';
import { DashboardLayout } from '../../components/layout';
import { DashboardSkeleton, InlineError } from '../../components/ui';
import { DEFAULT_TAGS_PAGINATION } from '../../constants/tagsManagement';
import { useAuth } from '../../contexts/AuthContext';
import { useAuthDataReady } from '../../hooks/useAuthDataReady';
import { useRolePermissions } from '../../hooks/useRolePermissions';
import { TagsHeader, TagsContent, TagsModals } from './TagsPage/components';
import {
  useTagsState,
  useTagsQueries,
  useTagsMutations,
  useTagsHandlers,
} from './TagsPage/hooks';

/**
 * Tags Management Page
 * Follows UsersPage pattern for predictable loading and skeleton behavior
 * Features responsive design with improved mobile UX when sidebar is collapsed
 */
const TagsPage: React.FC = () => {
  const { showNotification, isInitializing, user } = useAuth();
  const { canCreate, canEdit, canDelete, hasDashboardAccess } = useRolePermissions();
  const isAuthDataReady = useAuthDataReady();

  // State management
  const { state, setState, sortBy, setSortBy, sortOrder, setSortOrder } = useTagsState({
    initialPageSize: DEFAULT_TAGS_PAGINATION.limit,
  });

  // GraphQL queries
  const { queryLoading, refetch } = useTagsQueries({
    pageSize: state.pageSize,
    currentPage: state.currentPage,
    searchQuery: state.searchQuery,
    sortBy,
    sortOrder,
    isInitializing,
    hasDashboardAccess,
    user,
    isAuthDataReady,
    setState,
  });

  // GraphQL mutations
  const { createTagMutation, updateTagMutation, deleteTagMutation } = useTagsMutations();

  // Event handlers
  const {
    handleSearchChange,
    handlePageChange,
    handlePageSizeChange,
    handleSort,
    handleCreateTag,
    handleUpdateTag,
    handleDeleteTag,
    handleEditTag,
    handleDeleteTagClick,
    closeModals,
    handleCreateClick,
  } = useTagsHandlers({
    state,
    sortBy,
    sortOrder,
    setState,
    setSortBy,
    setSortOrder,
    refetch,
    createTagMutation,
    updateTagMutation,
    deleteTagMutation,
    showNotification,
  });

  // During auth initialization, show skeleton instead of AccessDenied to avoid flash
  if (isInitializing) {
    return <DashboardSkeleton />;
  }

  // Check if user has dashboard access (after initialization)
  if (!hasDashboardAccess) {
    return <AccessDenied feature="Tags Management" />;
  }

  // Initial data load skeleton (avoid double sidebar like UsersPage)
  if (queryLoading && (!state.tags || state.tags.length === 0)) {
    return <DashboardSkeleton />;
  }

  return (
    <DashboardLayout showSidebarSkeleton={false}>
      <div className="w-full h-full dashboard-content">
        {/* Header Section */}
        <TagsHeader canCreate={canCreate} onCreateClick={handleCreateClick} />

        {/* Main Content */}
        <TagsContent
          state={state}
          sortBy={sortBy}
          sortOrder={sortOrder}
          canEdit={canEdit}
          canDelete={canDelete}
          onSearchChange={handleSearchChange}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          onSort={handleSort}
          onEdit={handleEditTag}
          onDelete={handleDeleteTagClick}
        />

        {/* Error Display */}
        {state.error && (
          <div className="px-4 sm:px-6 lg:px-8 pb-6">
            <InlineError
              message={state.error}
              onDismiss={() => setState(prev => ({ ...prev, error: null }))}
            />
          </div>
        )}

        {/* Modals */}
        <TagsModals
          state={state}
          onCreateTag={handleCreateTag}
          onUpdateTag={handleUpdateTag}
          onDeleteTag={handleDeleteTag}
          onCloseModals={closeModals}
        />
      </div>
    </DashboardLayout>
  );
};

export default TagsPage;
