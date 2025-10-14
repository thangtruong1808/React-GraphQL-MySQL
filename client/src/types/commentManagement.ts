/**
 * TypeScript Types for Comment Management
 * Defines interfaces and types for comment management components
 */

import { Comment, PaginationInfo } from '../services/graphql/commentQueries';

// Props for CommentsTable component
export interface CommentsTableProps {
  comments: Comment[];
  loading: boolean;
  paginationInfo: PaginationInfo;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  currentPageSize: number;
  onSort: (sortBy: string, sortOrder: string) => void;
  currentSortBy: string;
  currentSortOrder: string;
  onEdit: (comment: Comment) => void;
  onDelete: (comment: Comment) => void;
}

// Props for CommentSearchInput component
export interface CommentSearchInputProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: (searchTerm: string) => void;
  placeholder?: string;
  loading?: boolean;
}

// Props for CreateCommentModal component
export interface CreateCommentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CommentFormData) => void;
  loading?: boolean;
}

// Props for EditCommentModal component
export interface EditCommentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CommentFormData) => void;
  comment: Comment | null;
  loading?: boolean;
}

// Props for DeleteCommentModal component
export interface DeleteCommentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  comment: Comment | null;
  loading?: boolean;
}

// Form data interface for comment forms
export interface CommentFormData {
  content: string;
  projectId?: string;
  taskId?: string;
}

// State interface for comment management
export interface CommentManagementState {
  comments: Comment[];
  loading: boolean;
  error: string | null;
  paginationInfo: PaginationInfo;
  searchTerm: string;
  sortBy: string;
  sortOrder: string;
  currentPage: number;
  pageSize: number;
  // Modal states
  createModalOpen: boolean;
  editModalOpen: boolean;
  deleteModalOpen: boolean;
  selectedComment: Comment | null;
  // Loading states
  createLoading: boolean;
  updateLoading: boolean;
  deleteLoading: boolean;
}

// Action types for comment management
export interface CommentManagementActions {
  // Data actions
  setComments: (comments: Comment[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setPaginationInfo: (paginationInfo: PaginationInfo) => void;
  
  // Search and sort actions
  setSearchTerm: (searchTerm: string) => void;
  setSortBy: (sortBy: string) => void;
  setSortOrder: (sortOrder: string) => void;
  setCurrentPage: (page: number) => void;
  setPageSize: (pageSize: number) => void;
  
  // Modal actions
  openCreateModal: () => void;
  closeCreateModal: () => void;
  openEditModal: (comment: Comment) => void;
  closeEditModal: () => void;
  openDeleteModal: (comment: Comment) => void;
  closeDeleteModal: () => void;
  
  // Loading actions
  setCreateLoading: (loading: boolean) => void;
  setUpdateLoading: (loading: boolean) => void;
  setDeleteLoading: (loading: boolean) => void;
  
  // CRUD actions
  addComment: (comment: Comment) => void;
  updateComment: (comment: Comment) => void;
  removeComment: (commentId: string) => void;
}

// Sort options for comments
export interface CommentSortOption {
  value: string;
  label: string;
}

// Page size options for pagination
export interface PageSizeOption {
  value: number;
  label: string;
}

// Comment status for display purposes
export type CommentStatus = 'active' | 'deleted';

// Comment priority for display purposes (based on likes count)
export type CommentPriority = 'low' | 'medium' | 'high';

// Comment filter options
export interface CommentFilterOptions {
  status?: CommentStatus;
  priority?: CommentPriority;
  author?: string;
  project?: string;
  task?: string;
  dateRange?: {
    start: Date;
    end: Date;
  };
}
