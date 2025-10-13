/**
 * TypeScript types for Tags Management
 * Defines interfaces and types for tags management functionality
 */

// Tag interface
export interface Tag {
  id: string;
  name: string;
  description: string;
  title?: string;
  type?: string;
  category?: string;
  createdAt: string;
  updatedAt: string;
}

// Pagination info interface
export interface PaginationInfo {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  totalCount: number;
  currentPage: number;
  totalPages: number;
}

// Paginated tags response
export interface PaginatedTagsResponse {
  tags: Tag[];
  paginationInfo: PaginationInfo;
}

// Tag input for creating tags
export interface TagInput {
  name: string;
  description: string;
  title?: string;
  type?: string;
  category?: string;
}

// Tag update input
export interface TagUpdateInput {
  name?: string;
  description?: string;
  title?: string;
  type?: string;
  category?: string;
}

// Tags table props
export interface TagsTableProps {
  tags: Tag[];
  loading: boolean;
  paginationInfo: PaginationInfo;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  onSort: (sortBy: string, sortOrder: string) => void;
  currentSortBy: string;
  currentSortOrder: string;
  onEdit: (tag: Tag) => void;
  onDelete: (tag: Tag) => void;
}

// Tag search input props
export interface TagSearchInputProps {
  onSearch: (searchTerm: string) => void;
  placeholder?: string;
  loading?: boolean;
}

// Create tag modal props
export interface CreateTagModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (tag: TagInput) => Promise<void>;
  loading?: boolean;
}

// Edit tag modal props
export interface EditTagModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (id: string, tag: TagUpdateInput) => Promise<void>;
  tag: Tag | null;
  loading?: boolean;
}

// Delete tag modal props
export interface DeleteTagModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDelete: (id: string) => Promise<void>;
  tag: Tag | null;
  loading?: boolean;
}

// Tag form data
export interface TagFormData {
  name: string;
  description: string;
  title: string;
  type: string;
  category: string;
}

// Tags management state
export interface TagsManagementState {
  tags: Tag[];
  paginationInfo: PaginationInfo;
  currentPage: number;
  pageSize: number;
  searchQuery: string;
  loading: boolean;
  error: string | null;
  selectedTag: Tag | null;
}

// Tags management actions
export interface TagsManagementActions {
  setTags: (tags: Tag[]) => void;
  setPaginationInfo: (paginationInfo: PaginationInfo) => void;
  setCurrentPage: (page: number) => void;
  setPageSize: (pageSize: number) => void;
  setSearchQuery: (query: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setSelectedTag: (tag: Tag | null) => void;
}
