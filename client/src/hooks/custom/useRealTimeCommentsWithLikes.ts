import { useState, useEffect } from 'react';
import { useQuery, useApolloClient } from '@apollo/client';
import { useCommentSubscriptions } from './useCommentSubscriptions';
import { useCommentLikesSubscriptions } from './useCommentLikesSubscriptions';
import { Comment } from '../../services/graphql/commentQueries';
import { GET_PROJECT_DETAILS } from '../../services/graphql/queries';
import { useAuth } from '../../contexts/AuthContext';
import { useCommentHandlers } from './useRealTimeCommentsWithLikes/handlers';
import { useLikeHandlers } from './useRealTimeCommentsWithLikes/handlers';
import { useCommentState } from './useRealTimeCommentsWithLikes/state/commentState';
import { UseRealTimeCommentsWithLikesOptions, CommentHandlersDependencies, LikeHandlersDependencies } from './useRealTimeCommentsWithLikes/types';

/**
 * Real-time Comments with Likes Hook
 * Description: Provides comprehensive real-time comment and like management with state updates
 * Date: 2024-12-19
 * Author: thangtruong
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

  // Get Apollo client for cache updates
  const apolloClient = useApolloClient();
  
  // Get current user for like status calculation
  const { user } = useAuth();

  // Local state for comments
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [isConnected, setIsConnected] = useState(false);

  // Fetch initial comments from the database
  const { data: projectData, loading: queryLoading, error: queryError } = useQuery(GET_PROJECT_DETAILS, {
    variables: { projectId },
    skip: !projectId || !enabled,
  });

  // Handle initial comments loading and sync with Apollo cache updates
  useEffect(() => {
    if (projectData?.project?.comments) {
      // Sort comments by creation date (latest first) to ensure consistent ordering
      const sortedComments = [...projectData.project.comments].sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      // Update local state to keep it in sync with Apollo cache
      setComments(sortedComments);
    }
  }, [projectData?.project?.comments]);

  // Prepare dependencies for comment handlers
  const commentHandlersDeps: CommentHandlersDependencies = {
    apolloClient,
    projectId,
    setComments,
    onCommentAdded,
    onCommentUpdated,
    onCommentDeleted,
    showNotifications,
  };

  // Initialize comment handlers
  const { handleCommentAdded, handleCommentUpdated, handleCommentDeleted } = useCommentHandlers(commentHandlersDeps);

  // Prepare dependencies for like handlers
  const likeHandlersDeps: LikeHandlersDependencies = {
    apolloClient,
    projectId,
    setComments,
    currentUserId: user?.id?.toString() || null,
    onCommentLiked,
    onCommentUnliked,
  };

  // Initialize like handlers
  const { handleCommentLiked, handleCommentUnliked } = useLikeHandlers(likeHandlersDeps);

  // Handle subscription errors
  const handleError = (error: Error) => {
    if (onError) {
      onError(error);
    }
  };

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

  // Initialize state management utilities
  const {
    updateConnectionStatus,
    addComment,
    updateComment,
    removeComment,
    updateCommentLikes,
    clearComments,
    setInitialComments,
  } = useCommentState(setComments, setIsConnected);

  // Destructure subscriptions to exclude loading (handled separately)
  const { loading: commentSubscriptionLoading, ...commentSubscriptionData } = commentSubscription;
  const { loading: commentLikesSubscriptionLoading, ...commentLikesSubscriptionData } = commentLikesSubscription;

  // Use Apollo cache data as source of truth, fallback to local state
  const displayComments = projectData?.project?.comments || comments;

  return {
    // Comment state - use Apollo cache data as source of truth
    comments: displayComments,
    isConnected,
    loading: queryLoading || commentSubscriptionLoading || commentLikesSubscriptionLoading,
    error: queryError,
    
    // Subscription data (excluding loading which is handled above)
    ...commentSubscriptionData,
    ...commentLikesSubscriptionData,
    
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

// Re-export types for convenience
export type { UseRealTimeCommentsWithLikesOptions } from './useRealTimeCommentsWithLikes/types';
