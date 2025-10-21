import { useCallback, useEffect } from 'react';
import { useSubscription } from '@apollo/client';
import { COMMENT_LIKED_SUBSCRIPTION, COMMENT_UNLIKED_SUBSCRIPTION } from '../../services/graphql/commentSubscriptions';

/**
 * Comment Like Event Types
 * Defines the structure of comment like events from subscriptions
 */
export interface CommentLikeEvent {
  commentId: string;
  projectId: string;
  userId: string;
  action: 'LIKED' | 'UNLIKED';
  likesCount: number;
  likers?: Array<{
    id: string;
    uuid: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    isDeleted: boolean;
    version: number;
    createdAt: string;
    updatedAt: string;
  }>;
  timestamp: string;
}

/**
 * Comment Likes Subscription Hook Options
 * Configuration options for comment likes subscriptions
 */
export interface UseCommentLikesSubscriptionsOptions {
  projectId: string;
  onCommentLiked?: (event: CommentLikeEvent) => void;
  onCommentUnliked?: (event: CommentLikeEvent) => void;
  enabled?: boolean;
}

/**
 * Custom hook for real-time comment likes subscriptions
 * Provides real-time updates for comment like events in a project
 * 
 * @param options - Configuration options for the subscription
 * @returns Object containing subscription data and loading states
 */
export const useCommentLikesSubscriptions = (options: UseCommentLikesSubscriptionsOptions) => {
  const { 
    projectId, 
    onCommentLiked, 
    onCommentUnliked, 
    enabled = true 
  } = options;

  // Subscribe to comment liked events
  const { data: likedData, loading: likedLoading } = useSubscription<{ commentLiked: CommentLikeEvent }>(
    COMMENT_LIKED_SUBSCRIPTION,
    {
      variables: { projectId },
      skip: !enabled
    }
  );

  // Subscribe to comment unliked events
  const { data: unlikedData, loading: unlikedLoading } = useSubscription<{ commentUnliked: CommentLikeEvent }>(
    COMMENT_UNLIKED_SUBSCRIPTION,
    {
      variables: { projectId },
      skip: !enabled
    }
  );

  // Handle comment liked event
  const handleCommentLiked = useCallback((event: CommentLikeEvent) => {
    if (onCommentLiked) {
      onCommentLiked(event);
    }
  }, [onCommentLiked]);

  // Handle comment unliked event
  const handleCommentUnliked = useCallback((event: CommentLikeEvent) => {
    if (onCommentUnliked) {
      onCommentUnliked(event);
    }
  }, [onCommentUnliked]);

  // Effect to handle subscription data changes - only trigger once per event
  useEffect(() => {
    if (likedData?.commentLiked) {
      handleCommentLiked(likedData.commentLiked);
    }
  }, [likedData?.commentLiked, handleCommentLiked]);

  useEffect(() => {
    if (unlikedData?.commentUnliked) {
      handleCommentUnliked(unlikedData.commentUnliked);
    }
  }, [unlikedData?.commentUnliked, handleCommentUnliked]);

  return {
    // Subscription data
    likedData: likedData?.commentLiked,
    unlikedData: unlikedData?.commentUnliked,
    
    // Loading states
    loading: likedLoading || unlikedLoading,
    likedLoading,
    unlikedLoading,
    
    // Event handlers
    handleCommentLiked,
    handleCommentUnliked
  };
};
