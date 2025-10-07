import React, { useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { FaPlus } from 'react-icons/fa';
import { DashboardLayout } from '../../components/layout';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { ROUTE_PATHS } from '../../constants/routingConstants';
import { DashboardSkeleton } from '../../components/ui';
import {
  UserSearchInput,
  UsersTable,
  CreateUserModal,
  EditUserModal,
  DeleteUserModal
} from '../../components/userManagement';
import UsersTableSkeleton from '../../components/userManagement/UsersTableSkeleton';
import {
  GET_USERS_QUERY,
  CREATE_USER_MUTATION,
  UPDATE_USER_MUTATION,
  DELETE_USER_MUTATION
} from '../../services/graphql/userQueries';
import {
  User,
  UserInput,
  UserUpdateInput,
  UserManagementState
} from '../../types/userManagement';
import {
  DEFAULT_USERS_PAGINATION,
  USER_SUCCESS_MESSAGES,
  USER_ERROR_MESSAGES
} from '../../constants/userManagement';
import { InlineError } from '../../components/ui';

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
  const navigate = useNavigate();
  const { isInitializing } = useAuth();

  // State management
  const [state, setState] = useState<UserManagementState>({
    users: [],
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
    pageSize: DEFAULT_USERS_PAGINATION.limit,
    createModalOpen: false,
    editModalOpen: false,
    deleteModalOpen: false,
    selectedUser: null,
    error: null
  });

  // Sorting state
  const [sortBy, setSortBy] = useState<string>('id');
  const [sortOrder, setSortOrder] = useState<string>('ASC');

  // GraphQL queries and mutations
  const { data, loading: queryLoading, refetch } = useQuery(GET_USERS_QUERY, {
    variables: {
      limit: state.pageSize,
      offset: (state.currentPage - 1) * state.pageSize,
      search: state.searchQuery || undefined,
      sortBy,
      sortOrder
    },
    errorPolicy: 'all',
    notifyOnNetworkStatusChange: true
  });

  const [createUserMutation] = useMutation(CREATE_USER_MUTATION);
  const [updateUserMutation] = useMutation(UPDATE_USER_MUTATION);
  const [deleteUserMutation] = useMutation(DELETE_USER_MUTATION);

  /**
   * Update state when GraphQL data changes
   * Handles loading states and data updates
   */
  useEffect(() => {
    if (data?.users) {
      setState(prev => ({
        ...prev,
        users: data.users.users,
        paginationInfo: data.users.paginationInfo,
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
   * Fetch users with current parameters
   * Refetches data when pagination or search changes
   */
  const fetchUsers = useCallback(async (page: number, pageSize: number, search: string) => {
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
        error: USER_ERROR_MESSAGES.FETCH
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
    fetchUsers(1, pageSize, state.searchQuery);
  }, [fetchUsers, state.searchQuery]);

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
    fetchUsers(page, state.pageSize, state.searchQuery);
  }, [fetchUsers, state.pageSize, state.searchQuery]);

  /**
   * Create a new user
   * Handles form submission and success/error states
   */
  const handleCreateUser = useCallback(async (userData: UserInput) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      await createUserMutation({
        variables: { input: userData }
      });

      setState(prev => ({ ...prev, createModalOpen: false, loading: false }));
      await refetch();
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: USER_ERROR_MESSAGES.CREATE
      }));
    }
  }, [createUserMutation, refetch]);

  /**
   * Update an existing user
   * Handles form submission and success/error states
   */
  const handleUpdateUser = useCallback(async (userId: string, userData: UserUpdateInput) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      await updateUserMutation({
        variables: { id: userId, input: userData }
      });

      setState(prev => ({ ...prev, editModalOpen: false, loading: false }));
      await refetch();
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: USER_ERROR_MESSAGES.UPDATE
      }));
    }
  }, [updateUserMutation, refetch]);

  /**
   * Delete a user
   * Handles confirmation and success/error states
   */
  const handleDeleteUser = useCallback(async (userId: string) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      await deleteUserMutation({
        variables: { id: userId }
      });

      setState(prev => ({ ...prev, deleteModalOpen: false, loading: false }));
      await refetch();
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: USER_ERROR_MESSAGES.DELETE
      }));
    }
  }, [deleteUserMutation, refetch]);

  /**
   * Clear error message
   * Removes error state from UI
   */
  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  // Show unified skeleton during loading (both sidebar and content)
  if (state.loading && state.users.length === 0) {
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
                  Users Management
                </h1>
                <p className="text-gray-600 mt-1">
                  Manage and track your users
                </p>
              </div>
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                onClick={() => setState(prev => ({ ...prev, createModalOpen: true }))}
              >
                <FaPlus className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                Create User
              </button>
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
              <UserSearchInput
                value={state.searchQuery}
                onChange={handleSearchChange}
                loading={state.loading}
              />

              {/* Users Table */}
              <UsersTable
                users={state.users}
                paginationInfo={state.paginationInfo}
                loading={state.loading}
                onEdit={(user) => setState(prev => ({
                  ...prev,
                  editModalOpen: true,
                  selectedUser: user
                }))}
                onDelete={(user) => setState(prev => ({
                  ...prev,
                  deleteModalOpen: true,
                  selectedUser: user
                }))}
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

        {/* Modals */}
        <CreateUserModal
          isOpen={state.createModalOpen}
          onClose={() => setState(prev => ({ ...prev, createModalOpen: false }))}
          onSubmit={handleCreateUser}
          loading={state.loading}
        />

        <EditUserModal
          isOpen={state.editModalOpen}
          user={state.selectedUser}
          onClose={() => setState(prev => ({ ...prev, editModalOpen: false, selectedUser: null }))}
          onSubmit={handleUpdateUser}
          loading={state.loading}
        />

        <DeleteUserModal
          isOpen={state.deleteModalOpen}
          user={state.selectedUser}
          onClose={() => setState(prev => ({ ...prev, deleteModalOpen: false, selectedUser: null }))}
          onConfirm={handleDeleteUser}
          loading={state.loading}
        />
      </div>
    </DashboardLayout>
  );
};

export default UsersPage;