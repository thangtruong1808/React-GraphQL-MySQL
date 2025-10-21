import { useCallback, useState } from 'react';
import { useCommentSubscriptions, UseCommentSubscriptionsOptions } from './useCommentSubscriptions';
import { Comment } from '../../services/graphql/commentQueries';

/**
 * Real-time Comments Hook Options
 * Extended options for real-time comment management
 */
export interface UseRealTimeCommentsOptions extends UseCommentSubscriptionsOptions {
  onError?: (error: Error) => void;
  showNotifications?: boolean;
}

/**
 * Real-time Comments Hook
 * Provides comprehensive real-time comment management with state updates
 * 
 * @param options - Configuration options for real-time comments
 * @returns Object containing comment state and handlers
 */
export const useRealTimeComments = (options: UseRealTimeCommentsOptions) => {
  const { 
    projectId, 
    onCommentAdded, 
    onCommentUpdated, 
    onCommentDeleted, 
    onError,
    showNotifications = true,
    enabled = true 
  } = options;

  // Local state for comments
  const [comments, setComments] = useState<Comment[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  // Handle comment added with state update
  const handleCommentAdded = useCallback((comment: Comment) => {
    setComments(prev => [comment, ...prev]);
    
    // Call custom handler if provided
    if (onCommentAdded) {
      onCommentAdded(comment);
    }

    // Show notification if enabled
    if (showNotifications) {
      // You can integrate with your notification system here
      // showNotification(`New comment by ${comment.author.firstName} ${comment.author.lastName}`, 'info');
    }
  }, [onCommentAdded, showNotifications]);

  // Handle comment updated with state update
  const handleCommentUpdated = useCallback((updatedComment: Comment) => {
    setComments(prev => 
      prev.map(comment => 
        comment.id === updatedComment.id ? updatedComment : comment
      )
    );
    
    // Call custom handler if provided
    if (onCommentUpdated) {
      onCommentUpdated(updatedComment);
    }
  }, [onCommentUpdated]);

  // Handle comment deleted with state update
  const handleCommentDeleted = useCallback((event: { commentId: string; projectId: string; deletedAt: string }) => {
    setComments(prev => 
      prev.filter(comment => comment.id !== event.commentId)
    );
    
    // Call custom handler if provided
    if (onCommentDeleted) {
      onCommentDeleted(event);
    }
  }, [onCommentDeleted]);

  // Handle subscription errors
  const handleError = useCallback((error: Error) => {
    if (onError) {
      onError(error);
    }
  }, [onError]);

  // Use the subscription hook
  const subscription = useCommentSubscriptions({
    projectId,
    onCommentAdded: handleCommentAdded,
    onCommentUpdated: handleCommentUpdated,
    onCommentDeleted: handleCommentDeleted,
    enabled
  });

  // Update connection status
  const updateConnectionStatus = useCallback((connected: boolean) => {
    setIsConnected(connected);
  }, []);

  // Add comment to local state (for optimistic updates)
  const addComment = useCallback((comment: Comment) => {
    setComments(prev => [comment, ...prev]);
  }, []);

  // Update comment in local state (for optimistic updates)
  const updateComment = useCallback((comment: Comment) => {
    setComments(prev => 
      prev.map(c => c.id === comment.id ? comment : c)
    );
  }, []);

  // Remove comment from local state (for optimistic updates)
  const removeComment = useCallback((commentId: string) => {
    setComments(prev => prev.filter(c => c.id !== commentId));
  }, []);

  // Clear all comments
  const clearComments = useCallback(() => {
    setComments([]);
  }, []);

  // Set initial comments
  const setInitialComments = useCallback((initialComments: Comment[]) => {
    setComments(initialComments);
  }, []);

  return {
    // Comment state
    comments,
    isConnected,
    
    // Subscription data
    ...subscription,
    
    // Comment management functions
    addComment,
    updateComment,
    removeComment,
    clearComments,
    setInitialComments,
    updateConnectionStatus,
    
    // Error handling
    handleError
  };
};
