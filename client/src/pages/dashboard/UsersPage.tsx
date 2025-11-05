import React, { useState } from 'react';
import AccessDenied from '../../components/auth/AccessDenied';
import { DashboardLayout } from '../../components/layout';
import { DashboardSkeleton, InlineError } from '../../components/ui';
import { DEFAULT_USERS_PAGINATION } from '../../constants/userManagement';
import { useAuth } from '../../contexts/AuthContext';
import { useAuthDataReady } from '../../hooks/useAuthDataReady';
import { useRolePermissions } from '../../hooks/useRolePermissions';
import { UserDeletionCheck } from '../../types/userManagement';
import { UsersHeader, UsersContent, UsersModals } from './UsersPage/components';
import {
  useUsersState,
  useUsersQueries,
  useUsersMutations,
  useUsersHandlers,
} from './UsersPage/hooks';

/**
 * Users Dashboard Page
 * Complete user management interface with search, table, and CRUD operations
 * Features modern, professional layout with pagination and real-time search
 * Includes skeleton loading states for better UX during data fetching
 *
 * CALLED BY: AppRoutes component via ProtectedRoute
 * SCENARIOS: User management for administrators and project managers
 */
const UsersPage: React.FC = () => {
  const { isInitializing, showNotification } = useAuth();
  const { canCreate, canEdit, canDelete, hasDashboardAccess } = useRolePermissions();
  const isAuthDataReady = useAuthDataReady();

  // State for user deletion check
  const [deletionCheck, setDeletionCheck] = useState<UserDeletionCheck | null>(null);

  // State management
  const { state, setState, sortBy, setSortBy, sortOrder, setSortOrder } = useUsersState({
    initialPageSize: DEFAULT_USERS_PAGINATION.limit,
  });

  // GraphQL queries
  const { queryLoading, refetch } = useUsersQueries({
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

  // GraphQL mutations
  const { createUserMutation, updateUserMutation, deleteUserMutation, checkUserDeletion } =
    useUsersMutations();

  // Event handlers
  const {
    handleSearchChange,
    handlePageChange,
    handlePageSizeChange,
    handleSort,
    handleCreateUser,
    handleUpdateUser,
    handleDeleteUser,
    handleEditUser,
    handleDeleteUserClick,
    clearError,
    handleCreateClick,
    closeModals,
  } = useUsersHandlers({
    state,
    sortBy,
    sortOrder,
    setState,
    setSortBy,
    setSortOrder,
    refetch,
    createUserMutation,
    updateUserMutation,
    deleteUserMutation,
    checkUserDeletion,
    showNotification,
    setDeletionCheck,
  });

  // During auth initialization, show skeleton to avoid Access Denied flash
  if (isInitializing) {
    return <DashboardSkeleton />;
  }

  // Check if user has dashboard access
  if (!hasDashboardAccess) {
    return <AccessDenied feature="Users Management" />;
  }

  // Show skeleton only during initial data loading (not during auth init)
  if (queryLoading && (!state.users || state.users.length === 0)) {
    return <DashboardSkeleton />;
  }

  return (
    <DashboardLayout showSidebarSkeleton={false}>
      <div className="w-full h-full dashboard-content">
        {/* Header Section */}
        <UsersHeader canCreate={canCreate} onCreateClick={handleCreateClick} />

        {/* Main Content */}
        <UsersContent
          state={state}
          sortBy={sortBy}
          sortOrder={sortOrder}
          canEdit={canEdit}
          canDelete={canDelete}
          onSearchChange={handleSearchChange}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          onSort={handleSort}
          onEdit={handleEditUser}
          onDelete={handleDeleteUserClick}
        />

        {/* Error Display */}
        {state.error && (
          <div className="px-4 sm:px-6 lg:px-8 pb-6">
            <InlineError message={state.error} onDismiss={clearError} />
          </div>
        )}

        {/* Modals */}
        <UsersModals
          state={state}
          canCreate={canCreate}
          canEdit={canEdit}
          canDelete={canDelete}
          deletionCheck={deletionCheck}
          onCreateUser={handleCreateUser}
          onUpdateUser={handleUpdateUser}
          onDeleteUser={handleDeleteUser}
          onCloseModals={closeModals}
        />
      </div>
    </DashboardLayout>
  );
};

export default UsersPage;
