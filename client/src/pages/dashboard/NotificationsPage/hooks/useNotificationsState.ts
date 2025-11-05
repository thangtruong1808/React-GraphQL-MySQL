import { useState } from 'react';
import { Notification, PaginationInfo } from '../../../../types/notificationManagement';
import { DEFAULT_NOTIFICATION_PAGINATION } from '../../../../constants/notificationManagement';
import { UseNotificationsStateDependencies, NotificationsPageState } from '../types';

/**
 * Custom hook for managing notifications page state
 * Handles all state management including sorting state
 */
export const useNotificationsState = ({ initialPageSize }: UseNotificationsStateDependencies) => {
  // Main state management
  const [state, setState] = useState<NotificationsPageState>({
    notifications: [],
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
    pageSize: initialPageSize,
    createModalOpen: false,
    editModalOpen: false,
    deleteModalOpen: false,
    selectedNotification: null,
    error: null,
  });

  // Sorting state
  const [sortBy, setSortBy] = useState(DEFAULT_NOTIFICATION_PAGINATION.sortBy);
  const [sortOrder, setSortOrder] = useState<'ASC' | 'DESC'>(DEFAULT_NOTIFICATION_PAGINATION.sortOrder);

  return {
    state,
    setState,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
  };
};

