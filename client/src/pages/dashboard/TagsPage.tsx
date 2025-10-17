import React, { useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { FaPlus } from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';
import { useRolePermissions } from '../../hooks/useRolePermissions';
import AccessDenied from '../../components/auth/AccessDenied';
import { DashboardLayout } from '../../components/layout';
import { DashboardSkeleton } from '../../components/ui';
import {
  TagSearchInput,
  TagsTable,
  CreateTagModal,
  EditTagModal,
  DeleteTagModal,
} from '../../components/tagsManagement';
import {
  GET_DASHBOARD_TAGS_QUERY,
  CREATE_TAG_MUTATION,
  UPDATE_TAG_MUTATION,
  DELETE_TAG_MUTATION,
} from '../../services/graphql/tagsQueries';
import {
  DEFAULT_TAGS_PAGINATION,
  TAGS_SUCCESS_MESSAGES,
  TAGS_ERROR_MESSAGES,
} from '../../constants/tagsManagement';
import {
  Tag,
  TagInput,
  TagUpdateInput,
  PaginationInfo,
} from '../../types/tagsManagement';

/**
 * Tags Management Page
 * Follows UsersPage pattern for predictable loading and skeleton behavior
 * Features responsive design with improved mobile UX when sidebar is collapsed
 */
const TagsPage: React.FC = () => {
  const { showNotification, isInitializing, user } = useAuth();
  const { hasDashboardAccess } = useRolePermissions();

  // Centralized state (UsersPage pattern)
  const [state, setState] = useState({
    tags: [] as Tag[],
    paginationInfo: {
      hasNextPage: false,
      hasPreviousPage: false,
      totalCount: 0,
      currentPage: 1,
      totalPages: 0,
    } as PaginationInfo,
    loading: false,
    searchQuery: '',
    currentPage: 1,
    pageSize: DEFAULT_TAGS_PAGINATION.limit,
    createModalOpen: false,
    editModalOpen: false,
    deleteModalOpen: false,
    selectedTag: null as Tag | null,
    error: null as string | null,
  });

  // Sorting state
  const [sortBy, setSortBy] = useState(DEFAULT_TAGS_PAGINATION.sortBy);
  const [sortOrder, setSortOrder] = useState(DEFAULT_TAGS_PAGINATION.sortOrder);

  // Query
  const { data, loading: queryLoading, refetch } = useQuery(GET_DASHBOARD_TAGS_QUERY, {
    variables: {
      limit: state.pageSize,
      offset: (state.currentPage - 1) * state.pageSize,
      search: state.searchQuery || undefined,
      sortBy,
      sortOrder,
    },
    errorPolicy: 'all',
    fetchPolicy: 'cache-and-network',
    notifyOnNetworkStatusChange: true,
    skip: isInitializing || !hasDashboardAccess || !user,
  });

  // Sync state from GraphQL
  useEffect(() => {
    if (data?.dashboardTags) {
      setState(prev => ({
        ...prev,
        tags: data.dashboardTags.tags,
        paginationInfo: data.dashboardTags.paginationInfo,
        loading: queryLoading,
      }));
    } else {
      setState(prev => ({ ...prev, loading: queryLoading }));
    }
  }, [data, queryLoading]);

  // Fetch helper
  const fetchTags = useCallback(async (page: number, pageSize: number, search: string) => {
    try {
      await refetch({
        limit: pageSize,
        offset: (page - 1) * pageSize,
        search: search || undefined,
        sortBy,
        sortOrder,
      });
    } catch (error) {
      setState(prev => ({ ...prev, error: TAGS_ERROR_MESSAGES.FETCH }));
    }
  }, [refetch, sortBy, sortOrder]);

  // Handlers
  const handleSearchChange = useCallback((searchTerm: string) => {
    setState(prev => ({ ...prev, searchQuery: searchTerm, currentPage: 1 }));
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setState(prev => ({ ...prev, currentPage: page }));
    fetchTags(page, state.pageSize, state.searchQuery);
  }, [fetchTags, state.pageSize, state.searchQuery]);

  const handlePageSizeChange = useCallback((newPageSize: number) => {
    setState(prev => ({ ...prev, pageSize: newPageSize, currentPage: 1 }));
    fetchTags(1, newPageSize, state.searchQuery);
  }, [fetchTags, state.searchQuery]);

  const handleSort = useCallback((newSortBy: string, newSortOrder: string) => {
    setSortBy(newSortBy);
    setSortOrder(newSortOrder);
    setState(prev => ({ ...prev, currentPage: 1 }));
  }, []);

  // Mutations
  const [createTagMutation] = useMutation(CREATE_TAG_MUTATION);
  const [updateTagMutation] = useMutation(UPDATE_TAG_MUTATION);
  const [deleteTagMutation] = useMutation(DELETE_TAG_MUTATION);

  const handleCreateTag = useCallback(async (input: TagInput) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      await createTagMutation({ variables: { input } });
      setState(prev => ({ ...prev, createModalOpen: false, loading: false }));
      await refetch();
      showNotification(TAGS_SUCCESS_MESSAGES.CREATE, 'success');
    } catch (error: any) {
      setState(prev => ({ ...prev, loading: false, error: TAGS_ERROR_MESSAGES.CREATE }));
      showNotification(error.message || TAGS_ERROR_MESSAGES.CREATE, 'error');
    }
  }, [createTagMutation, refetch, showNotification]);

  const handleUpdateTag = useCallback(async (id: string, input: TagUpdateInput) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      await updateTagMutation({ variables: { id, input } });
      setState(prev => ({ ...prev, editModalOpen: false, loading: false, selectedTag: null }));
      await refetch();
      showNotification(TAGS_SUCCESS_MESSAGES.UPDATE, 'success');
    } catch (error: any) {
      setState(prev => ({ ...prev, loading: false, error: TAGS_ERROR_MESSAGES.UPDATE }));
      showNotification(error.message || TAGS_ERROR_MESSAGES.UPDATE, 'error');
    }
  }, [updateTagMutation, refetch, showNotification]);

  const handleDeleteTag = useCallback(async (id: string) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      await deleteTagMutation({ variables: { id } });
      setState(prev => ({ ...prev, deleteModalOpen: false, loading: false, selectedTag: null }));
      await refetch();
      showNotification(TAGS_SUCCESS_MESSAGES.DELETE, 'success');
    } catch (error: any) {
      setState(prev => ({ ...prev, loading: false, error: TAGS_ERROR_MESSAGES.DELETE }));
      showNotification(error.message || TAGS_ERROR_MESSAGES.DELETE, 'error');
    }
  }, [deleteTagMutation, refetch, showNotification]);

  const handleEditTag = useCallback((tag: Tag) => {
    setState(prev => ({ ...prev, selectedTag: tag, editModalOpen: true }));
  }, []);

  const handleDeleteTagClick = useCallback((tag: Tag) => {
    setState(prev => ({ ...prev, selectedTag: tag, deleteModalOpen: true } as any));
  }, []);

  const closeModals = useCallback(() => {
    setState(prev => ({ ...prev, createModalOpen: false, editModalOpen: false, deleteModalOpen: false, selectedTag: null }));
  }, []);

  // Auth init skeleton
  if (isInitializing) {
    return <DashboardSkeleton />;
  }

  // Access control
  if (!hasDashboardAccess) {
    return <AccessDenied feature="Tags Management" />;
  }

  // Initial data load skeleton
  if (queryLoading && (!state.tags || state.tags.length === 0)) {
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
                  Tags Management
                </h1>
                <p className="text-sm sm:text-base text-gray-600 mt-1">
                  Manage and organize tags for task categorization
                </p>
              </div>
              {/* Create Tag Button - Centered icon and text for better mobile UX when sidebar is collapsed */}
              <button
                type="button"
                onClick={() => setState(prev => ({ ...prev, createModalOpen: true }))}
                className="inline-flex items-center justify-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 w-full sm:w-auto sm:flex-shrink-0"
              >
                <FaPlus className="h-5 w-5" aria-hidden="true" />
                <span className="ml-2">Create Tag</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="w-full">
          <div className="px-8 py-8 w-full">
            {/* Search and Table */}
            <div className="space-y-6">
              <TagSearchInput
                onSearch={handleSearchChange}
                placeholder="Search tags..."
                loading={state.loading}
              />

              <TagsTable
                tags={state.tags}
                loading={state.loading}
                paginationInfo={state.paginationInfo}
                pageSize={state.pageSize}
                onPageChange={handlePageChange}
                onPageSizeChange={handlePageSizeChange}
                onSort={handleSort}
                currentSortBy={sortBy}
                currentSortOrder={sortOrder}
                onEdit={handleEditTag}
                onDelete={handleDeleteTagClick}
              />
            </div>
          </div>
        </div>

        {/* Modals */}
        <CreateTagModal
          isOpen={state.createModalOpen}
          onClose={closeModals}
          onCreate={handleCreateTag}
          loading={state.loading}
        />

        <EditTagModal
          isOpen={state.editModalOpen}
          onClose={closeModals}
          onUpdate={handleUpdateTag}
          tag={state.selectedTag}
          loading={state.loading}
        />

        <DeleteTagModal
          isOpen={state.deleteModalOpen}
          onClose={closeModals}
          onDelete={() => state.selectedTag && handleDeleteTag(state.selectedTag.id)}
          tag={state.selectedTag}
          loading={state.loading}
        />
      </div>
    </DashboardLayout>
  );
};

export default TagsPage;