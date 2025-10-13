/**
 * TypeScript types for Notification Management
 * Defines interfaces and types for notification management functionality
 */

// User interface for notification relationships
export interface User {
  id: string;
  uuid: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

// Notification interface
export interface Notification {
  id: string;
  user: User;
  message: string;
  isRead: boolean;
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

// Paginated notifications response
export interface PaginatedNotificationsResponse {
  notifications: Notification[];
  paginationInfo: PaginationInfo;
}

// Notification input for creating notifications
export interface NotificationInput {
  message: string;
  userId: string;
}

// Notification update input
export interface NotificationUpdateInput {
  message?: string;
  isRead?: boolean;
}

// Notification table props
export interface NotificationsTableProps {
  notifications: Notification[];
  loading: boolean;
  paginationInfo: PaginationInfo;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  onSort: (sortBy: string, sortOrder: string) => void;
  currentSortBy: string;
  currentSortOrder: string;
  onEdit: (notification: Notification) => void;
  onDelete: (notification: Notification) => void;
  onMarkRead: (notification: Notification) => void;
  onMarkUnread: (notification: Notification) => void;
}

// Notification search input props
export interface NotificationSearchInputProps {
  onSearch: (searchTerm: string) => void;
  placeholder?: string;
  loading?: boolean;
}

// Create notification modal props
export interface CreateNotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (notification: NotificationInput) => Promise<void>;
  loading?: boolean;
}

// Edit notification modal props
export interface EditNotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (id: string, notification: NotificationUpdateInput) => Promise<void>;
  notification: Notification | null;
  loading?: boolean;
}

// Delete notification modal props
export interface DeleteNotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDelete: (id: string) => Promise<void>;
  notification: Notification | null;
  loading?: boolean;
}

// Notification form data
export interface NotificationFormData {
  message: string;
  userId: string;
}

// Notification management state
export interface NotificationManagementState {
  notifications: Notification[];
  paginationInfo: PaginationInfo;
  currentPage: number;
  pageSize: number;
  searchQuery: string;
  loading: boolean;
  error: string | null;
  selectedNotification: Notification | null;
}

// Notification management actions
export interface NotificationManagementActions {
  setNotifications: (notifications: Notification[]) => void;
  setPaginationInfo: (paginationInfo: PaginationInfo) => void;
  setCurrentPage: (page: number) => void;
  setPageSize: (pageSize: number) => void;
  setSearchQuery: (query: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setSelectedNotification: (notification: Notification | null) => void;
}
