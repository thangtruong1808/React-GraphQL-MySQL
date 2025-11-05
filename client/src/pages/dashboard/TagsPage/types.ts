import { Tag, PaginationInfo } from '../../../types/tagsManagement';

/**
 * Tags Page State
 * Main state for tags management
 */
export interface TagsPageState {
  tags: Tag[];
  paginationInfo: PaginationInfo;
  loading: boolean;
  searchQuery: string;
  currentPage: number;
  pageSize: number;
  createModalOpen: boolean;
  editModalOpen: boolean;
  deleteModalOpen: boolean;
  selectedTag: Tag | null;
  error: string | null;
}

/**
 * Use Tags State Dependencies
 * Dependencies for tags state hook
 */
export interface UseTagsStateDependencies {
  initialPageSize: number;
}

/**
 * Use Tags Queries Dependencies
 * Dependencies for tags queries hook
 */
export interface UseTagsQueriesDependencies {
  pageSize: number;
  currentPage: number;
  searchQuery: string;
  sortBy: string;
  sortOrder: 'ASC' | 'DESC';
  isInitializing: boolean;
  hasDashboardAccess: boolean;
  user: any;
  isAuthDataReady: boolean;
  setState: React.Dispatch<React.SetStateAction<TagsPageState>>;
}

/**
 * Use Tags Handlers Dependencies
 * Dependencies for tags handlers hook
 */
export interface UseTagsHandlersDependencies {
  state: TagsPageState;
  sortBy: string;
  sortOrder: 'ASC' | 'DESC';
  setState: React.Dispatch<React.SetStateAction<TagsPageState>>;
  setSortBy: (sortBy: string) => void;
  setSortOrder: (sortOrder: 'ASC' | 'DESC') => void;
  refetch: () => Promise<any>;
  createTagMutation: any;
  updateTagMutation: any;
  deleteTagMutation: any;
  showNotification: (message: string, type: 'success' | 'error' | 'info') => void;
}

