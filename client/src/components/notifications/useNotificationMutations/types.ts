/**
 * Types for useNotificationMutations hook
 */

import { Notification } from '../../../types/notificationManagement';

/**
 * Return type for useNotificationMutations hook
 */
export interface UseNotificationMutationsReturn {
  markAsRead: (notification: Notification) => Promise<void>;
  markAsUnread: (notification: Notification) => Promise<void>;
  markAllAsRead: (unreadNotifications: Notification[]) => Promise<void>;
  markAllAsUnread: (readNotifications: Notification[]) => Promise<void>;
  deleteNotification: (notification: Notification) => Promise<void>;
  deleteAllRead: (readNotifications: Notification[]) => Promise<void>;
  deleteAllUnread: (unreadNotifications: Notification[]) => Promise<void>;
  isProcessing: (notificationId: string) => boolean;
  isProcessingBulk: () => boolean;
  reset: () => void;
}

