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
        {/* Enhanced Header Section */}
        <div className="w-full" style={{ background: 'var(--bg-base)' }}>
          <div className="px-4 sm:px-6 lg:px-8 py-8 sm:py-12 w-full">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--accent-from)', opacity: 0.1 }}>
                    <FaPlus className="h-5 w-5" style={{ color: 'var(--accent-from)' }} />
                  </div>
                  <h1 className="text-3xl sm:text-4xl font-bold" style={{ color: 'var(--text-primary)' }}>
                    Tags Management
                  </h1>
                </div>
                <p className="text-lg mt-2" style={{ color: 'var(--text-secondary)' }}>
                  Organize and manage tags for efficient task categorization
                </p>
              </div>
              {/* Create Tag Button */}
              <button
                type="button"
                onClick={() => setState(prev => ({ ...prev, createModalOpen: true }))}
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent shadow-lg text-sm font-semibold rounded-xl transition-all duration-200 w-full sm:w-auto sm:flex-shrink-0 transform hover:scale-105"
                style={{ 
                  backgroundColor: 'var(--button-primary-bg)', 
                  color: 'var(--button-primary-text)',
                  borderColor: 'var(--button-primary-bg)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--button-primary-hover-bg)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--button-primary-bg)';
                }}
              >
                <FaPlus className="h-5 w-5 mr-2" aria-hidden="true" />
                <span className="hidden xs:inline">Create New Tag</span>
                <span className="xs:hidden">Create Tag</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="w-full min-h-screen" style={{ background: 'var(--bg-base)' }}>
          <div className="px-4 sm:px-6 lg:px-8 py-8 w-full">
            <div className="space-y-8">
              {/* Search Section */}
              <div className="rounded-xl shadow-sm p-6" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)', borderWidth: '1px' }}>
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'var(--accent-from)', opacity: 0.1 }}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'var(--accent-from)' }}>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>Search Tags</h2>
                </div>
                <TagSearchInput
                  onSearch={handleSearchChange}
                  placeholder="Search by name, description, type, or category..."
                  loading={state.loading}
                />
              </div>

              {/* Table Section */}
              <div className="rounded-xl shadow-sm overflow-hidden" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)', borderWidth: '1px' }}>
                <div className="px-6 py-4" style={{ backgroundColor: 'var(--table-header-bg)', borderBottomColor: 'var(--border-color)', borderBottomWidth: '1px' }}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'var(--accent-from)', opacity: 0.1 }}>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'var(--accent-from)' }}>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                      </div>
                      <h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>Tags List</h2>
                      <span className="px-2 py-1 text-xs font-medium rounded-full" style={{ backgroundColor: 'var(--badge-primary-bg)', color: 'var(--badge-primary-text)' }}>
                        {state.paginationInfo.totalCount} total
                      </span>
                    </div>
                  </div>
                </div>
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