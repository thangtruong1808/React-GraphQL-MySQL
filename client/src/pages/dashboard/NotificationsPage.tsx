import React, { useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { useAuth } from '../../contexts/AuthContext';
import { DashboardLayout } from '../../components/layout';
import { DashboardSkeleton } from '../../components/ui';
import {
  NotificationSearchInput,
  NotificationsTable,
  CreateNotificationModal,
  EditNotificationModal,
  DeleteNotificationModal,
} from '../../components/notificationManagement';
import {
  GET_DASHBOARD_NOTIFICATIONS_QUERY,
  CREATE_NOTIFICATION_MUTATION,
  UPDATE_NOTIFICATION_MUTATION,
  DELETE_NOTIFICATION_MUTATION,
  MARK_NOTIFICATION_READ_MUTATION,
  MARK_NOTIFICATION_UNREAD_MUTATION,
} from '../../services/graphql/notificationQueries';
import {
  DEFAULT_NOTIFICATION_PAGINATION,
  NOTIFICATION_SUCCESS_MESSAGES,
  NOTIFICATION_ERROR_MESSAGES,
} from '../../constants/notificationManagement';
import {
  Notification,
  NotificationInput,
  NotificationUpdateInput,
  PaginationInfo,
} from '../../types/notificationManagement';

/**
 * Notifications Management Page
 * Main page for managing notifications with search, table display, pagination, and CRUD operations
 * Features comprehensive notification management functionality
 */
const NotificationsPage: React.FC = () => {
  // Get notification function from auth context
  const { showNotification } = useAuth();

  // State management
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [paginationInfo, setPaginationInfo] = useState<PaginationInfo>({
    hasNextPage: false,
    hasPreviousPage: false,
    totalCount: 0,
    currentPage: 1,
    totalPages: 1,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_NOTIFICATION_PAGINATION.limit);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState(DEFAULT_NOTIFICATION_PAGINATION.sortBy);
  const [sortOrder, setSortOrder] = useState(DEFAULT_NOTIFICATION_PAGINATION.sortOrder);
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);

  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // GraphQL queries and mutations
  const { loading, refetch } = useQuery(GET_DASHBOARD_NOTIFICATIONS_QUERY, {
    variables: {
      limit: pageSize,
      offset: (currentPage - 1) * pageSize,
      search: searchQuery || undefined,
      sortBy,
      sortOrder,
    },
    onCompleted: (data) => {
      setNotifications(data.dashboardNotifications.notifications);
      setPaginationInfo(data.dashboardNotifications.paginationInfo);
    },
    onError: (error) => {
      console.error('Error fetching notifications:', error);
      showNotification(NOTIFICATION_ERROR_MESSAGES.FETCH, 'error');
    },
    fetchPolicy: 'cache-and-network',
  });

  const [createNotification] = useMutation(CREATE_NOTIFICATION_MUTATION);
  const [updateNotification] = useMutation(UPDATE_NOTIFICATION_MUTATION);
  const [deleteNotification] = useMutation(DELETE_NOTIFICATION_MUTATION);
  const [markNotificationRead] = useMutation(MARK_NOTIFICATION_READ_MUTATION);
  const [markNotificationUnread] = useMutation(MARK_NOTIFICATION_UNREAD_MUTATION);

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

  // Handle create notification
  const handleCreateNotification = useCallback(async (input: NotificationInput) => {
    try {
      await createNotification({
        variables: { input },
        update: (cache, { data }) => {
          if (data?.createNotification) {
            // Refetch notifications to update the list
            refetch();
          }
        },
      });
      showNotification(NOTIFICATION_SUCCESS_MESSAGES.CREATE, 'success');
    } catch (error: any) {
      console.error('Error creating notification:', error);
      showNotification(error.message || NOTIFICATION_ERROR_MESSAGES.CREATE, 'error');
      throw error;
    }
  }, [createNotification, refetch, showNotification]);

  // Handle update notification
  const handleUpdateNotification = useCallback(async (id: string, input: NotificationUpdateInput) => {
    try {
      await updateNotification({
        variables: { id, input },
        update: (cache, { data }) => {
          if (data?.updateNotification) {
            // Refetch notifications to update the list
            refetch();
          }
        },
      });
      showNotification(NOTIFICATION_SUCCESS_MESSAGES.UPDATE, 'success');
    } catch (error: any) {
      console.error('Error updating notification:', error);
      showNotification(error.message || NOTIFICATION_ERROR_MESSAGES.UPDATE, 'error');
      throw error;
    }
  }, [updateNotification, refetch, showNotification]);

  // Handle delete notification
  const handleDeleteNotification = useCallback(async (id: string) => {
    try {
      await deleteNotification({
        variables: { id },
        update: (cache, { data }) => {
          if (data?.deleteNotification) {
            // Refetch notifications to update the list
            refetch();
          }
        },
      });
      showNotification(NOTIFICATION_SUCCESS_MESSAGES.DELETE, 'success');
    } catch (error: any) {
      console.error('Error deleting notification:', error);
      showNotification(error.message || NOTIFICATION_ERROR_MESSAGES.DELETE, 'error');
      throw error;
    }
  }, [deleteNotification, refetch, showNotification]);

  // Handle mark notification as read
  const handleMarkRead = useCallback(async (notification: Notification) => {
    try {
      await markNotificationRead({
        variables: { id: notification.id },
        update: (cache, { data }) => {
          if (data?.markNotificationRead) {
            // Refetch notifications to update the list
            refetch();
          }
        },
      });
      showNotification(NOTIFICATION_SUCCESS_MESSAGES.MARK_READ, 'success');
    } catch (error: any) {
      console.error('Error marking notification as read:', error);
      showNotification(error.message || NOTIFICATION_ERROR_MESSAGES.MARK_READ, 'error');
    }
  }, [markNotificationRead, refetch, showNotification]);

  // Handle mark notification as unread
  const handleMarkUnread = useCallback(async (notification: Notification) => {
    try {
      await markNotificationUnread({
        variables: { id: notification.id },
        update: (cache, { data }) => {
          if (data?.markNotificationUnread) {
            // Refetch notifications to update the list
            refetch();
          }
        },
      });
      showNotification(NOTIFICATION_SUCCESS_MESSAGES.MARK_UNREAD, 'success');
    } catch (error: any) {
      console.error('Error marking notification as unread:', error);
      showNotification(error.message || NOTIFICATION_ERROR_MESSAGES.MARK_UNREAD, 'error');
    }
  }, [markNotificationUnread, refetch, showNotification]);

  // Handle edit notification
  const handleEditNotification = useCallback((notification: Notification) => {
    setSelectedNotification(notification);
    setIsEditModalOpen(true);
  }, []);

  // Handle delete notification
  const handleDeleteNotificationClick = useCallback((notification: Notification) => {
    setSelectedNotification(notification);
    setIsDeleteModalOpen(true);
  }, []);

  // Close modals
  const closeModals = useCallback(() => {
    setIsCreateModalOpen(false);
    setIsEditModalOpen(false);
    setIsDeleteModalOpen(false);
    setSelectedNotification(null);
  }, []);

  // Show unified skeleton during loading (both sidebar and content)
  if (loading && notifications.length === 0) {
    return <DashboardSkeleton />;
  }

  return (
    <DashboardLayout showSidebarSkeleton={false}>
      <div className="w-full h-full dashboard-content">
        {/* Header Section */}
        <div className="bg-white border-b border-gray-200 w-full">
          <div className="px-8 py-8 w-full">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Notifications Management
                </h1>
                <p className="text-gray-600 mt-1">
                  Manage and monitor all notifications in the system
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
                Create Notification
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
              <NotificationSearchInput
                onSearch={handleSearch}
                placeholder="Search notifications..."
                loading={loading}
              />

              {/* Notifications Table */}
              <NotificationsTable
                notifications={notifications}
                loading={loading}
                paginationInfo={paginationInfo}
                onPageChange={handlePageChange}
                onPageSizeChange={handlePageSizeChange}
                onSort={handleSort}
                currentSortBy={sortBy}
                currentSortOrder={sortOrder}
                onEdit={handleEditNotification}
                onDelete={handleDeleteNotificationClick}
                onMarkRead={handleMarkRead}
                onMarkUnread={handleMarkUnread}
              />

              {/* Modals */}
              <CreateNotificationModal
                isOpen={isCreateModalOpen}
                onClose={closeModals}
                onCreate={handleCreateNotification}
                loading={loading}
              />

              <EditNotificationModal
                isOpen={isEditModalOpen}
                onClose={closeModals}
                onUpdate={handleUpdateNotification}
                notification={selectedNotification}
                loading={loading}
              />

              <DeleteNotificationModal
                isOpen={isDeleteModalOpen}
                onClose={closeModals}
                onDelete={handleDeleteNotification}
                notification={selectedNotification}
                loading={loading}
              />
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default NotificationsPage;