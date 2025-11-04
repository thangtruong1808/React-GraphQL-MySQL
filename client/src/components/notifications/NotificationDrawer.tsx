import React from 'react';
import { useQuery } from '@apollo/client';
import { GET_USER_UNREAD_NOTIFICATIONS_QUERY, GetUserUnreadNotificationsQueryResponse } from '../../services/graphql/notificationQueries';
import { useAuth } from '../../contexts/AuthContext';
import { useAuthDataReady } from '../../hooks/useAuthDataReady';
import { TokenManager, isActivityBasedTokenExpired, isTokenExpired, getTokens } from '../../utils/tokenManager';
import { AUTH_CONFIG } from '../../constants/auth';
import NotificationDrawerHeader from './NotificationDrawerHeader';
import NotificationDrawerActions from './NotificationDrawerActions';
import NotificationDrawerContent from './NotificationDrawerContent';
import { useNotificationMutations } from './useNotificationMutations';

/**
 * Notification Drawer Component
 * Displays user's notifications in a right-side drawer
 * Allows users to manage notifications (mark as read/unread, delete)
 */
interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const NotificationDrawer: React.FC<NotificationDrawerProps> = ({ isOpen, onClose }) => {
  // Get session expiry modal state to pause queries during expiry
  const { showSessionExpiryModal, isAuthenticated, isInitializing } = useAuth();

  // Wait for auth data to be ready to prevent race conditions during fast navigation
  // This ensures Apollo Client's authLink has collected tokens before query runs
  const isAuthDataReady = useAuthDataReady();

  // Check if token is expired or close to expiring (async check to avoid race conditions)                                                                      
  const [shouldSkipNotifications, setShouldSkipNotifications] = React.useState(false);

  // Update skip state asynchronously to check token expiry
  // Wait for auth data to be ready before checking token status to avoid race conditions
  React.useEffect(() => {
    const checkTokenStatus = async () => {
      try {
        // Skip if not authenticated, auth is initializing, auth data not ready, session modal showing, or drawer closed
        if (!isAuthenticated || isInitializing || !isAuthDataReady || showSessionExpiryModal || !isOpen) {
          setShouldSkipNotifications(true);
          return;
        }

        // Check if token is expired or close to expiring (within 10 seconds threshold)                                                                         
        const tokens = getTokens();
        if (!tokens.accessToken) {
          setShouldSkipNotifications(true);
          return;
        }

        let isExpired = false;
        if (AUTH_CONFIG.ACTIVITY_BASED_TOKEN_ENABLED) {
          isExpired = isActivityBasedTokenExpired();
          // Also check if close to expiring (within 10 seconds)
          if (!isExpired) {
            const expiry = TokenManager.getActivityBasedTokenExpiry();
            if (expiry) {
              const timeRemaining = expiry - Date.now();
              isExpired = timeRemaining <= 10000; // 10 seconds threshold
            }
          }
        } else {
          isExpired = isTokenExpired(tokens.accessToken);
          // Also check if close to expiring (within 10 seconds)
          if (!isExpired) {
            const expiry = TokenManager.getTokenExpiration(tokens.accessToken);
            if (expiry) {
              const timeRemaining = expiry - Date.now();
              isExpired = timeRemaining <= 10000; // 10 seconds threshold
            }
          }
        }

        setShouldSkipNotifications(isExpired || showSessionExpiryModal);
      } catch (error) {
        // On error, skip to prevent unwanted queries
        setShouldSkipNotifications(true);
      }
    };

    if (isOpen) {
      checkTokenStatus();
      // Check every 5 seconds to update skip state as token approaches expiry
      const interval = setInterval(checkTokenStatus, 5000);
      return () => clearInterval(interval);
    } else {
      setShouldSkipNotifications(true);
    }
  }, [isAuthenticated, isInitializing, isAuthDataReady, showSessionExpiryModal, isOpen]);

  // Fetch user's notifications when drawer is opened
  // Skip query when:
  // - Drawer is closed
  // - Auth is initializing
  // - User is not authenticated
  // - Auth data is not ready (tokens not collected yet - prevents race conditions)
  // - Session expiry modal is showing
  // - Token is expired/close to expiring
  const shouldSkip = !isOpen || isInitializing || !isAuthenticated || !isAuthDataReady || showSessionExpiryModal || shouldSkipNotifications;
  const { data, loading, refetch } = useQuery<GetUserUnreadNotificationsQueryResponse>(
    GET_USER_UNREAD_NOTIFICATIONS_QUERY,
    {
      variables: { limit: 100 },
      skip: shouldSkip,
      errorPolicy: 'all',
      fetchPolicy: 'cache-and-network', // Always fetch from network to ensure fresh data
      notifyOnNetworkStatusChange: true
    }
  );

  // Get all mutation handlers from custom hook with loading states
  const {
    markAsRead,
    markAsUnread,
    markAllAsRead,
    markAllAsUnread,
    deleteNotification,
    deleteAllRead,
    deleteAllUnread,
    isProcessing,
    isProcessingBulk,
    reset
  } = useNotificationMutations(refetch);

  // Reset mutation state when drawer opens or closes to ensure clean state (prevents frozen buttons after navigation)
  // Reset on open to clear any stale state from previous sessions
  // Reset on close to clean up any in-progress operations
  React.useEffect(() => {
    if (isOpen) {
      // Reset when drawer opens to ensure clean state after navigation
      reset();
    } else {
      // Reset when drawer closes to clean up any in-progress operations
      reset();
    }
  }, [isOpen, reset]);

  // Refetch notifications when drawer opens and auth data is ready
  // Only refetch if drawer is open, authenticated, and auth data is ready      
  // This prevents race conditions during fast navigation
  React.useEffect(() => {
    if (isOpen && isAuthenticated && isAuthDataReady && !shouldSkipNotifications && !showSessionExpiryModal) {
      refetch();
    }
  }, [isOpen, isAuthenticated, isAuthDataReady, shouldSkipNotifications, showSessionExpiryModal, refetch]);

  // Get all notifications (both read and unread) for better UX
  const allNotifications = data?.dashboardNotifications?.notifications || [];

  // Separate read and unread notifications for display
  const unreadNotifications = allNotifications.filter(notification => !notification.isRead);
  const readNotifications = allNotifications.filter(notification => notification.isRead);

  // Handle mark all as read
  const handleMarkAllAsRead = async () => {
    if (!isProcessingBulk()) {
      await markAllAsRead(unreadNotifications);
    }
  };

  // Handle mark all as unread
  const handleMarkAllAsUnread = async () => {
    if (!isProcessingBulk()) {
      await markAllAsUnread(readNotifications);
    }
  };

  // Handle delete all unread
  const handleDeleteAllUnread = async () => {
    if (!isProcessingBulk()) {
      await deleteAllUnread(unreadNotifications);
    }
  };

  // Handle delete all read
  const handleDeleteAllRead = async () => {
    if (!isProcessingBulk()) {
      await deleteAllRead(readNotifications);
    }
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed right-0 top-0 h-full w-96 theme-notification-drawer-bg shadow-2xl transform transition-transform duration-300 ease-in-out z-50 flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
      >
        <NotificationDrawerHeader onClose={onClose} />

        <NotificationDrawerActions
          unreadCount={unreadNotifications.length}
          readCount={readNotifications.length}
          onMarkAllAsRead={handleMarkAllAsRead}
          onMarkAllAsUnread={handleMarkAllAsUnread}
          onDeleteAllUnread={handleDeleteAllUnread}
          onDeleteAllRead={handleDeleteAllRead}
          isProcessingBulk={isProcessingBulk()}
        />

        <NotificationDrawerContent
          loading={loading}
          unreadNotifications={unreadNotifications}
          readNotifications={readNotifications}
          onMarkAsRead={markAsRead}
          onMarkAsUnread={markAsUnread}
          onDelete={deleteNotification}
          isProcessing={isProcessing}
        />
      </div>
    </>
  );
};

export default NotificationDrawer;
