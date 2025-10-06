import React, { useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { FaPlus } from 'react-icons/fa';
import { DashboardLayout } from '../../components/layout';
import { useNavigate } from 'react-router-dom';
import { ROUTE_PATHS } from '../../constants/routingConstants';
import {
  UserSearchInput,
  UsersTable,
  CreateUserModal,
  EditUserModal,
  DeleteUserModal
} from '../../components/userManagement';
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
 * 
 * CALLED BY: AppRoutes component via ProtectedRoute
 * SCENARIOS: User management for administrators and project managers
 */
const UsersPage: React.FC = () => {
  const navigate = useNavigate();
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
  const [sortBy, setSortBy] = useState<string>('createdAt');
  const [sortOrder, setSortOrder] = useState<string>('DESC');

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

  // Update state when query data changes
  useEffect(() => {
    if (data?.users) {
      setState(prev => ({
        ...prev,
        users: data.users.users,
        paginationInfo: data.users.paginationInfo,
        loading: queryLoading
      }));
    }
  }, [data, queryLoading]);

  /**
   * Fetch users with current parameters
   * Refetches data when pagination or search changes
   */
  const fetchUsers = useCallback(async (page?: number, pageSize?: number, search?: string) => {
    const currentPage = page || state.currentPage;
    const currentPageSize = pageSize || state.pageSize;
    const currentSearch = search !== undefined ? search : state.searchQuery;

    try {
      await refetch({
        limit: currentPageSize,
        offset: (currentPage - 1) * currentPageSize,
        search: currentSearch || undefined
      });
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: USER_ERROR_MESSAGES.fetchFailed
      }));
    }
  }, [state.currentPage, state.pageSize, state.searchQuery, refetch]);

  /**
   * Create new user
   * Handles user creation with success/error feedback
   */
  const createUser = useCallback(async (userData: UserInput) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      await createUserMutation({
        variables: { input: userData }
      });

      // Refresh users list
      await fetchUsers(1, state.pageSize, state.searchQuery);

      setState(prev => ({ ...prev, loading: false }));
      // Success message would be shown via toast notification
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: USER_ERROR_MESSAGES.createFailed
      }));
    }
  }, [createUserMutation, fetchUsers, state.pageSize, state.searchQuery]);

  /**
   * Update existing user
   * Handles user updates with success/error feedback
   */
  const updateUser = useCallback(async (userId: string, userData: UserUpdateInput) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      await updateUserMutation({
        variables: { id: userId, input: userData }
      });

      // Refresh users list
      await fetchUsers(state.currentPage, state.pageSize, state.searchQuery);

      setState(prev => ({ ...prev, loading: false }));
      // Success message would be shown via toast notification
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: USER_ERROR_MESSAGES.updateFailed
      }));
    }
  }, [updateUserMutation, fetchUsers, state.currentPage, state.pageSize, state.searchQuery]);

  /**
   * Delete user
   * Handles user deletion with confirmation
   */
  const deleteUser = useCallback(async (userId: string) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      await deleteUserMutation({
        variables: { id: userId }
      });

      // Refresh users list
      await fetchUsers(state.currentPage, state.pageSize, state.searchQuery);

      setState(prev => ({ ...prev, loading: false }));
      // Success message would be shown via toast notification
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: USER_ERROR_MESSAGES.deleteFailed
      }));
    }
  }, [deleteUserMutation, fetchUsers, state.currentPage, state.pageSize, state.searchQuery]);

  /**
   * Handle search query change
   * Debounced search with automatic refetch
   */
  const handleSearchChange = useCallback((query: string) => {
    setState(prev => ({ ...prev, searchQuery: query, currentPage: 1 }));
    fetchUsers(1, state.pageSize, query);
  }, [fetchUsers, state.pageSize]);

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
   * Clear error message
   * Removes error state
   */
  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  return (
    <DashboardLayout>
      <div className="w-full h-full bg-gray-50 dashboard-content">
        {/* Header Section */}
        <div className="bg-white border-b border-gray-200 w-full">
          <div className="px-8 py-8 w-full">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Users Management
                </h1>
                <p className="text-gray-600 mt-1">
                  Manage users and team members
                </p>
              </div>
              <button
                onClick={() => navigate(ROUTE_PATHS.DASHBOARD_USERS_CREATE)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors duration-150"
              >
                <FaPlus className="h-5 w-5 mr-2" />
                Create User
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="px-8 py-8 w-full">
          {/* Error Display */}
          {state.error && (
            <div className="mb-6">
              <InlineError message={state.error} onDismiss={clearError} />
            </div>
          )}

          {/* Search Section */}
          <div className="mb-6">
            <UserSearchInput
              value={state.searchQuery}
              onChange={handleSearchChange}
              loading={state.loading}
            />
          </div>

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

        {/* Modals */}
        <CreateUserModal
          isOpen={state.createModalOpen}
          onClose={() => setState(prev => ({ ...prev, createModalOpen: false }))}
          onSubmit={createUser}
          loading={state.loading}
        />

        <EditUserModal
          isOpen={state.editModalOpen}
          user={state.selectedUser}
          onClose={() => setState(prev => ({
            ...prev,
            editModalOpen: false,
            selectedUser: null
          }))}
          onSubmit={updateUser}
          loading={state.loading}
        />

        <DeleteUserModal
          isOpen={state.deleteModalOpen}
          user={state.selectedUser}
          onClose={() => setState(prev => ({
            ...prev,
            deleteModalOpen: false,
            selectedUser: null
          }))}
          onConfirm={deleteUser}
          loading={state.loading}
        />
      </div>
    </DashboardLayout>
  );
};

export default UsersPage;