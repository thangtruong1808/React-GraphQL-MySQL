import { useMutation } from '@apollo/client';
import {
  CREATE_NOTIFICATION_MUTATION,
  UPDATE_NOTIFICATION_MUTATION,
  DELETE_NOTIFICATION_MUTATION,
  MARK_NOTIFICATION_READ_MUTATION,
  MARK_NOTIFICATION_UNREAD_MUTATION,
} from '../../../../services/graphql/notificationQueries';

/**
 * Custom hook for managing GraphQL mutations
 * Handles all CRUD mutations and status updates for notifications
 */
export const useNotificationsMutations = () => {
  // Mutations for CRUD operations
  const [createNotificationMutation] = useMutation(CREATE_NOTIFICATION_MUTATION);
  const [updateNotificationMutation] = useMutation(UPDATE_NOTIFICATION_MUTATION);
  const [deleteNotificationMutation] = useMutation(DELETE_NOTIFICATION_MUTATION);
  const [markNotificationReadMutation] = useMutation(MARK_NOTIFICATION_READ_MUTATION);
  const [markNotificationUnreadMutation] = useMutation(MARK_NOTIFICATION_UNREAD_MUTATION);

  return {
    createNotificationMutation,
    updateNotificationMutation,
    deleteNotificationMutation,
    markNotificationReadMutation,
    markNotificationUnreadMutation,
  };
};

