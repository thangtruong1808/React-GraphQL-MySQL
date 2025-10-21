import { useSubscription } from '@apollo/client';
import { useCallback, useEffect } from 'react';
import { 
  COMMENT_ADDED_SUBSCRIPTION, 
  COMMENT_UPDATED_SUBSCRIPTION, 
  COMMENT_DELETED_SUBSCRIPTION 
} from '../../services/graphql/commentSubscriptions';
import { Comment } from '../../services/graphql/commentQueries';

/**
 * Comment Subscription Event Types
 * Defines the structure of real-time comment events
 */
export interface CommentAddedEvent {
  commentAdded: Comment;
}

export interface CommentUpdatedEvent {
  commentUpdated: Comment;
}

export interface CommentDeletedEvent {
  commentDeleted: {
    commentId: string;
    projectId: string;
    deletedAt: string;
  };
}

/**
 * Comment Subscription Hook Options
 * Configuration for comment subscription behavior
 */
export interface UseCommentSubscriptionsOptions {
  projectId: string;
  onCommentAdded?: (comment: Comment) => void;
  onCommentUpdated?: (comment: Comment) => void;
  onCommentDeleted?: (event: CommentDeletedEvent['commentDeleted']) => void;
  enabled?: boolean;
}

/**
 * Custom hook for real-time comment subscriptions
 * Provides real-time updates for comment events in a project
 * 
 * @param options - Configuration options for the subscription
 * @returns Object containing subscription data and loading states
 */
export const useCommentSubscriptions = (options: UseCommentSubscriptionsOptions) => {
  const { 
    projectId, 
    onCommentAdded, 
    onCommentUpdated, 
    onCommentDeleted, 
    enabled = true 
  } = options;

  // Subscribe to comment added events
  const { data: addedData, loading: addedLoading } = useSubscription<CommentAddedEvent>(
    COMMENT_ADDED_SUBSCRIPTION,
    {
      variables: { projectId },
      skip: !enabled
    }
  );

  // Subscribe to comment updated events
  const { data: updatedData, loading: updatedLoading } = useSubscription<CommentUpdatedEvent>(
    COMMENT_UPDATED_SUBSCRIPTION,
    {
      variables: { projectId },
      skip: !enabled
    }
  );

  // Subscribe to comment deleted events
  const { data: deletedData, loading: deletedLoading } = useSubscription<CommentDeletedEvent>(
    COMMENT_DELETED_SUBSCRIPTION,
    {
      variables: { projectId },
      skip: !enabled
    }
  );

  // Handle comment added event
  const handleCommentAdded = useCallback((comment: Comment) => {
    if (onCommentAdded) {
      onCommentAdded(comment);
    }
  }, [onCommentAdded]);

  // Handle comment updated event
  const handleCommentUpdated = useCallback((comment: Comment) => {
    if (onCommentUpdated) {
      onCommentUpdated(comment);
    }
  }, [onCommentUpdated]);

  // Handle comment deleted event
  const handleCommentDeleted = useCallback((event: CommentDeletedEvent['commentDeleted']) => {
    if (onCommentDeleted) {
      onCommentDeleted(event);
    }
  }, [onCommentDeleted]);

  // Effect to handle subscription data changes - only trigger once per event
  useEffect(() => {
    if (addedData?.commentAdded) {
      handleCommentAdded(addedData.commentAdded);
    }
  }, [addedData?.commentAdded, handleCommentAdded]);

  useEffect(() => {
    if (updatedData?.commentUpdated) {
      handleCommentUpdated(updatedData.commentUpdated);
    }
  }, [updatedData?.commentUpdated, handleCommentUpdated]);

  useEffect(() => {
    if (deletedData?.commentDeleted) {
      handleCommentDeleted(deletedData.commentDeleted);
    }
  }, [deletedData?.commentDeleted, handleCommentDeleted]);

  return {
    // Subscription data
    addedData: addedData?.commentAdded,
    updatedData: updatedData?.commentUpdated,
    deletedData: deletedData?.commentDeleted,
    
    // Loading states
    loading: addedLoading || updatedLoading || deletedLoading,
    addedLoading,
    updatedLoading,
    deletedLoading,
    
    // Event handlers
    handleCommentAdded,
    handleCommentUpdated,
    handleCommentDeleted
  };
};
