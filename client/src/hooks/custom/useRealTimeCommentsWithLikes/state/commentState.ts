import { useCallback } from 'react';
import { Comment } from '../../../../services/graphql/commentQueries';

/**
 * Comment State Management Hook
 * Provides utilities for managing comment state
 */
export const useCommentState = (
  setComments: React.Dispatch<React.SetStateAction<Comment[]>>,
  setIsConnected: React.Dispatch<React.SetStateAction<boolean>>
) => {
  /**
   * Update connection status
   * Sets the WebSocket connection status
   */
  const updateConnectionStatus = useCallback((connected: boolean) => {
    setIsConnected(connected);
  }, [setIsConnected]);

  /**
   * Add comment to local state (for optimistic updates)
   * Adds a new comment to the comments array
   */
  const addComment = useCallback((comment: Comment) => {
    setComments(prev => [comment, ...prev]);
  }, [setComments]);

  /**
   * Update comment in local state (for optimistic updates)
   * Updates an existing comment in the comments array
   */
  const updateComment = useCallback((comment: Comment) => {
    setComments(prev => 
      prev.map(c => c.id === comment.id ? comment : c)
    );
  }, [setComments]);

  /**
   * Remove comment from local state (for optimistic updates)
   * Removes a comment from the comments array
   */
  const removeComment = useCallback((commentId: string) => {
    setComments(prev => prev.filter(c => c.id !== commentId));
  }, [setComments]);

  /**
   * Update comment likes in local state
   * Updates the like count and like status for a comment
   */
  const updateCommentLikes = useCallback((commentId: string, likesCount: number, isLikedByUser: boolean) => {
    setComments(prev => 
      prev.map(comment => 
        comment.id === commentId 
          ? { ...comment, likesCount, isLikedByUser }
          : comment
      )
    );
  }, [setComments]);

  /**
   * Clear all comments
   * Removes all comments from the comments array
   */
  const clearComments = useCallback(() => {
    setComments([]);
  }, [setComments]);

  /**
   * Set initial comments
   * Sets the initial comments array
   */
  const setInitialComments = useCallback((initialComments: Comment[]) => {
    setComments(initialComments);
  }, [setComments]);

  return {
    updateConnectionStatus,
    addComment,
    updateComment,
    removeComment,
    updateCommentLikes,
    clearComments,
    setInitialComments,
  };
};

