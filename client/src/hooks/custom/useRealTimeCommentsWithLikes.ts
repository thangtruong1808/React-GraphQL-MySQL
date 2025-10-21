import { useCallback, useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { useCommentSubscriptions, UseCommentSubscriptionsOptions } from './useCommentSubscriptions';
import { useCommentLikesSubscriptions, UseCommentLikesSubscriptionsOptions, CommentLikeEvent } from './useCommentLikesSubscriptions';
import { Comment } from '../../services/graphql/commentQueries';
import { GET_PROJECT_DETAILS } from '../../services/graphql/queries';

/**
 * Real-time Comments with Likes Hook Options
 * Extended options for real-time comment and like management
 */
export interface UseRealTimeCommentsWithLikesOptions extends UseCommentSubscriptionsOptions, UseCommentLikesSubscriptionsOptions {
  onError?: (error: Error) => void;
  showNotifications?: boolean;
  initialComments?: Comment[];
}

/**
 * Real-time Comments with Likes Hook
 * Provides comprehensive real-time comment and like management with state updates
 * 
 * @param options - Configuration options for real-time comments and likes
 * @returns Object containing comment state, like state, and handlers
 */
export const useRealTimeCommentsWithLikes = (options: UseRealTimeCommentsWithLikesOptions) => {
  const { 
    projectId, 
    onCommentAdded, 
    onCommentUpdated, 
    onCommentDeleted,
    onCommentLiked,
    onCommentUnliked,
    onError,
    showNotifications = true,
    enabled = true,
    initialComments = []
  } = options;

  // Local state for comments
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [isConnected, setIsConnected] = useState(false);

  // Fetch initial comments from the database
  const { data: projectData, loading: queryLoading, error: queryError } = useQuery(GET_PROJECT_DETAILS, {
    variables: { projectId },
    skip: !projectId || !enabled,
  });

  // Handle initial comments loading with useEffect instead of onCompleted
  useEffect(() => {
    if (projectData?.project?.comments) {
      // Sort comments by creation date (latest first) to ensure consistent ordering
      const sortedComments = [...projectData.project.comments].sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setComments(sortedComments);
    }
  }, [projectData?.project?.comments]);

  // Handle comment added with state update
  const handleCommentAdded = useCallback((comment: Comment) => {
    setComments(prev => {
      // Check if comment already exists to prevent duplicates
      const exists = prev.some(c => c.id === comment.id);
      if (exists) {
        return prev;
      }
      
      // Add new comment and sort by creation date (latest first)
      const updated = [comment, ...prev];
      return updated.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    });
    
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
    setComments(prev => {
      // Update the comment and maintain sorted order
      const updated = prev.map(comment => 
        comment.id === updatedComment.id ? updatedComment : comment
      );
      // Sort by creation date (latest first) to maintain consistent ordering
      return updated.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    });
    
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

  // Handle comment liked with state update
  const handleCommentLiked = useCallback((event: CommentLikeEvent) => {
    setComments(prev => 
      prev.map(comment => 
        comment.id === event.commentId 
          ? { ...comment, likesCount: event.likesCount, likers: event.likers || [] }
          : comment
      )
    );
    
    // Call custom handler if provided
    if (onCommentLiked) {
      onCommentLiked(event);
    }
  }, [onCommentLiked]);

  // Handle comment unliked with state update
  const handleCommentUnliked = useCallback((event: CommentLikeEvent) => {
    setComments(prev => 
      prev.map(comment => 
        comment.id === event.commentId 
          ? { ...comment, likesCount: event.likesCount, likers: event.likers || [] }
          : comment
      )
    );
    
    // Call custom handler if provided
    if (onCommentUnliked) {
      onCommentUnliked(event);
    }
  }, [onCommentUnliked]);

  // Handle subscription errors
  const handleError = useCallback((error: Error) => {
    if (onError) {
      onError(error);
    }
  }, [onError]);

  // Use the comment subscription hook
  const commentSubscription = useCommentSubscriptions({
    projectId,
    onCommentAdded: handleCommentAdded,
    onCommentUpdated: handleCommentUpdated,
    onCommentDeleted: handleCommentDeleted,
    enabled
  });

  // Use the comment likes subscription hook
  const commentLikesSubscription = useCommentLikesSubscriptions({
    projectId,
    onCommentLiked: handleCommentLiked,
    onCommentUnliked: handleCommentUnliked,
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

  // Update comment likes in local state
  const updateCommentLikes = useCallback((commentId: string, likesCount: number, isLikedByUser: boolean) => {
    setComments(prev => 
      prev.map(comment => 
        comment.id === commentId 
          ? { ...comment, likesCount, isLikedByUser }
          : comment
      )
    );
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
    loading: queryLoading || commentSubscription.loading || commentLikesSubscription.loading,
    error: queryError || commentSubscription.error,
    
    // Subscription data
    ...commentSubscription,
    ...commentLikesSubscription,
    
    // Comment management functions
    addComment,
    updateComment,
    removeComment,
    updateCommentLikes,
    clearComments,
    setInitialComments,
    updateConnectionStatus,
    
    // Error handling
    handleError
  };
};
