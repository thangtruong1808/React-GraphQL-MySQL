import React, { useState, useCallback } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { DashboardLayout } from '../../components/layout';
import { useError } from '../../contexts/ErrorContext';
import { useAuth } from '../../contexts/AuthContext';
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
  CommentFormData,
  GetDashboardCommentsQueryVariables,
} from '../../services/graphql/commentQueries';
import { DEFAULT_COMMENTS_PAGINATION, PAGE_SIZE_OPTIONS } from '../../constants/commentManagement';

/**
 * Comments Dashboard Page
 * Comprehensive management page for comments with search, table display, pagination, and CRUD operations
 * Accessible to all authenticated users
 */
const CommentsPage: React.FC = () => {
  const { showError, showSuccess } = useError();
  const { user } = useAuth();

  // State management
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState(DEFAULT_COMMENTS_PAGINATION.sortBy);
  const [sortOrder, setSortOrder] = useState(DEFAULT_COMMENTS_PAGINATION.sortOrder);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_COMMENTS_PAGINATION.limit);

  // Modal states
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedComment, setSelectedComment] = useState<Comment | null>(null);

  // Loading states
  const [createLoading, setCreateLoading] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Calculate offset for pagination
  const offset = (currentPage - 1) * pageSize;

  // GraphQL query variables
  const queryVariables: GetDashboardCommentsQueryVariables = {
    limit: pageSize,
    offset,
    search: searchTerm || undefined,
    sortBy,
    sortOrder,
  };

  // Fetch comments
  const { data, loading, error, refetch } = useQuery(GET_DASHBOARD_COMMENTS_QUERY, {
    variables: queryVariables,
    errorPolicy: 'all',
    fetchPolicy: 'cache-and-network',
  });

  // Mutations
  const [createCommentMutation] = useMutation(CREATE_COMMENT_MUTATION);
  const [updateCommentMutation] = useMutation(UPDATE_COMMENT_MUTATION);
  const [deleteCommentMutation] = useMutation(DELETE_COMMENT_MUTATION);

  // Handle search
  const handleSearch = useCallback((search: string) => {
    setSearchTerm(search);
    setCurrentPage(1); // Reset to first page when searching
  }, []);

  // Handle sort
  const handleSort = useCallback((newSortBy: string, newSortOrder: string) => {
    setSortBy(newSortBy);
    setSortOrder(newSortOrder);
    setCurrentPage(1); // Reset to first page when sorting
  }, []);

  // Handle page change
  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  // Handle page size change
  const handlePageSizeChange = useCallback((newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(1); // Reset to first page when changing page size
  }, []);

  // Handle edit comment
  const handleEdit = useCallback((comment: Comment) => {
    setSelectedComment(comment);
    setEditModalOpen(true);
  }, []);

  // Handle delete comment
  const handleDelete = useCallback((comment: Comment) => {
    setSelectedComment(comment);
    setDeleteModalOpen(true);
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

      showSuccess('Comment created successfully');
      setCreateModalOpen(false);
      refetch();
    } catch (error: any) {
      showError(error.message || 'Failed to create comment');
    } finally {
      setCreateLoading(false);
    }
  }, [createCommentMutation, showSuccess, showError, refetch]);

  // Handle update comment
  const handleUpdateComment = useCallback(async (formData: CommentFormData) => {
    if (!selectedComment) return;

    setUpdateLoading(true);
    try {
      await updateCommentMutation({
        variables: {
          id: selectedComment.id,
          input: {
            content: formData.content,
          },
        },
      });

      showSuccess('Comment updated successfully');
      setEditModalOpen(false);
      setSelectedComment(null);
      refetch();
    } catch (error: any) {
      showError(error.message || 'Failed to update comment');
    } finally {
      setUpdateLoading(false);
    }
  }, [selectedComment, updateCommentMutation, showSuccess, showError, refetch]);

  // Handle delete comment
  const handleDeleteComment = useCallback(async () => {
    if (!selectedComment) return;

    setDeleteLoading(true);
    try {
      await deleteCommentMutation({
        variables: {
          id: selectedComment.id,
        },
      });

      showSuccess('Comment deleted successfully');
      setDeleteModalOpen(false);
      setSelectedComment(null);
      refetch();
    } catch (error: any) {
      showError(error.message || 'Failed to delete comment');
    } finally {
      setDeleteLoading(false);
    }
  }, [selectedComment, deleteCommentMutation, showSuccess, showError, refetch]);

  // Handle modal close
  const handleCloseModals = useCallback(() => {
    setCreateModalOpen(false);
    setEditModalOpen(false);
    setDeleteModalOpen(false);
    setSelectedComment(null);
  }, []);

  // Get comments and pagination info from query result
  const comments = data?.dashboardComments?.comments || [];
  const paginationInfo = data?.dashboardComments?.paginationInfo || {
    hasNextPage: false,
    hasPreviousPage: false,
    totalCount: 0,
    currentPage: 1,
    totalPages: 1,
  };

  return (
    <DashboardLayout>
      <div className="w-full h-full dashboard-content">
        {/* Header Section */}
        <div className="border-b border-gray-200 w-full">
          <div className="px-8 py-8 w-full">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Comments Management
                </h1>
                <p className="text-gray-600 mt-1">
                  Manage comments and discussions across all tasks and projects
                </p>
              </div>
              <div className="flex items-center space-x-4">
                {/* Page Size Selector */}
                <div className="flex items-center space-x-2">
                  <label htmlFor="pageSize" className="text-sm font-medium text-gray-700">
                    Show:
                  </label>
                  <select
                    id="pageSize"
                    value={pageSize}
                    onChange={(e) => handlePageSizeChange(Number(e.target.value))}
                    className="block w-32 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  >
                    {PAGE_SIZE_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Create Comment Button */}
                <button
                  onClick={() => setCreateModalOpen(true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Create Comment
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="w-full">
          <div className="px-8 py-8 w-full">
            <div className="space-y-6">
              {/* Search Input */}
              <CommentSearchInput
                value={searchTerm}
                onChange={setSearchTerm}
                onSearch={handleSearch}
                loading={loading}
              />

              {/* Comments Table */}
              <CommentsTable
                comments={comments}
                loading={loading}
                paginationInfo={paginationInfo}
                onPageChange={handlePageChange}
                onPageSizeChange={handlePageSizeChange}
                onSort={handleSort}
                currentSortBy={sortBy}
                currentSortOrder={sortOrder}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            </div>
          </div>
        </div>

        {/* Modals */}
        <CreateCommentModal
          isOpen={createModalOpen}
          onClose={handleCloseModals}
          onSubmit={handleCreateComment}
          loading={createLoading}
        />

        <EditCommentModal
          isOpen={editModalOpen}
          onClose={handleCloseModals}
          onSubmit={handleUpdateComment}
          comment={selectedComment}
          loading={updateLoading}
        />

        <DeleteCommentModal
          isOpen={deleteModalOpen}
          onClose={handleCloseModals}
          onConfirm={handleDeleteComment}
          comment={selectedComment}
          loading={deleteLoading}
        />
      </div>
    </DashboardLayout>
  );
};

export default CommentsPage;
