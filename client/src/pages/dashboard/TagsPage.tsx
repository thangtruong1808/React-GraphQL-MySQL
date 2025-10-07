import React, { useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { useAuth } from '../../contexts/AuthContext';
import { DashboardLayout } from '../../components/layout';
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
 * Main page for managing tags with search, table display, pagination, and CRUD operations
 * Features comprehensive tags management functionality
 */
const TagsPage: React.FC = () => {
  // Get notification function from auth context
  const { showNotification } = useAuth();

  // State management
  const [tags, setTags] = useState<Tag[]>([]);
  const [paginationInfo, setPaginationInfo] = useState<PaginationInfo>({
    hasNextPage: false,
    hasPreviousPage: false,
    totalCount: 0,
    currentPage: 1,
    totalPages: 1,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_TAGS_PAGINATION.limit);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState(DEFAULT_TAGS_PAGINATION.sortBy);
  const [sortOrder, setSortOrder] = useState(DEFAULT_TAGS_PAGINATION.sortOrder);
  const [selectedTag, setSelectedTag] = useState<Tag | null>(null);

  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // GraphQL queries and mutations
  const { loading, refetch } = useQuery(GET_DASHBOARD_TAGS_QUERY, {
    variables: {
      limit: pageSize,
      offset: (currentPage - 1) * pageSize,
      search: searchQuery || undefined,
      sortBy,
      sortOrder,
    },
    onCompleted: (data) => {
      setTags(data.dashboardTags.tags);
      setPaginationInfo(data.dashboardTags.paginationInfo);
    },
    onError: (error) => {
      console.error('Error fetching tags:', error);
      showNotification(TAGS_ERROR_MESSAGES.FETCH, 'error');
    },
    fetchPolicy: 'cache-and-network',
  });

  const [createTag] = useMutation(CREATE_TAG_MUTATION);
  const [updateTag] = useMutation(UPDATE_TAG_MUTATION);
  const [deleteTag] = useMutation(DELETE_TAG_MUTATION);

  // Handle search
  const handleSearch = useCallback((searchTerm: string) => {
    setSearchQuery(searchTerm);
    setCurrentPage(1); // Reset to first page when searching
  }, []);

  // Handle pagination
  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const handlePageSizeChange = useCallback((newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(1); // Reset to first page when changing page size
  }, []);

  // Handle sorting
  const handleSort = useCallback((newSortBy: string, newSortOrder: string) => {
    setSortBy(newSortBy);
    setSortOrder(newSortOrder);
    setCurrentPage(1); // Reset to first page when sorting
  }, []);

  // Handle create tag
  const handleCreateTag = useCallback(async (input: TagInput) => {
    try {
      await createTag({
        variables: { input },
        update: (cache, { data }) => {
          if (data?.createTag) {
            // Refetch tags to update the list
            refetch();
          }
        },
      });
      showNotification(TAGS_SUCCESS_MESSAGES.CREATE, 'success');
    } catch (error: any) {
      console.error('Error creating tag:', error);
      showNotification(error.message || TAGS_ERROR_MESSAGES.CREATE, 'error');
      throw error;
    }
  }, [createTag, refetch, showNotification]);

  // Handle update tag
  const handleUpdateTag = useCallback(async (id: string, input: TagUpdateInput) => {
    try {
      await updateTag({
        variables: { id, input },
        update: (cache, { data }) => {
          if (data?.updateTag) {
            // Refetch tags to update the list
            refetch();
          }
        },
      });
      showNotification(TAGS_SUCCESS_MESSAGES.UPDATE, 'success');
    } catch (error: any) {
      console.error('Error updating tag:', error);
      showNotification(error.message || TAGS_ERROR_MESSAGES.UPDATE, 'error');
      throw error;
    }
  }, [updateTag, refetch, showNotification]);

  // Handle delete tag
  const handleDeleteTag = useCallback(async (id: string) => {
    try {
      await deleteTag({
        variables: { id },
        update: (cache, { data }) => {
          if (data?.deleteTag) {
            // Refetch tags to update the list
            refetch();
          }
        },
      });
      showNotification(TAGS_SUCCESS_MESSAGES.DELETE, 'success');
    } catch (error: any) {
      console.error('Error deleting tag:', error);
      showNotification(error.message || TAGS_ERROR_MESSAGES.DELETE, 'error');
      throw error;
    }
  }, [deleteTag, refetch, showNotification]);

  // Handle edit tag
  const handleEditTag = useCallback((tag: Tag) => {
    setSelectedTag(tag);
    setIsEditModalOpen(true);
  }, []);

  // Handle delete tag
  const handleDeleteTagClick = useCallback((tag: Tag) => {
    setSelectedTag(tag);
    setIsDeleteModalOpen(true);
  }, []);

  // Close modals
  const closeModals = useCallback(() => {
    setIsCreateModalOpen(false);
    setIsEditModalOpen(false);
    setIsDeleteModalOpen(false);
    setSelectedTag(null);
  }, []);

  return (
    <DashboardLayout>
      <div className="w-full h-full dashboard-content">
        {/* Header Section */}
        <div className="bg-white border-b border-gray-200 w-full">
          <div className="px-8 py-8 w-full">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Tags Management
                </h1>
                <p className="text-gray-600 mt-1">
                  Manage and organize tags for task categorization
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
              >
                <svg className="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Create Tag
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="w-full">
          <div className="px-8 py-8 w-full">
            {/* Search and Table */}
            <div className="space-y-6">
              {/* Search Input */}
              <TagSearchInput
                onSearch={handleSearch}
                placeholder="Search tags..."
                loading={loading}
              />

              {/* Tags Table */}
              <TagsTable
                tags={tags}
                loading={loading}
                paginationInfo={paginationInfo}
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
          isOpen={isCreateModalOpen}
          onClose={closeModals}
          onCreate={handleCreateTag}
          loading={loading}
        />

        <EditTagModal
          isOpen={isEditModalOpen}
          onClose={closeModals}
          onUpdate={handleUpdateTag}
          tag={selectedTag}
          loading={loading}
        />

        <DeleteTagModal
          isOpen={isDeleteModalOpen}
          onClose={closeModals}
          onDelete={handleDeleteTag}
          tag={selectedTag}
          loading={loading}
        />
      </div>
    </DashboardLayout>
  );
};

export default TagsPage;