/**
 * Types for CommentsPage component
 * Defines all interfaces and types used in comments page management
 */

import { Comment, GetDashboardCommentsQueryVariables } from '../../../services/graphql/commentQueries';
import { CommentFormData } from '../../../types/commentManagement';

export interface CommentsPageState {
  comments: Comment[];
  paginationInfo: {
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    totalCount: number;
    currentPage: number;
    totalPages: number;
  };
  loading: boolean;
  searchTerm: string;
  currentPage: number;
  pageSize: number;
  createModalOpen: boolean;
  editModalOpen: boolean;
  deleteModalOpen: boolean;
  selectedComment: Comment | null;
  error: string | null;
}

export interface UseCommentsStateDependencies {
  initialPageSize: number;
}

export interface UseCommentsQueriesDependencies {
  pageSize: number;
  currentPage: number;
  searchTerm: string;
  sortBy: string;
  sortOrder: 'ASC' | 'DESC';
  isInitializing: boolean;
  hasDashboardAccess: boolean;
  user: any;
  isAuthDataReady: boolean;
}

export interface UseCommentsMutationsDependencies {
  showNotification: (message: string, type: 'success' | 'error' | 'info') => void;
}

export interface UseCommentsHandlersDependencies {
  state: CommentsPageState;
  sortBy: string;
  sortOrder: 'ASC' | 'DESC';
  isSorting: boolean;
  setState: React.Dispatch<React.SetStateAction<CommentsPageState>>;
  setSortBy: (sortBy: string) => void;
  setSortOrder: (sortOrder: 'ASC' | 'DESC') => void;
  setIsSorting: (isSorting: boolean) => void;
  setCreateLoading: (loading: boolean) => void;
  setUpdateLoading: (loading: boolean) => void;
  setDeleteLoading: (loading: boolean) => void;
  refetch: (variables?: Partial<GetDashboardCommentsQueryVariables>) => Promise<any>;
  createCommentMutation: (options: { variables: { input: { content: string; projectId: string } } }) => Promise<any>;
  updateCommentMutation: (options: { variables: { id: string; input: { content: string } } }) => Promise<any>;
  deleteCommentMutation: (options: { variables: { id: string } }) => Promise<any>;
  showNotification: (message: string, type: 'success' | 'error' | 'info') => void;
  user: any;
  hasDashboardAccess: boolean;
  isInitializing: boolean;
}

export interface CommentsHeaderProps {
  canCreate: boolean;
  onCreateClick: () => void;
}

export interface CommentsContentProps {
  state: CommentsPageState;
  sortBy: string;
  sortOrder: 'ASC' | 'DESC';
  isSorting: boolean;
  canEdit: boolean;
  canDelete: boolean;
  onSearch: (search: string) => void;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  onSort: (newSortBy: string, newSortOrder: string) => Promise<void>;
  onEdit: (comment: Comment) => void;
  onDelete: (comment: Comment) => void;
}

export type { Comment, CommentFormData };

